---
title: Install it on your laptop
description: Install IdPlatformKit on your own GitHub org in two commands, make setup and make up, on a local kind cluster. Then create your first tenant from the portal.
---

IdPlatformKit always runs on **your own GitHub org**. Its members sign in to the portal, its teams own the tenants, and your own instances repository holds every claim. Everything else runs on your laptop, on [kind](https://kind.sigs.k8s.io/): no cloud account, no domain, no DNS setup.

```sh
git clone https://github.com/idPlatformKit/Orchestrator.git && cd Orchestrator
make setup    # checks your machine, prepares your GitHub org
make up       # builds the platform (about 5 minutes)
```

Then open **https://portal.127.0.0.1.nip.io** and sign in with GitHub.

## Before you start

- **Docker** running (Docker Desktop, OrbStack, Colima…), plus `kind`, `kubectl`, `helm`, `openssl` and the GitHub CLI `gh`, signed in.
- Host ports **80 and 443** free: the platform serves `https://<name>.127.0.0.1.nip.io` there, on `127.0.0.1` only.
- A **GitHub org you own, with at least one team.** A free org is enough. If you're just trying IdPlatformKit, [create a test org](https://github.com/account/organizations/new) and a team in it.

You don't have to check all of this by hand: `make setup` does, and tells you what to fix.

## `make setup`

An interactive guide, safe to re-run. It:

1. Checks your tools, that Docker runs and that ports 80 and 443 are free.
2. Checks that `gh` can read your org's members and teams. Its default token can't (`read:user`, `user:email` are missing): `make setup` offers to add them, in your browser.
3. Asks for your org, and warns if it has no team yet.
4. Creates **your instances repository** from [instances-template](https://github.com/idPlatformKit/instances-template), empty and public, or reuses it.
5. Walks you through the portal's **OAuth App**. GitHub has no API for this one: the guide opens the right page in your org and prints the three values to paste, then asks for the client ID and secret.

Everything lands in `.idpk.env`, git-ignored and readable by you only.

## `make up`

Creates the cluster and lets Argo CD install the rest from Git: Crossplane and the compositions, the shared Postgres and OpenBao servers, External Secrets Operator, the HTTPS entry point, the portal. Then it syncs your instances repository. On a laptop (macOS, OrbStack), a fresh cluster was ready in about 4.5 minutes.

It ends with `make status`:

```
IdPlatformKit status

  ✓ GitHub org idpk-test, claims in https://github.com/idpk-test/instances
  ✓ Argo CD: every application Synced and Healthy
  ✓ Portal running
  ✓ Local CA trusted by this machine

Open
  Portal    https://portal.127.0.0.1.nip.io   sign in with GitHub (a member of idpk-test)
  Argo CD   https://argocd.127.0.0.1.nip.io   admin / <generated password>
  OpenBao   https://openbao.127.0.0.1.nip.io/ui   token root-local-dev
```

If your browser doesn't trust the local CA yet, `make status` says so: run `make local-ca-trust` once per machine (it asks for sudo). Firefox keeps its own store: import `.local-ca/ca.crt` there.

## Your first tenant

1. In the portal, **Create → New Tenant**: a name, one of your org's teams, and optionally its own OpenBao secrets space.
2. The portal opens a pull request on your instances repository, **under your GitHub identity**. Its CI checks the claim against the platform's APIs.
3. Merge it. Argo CD syncs it within about 3 minutes, Crossplane creates the tenant, and within 5 minutes the portal's catalog shows it, with a Kubernetes tab listing everything it's made of.

Add a database the same way, with **New Postgres database**.

## When you're done

```sh
make down   # deletes the cluster; your org, repository and .idpk.env stay
```

`make up` rebuilds everything from them, and syncs the tenants already in your repository.

Wait a minute after creating a tenant before deleting it: a tenant deleted right after creation can hang ([#14](https://github.com/idPlatformKit/Orchestrator/issues/14)).

## Just the compositions

To try the Crossplane compositions alone, without Argo CD, the portal or a GitHub org:

```sh
make local-up && make try-tenant && make try-postgres-database
```

[Watch `make try-tenant`](/demos/tenant/) to see what to expect. The full reference for the install is in the Orchestrator's [`docs/install.md`](https://github.com/idPlatformKit/Orchestrator/blob/main/docs/install.md).
