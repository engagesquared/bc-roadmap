---
title: "Enriched Search"
summary: "Unlock powerful content and semantic search."
---

# Enriched Search Feature PRD

## Context

Brief authors, reviewers, and executives routinely mine past briefs - citing them as evidence in new submissions, drafting responses to ministerial questions and correspondence, and satisfying Freedom of Information obligations - so quick, reliable search is essential.

Today's Brief Connect search only scans titles and metadata, forcing users to remember exact document names or dig through folders. As content grows, so does the time wasted hunting for the right brief.

Additionally, the existing Brief Connect search system only reindexes record changes approximately every ~30mins. This delay can cause the dashboard to appear out of date in circumstances where records are updated frequently.

## Problem Statement & Goal

Searching for something "housing affordability" should pull every relevant brief-regardless of whether those words appear in the title, body, or attachment. Currently it does not.

Our goal is to:
- Expose full-text and AI-driven semantic search, enabling natural language queries like "Briefs relating to social housing in 2023," while respecting existing permissions
- Ensure that Brief Connect serves up fresher search and dashboard results

## Value Proposition

- **Save minutes, not moments** - executives locate the correct document in seconds rather than trawling channels or emailing colleagues
- **Reduce risk** - find the most up-to-date brief first time, lowering the chance of referencing outdated advice
- **Drive reuse** - easier discovery encourages teams to build on prior work instead of reinventing it
- **Lay AI foundations** - creates the index that future generative agents can use

## Capabilities

### Content Search
- Index full text of briefs, attachments (Word, PDF, email) and comments
- Relevance-ranked results with hit-highlighting
- Security trimming inherited from record permissions

### Semantic (AI) Search
- Natural-language queries using semantic ranking/embeddings to return relevant data
- Handles synonyms and related terms (e.g. "TIQ" <-> "Trade & Investment QLD")
- Inline filters: "Briefs about cyber security approved last quarter"

## Success Criteria

- Full-text indexing across all document types
- Real-time or near-real-time reindexing (eliminating 30-minute delay)
- Natural language query support with high relevance
- Sub-second search response times
- Permission-aware search results
