---
title: Run it on your laptop
description: Build the whole platform on a local kind cluster in one command, with no cloud account, then create a tenant and a database.
---

The platform runs on [kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker). No cloud account, no domain, no DNS setup.

## Prerequisites

- Docker (or OrbStack, Colima…), `kind`, `helm`, `kubectl`, `openssl`.
- Host ports **80 and 443** free: the platform's HTTPS entry point listens there, on `127.0.0.1` only.
- Enough memory for Docker: with everything running, the kind node used about 3 GB.

## Build it

```sh
git clone https://github.com/idPlatformKit/Orchestrator.git
cd Orchestrator
make local-up-gitops
```

This creates the kind cluster, installs Argo CD and a few bootstrap Secrets, then lets Argo CD install everything else from Git: Crossplane and its providers, the shared Postgres and OpenBao servers, External Secrets Operator, cert-manager, Envoy Gateway and the compositions. Finally it syncs the claims from the [instances](https://github.com/idPlatformKit/instances) repository. On a laptop (macOS, OrbStack), a fresh cluster was fully synced in about 5.5 minutes.

Prefer to skip Argo CD? `make local-up` installs the same platform directly with Helm and `kubectl`.

## Trust the local CA, once

```sh
make local-ca-trust   # asks for sudo
```

The CA was generated on the first run in `.local-ca/` (git-ignored) and is reused by every cluster you create, so this is a one-time step per machine. Firefox keeps its own store: import `.local-ca/ca.crt` there.

You can now open:

- `https://argocd.127.0.0.1.nip.io`: Argo CD. User `admin`, password from `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d`.
- `https://openbao.127.0.0.1.nip.io/ui/`: OpenBao. Dev token `root-local-dev`.

`nip.io` resolves any `<name>.127.0.0.1.nip.io` to `127.0.0.1`, which is why no DNS setup is needed.

## Create a tenant and a database

```sh
make try-tenant              # a Tenant with its OpenBao namespace, then a secret read back through ESO
make try-postgres-database   # a logical database and its connection Secret
make try-gateway             # the HTTPS routes and certificate
```

[Watch `make try-tenant`](/demos/tenant/) to see what to expect.

In the GitOps flow, the real way to add a tenant is a pull request to `instances`, usually opened by the portal's New Tenant template. The `try-*` targets apply example claims directly, for a quick check.

## Clean up

```sh
make local-down
```

Delete test tenants before tearing down a cluster you keep: wait until a new tenant is `Ready` for a minute or so before deleting it, because of a known issue where a tenant deleted right after creation hangs ([#14](https://github.com/idPlatformKit/Orchestrator/issues/14)).

## The portal

The portal runs on your machine, next to the cluster, and needs a GitHub OAuth App. Its [README](https://github.com/idPlatformKit/portal#readme) walks through it. Once it runs, export the cluster's read-only credentials so its Kubernetes tab works:

```sh
eval "$(make -C ../Orchestrator -s backstage-token)"
yarn start
```
