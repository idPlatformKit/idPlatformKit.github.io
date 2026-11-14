# Terminal demo: `make try-tenant` on a running IdPlatformKit cluster.
#
# Re-record (needs a cluster from `make local-up` or `make local-up-gitops`,
# without a demo-team tenant):
#   ORCHESTRATOR_DIR=../Orchestrator vhs demos/try-tenant.tape
# Then delete the tenant, at least a minute after it became Ready
# (Orchestrator#14): kubectl delete -f examples/tenant-external-secret.yaml -f examples/tenant.yaml
#
# Nothing is sped up: the waits are real.

Output public/demos/try-tenant.gif
Output public/demos/try-tenant.webm

Set Shell "bash"
Set FontFamily "JetBrainsMono Nerd Font"
Set FontSize 13
Set Width 1280
Set Height 900
Set Padding 24
Set Theme "Builtin Solarized Dark"
Set TypingSpeed 45ms
Set WindowBar Colorful

Hide
Type `cd "$ORCHESTRATOR_DIR" && export PS1='$ ' && clear`
Enter
Show

Type "# A Tenant with its own OpenBao namespace: ten lines of YAML"
Enter
Sleep 600ms
Type "grep -v '#' examples/tenant.yaml"
Enter
Sleep 3s

Type "make -s try-tenant"
Enter
# Wait for the prompt to come back (make try-tenant waits up to 180s itself).
Wait+Line@200s /^\$$/
Sleep 5s

Type "clear && kubectl get tenant demo-team"
Enter
Sleep 4s
