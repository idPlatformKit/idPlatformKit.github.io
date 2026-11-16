---
title: Who can do what
description: Every way into IdPlatformKit is a named identity with its own scope, and every credential not tied to a person's sign-in expires. People, the portal, agents, CI and break-glass.
---

Every way into the platform is a named identity with its own scope, and every credential that isn't tied to a person's sign-in expires. Nobody shares an admin token.

| Identity | Signs in with | On the cluster | Expires |
|---|---|---|---|
| **A team member** | GitHub, through [Dex](/architecture/sso/) | `edit` on its team's tenants; its tenants' secrets in OpenBao; read in Argo CD | With the sign-in |
| **A platform admin** (`platform-admins`) | GitHub, through Dex | Everything | With the sign-in |
| **The portal** | Its pod's ServiceAccount | Read what it shows, no Secrets | Rotated by Kubernetes |
| **An agent** | A ServiceAccount of its own | Read, no Secrets | 8 hours by default |
| **CI** (GitHub Actions of the org) | The job's GitHub OIDC token | Read, no Secrets | With the job |
| **Break-glass** | A client certificate issued on demand | Everything, **audited** | 1 hour |

Changes to the platform don't go through any of these: they're pull requests, merged by people, applied by Argo CD.

## Agents see, and propose

`make agent-kubeconfig NAME=reviewer` gives an agent its own ServiceAccount and a kubeconfig whose token expires. It can read tenants, databases and their status, never Secrets, and can't change anything. To change something, it does what a person does: it opens a pull request on the instances repository, with its own GitHub identity. The platform's MCP server, later in the roadmap, builds on this.

## CI without a stored kubeconfig

GitHub gives every Actions job a short-lived OIDC token. The API server trusts GitHub's issuer, for one audience and only for repositories of the installation's org, a rule written in CEL. The job signs in as `github-actions:<owner>/<repo>`, read-only, with no secret stored anywhere.

The local kind cluster isn't reachable from GitHub, so the project checks it where it is: each e2e job signs in to the kind cluster it creates, with its own token, and checks it can read tenants and can't read Secrets or create namespaces.

## Break-glass, for when sign-in is down

Nobody holds an emergency credential by default. `make break-glass WHO=anas` issues a client certificate for `break-glass:anas`, signed by the cluster for one hour, with cluster-admin rights. The API server's audit policy logs every request from that group, and nothing else, and `make break-glass-log` reads it back:

```
2026-11-16T10:33:59Z  break-glass:claude-test  create configmaps -n default break-glass-audit-check  201
2026-11-16T10:33:59Z  break-glass:claude-test  delete configmaps -n default break-glass-audit-check  200
```

Argo CD's local `admin` account is disabled: admins sign in with GitHub, emergencies go through break-glass.

## What stays shared, said plainly

- **The cluster owner's admin certificate**, on their own machine: it creates the cluster and issues break-glass certificates. On a real cluster, it would be kept offline.
- **OpenBao's root token**: its dev mode requires one, and the platform uses it to configure OpenBao. People sign in through Dex instead. A prod-like OpenBao is on the roadmap.

Reference: [`docs/access.md`](https://github.com/idPlatformKit/Orchestrator/blob/main/docs/access.md).
