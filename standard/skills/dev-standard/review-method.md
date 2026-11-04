## How to review

The rules for this repository are in `.github/instructions/dev-standard-*.instructions.md`: apply every file whose `applyTo` matches a changed path, plus `dev-standard-local.instructions.md` if it exists. Local rules may make VMS rules stricter, never weaker; on conflict follow the VMS rule and report it.

Read each matching rules file to its last line. If a read stops early, read the rest before you start.

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

State: overall assessment; number of findings per severity; how many MUST rules the second pass checked and which IDs it found violated; test and CI evidence; open questions; whether the dev-standard rule files are present, and their version; safe to merge: yes or no.
