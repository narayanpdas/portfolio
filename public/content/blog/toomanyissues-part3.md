---
title: "TooManyIssues Part 3: Squeezing Performance - N+1 Queries, Egress, and Search"
date: "2026-06-29"
tags: ["SQL", "Redis", "Database Optimization", "Spring Data JPA"]
excerpt: "With API rate limits solved, my next bottleneck was the database. Here is how I eliminated N+1 network calls, slashed DB egress, and fixed search relevance."
---

Parent Project Link: [TooManyIssues](https://github.com/narayanpdas/TooManyIssues)

# The Database Wall

In Part 2, I protected the application from external API rate limits using a custom polling algorithm and Redis distributed locks. The system was finally ingesting massive amounts of open-source data safely. 

But as the data volume grew, a new set of problems emerged internally. My Spring Boot application was suddenly making way too many network calls to my databases, driving up latency and egress costs. Furthermore, the search functionality was becoming useless as more data flooded in. 

Here is how I optimized the data layer to squeeze maximum performance out of the architecture.

## Fix 1: Eliminating the N+1 Query Problem

When using Object-Relational Mapping (ORM) tools like Spring Data JPA or Hibernate, it is dangerously easy to accidentally trigger the **N+1 Problem**. 

Initially, when I fetched a list of repositories for issue scrapping I used to call the database each time with 10-100 repository for scanning, because of this if cron job has to scan 500 repos we would make 5 calls to database, this also included information we might not require for actually fetching an issue. To solve this
I completely rewrote the database interaction logic:
- I removed the some of the naive ORM loops and wrote **custom SQL SELECT and UPDATE queries**.
- By utilizing proper `SELECT & UPDATE` clauses and batch updates, I consolidated those 5 network calls down to just 1 highly optimized query. The CPU and network overhead dropped instantly as well since we only poll whats needed, the actuall bandwidth optimization came from the next fix.

## Fix 2: Caching to Slash Database Egress

Every time my Spring Boot backend fetched data from PostgreSQL, it cost network bandwidth (Egress). Since many of these open-source repositories are frequently queried, so calling the database on every single cron-job was incredibly inefficient.

I expanded my use of **Redis**. Instead of just using it for `SETNX` distributed locks, I started using it as a high-speed data cache. By storing required, frequently accessed database information in the Redis server, I drastically reduced the egress load on my primary databases. Now, when we scrape for issues we do not query the entire database instead we use query it from redis and sync the changes back to postgres periodically.


![egressReductionGraph](/portfolio/content/blog/images/egressReductionGraphSupabase.png)
As you can see here the bandwidth reduced a lot, because of caching which cost around 50-70Mb of local server ram.


## Fix 3: Label Mapping & The "Lost in Words" Problem

With the backend running fast, I noticed a severe issue with the frontend user experience: the search was broken.

Initially, I indexed the entire body of the GitHub issues. This created a massive **"Lost in Words"** problem (essentially bad SEO). If a user searched for the "bug" tag, the database would return hundreds of irrelevant issues just because someone wrote the word "bug" in a random comment deep inside a 2,000-word Markdown thread.

To fix search relevance:
- I fixed the Label Mapping pipeline to accurately parse labels.
- I restructured the indexing engine to **only index the Issue Title and the Labels**. 
By ignoring the noise of the issue body, the search precision increased. When a user searches for a specific tech stack or issue type, they now get exact matches.

## Where I Am Now?

**NOTE:** As of today, the system is fully functional. The ingestion engine is stable, the database is highly optimized, and the architecture runs continuously without hitting either GitHub or Gemini API rate limits. 

The backend infrastructure is finally complete, but the product itself still has room to grow to become even more user-friendly.

## What's Next?

With the data clean and flowing, it is time to build the intelligence layers. Here is what is coming up next:

- **Mathematical Issue Ranking System:** Implementing a Hacker News-style exponential decay algorithm to rank issues by utility (stars vs. forks) rather than just recency.
- **Recommendation Engine v2.0.0:** Shifting from basic filtering to a smarter matching system, this would include basic ml pipelines to which would automatically tag and find issues from your profile, along with github account addition option by which your github id can be used to further improve your issue finding experience.
- **GSOC Tab:** A dedicated pipeline/section for Google Summer of Code orgs.

You can check out the live builds or follow the progress on my [X](https://x.com/realnarayan_) handle!