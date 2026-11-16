---
title: Roadmap
description: What IdPlatformKit does today and the milestones ahead, from single sign-on to multi-cluster and AI platform services.
---

Each milestone is a [`roadmap` issue](https://github.com/idPlatformKit/Orchestrator/issues?q=is%3Aissue%20label%3Aroadmap) in the Orchestrator repository, or in the [portal](https://github.com/idPlatformKit/portal/issues?q=is%3Aissue%20label%3Aroadmap) for the portal's own work. A milestone is marked done only once it's implemented and tested end to end.

## Done

- **GitOps and the first golden path.** Argo CD installs the platform from Git (app of apps), claims live in a separate repository validated in CI, the portal's New Tenant template opens the pull request, and each tenant's resources are visible in the portal.
- **Secrets and databases.** Tenant secrets delivered as Kubernetes `Secret`s by External Secrets Operator, the New Postgres database template, and per-tenant database names on the shared server.
- **HTTPS on kind** ([#27](https://github.com/idPlatformKit/Orchestrator/issues/27)). Gateway API with Envoy Gateway, cert-manager and a local CA, `https://<name>.127.0.0.1.nip.io` for the platform's UIs.
- **Install on your own GitHub org** ([#45](https://github.com/idPlatformKit/Orchestrator/issues/45)). `make setup` and `make up`, with the portal running in the cluster. Verified end to end on a second org.
- **Single sign-on with Dex** ([#28](https://github.com/idPlatformKit/Orchestrator/issues/28)). GitHub teams of the installation's org as groups for kubectl, Argo CD and OpenBao. See [Single sign-on](/architecture/sso/).
- **Dedicated identities** ([#29](https://github.com/idPlatformKit/Orchestrator/issues/29)). Read-only, expiring identities for the portal, agents and CI (GitHub Actions OIDC, no stored kubeconfig), and an audited, one-hour break-glass. See [Who can do what](/architecture/access/).

- **The portal, made our own** ([portal#6](https://github.com/idPlatformKit/portal/issues/6), [portal#7](https://github.com/idPlatformKit/portal/issues/7)). The IdPlatformKit theme and logo, light and dark, and an admin page for `platform-admins`: the installation, the tools and how to sign in to each, and every Argo CD Application's health and sync status.
## Next

- **Guardrails and observability**: Kyverno baseline policies for tenant namespaces ([#8](https://github.com/idPlatformKit/Orchestrator/issues/8)), a "new app" golden path ([#24](https://github.com/idPlatformKit/Orchestrator/issues/24)), a Grafana dashboard per tenant ([#25](https://github.com/idPlatformKit/Orchestrator/issues/25)).
- **Day-2 operations**: update and delete tenants and databases from the portal, tenant tiers ([#30](https://github.com/idPlatformKit/Orchestrator/issues/30)), and governance on the claims repository ([#31](https://github.com/idPlatformKit/Orchestrator/issues/31)).
- **The composition library as a product**: render tests, packaging and versioned APIs ([#32](https://github.com/idPlatformKit/Orchestrator/issues/32)).

## Later

- **GitLab** as an alternative Git provider ([#46](https://github.com/idPlatformKit/Orchestrator/issues/46)).

- **Developer experience**: pull request previews, a fast inner loop, an `idpk` CLI ([#33](https://github.com/idPlatformKit/Orchestrator/issues/33)).
- **Agentic development**: the platform's golden paths exposed to AI agents over MCP, and agent sandboxes ([#34](https://github.com/idPlatformKit/Orchestrator/issues/34)).
- **Tenancy tiers and multi-cluster**: shared namespace, virtual cluster or dedicated cluster ([#35](https://github.com/idPlatformKit/Orchestrator/issues/35)), regions and placement with Cluster API ([#36](https://github.com/idPlatformKit/Orchestrator/issues/36)).
- **Prod-like services**: highly available OpenBao, CloudNativePG, backups, a self-managed Argo CD ([#37](https://github.com/idPlatformKit/Orchestrator/issues/37)).
- **A cloud target**: the same platform APIs backed by managed cloud services ([#38](https://github.com/idPlatformKit/Orchestrator/issues/38)).
- **AI platform services**: LLM access per tenant through an AI gateway ([#39](https://github.com/idPlatformKit/Orchestrator/issues/39)), GPU sharing ([#40](https://github.com/idPlatformKit/Orchestrator/issues/40)), pgvector ([#41](https://github.com/idPlatformKit/Orchestrator/issues/41)).

## Known issues

- Deleting a tenant right after creating it can hang ([#14](https://github.com/idPlatformKit/Orchestrator/issues/14)).
- provider-vault occasionally re-creates an OpenBao mount that already exists ([#16](https://github.com/idPlatformKit/Orchestrator/issues/16)).
