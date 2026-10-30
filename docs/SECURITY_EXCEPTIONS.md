# Security exceptions

Follow the [dependency security process](DEPENDENCY_SECURITY.md). This register records decisions; it does not grant approval. A remediation request, scanner baseline or approval in another repository does not accept risk here.

## Approved current exceptions

No approved current security exceptions were evidenced in the repository guidance or existing scanner baseline. No new exception is approved by this change. An empty approved section does not establish a clean audit; unresolved findings belong in the change's review inventory.

For each future authorised exception, retain all of the following:

| Field | Required evidence |
| --- | --- |
| Advisory | Canonical identity and authoritative source. |
| Affected scope | Package, resolved versions/ranges and every approved parent path. |
| Rationale and exposure | Why supported remediation is blocked and actual runtime/build/test/packed exposure. |
| Mitigation | Verified controls and their limitations. |
| Accountable owner | Verified assignment, not an agent's proposed team. |
| Tracking | Real tracking reference and access-appropriate review evidence. |
| Approval | Authorised approver, decision date and evidence of the exact accepted scope. |
| Review/expiry | Date and reassessment triggers required by the actual policy. |

## Outstanding policy and scope decisions

The inspected repository does not document a security-exception approval authority or response policy. Establish that authority through the repository's owners before accepting risk; do not fabricate owners, tickets, deadlines or approval.

The [known-issues baseline](../yarn-audit-known-issues) contains deprecation output with older Angular versions. It supplies none of the approval metadata above and is not an accepted security exception. Its version scope and the audit wrapper's parser/error handling require follow-up. Preserve unresolved records until reviewed; do not expand the baseline or treat an empty parsed set as approval.

Keep proposed, expired, incomplete and changed-scope decisions explicitly separate from approved current entries in the review inventory. This change proposes no new security exception. Existing peer mismatches and deprecations are maintenance/compatibility gaps, not implicit risk acceptance.

## Reassessment

Reassess by the actual review/expiry date, or earlier when dependency paths, versions, exposure or supported fixes change. Capture fresh complete and production audits; inspect current maintained parent releases and attempt supported fixes when authorised.

Remove resolved entries and matching baseline records only after every affected occurrence is verified removed. If remediation remains blocked, request the policy-required decision with current scope and evidence. Never silently renew dates, transfer approval across paths or repositories, or regenerate the baseline to obtain a pass. Record any authorised renewal separately from the historical decision.
