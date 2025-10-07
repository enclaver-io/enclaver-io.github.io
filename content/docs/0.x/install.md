---
title: "Installation"
layout: docs-enclaver-single
category: getting_started
weight: 5
---

## Installing Enclaver

Enclaver is released on GitHub: https://github.com/enclaver-io/enclaver/releases

Binary releases exist for Linux and MacOS platforms, and x86 and Arm architectures.

`enclaver build` and other commands can be executed on any platform and architecture.

`enclaver run` only supports Linux/x86 based enclaves at this time, but Linux/Arm support is very close, tracked by [issue #97](https://github.com/enclaver-io/enclaver/issues/97)

## Verifying the binary

You can verify that the downloaded binary was indeed compiled from the https://github.com/enclaver-io/enclaver repo source code.
All releases starting with 0.6.1 publish a SLSA provenance document to [SigStore](https://sigstore.dev).
The SLSA provenance document contains which Git repo and SHA was used as source and what GitHub workflow was invoked to produce the binary.

Use [GitHub CLI](https://cli.github.com/) (`gh`) to verify the binary:

```console
$ gh attestation verify --repo enclaver-io/enclaver ./enclaver
Loaded digest sha256:1adcbcae6c9bff4496ef538c36b6a462cb18a57620053b7caf6d5afca5032b9d for file://enclaver
Loaded 1 attestation from GitHub API

The following policy criteria will be enforced:
- Predicate type must match:................ https://slsa.dev/provenance/v1
- Source Repository Owner URI must match:... https://github.com/enclaver-io
- Source Repository URI must match:......... https://github.com/enclaver-io/enclaver
- Subject Alternative Name must match regex: (?i)^https://github.com/enclaver-io/enclaver/
- OIDC Issuer must match:................... https://token.actions.githubusercontent.com

✓ Verification succeeded!

The following 1 attestation matched the policy criteria

- Attestation #1
  - Build repo:..... enclaver-io/enclaver
  - Build workflow:. .github/workflows/release.yaml@refs/heads/main
  - Signer repo:.... enclaver-io/enclaver
  - Signer workflow: .github/workflows/release.yaml@refs/heads/main
```

## Getting Started

Head over to the [Getting Started guide][getting-started] to start using Enclaver.

[getting-started]: getting-started.md
