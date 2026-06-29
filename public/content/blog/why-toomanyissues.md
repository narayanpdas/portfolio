---
title: "TooManyIssues Part 1: Bootstrapping a Polyglot Ingestion Engine"
date: "2026-06-25"
tags: ["Spring Boot", "System Design", "PostgreSQL", "MongoDB"]
excerpt: "The open-source ecosystem is heavily fragmented. Here is how I started building a concurrent backend to aggregate and index it."
---

Parent Project Link: [TooManyIssues](https://github.com/narayanpdas/TooManyIssues)

# Why?

When I first started looking for open-source projects to contribute to, I realized a frustrating truth: finding the *right* issue often takes longer than actually writing the code to fix it. In this post, I'll share my experience building the core backend ingestion engine for **TooManyIssues**, designed to solve this exact ecosystem fragmentation.

## Why Build This?

I could have easily built a simple frontend wrapper that makes live calls to the GitHub API whenever a user searches for something. I used to do that in starter projects, but soon I realized that approach doesn't scale. If you just wrap an external API, you don't actually control the data pipeline. You hit rate limits instantly, and the user experience suffers. 

Instead of taking the easy route, I wanted to understand what happens **behind the scenes** when enterprise systems ingest massive amounts of data. Here are my main goals for this architectural series:

- **Polyglot Persistence**: Understand how to split data intelligently between relational databases (PostgreSQL) and schema-less document stores (MongoDB).
- **System Design**: Learn how to orchestrate high-throughput background workers in Spring Boot without blocking the main application threads.
- **Control**: To build an autonomous system that doesn't just read data, but schedules, indexes, and manages its own polling lifecycle.

## My WorkFlow

I primarily focused on the core data modeling and ingestion loop, starting from:

- How to query the GitHub GraphQL API efficiently instead of relying on heavy REST payloads.
- Setting up **PostgreSQL (Supabase)** to handle strict relational integrity. This is where I manage User accounts, Role-Based Access Control (RBAC), and user tracking.
- Setting up **MongoDB (Atlas)** to handle the high-volume, schema-less issue data. GitHub markdown and issue threads are highly unstructured, making a document database with compound indexing the perfect fit.

The development part was amazing. I learned how to move away from basic CRUD operations and start thinking about asynchronous execution like the following:

```java
@Scheduled(fixedRate = 60000)
public void pollGitHubIssues() {
    // The initial naive approach to fetching data
    List<Repository> repos = postgresRepo.findAll();
    repos.forEach(repo -> fetchAndSaveToMongo(repo));
}
```
## Where I Am Now?
This initial build was a huge success ,until it wasn't. The ingestion engine worked flawlessly for the first 100 repositories. But as I expanded the database to index thousands of repositories, the system started collapsing. My naive @Scheduled workers began hitting GitHub's API rate limits, and the application choked.

This is the start of the "Scaling TooManyIssues" series. The foundation is laid, but the architecture needs to evolve to handle scale.

## What's Next?

To fix the rate-limiting bottlenecks and prevent my threads from crashing into each other, I am currently engineering a custom "Thermostat" dynamic polling algorithm and integrating Redis distributed locks.

I will break down the math and code behind those scaling decisions in Part 2.

Feel free to reach out via the About page if you have any questions or want to collaborate!