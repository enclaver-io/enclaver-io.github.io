---
author: "The Enclaver Team"
title: "Validate an AWS Nitro Enclave Attestation"
layout: attestation
---

<div class="wrapper">
    <div class="single-page-header">
      <h1 class="header-skew">Attestation Explorer</h1>
    </div>
    <div class="row">
        <div class="validator-subtext col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12">
            <p>Use this tool to validate an attestation document from a AWS Nitro Enclave in CBOR/COSE format. An attestation from a secure enclave proves that data was processed within an enclave.</p>
            <p><em>Attestations may contain sensitive information. We don't record anything uploaded here, but you should be careful where you share them.</em></p>
        </div>
    </div>
    <div id="validator">
        <script src="{{< baseurl >}}js/validator.js"></script>
        <div class="validator-hitbox validator-hitbox-large">
            <div class="validator-hitbox-prompt">
                <img src="{{< baseurl >}}img/icon-upload.svg" class="img-center" />
                <span id="validator-prompt">Drag to upload attestation document</span>
            </div>
            <button type="submit" id="validator-upload">Upload file...</button>
            <button id="validator-demo" class="button-white">Load demo attestation</button>
            <input type="file" name="file" id="file" class="hidden">
        </div>
        <div class="validator-results">
            <div class="validator-summary" id="status">
                <div class="validator-summary-wrapper">
                    <div class="validator-summary-primary">Attestation is valid</div>
                    <div class="validator-summary-secondary">CertExpired</div>
                </div>
            </div>
            <div class="validator-help validator-subtext hidden">
                <p>An attestation document is encoded binary data, so it can be hard to figure out if it's valid or not.</p>
                <p>Before using this tool, fetch the document from your EC2 server to your local machine:</p>
                <div class="highlight">
                    <pre><code>scp ec2-user@1.2.3.4:/location/of/attestation.cbor ~/Desktop/attestation.cbor</code></pre>
                </div>
                <div class="validator-doc validator-doc-first validator-doc-last">
                    <div class="validator-doc-pill">Guide</div>
                    <a href="https://github.com/enclaver-io/enclaver/pull/126#issuecomment-1324229762" class="homepage-demo-title">Read the attestation document inside of your enclave</a>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="validator-section" id="module_id">
                        <h3 class="validator-section-header">Module ID</h3><span class="validator-section-subtext"> - Issuing Nitro hypervisor module ID</span>
                        <div class="validator-section-result">
                            <div class="highlight">
                                <pre class="validator-value"><code class="language-text" data-lang="text"></code></pre>
                            </div>
                        </div>
                        <div class="validator-doc validator-doc-first">
                            <div class="validator-doc-pill">Guide</div>
                            <a href="{{< baseurl >}}enclaver/docs/0.x/deploy-aws/#run-via-systemd-unit" class="homepage-demo-title">Start enclaves with <code>docker run</code></a>
                        </div>
                        <div class="validator-doc validator-doc-last">
                            <div class="validator-doc-pill">Guide</div>
                            <a href="{{< baseurl >}}enclaver/docs/0.x/guide-first/#build-the-enclave-image" class="homepage-demo-title">Store enclave images in a container registry</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="validator-section" id="timestamp">
                        <h3 class="validator-section-header">Creation Timestamp</h3><span class="validator-section-subtext"> - When the document was created</span>
                        <div class="validator-section-result">
                            <div class="highlight">
                                <pre class="validator-value"><code class="language-text" data-lang="text"></code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="validator-section">
                <h3 class="validator-section-header">Certificate Chain</h3><span class="validator-section-subtext"> - Validate that the document is tied to a valid root of trust</span>
                <div class="validator-section-result" id="cert-chain">
                    <div class="highlight">  
                    </div>
                </div>
            </div>
            <div class="validator-section">
                <h3 class="validator-section-header">PCRs</h3><span class="validator-section-subtext">- Values of all locked and non-zero PCRs at the moment the attestation document was generated</span>
                <div class="validator-section-result" id="pcrs">
                    <div class="highlight">  
                    </div>
                </div>
                <div class="validator-doc validator-doc-first validator-doc-last">
                    <div class="validator-doc-pill">Guide</div>
                    <a href="{{< baseurl >}}enclaver/docs/0.x/guide-app/#explore-the-enclave" class="homepage-demo-title">KMS key policies using PCR values</a>
                </div>
            </div>
            <div class="validator-section" id="nonce">
                <h3 class="validator-section-header">Nonce</h3><span class="validator-section-subtext">(base64) - Optional value used as a proof of authenticity that your data is the subject of the attestation document</span>
                <div class="validator-section-result">
                    <div class="highlight">
                        <pre class="validator-value"><code class="language-text" data-lang="text"></code></pre>
                    </div>
                </div>
                <div class="validator-doc validator-doc-first validator-doc-last">
                    <div class="validator-doc-pill">Guide</div>
                    <a href="https://github.com/enclaver-io/enclaver/pull/126#issuecomment-1324229762" class="homepage-demo-title">Include a nonce in your attestations to avoid replays</a>
                </div>
            </div>
            <div class="validator-section" id="user_data">
                <h3 class="validator-section-header">User Data</h3><span class="validator-section-subtext">(base64) - Optional additional user data signed by the enclave</span>
                <div class="validator-section-result">
                    <div class="highlight">
                        <pre class="validator-value"><code class="language-text" data-lang="text"></code></pre>
                    </div>
                </div>
                <div class="validator-doc validator-doc-first validator-doc-last">
                    <div class="validator-doc-pill">Guide</div>
                    <a href="https://github.com/enclaver-io/enclaver/pull/126#issuecomment-1324229762" class="homepage-demo-title">Reference data in your attestations for signing operations</a>
                </div>
            </div>
            <div class="validator-section" id="public_key">
                <h3 class="validator-section-header">Public Key</h3><span class="validator-section-subtext">(base64) - Optional DER-encoded key you can use to encrypt data to be read by the enclave</span>
                <div class="validator-section-result">
                    <div class="highlight">
                        <pre class="validator-value"><code class="language-text" data-lang="text"></code></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
