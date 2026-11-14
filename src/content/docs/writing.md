---
title: Writing
description: Articles by Anas Touil about the building blocks of IdPlatformKit, published on his blog.
---

This site is the reference: architecture, how to run the platform, demos. It follows the code and has no dates.

The stories behind it, dated and written in the first person, live on [Anas Touil's blog](https://antoyavin.github.io/writing/). Articles related to IdPlatformKit are listed here.

## Backstage.io series

The portal is built on Backstage. This series sets Backstage up from scratch, with the same GitHub sign-in and org import the portal uses.

- **[Part 1: Getting Started & Setting Up PostgreSQL](https://antoyavin.github.io/writing/backstage-series-part-1-getting-started/)**, September 6, 2026. What Backstage is, scaffolding an app with the CLI, and moving it from SQLite to PostgreSQL.
- **[Part 2: GitHub Authentication & User Ingestion](https://antoyavin.github.io/writing/backstage-series-part-2-github-auth/)**, September 13, 2026. Signing in with a GitHub OAuth App, then importing the GitHub org's users and teams into the catalog, with the errors you'll likely meet.

What the IdPlatformKit portal adds on top, in its [README](https://github.com/idPlatformKit/portal#readme):

- Software Templates that open a pull request to the instances repository **with the developer's own GitHub identity**.
- One catalog entity per tenant and per database, with a Kubernetes tab listing what Crossplane created, through a read-only ServiceAccount.
