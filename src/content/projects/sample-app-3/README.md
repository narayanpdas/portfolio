---
title: "TooManyIssues"
description: "A polyglot backend pipeline scaling open-source discovery across 14,000+ repositories."
source: "https://github.com/narayanpdas/toomanyissues-backend"
demo: "https://toomanyissues.vercel.app/"
track: "https://x.com/realnarayan_"
image: "content/projects/sample-app-3/screenshot.png"
tags: ["Spring-Boot", "Redis", "Mongo-Db" ,"System-Design", "PostgreSQL"]
order: 1
date: "2026-06-29"
---

## TL;DR

Finding the right open-source issue is often harder than fixing it due to ecosystem fragmentation and vanity metrics. **TooManyIssues** is a highly concurrent backend pipeline designed to aggregate, rank, and serve issues from over 14,000 GitHub repositories. Built around a robust Spring Boot core, it tackles complex infrastructure challenges like heavy API rate limiting, distributed state management, and algorithmic data normalization to provide developers with a curated, high-utility feed of open-source work.

## Key features

- **Dynamic Polling Algorithm:** Engineered a custom "Thermostat" (Hot/Warm/Cold) scraper that autonomously adjusts GitHub API polling frequencies based on repository activity, drastically reducing rate-limit exhaustion.
- **Distributed Concurrency & AI:** Integrated the Gemini AI model for real-time issue summarization, utilizing Redis `SETNX` distributed locks (15s TTL) to prevent "thundering herd" race conditions and duplicate API calls.
- **Polyglot Persistence Layer:** Architected a dual-database system using PostgreSQL for strict relational integrity (Users, RBAC) and MongoDB with compound indexing for high-volume, schema-less issue data.
- **Heuristic Ranking System:** Bypasses basic "vanity stars" by using a Hacker News-style exponential decay algorithm, ranking issues mathematically based on repository utility (forks-to-stars ratio) and recency.
- **Production Reliability:** Core business logic, concurrency handling, and rate-limiting behaviors are strictly verified using JUnit 5 and Mockito.
