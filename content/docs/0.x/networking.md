---
title: "Networking"
layout: docs-enclaver-single
category: reference
weight: 20 
---

# Networking

Nitro enclaves are stripped down virtual machines that do not have a networking interface, except for localhost.
The only conduit is a virtual socket (vsock) that connects the enclave to the host.
Enclaver uses this vsock to proxy networking traffic to and from the enclave.

## Egress proxy

### HTTP Tunnel
At this time, Enclaver only supports [HTTP Tunnel](https://en.wikipedia.org/wiki/HTTP_tunnel).
While the tunnel uses the HTTP `CONNECT` verb to initiate a connection, once a connection is established,
any TCP traffic can be proxied through it.

The application needs to have support for the HTTP tunnel (proxy), however, many high level HTTP libraries,
such as Python's "requests" have this capability built-in. For others, there is often an easy plugin/middleware
that can be installed to gain this functionality.

For libraries that have support out of the box, they often automatically detect the presence of `http_proxy` and `https_proxy`
environment variables to automatically establish a tunnel for requests.
Enclaver sets `http_proxy`, `HTTP_PROXY`, `https_proxy`, `HTTPS_PROXY`, `no_proxy`, `NO_PROXY` environment variables if the egress proxy is enabled.

### Configuration
To enable the egress proxy (HTTP tunnel), set the `egress` object in the manifest file and include hostnames and IPs that should be allowed for the application to connect to.
The configuration supports both regular (`*`) and greedy (`**`) wildcards. The greedy versions match multiple components of a hostname/IP. For example:

```yaml
egress:
  allow:
    - "kms.*.amazonaws.com"
    - "s3.amazonaws.com"
    - "**.mycorp.com"

  deny:
    - "auth.mycorp.com"
```

### Ingress proxy
The Enclaver supports a TCP ingress proxy which proxies from the host to the `localhost` inside the enclave.
To accept connections on a port 3000, the application should bind to `127.0.0.1:3000` and then instruct the Encalver to start the proxy in the manifest file:

```yaml
ingress:
  - listen_port: 3000
```

This will also cause the "outer" proxy to listen on `0.0.0.0:3000` on the host.
It is recommended to use TLS to secure the communication flowing through the host.
