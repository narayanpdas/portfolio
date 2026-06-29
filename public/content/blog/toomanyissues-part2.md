---
title: "TooManyIssues Part 2: Taming the Thundering Herd"
date: "2026-06-28"
tags: ["Redis", "Concurrency", "System Design", "Spring Boot"]
excerpt: "Scaling to 1,000+ repositories broke my ingestion engine. Here is how I used distributed locks and dynamic polling to fix it."
---

Parent Project Link: [TooManyIssues](https://github.com/narayanpdas/TooManyIssues)

# The Scaling Wall

In Part 1, I built a reliable Spring Boot backend to ingest open-source data into PostgreSQL and MongoDB. It worked beautifully on a small scale. But as I expanded my tracker from 100 repositories to over 1,000, I hit a massive wall: **Rate Limits and Race Conditions.**

When you schedule a naive cron job to fetch data for thousands of repos simultaneously, GitHub's API shuts you down. Worse, when multiple users requested an AI summary of a newly fetched issue at the same exact time, my server fired off identical requests to the Gemini API, burning tokens and causing a classic "Thundering Herd" bottleneck. 

Here is how I engineered my way out of it.

## Fix 1: The "Thermostat" Polling Algorithm

I needed to stop polling dead repositories. I realized that a repo like `facebook/react` needs to be checked constantly, while an obscure indie library might not see a new issue for weeks.

I engineered a custom **"Thermostat" (Hot/Warm/Cold) algorithm** to dynamically adjust polling frequencies based on repository momentum:

- **Hot:** Repositories with high recent activity are polled every hour.
- **Warm:** If a repository sees no new issues for 3 days, it drops to a 12-hour polling cycle.
- **Cold:** After 2 weeks of silence, it is throttled to a 24-hour sync. 

The moment a "Cold" repo gets a new issue, the Thermostat instantly upgrades it back to "Hot". This single algorithmic change reduced unnecessary GitHub API calls by over 70% while keeping active data perfectly real-time.

## Fix 2: Redis Distributed Locks (`SETNX`)

The second problem was concurrency. I use the Gemini API to summarize massive issue threads. If three developers clicked on the same un-summarized issue at the exact same millisecond, Spring Boot spun up three threads and hit the AI API three times. 

To solve this, I implemented a **Distributed Lock** using Redis. 

I used the Redis `SETNX` (Set if Not eXists) command with a 15-second TTL (Time to Live). 

```java
public String getIssueSummary(String issueId) {
    // 1. Check if summary already exists in DB/Cache
    if (cache.hasKey(issueId)) return cache.get(issueId);

    // 2. Try to acquire the Redis Lock
    boolean isLockAcquired = redisTemplate.opsForValue()
            .setIfAbsent("lock:summary:" + issueId, "LOCKED", 15, TimeUnit.SECONDS);

    if (isLockAcquired) {
        try {
            // 3. I have the lock! Call the Gemini API.
            String summary = geminiService.generateSummary(issueId);
            saveToDbAndCache(issueId, summary);
            return summary;
        } finally {
            // 4. Release lock
            redisTemplate.delete("lock:summary:" + issueId);
        }
    } else {
        // 5. Another thread is summarizing this right now. Backoff and wait.
        return waitForSummaryAndPollCache(issueId);
    }
}
```
Now, the first thread acquires the lock and does the heavy lifting. The concurrent threads see the lock, wait gracefully, and then pull the final result straight from the cache. Zero duplicate API calls, zero wasted AI tokens.

## Where I Am Now?
With the Thermostat saving GitHub API quotas and Redis protecting my Gemini AI quotas, the backend is finally thread-safe and highly concurrent. The core infrastructure is stable enough to handle heavy traffic without collapsing.

## What's Next?
The system is optimized, but I now face a massive data challenge: Historical Backfilling.

I want to expand the platform to track 14,000+ repositories. I need to summarize thousands of historical READMEs, which would instantly exhaust my daily AI limits and spike my AWS RAM if I ran it on the live production server.

In Part 3, I will discuss how I optimized the data layer to squeeze maximum performance out of the architecture.

Feel free to check out my live builds or reach out via my X handle!