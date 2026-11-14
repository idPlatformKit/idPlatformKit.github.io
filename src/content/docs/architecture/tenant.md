---
title: Tenant
description: The Tenant composition in IdPlatformKit, a namespace baseline plus an optional, genuinely isolated OpenBao secrets space, created in dependency order.
---

A `Tenant` is what a team asks for first: its own namespace, with the guardrails already in place, and optionally its own secrets space.

```yaml
apiVersion: platform.idplatformkit.io/v1alpha1
kind: Tenant
metadata:
  name: demo-team          # also the namespace, and the OpenBao namespace
spec:
  ownerGroup: demo-team-engineers
  vault:
    enabled: true
    serviceAccountName: demo-app   # the only ServiceAccount allowed to read the secrets
```

`Tenant` is cluster-scoped, because it creates a namespace and so can't live inside one.

## What it creates

**Always:** a `Namespace`, a `ResourceQuota` (requests of 4 CPU and 8Gi, limits of 8 CPU and 16Gi, 20 pods), a `LimitRange`, a `RoleBinding` that gives the owner group the `edit` role, and a `NetworkPolicy` that denies everything except traffic inside the namespace.

**With `vault.enabled`:** an OpenBao namespace with its own KV mount, policy, Kubernetes auth backend, auth config and role, the ServiceAccount allowed to log in, and a `SecretStore` so External Secrets Operator can deliver secrets as Kubernetes `Secret`s.

One composition serves both cases. `function-cel-filter` drops the OpenBao resources unless `spec.vault.enabled` is true, so there's no second composition to maintain.

## Isolation, tested rather than assumed

Each tenant gets its own OpenBao **namespace**, not a path prefix on a shared mount. A secret written in one tenant's namespace was invisible from the root namespace and from another tenant's namespace.

The auth role only accepts the tenant's own ServiceAccount from the tenant's own namespace. A team has `edit` on its namespace and can create its own `SecretStore`, so that was tested too: a store in `checkout` pointed at the `payments` OpenBao namespace was refused by OpenBao with a `403`.

[Why OpenBao rather than Vault](/architecture/decisions/#openbao-rather-than-vault)

## Creation order: from 3 minutes to 3 seconds

Crossplane applies every composed resource at once. Here that fails twice: resources inside the namespace are created before the namespace exists, and the OpenBao mount and policy before their OpenBao namespace. Each failure triggers a back-off. A tenant with secrets took **183 seconds** to become `Ready`, longer than the CI's 180-second wait, which made CI flaky.

`function-sequencer`, last in the pipeline, now creates resources in dependency order:

1. the namespace;
2. what lives in it, and the OpenBao namespace;
3. the mount, the policy and the auth backend;
4. the auth config and the role;
5. the `SecretStore`, once everything it depends on is `Ready`.

Measured afterwards on kind: tenants with secrets were `Ready` in **2 to 3 seconds**, over three consecutive runs. Measured again in November 2026, with Envoy Gateway and cert-manager also on the cluster: 7, 4 and 3 seconds.

One run that day took about **65 seconds**. The `SecretStore` was created last, a minute late, and Crossplane reported `WatchCircuitOpen: Too many watch events from Tenant/demo-team`: its watch circuit breaker was throttling the Tenant's reconciles. The three runs right after had the circuit closed. Why it opened that once isn't known yet.

One gotcha along the way: listing the store's prerequisites as one group of alternatives didn't hold the store back. It was created before its role and failed validation three times. One rule per prerequisite fixed it.

## Known issues

- Deleting a tenant within seconds of its creation can hang, because a terminating namespace refuses the objects a managed resource needs to finish deleting ([#14](https://github.com/idPlatformKit/Orchestrator/issues/14)). Wait a minute or so before deleting a new tenant.
- Deletion order can't be sequenced yet for a cluster-scoped XR, because of an upstream bug in function-sequencer ([#114](https://github.com/crossplane-contrib/function-sequencer/issues/114)). The first attempt made every deletion hang, so only creation is sequenced.

Reference: [`docs/compositions/tenant.md`](https://github.com/idPlatformKit/Orchestrator/blob/main/docs/compositions/tenant.md).
