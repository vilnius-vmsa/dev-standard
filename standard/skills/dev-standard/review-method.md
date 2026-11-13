## How to review

The rules for this repository are in `.github/instructions/dev-standard-*.instructions.md`: apply every file whose `applyTo` matches a changed path, plus `dev-standard-local.instructions.md` if it exists. Local rules may make VMS rules stricter, never weaker; on conflict follow the VMS rule and report it. One exception is allowed by the standard itself: a file-layout exception recorded there under OPS-REPO-P02 is valid, and the paths it names are reviewed as if they matched the `applyTo` of the `infra` rules file and of the active DevOps profile files.

Read each matching rules file to its last line. If a read stops early, read the rest before you start.

### DevOps profiles

Delivery rules are split by method. A repository chooses its profiles in `.dev-standard/config.json`: one release model (`flow-branch` or `flow-tag`) and one deployment method (`compose`, `compose-blue-green` or `k8s`). `docker` is not a deployment method: it holds the container image rules, comes with every deployment method, and is listed on its own by a repository that builds images but deploys with a technology the standard does not describe, or deploys nothing.

* If `dev-standard-infra.instructions.md` is not installed, the repository has not enabled the DevOps rules (its config lists no infrastructure stack). Check none of them and do not state them from memory. When the repository has CI/CD or delivery files, that missing declaration is itself a violation of OPS-PIPE-P07, which is in `dev-standard-all.instructions.md`: report it once, on a change that touches those files or `.dev-standard/config.json`.
* `.dev-standard/config.json` decides which profiles are active: the stacks listed there, plus the stacks those build on. A profile rules file that is present but not chosen there is not active, except in the transitional case below.
* Apply the common `infra` rules and the rules of the active profiles. Do not apply or cite rules of a profile the repository did not choose.
* If the change touches delivery files (workflows, Dockerfiles, Compose files, manifests, deployment scripts) and no release model or no deployment method is active, say in the summary that the method-specific rules were not checked and why: the standard does not describe this technology, the repository deploys nothing, or the profile is simply not chosen. Only the last case can be a violation, as the next point says. The common `infra` rules, when installed, still apply.
* Outside the transitional case, report OPS-PIPE-P07 as a violation when the change touches `.dev-standard/config.json` or delivery files and the repository clearly deploys with a method the standard describes (production Compose files, Kubernetes manifests, Helm charts) or with a described release model, but the config does not list that stack: the rule requires the stack in the config as well as the description in the documentation, and without the stack those rules are not installed. Do not report it for a technology the standard does not describe or for a repository that deploys nothing.
* Transitional case: the config lists `infra` and none of `docker`, `compose`, `compose-blue-green`, `flow-branch`, `flow-tag`, `k8s`. Sync then installs every profile file and the repository has not chosen yet. Decide from the repository itself which profiles to apply, apply only those, and name the missing choice in the summary:
  * release model: production is deployed by a `vX.Y.Z` tag: `flow-tag`; by a push or merge to `main` (with `stage` for staging): `flow-branch`;
  * deployment method: production Compose files with slot services (`*-blue`, `*-green`) and a balancer in front of them: `compose-blue-green`; other production Compose files: `compose`; Kubernetes manifests, Helm charts or Kustomize: `k8s`;
  * container images: a Dockerfile is present: `docker`, whatever the deployment method;
  * when the repository shows neither, apply none of that pair.
* Cases the standard does not describe in detail yet are reported as information in the summary, not as findings and without a severity label:
  * the config lists both release models: say that a repository follows one release model, and apply the one its workflows actually use;
  * the config lists a Compose profile together with `k8s`: apply both sets of rules and say that both are declared.

### Two passes

Do both, in this order.

1. Defect pass. Review the changed code and the paths it affects for defects this change introduces or makes worse.
2. MUST rule pass. Go through every MUST rule (ID with `-P`) in the matching rules files. Skip a rule only when the change cannot touch what it governs. Check the diff against the text of each remaining rule, and report every violation, including ones that cause no defect.

### Findings

* Write all comments and the summary in English.
* Report only actionable issues this change introduces or makes worse.
* Each finding gives: severity, file and line, the problem, its impact and a fix. Do not repeat a finding.
* Cite a rule ID with its section, for example `CODE-SEC-P01 (4.6)`, only when the finding breaks that rule's text. A defect that breaks no rule gets no ID. Never attach the nearest rule to label a defect.
* Severity:
  * `[BLOCKING]`: a verified violation of a MUST rule, or a critical security, data, authorization or functional defect.
  * `[IMPORTANT]`: a concrete reliability, maintainability, performance or operational risk.
  * `[SUGGESTION]`: a SHOULD rule (ID with `-R`) or another non-blocking improvement.
* Ignore formatting that linters handle (4.2.3).
* Do not claim missing CI, coverage, legal basis or external configuration unless you can verify it; list doubts under "Open questions".
* If the change complies, give a short approval summary. Never invent findings.

### Verifying

* Check each finding against the diff, related code, middleware, configuration and tests; absence from one file is not proof.
* Trace input and data flow; do not claim a vulnerability or failure without a concrete path.
* Comment on the smallest relevant changed line; otherwise use the summary.
* Never repeat secrets or personal data in a comment. Leave out low-confidence findings.
* Do not ask for unrelated refactors, dependencies or redesigns when a smaller compliant fix exists.

### Summary

State: overall assessment; number of findings per severity; how many MUST rules the second pass checked and which IDs it found violated; the DevOps profiles checked and not checked (for example "DevOps profiles: flow-branch, compose-blue-green. Not checked: flow-tag, k8s.") when the change touches delivery files; test and CI evidence; open questions; whether the dev-standard rule files are present, and their version; safe to merge: yes or no.
