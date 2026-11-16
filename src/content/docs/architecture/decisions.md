---
title: Design decisions
description: Why IdPlatformKit uses Crossplane v2, OpenBao, Envoy Gateway, nip.io with a local CA, a separate claims repository and Dex, with the alternative considered each time.
---

Each building block was chosen for a reason that can be stated in a sentence. This page keeps those reasons, and the alternative that was considered.

## Crossplane v2 rather than v1

Two v2 features carry the design:

- **Namespaced composite resources.** A team creates a `PostgresDatabase` directly in its namespace. There's no separate claim kind to maintain.
- **Native Kubernetes resources composed directly.** A `Tenant` creates its `Namespace`, `ResourceQuota`, `RoleBinding` and `NetworkPolicy` without `provider-kubernetes`. The cost: Crossplane's own controller needs RBAC for those kinds, granted explicitly, including the `bind` verb on the `edit` role.

## OpenBao rather than Vault

The tenant design needs one feature: real **namespaces**, an isolation boundary with its own mounts, policies and auth methods. Vault's community edition reserves namespaces for Vault Enterprise. OpenBao, the Linux Foundation fork, ships them free. `provider-vault` talks to OpenBao unchanged, since the API is compatible.

## One composition with optional features, not one per variant

A tenant with or without secrets is the same `Tenant` API. `function-cel-filter` drops the OpenBao resources when `spec.vault.enabled` is false. One composition to test and maintain, and a team can switch the option on later without changing API.

## A shared backing service, sliced per claim

One Postgres server and one OpenBao server per cluster; each claim gets its own database or namespace on it. It keeps a laptop cluster small. The cost is that isolation depends on naming and policies, which is exactly where the [`PostgresDatabase` naming bug](/architecture/postgres-database/#server-side-names-a-security-fix) was found and fixed.

## Claims in their own repository

The platform (Orchestrator) and what runs on it (instances) live in separate repositories. Developers only ever open pull requests to `instances`, where CI validates each claim against the platform's APIs before Argo CD sees it. The platform team changes the platform without touching teams' claims, and the other way round.

## Pull requests under the developer's own identity

The portal's templates open pull requests with the signed-in user's GitHub token, not a shared bot token. GitHub then shows who asked for each tenant. The cost: the GitHub org has to approve the portal's OAuth App once.

## Envoy Gateway rather than Traefik

Both implement Gateway API, the Kubernetes standard that replaces Ingress (ingress-nginx was retired in March 2026). Envoy Gateway is built for Gateway API only, with no proprietary annotations for the basics, and is the natural base for the AI gateway planned later. Traefik is lighter and was the alternative.

## nip.io and a local CA rather than a real domain

`*.127.0.0.1.nip.io` needs no domain, DNS account or token, so anyone who clones the project gets the same URLs. A real domain with Let's Encrypt would avoid trusting a local CA, at the cost of reproducibility. The CA is generated on the host, not in the cluster, so it's trusted once per machine rather than once per cluster.

## Dex rather than Keycloak, for single sign-on

The goal is to use the GitHub org's teams as groups everywhere: kubectl, Argo CD, OpenBao, later Grafana. Dex passes GitHub teams through as groups; Keycloak doesn't import them, so it would have brought a second source of groups. Built and verified: see [Single sign-on](/architecture/sso/).
