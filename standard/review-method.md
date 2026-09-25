## How to review

The rules for this repository are in `.github/instructions/dev-standard-*.instructions.md`: apply every file whose `applyTo` matches a changed path, plus `dev-standard-local.instructions.md` if it exists. Local rules may make VMS rules stricter, never weaker; on conflict follow the VMS rule and report it.

### Findings

* Write all comments and the summary in English.
* Review the changed code and the paths it affects. Report only actionable issues this change introduces or makes worse.
* Each finding gives: severity, file and line, the problem, its impact, a fix, and the rule ID with its section, for example `CODE-SEC-P01 (4.6)`. Do not repeat a finding.
* Severity:
  * `[BLOCKING]`: a verified violation of a MUST rule (ID with `-P`), or a critical security, data, authorization or functional defect.
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

State: overall assessment; number of findings per severity; test and CI evidence; open questions; whether the dev-standard rule files are present, and their version; safe to merge: yes or no.
