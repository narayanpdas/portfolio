---
title: "HI Docs"
description: "A RAG Based App, Designed to Talk with Documents."
source: "https://github.com/narayanpdas/HI-Docs-"
# demo: "https://sample-app-one.example.com"
track: "https://x.com/realnarayan_"
image: "content/projects/sample-app-1/assets/screenshot.svg"
tags: ["FastAPI", "Tf", "React", "Sqlitte"]
order: 1
date: "2025-11-01"
---

# TL;DR

HIDocs is a high-performance web application engineered to facilitate semantic search and QA over unstructured documents. Built on FastAPI, it leverages the RAG (Retrieval-Augmented Generation) architecture to ground LLM responses in factual data.

Unlike standalone LLMs which are prone to hallucinations, HIDocs ensures deterministic and verifiable outputs by retrieving context directly from the source material before generation.

# Key features

- Utilizing FastAPI BackgroundTasks to handle heavy PDF parsing without blocking the main thread.
- The chat engine uses WebSockets for real-time latency. It retrieves context chunks from ChromaDB and injects them into the LLM context window dynamically.
- Strict validation using Pydantic to prevent runtime errors, with a clean separation of concerns (Ingestion, Embedding, Retrieval).
