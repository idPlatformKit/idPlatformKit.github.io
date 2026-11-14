---
title: What IdPlatformKit is
description: A reference Internal Developer Platform built from open-source building blocks, runnable on a laptop, documented from what was actually observed.
---

IdPlatformKit (idpk) shows, end to end, how a platform team can give developers self-service access to secured infrastructure. A team asks for what it needs from a developer portal and gets an isolated, policy-compliant environment a few minutes later, without opening a ticket.

It's a **reference implementation**: the point is to be read, run and reused, not deployed as is.

## What a team gets today

- **A tenant**: a namespace with a resource quota, default limits, RBAC for the team's GitHub group and a default-deny network policy.
- **Its own secrets space**, optional: a dedicated OpenBao namespace that only the tenant's ServiceAccount can log in to, with secrets delivered as Kubernetes `Secret`s by External Secrets Operator. Cross-tenant access is refused by OpenBao itself, and that was tested.
- **Postgres databases**, as many as needed, on a shared server, with credentials in a `Secret`.
- **A view of all of it** in the portal: each tenant and database is a catalog entity, with a Kubernetes tab listing the resources behind it.
- **HTTPS** for the platform's own UIs (OpenBao, Argo CD), with a local CA.

## The three repositories

| Repository | Role |
|---|---|
| [Orchestrator](https://github.com/idPlatformKit/Orchestrator) | The platform itself: Crossplane compositions, platform services, the Argo CD bootstrap and the local kind environment |
| [instances](https://github.com/idPlatformKit/instances) | The claims that should exist on the platform, validated in CI and synced by Argo CD |
| [portal](https://github.com/idPlatformKit/portal) | The developer portal: Backstage with GitHub sign-in, the org's teams, Software Templates and the Kubernetes view |

## How the docs are written

Each page says what was run and what was observed, on a real kind cluster or in CI. When the first attempt was wrong, it says so and keeps the error message. A feature is marked as done only once it's implemented and tested end to end.

Next: [run it on your laptop](/start/run-locally/), or read the [architecture overview](/architecture/overview/).
