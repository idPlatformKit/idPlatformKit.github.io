---
title: A tenant in seconds
description: Terminal recording of make try-tenant on a local IdPlatformKit cluster, a Tenant with its OpenBao namespace, then a secret delivered as a Kubernetes Secret.
---

`make try-tenant` on a local cluster. It applies the example `Tenant` with its OpenBao secrets space, waits for it to be `Ready`, lists what Crossplane created, then checks the whole secrets path: it writes a secret in the tenant's OpenBao namespace and reads it back as a Kubernetes `Secret` delivered by External Secrets Operator.

Nothing is sped up.

<video controls preload="none" playsinline poster="/demos/try-tenant-poster.png" width="1280" height="900" class="demo-video">
  <source src="/demos/try-tenant.webm" type="video/webm" />
  <a href="/demos/try-tenant.gif">Watch the recording (GIF)</a>
</video>

The still shows the end of the run: the Tenant and its resources, then `db-credentials/password in Kubernetes: from-openbao-demo-team`. Also available [as a GIF](/demos/try-tenant.gif).

## What you're seeing

1. The claim: ten lines of YAML.
2. `kubectl wait` until the `Tenant` is `Ready`.
3. The namespace and its guardrails: quota, limits, RBAC, network policy.
4. The OpenBao namespace, mount and policy, as Crossplane managed resources.
5. The tenant's ServiceAccount and its `SecretStore`.
6. A secret written in OpenBao, then read back from a Kubernetes `Secret`.

In real use, a team doesn't apply the claim itself: the portal's New Tenant template opens a pull request to the instances repository, and Argo CD applies it after the merge. See [the flow](/architecture/overview/).

## Record it yourself

The recording is a [VHS](https://github.com/charmbracelet/vhs) script, versioned with the site, so it can be re-recorded whenever the platform changes:

```sh
# with a running cluster (make local-up or make local-up-gitops)
ORCHESTRATOR_DIR=../Orchestrator vhs demos/try-tenant.tape
```
