---
title: GitOps with Argo CD
description: How Argo CD installs the whole IdPlatformKit platform from Git with an app of apps, and the sync-wave and health-check gotchas found on the way.
---

In the GitOps flow, only Argo CD and a few bootstrap Secrets are installed by hand. Argo CD installs everything else from the Orchestrator repository, keeps it in sync, then syncs the claims from the instances repository.

```sh
make local-up-gitops                              # tracks main
make local-up-gitops GITOPS_REVISION=my-branch    # test a pushed branch
```

## App of apps, in waves

One root Application, `platform`, renders a Helm chart of child Applications. Sync waves order the install:

| Wave | Applications |
|---|---|
| -2 | `crossplane`, `cert-manager`, `envoy-gateway` |
| -1 | `postgres-server`, `openbao-server`, `external-secrets`, `backstage-reader`, `gateway`, `argocd-route` |
| 0 | `providers` |
| 1 | `compositions` |
| 2 | `instances`: the claims |

Charts come from upstream; their values come from the same `platform/*/values.yaml` files the direct install uses, through multi-source Applications.

## Bootstrap Secrets, deliberately not in Git

The Postgres admin password, the OpenBao token and the local CA's key pair must exist before anything can use them, External Secrets Operator included. `make bootstrap-secrets` creates them imperatively, with the same fixed dev values as the direct install. It's a bootstrap stopgap, documented as such.

## What was learned on the way

**Sync waves don't order child apps out of the box.** Since Argo CD 1.8, an Application's health isn't assessed, so a parent only waits for a child Application *object* to exist. The waves were cosmetic until a health check for `Application` resources was restored in Argo CD's config.

**...and the root app was still healthy one wave too early.** A child app that hasn't synced yet reports `Missing`, which Argo CD doesn't count against the parent. The health check now maps `Missing` to `Progressing`. Polling every 5 seconds afterwards showed the waves in order.

**Argo CD knows nothing about the platform's own APIs.** A `Tenant` showed `Healthy` as soon as it existed. A Lua health check for `*.idplatformkit.io/*` maps the Crossplane `Synced` and `Ready` conditions. The first attempt, a wildcard in the per-kind key format, was refused by the API server: ConfigMap keys can't contain `*`.

**A briefly degraded child can stop the whole bootstrap.** After Envoy Gateway was added, its Application went `Degraded` for a few minutes on a fresh cluster. The root app failed that wave five times, gave up, and never created `compositions` and `instances`. The root app now has an explicit retry policy.

**CI hit a registry rate limit.** Argo CD's Redis image comes from ECR Public, which rate-limits anonymous pulls. On shared GitHub runners it failed with `429 Too Many Requests`. The same image is now pulled from Google's Docker Hub mirror.

**Self-heal works on claims.** Patching a `Tenant`'s owner group by hand was reverted 25 seconds later.

Reference: [`docs/gitops.md`](https://github.com/idPlatformKit/Orchestrator/blob/main/docs/gitops.md).
