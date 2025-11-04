---
title: "RAG Web App Journey: The Motivation"
date: "2025-11-04"
tags: ["RAG", "FastAPI", "React/ChakraUI", "Tensorflow", "Sqlitte"]
excerpt: "How it all started."
---

![motivation](/portfolio/content/blog/images/motivation.jpg)

# The Motivation

The main motivation for the RAG app came from NoteBookLM itself. I have been into AI for around 2-3 months by that time and was thinking of can AIs be used to somehow read Pdfs and answer questions. NotebookLM when launched, not only did it, it also added many features like mind-maps, and later they kept adding features like audio and even video Overview.This single thing was my motivation to build my own custom RAG version.

## Why RAG and why in 2025?

FastForward to 2025, I saw many trends in AI, one being, "The lack of context window or a model's Ability to retain current information". To solve these issues, some kind of database was required which can retrieve high quality info and put it into the model's context window to generate the required output. This was a genius idea which i was really blown away. Then i studied more on it, second motivation came when i used perplexity which on the top level is a type of RAG. These things kept on forcing and inspiring me to create my own RAG Application.

## What I am Doing?

I Know I am late, especially since there are many cool and usefull libraries like Langchain, Chromadb, Pincecone etc. But for someone who is sort of a "First Principle Guy", a guy who like to understand every single bit of optimization or trick that is making a system fast, reliable or efficient, I needed to understand it from the Bottom Up. So, that's the reason I almost started scratch.

## Deployment vs Understanding

Now , i know its hilarious to even think to build RAG without as powerfull libraries as Langchain, but here was my goal, first principles for Understanding , abstraction for Deployment. Yes, my final Version will be almost entirely of Langchain. That is what i called the RAG Engine. Intially I made my own, and then slowly kept adding Langchain's equivalent which is more reliable and battle tested.

## Why all the Stack Choices?

### Why FastAPI?

See, Choosing FastAPI was straightforward, it was a light-weight, modern and fastgrowing library made for easier deployment of python models. The learning Curve for it is pretty balanced as well as its Fast considering being a Python Library.

### Why React and ChakraUI?

This was hard choice, in general people tend to move for options like StreamLit or Gradio, which are really cool BTW, but the reason i Choose React is freedom the freedom to design almost any component.
It offered freedom along with enough abstractions to work with. Combined with Chakra UI which is really nice framework it made it more easier to do.

### Why Chromadb and Sqlite?

For the Database I needed something simple and easier to debug as this was for the 1st time I was coding something which includes a DBMS system.
Both of these were pretty straight forward to work with as well as powerfull enough for my personal Project.

## What's Next?

For the next one i Would Explain and Breakdown of my entire RAG Engine Architecture what I have done till now, what improvements I am making and what i am Planning. For latest update check out my : [X](https://x.com/realnarayan_) handle. Untill then Meet you in the Next blog.
