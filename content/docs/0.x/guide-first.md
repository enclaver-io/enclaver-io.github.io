---
title: "Run Your First Enclave"
layout: docs-enclaver-single
category: guides
weight: 1
---

# Build and Run Your First Enclave

This guide will walk you through booting an EC2 machine, configuring it, then building and running your first enclave with Enclaver.

## Boot the Machine

Only certain [EC2 instance types][instance-req] can run Nitro Enclaves. Since dedicated CPUs are carved off for the enclave, the larger x86 types with 4+ vCPUs are ok, with `c6a.xlarge` being the cheapest. Your machines must be booted with the Nitro Enclave option enabled, which is found under the "Advanced details" > "Nitro Enclave". 

See [the Deploying on AWS](deploy-aws.md) for more details and an example CloudFormation template.

## Configure Instance

First, SSH to your EC2 machine:

```console
$ ssh ec2-user@<ip address>
```

Install the Nitro Enclave packages:

```console
$ sudo yum install --assumeyes aws-nitro-enclaves-cli aws-nitro-enclaves-cli-devel git
```

Configure the resources to dedicate to your enclaves:

```console
$ sudo sed --in-place 's/memory_mib: 512/memory_mib: 3072/g' /etc/nitro_enclaves/allocator.yaml
$ sudo systemctl enable --now nitro-enclaves-allocator.service
$ sudo systemctl enable --now docker
```

Download the latest Enclaver binary:

```console
$ curl --silent --location $(curl -s https://api.github.com/repos/enclaver-io/enclaver/releases/latest | jq --raw-output ".assets[] | select(.name|match(\"^enclaver-linux-$(uname -m)-(.*)tar.gz$\")) | .browser_download_url") --output enclaver.tar.gz
$ tar --extract --verbose --file enclaver.tar.gz
$ sudo install enclaver-linux-$(uname -m)-v*/enclaver /usr/bin
```

## Build the App

Clone Enclaver, which contains the example app code:

```console
$ git clone https://github.com/enclaver-io/enclaver
```

Enclaver uses a source "app" container image and transforms that image into an enclave image. Build the source app:

```console
$ cd enclaver/example
$ docker build --tag app .
```

This app echos a string back to you with each HTTP request:

```console
$ docker run --rm --detach --name app --publish 8000:8000 app
$ curl localhost:8000
Hello World!
$ docker stop app
```

## Build the Enclave Image

Enclaver builds enclave images based on a configuration file, which specifies the container that holds the app code, the network policy details.

Here's the `enclaver.yaml` for the example app:

```yaml
version: v1
name: "example"
target: "enclave:latest"
sources:
  app: "app:latest"
defaults:
  memory_mb: 1000
ingress:
  - listen_port: 8000
```

Build our enclave image:

```console
$ enclaver build
```

## Verify the Enclave Image (optional)

If you [verified](../install#verifying-the-binary) the downloaded `enclaver` binary against its SLSA attestation during the install step, you can trust the authenticity of the `enclaver` binary.
However during the build step, the Enclaver downloaded several helper Docker images that it combined with the app to produce the final image.
Before trusting and using the enclave image, you can verify that the downloaded helpers were also authentic.
`enclaver build` will print to the standard output a JSON with "Sources" that went into the image.
Use the digests to verify their provenance back to `enclaver-io/enclaver` repo:

```console
$ enclaver build
{
  "Sources": {
    "App": {
      "ID": "sha256:269bf2a9aca23ddc0fe66558e0b23ff5be6129838e365b0ef05bbe8e67f72191"
    },
    "Odyn": {
      "ID": "sha256:2be2016f0aa17f7cfc2660c635822b094a0c2ee64516e69be9913e48394c75f0",
      "Name": "public.ecr.aws/s2t1d4c6/enclaver-io/odyn:sha-3666d96",
      "RepoDigest": "public.ecr.aws/s2t1d4c6/enclaver-io/odyn@sha256:f4f3c2bc6489494579adc03ddbe7dfa5e9c84bc6ed848d1bd196969533a74d38"
    },
    "NitroCLI": {
      "ID": "sha256:14dd347aec286f67025c824762876b0226d0a890033bcd4ac5076c06fe90eee8",
      "Name": "public.ecr.aws/s2t1d4c6/enclaver-io/nitro-cli:latest",
      "RepoDigest": "public.ecr.aws/s2t1d4c6/enclaver-io/nitro-cli@sha256:83d1bf977d62d68fe49763c94fb0d1ab23dc59a5844e9f5b86a07ccf7618ced9"
    },
    "Sleeve": {
      "ID": "sha256:90a3e02986a728902d0751180e5213edc63cc0348f62cf03cd1ff7578281cd7d",
      "Name": "public.ecr.aws/s2t1d4c6/enclaver-io/enclaver-wrapper-base:sha-3666d96",
      "RepoDigest": "public.ecr.aws/s2t1d4c6/enclaver-io/enclaver-wrapper-base@sha256:00be50a88900a57294b82d62419b3ec3ef1dae2b7adf15565c04d2604fcb484a"
    }
  },
  "Measurements": {
    "PCR0": "3deca96aa8ab2d9ba6452c3075eb33cabb6b87543fbbf7f6746764c4d9c1e92ad8f3e441e7de9d1515978491044dd996",
    "PCR1": "4b4d5b3661b3efc12920900c80e126e4ce783c522de6c02a2a5bf7af3a2b9327b86776f188e4be1c1c404a129dbda493",
    "PCR2": "73778961b3d4faa24ba0f0a772256a3ab6498cc22b8b298bf4751c450e297d18d1dde18cf1c6ff6deaab16da4bdc9ff9"
  },
  "Image": {
    "ID": "sha256:085cf99c1ce2677bda33d8cc1446638ce8b0802d84b772fe43a5f304ae2901fe",
    "Name": "enclave:latest"
  }
}

$ gh attestation verify --repo enclaver-io/enclaver oci://public.ecr.aws/s2t1d4c6/enclaver-io/odyn@sha256:f4f3c2bc6489494579adc03ddbe7dfa5e9c84bc6ed848d1bd196969533a74d38
Loaded digest sha256:f4f3c2bc6489494579adc03ddbe7dfa5e9c84bc6ed848d1bd196969533a74d38 for oci://public.ecr.aws/s2t1d4c6/enclaver-io/odyn@sha256:f4f3c2bc6489494579adc03ddbe7dfa5e9c84bc6ed848d1bd196969533a74d38
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

Repeat the above for the "Sleeve" source and the NitroCLI (NitroCLI comes from enclaver-io/nitro-cli-docker repo).

## Run the Enclave

Run your enclave image by referencing it by it's given `target` name:

```console
$ enclaver run --publish 8000:8000 enclave:latest
```

Open a new shell and send a request to the service:

```console
$ curl localhost:8000
Hello World!
```

In your first shell you should see that the enclave received the request:

```console
 INFO  enclave         > Example app listening on port 8000
 INFO  enclave         > Request received!
```

Boom! You've started your first secure enclave!

To clean up, you can `^C` the `enclaver run` and it will shut down.

## Next Steps

This example walked through running an simple application in an enclave. Next, experiement with running a specific microservice or a security-centric function within an enclave.

Check out the [example Python app that talks to KMS](guide-app.md).

[instance-req]: https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave.html#nitro-enclave-reqs
