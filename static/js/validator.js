$(document).ready(function() {
    $("html").on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(".validator-hitbox").addClass("validator-hitbox-hover");
    });

    $("html").on("drop", function(e) { e.preventDefault(); e.stopPropagation(); });

    // Manual upload button
    $("#validator-upload").click(function() {
        $("#file").click();
    });

    // Manual file selected
    $("#file").change(function() {
        var files = $('#file')[0].files[0];

        $("#validator-prompt").text(files.name);

        uploadData(files);
    });

    // Drag enter
    $(".validator-hitbox").on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // Drag over
    $(".validator-hitbox").on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // Drop
    $(".validator-hitbox").on('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();

        // Change styles
        $(".validator-hitbox").removeClass("validator-hitbox-hover");
        $("#validator-prompt").text(e.originalEvent.dataTransfer.files[0].name);

        // Handle files
        uploadData(e.originalEvent.dataTransfer.files[0]);
    });

    $("#validator-demo").click(function() {
        // Change styles
        $(".validator-hitbox").removeClass("validator-hitbox-large");
        $(".validator-hitbox").addClass("validator-hitbox-small");

        // Load demo data
        processResults(null, true);
        $(".validator-results").show();
    });

    function uploadData(formdata) {
        // Change styles
        $(".validator-hitbox").removeClass("validator-hitbox-large");
        $(".validator-hitbox").addClass("validator-hitbox-small");

        if(activeGoogleAnalytics) gtag('event', 'attestation_upload_attempt');

        $.ajax({
            url: 'https://attestation.edgebit.io/attestation',
            type: 'post',
            data: formdata,
            contentType: "application/octet-stream",
            processData: false,
        }).done(function(data) {
            data = JSON.parse(data);
            processResults(data, false);
            $(".validator-results").show();
            if(activeGoogleAnalytics) gtag('event', 'attestation_upload_success');
        }).fail(function() {
            // Hide everything but the summary
            $(".validator-results").show();
            $(".validator-results").children(":not(.validator-summary)").hide();
            $(".validator-help").show();
            updateStatus("#status", "InvalidFile");
            if(activeGoogleAnalytics) gtag('event', 'attestation_upload_error');
        });
    }

    function updateValue(id, value) {
        if (value == null) {
            value = "(empty)";
        }
        $(id).find(".validator-value code").text(value);
    }

    function updateStatus(id, value) {
        switch (value) {
            case "InvalidFile":
                $(id).addClass("validator-summary-bad");
                $(id).find(".validator-summary-primary").text("Couldn't parse file");
                $(id).find(".validator-summary-secondary").text("Not an attestation document");
                break;
            case "CertExpired":
                $(id).addClass("validator-summary-bad");
                $(id).find(".validator-summary-primary").text("Attestation is invalid");
                $(id).find(".validator-summary-secondary").text(value);
                break;
            default:
                $(id).addClass("validator-summary-good");
                $(id).find(".validator-summary-primary").text("Attestation is valid");
                $(id).find(".validator-summary-secondary").text("");
                break;
        }
    }

    function updateChain(id, chain) {
        // Reset state
        $(id).find(".highlight").html("");

        // Update new state
        $.each(chain, function(index, cert) {
            // Extract and verify expiry timestamps
            today = new Date();

            notBefore = Date.parse(cert.validity.not_before);
            notAfter = Date.parse(cert.validity.not_after);

            if (today < notBefore) {
                validityHTML = '<div class="validator-cert-badge validator-cert-invalid">Invalid</div>';
            } else if (today > notAfter) {
                validityHTML = '<div class="validator-cert-badge validator-cert-invalid">Invalid</div>';
            } else {
                validityHTML = '<div class="validator-cert-badge validator-cert-valid">Valid</div>';
            }

            // Extract subject and parse for CN
            subject = cert.subject.split(", ");
            $.each(subject, function(id, value) {
                pair = value.split("=");
                if (pair[0] == "CN") {
                    commonName = pair[0] + "=" + pair[1];
                }
            });

            html = '<pre class="validator-value validator-cert"><code class="language-text" data-lang="text">' + index + '</code>' +
                validityHTML +
                '<code class="language-text" data-lang="text">' + commonName + '</code>' +
                '<code class="language-text validator-cert-secondary" data-lang="text">Issuer:   ' + cert.issuer + '</code>' +
                '<code class="language-text validator-cert-secondary" data-lang="text">Subject:  ' + cert.subject + '</code>' +
                '<code class="language-text validator-cert-secondary" data-lang="text">Validity: Not-Before: ' + cert.validity.not_before + ', Not-After: ' + cert.validity.not_after + '</code></pre>';
            $(id).find(".highlight").append(html);
        });

        $(".validator-cert").click(function() {
            $(this).children(".validator-cert-secondary").toggleClass("validator-cert-secondary-visible");
        });
    }

    function updatePCRs(id, pcrs) {
        // Reset state
        $(id).find(".highlight").html("");

        // Update new state
        $.each(pcrs, function(index, pcr) {
            if (pcr != "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000") {
                html = '<pre class="validator-value"><code class="language-text" data-lang="text">' + index + " " + pcr + '</code></pre>';
                $(id).find(".highlight").append(html);
            }
        });
    }

    function processResults(data, demo = false) {
        demoNotBefore = new Date();
        demoNotBefore.setDate(new Date().getDate() - 1);

        demoNotAfter = new Date();
        demoNotAfter.setDate(new Date().getDate() + 1);

        demoData = {
            "module_id": "i-002140d2c48bc79db-enc01849c6af9badfd2",
            "digest": "SHA384",
            "timestamp": new Date().toUTCString(),
            "pcrs": {
                "0": "0df7c9f39c69929de5eb1dd2081b3d3be074fd1be9ba78039b2dadff293b30c387297518fe330b3e5318fe16cc90ad78",
                "5": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "1": "bcdf05fefccaa8e55bf2c8d6dee9e79bbff31e34bf28a99aa19e6b29c37ee80b214a414b7607236edf26fcb78654e63f",
                "11": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "10": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "13": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "14": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "3": "37b6ae66623e85c15863fba3f2d09e2d6d3bb28acac391112cb94250bae68df3e6eaf71443e23ce76a626baf1bf1fc02",
                "4": "5644c90bd75e27d7e999796e33f57085b2b444c5032d342e05dca8042aba3de3655e043f94f4b616eca4e93b34b26e13",
                "7": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "12": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "9": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "8": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "15": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "2": "61e80cfdaa8b91bd15e4eccc8ce8867f157a2888a4898ab82ca3f7cf026ba72c05d4a88d6c07e957a724a4c52ba608a6",
                "6": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            },
            "certs": [
                {
                    "issuer": "C=US, O=Amazon, OU=AWS, CN=aws.nitro-enclaves",
                    "subject": "C=US, O=Amazon, OU=AWS, CN=aws.nitro-enclaves",
                    "validity": {
                        "not_before": "Oct 28 13:28:05 2019 +00:00",
                        "not_after": "Oct 28 14:28:05 2049 +00:00"
                    }
                },
                {
                    "issuer": "C=US, O=Amazon, OU=AWS, CN=aws.nitro-enclaves",
                    "subject": "C=US, O=Amazon, OU=AWS, CN=15e7fdc7dbb2c6ba.us-east-1.aws.nitro-enclaves",
                    "validity": {
                        "not_before": demoNotBefore.toUTCString(),
                        "not_after": demoNotAfter.toUTCString()
                    }
                },
                {
                    "issuer": "C=US, O=Amazon, OU=AWS, CN=15e7fdc7dbb2c6ba.us-east-1.aws.nitro-enclaves",
                    "subject": "CN=e80a35b7208f0683.zonal.us-east-1.aws.nitro-enclaves, OU=AWS, O=Amazon, C=US, ST=WA, L=Seattle",
                    "validity": {
                        "not_before": demoNotBefore.toUTCString(),
                        "not_after": demoNotAfter.toUTCString()
                    }
                },
                {
                    "issuer": "CN=e80a35b7208f0683.zonal.us-east-1.aws.nitro-enclaves, OU=AWS, O=Amazon, C=US, ST=WA, L=Seattle",
                    "subject": "C=US, ST=Washington, L=Seattle, O=Amazon, OU=AWS, CN=i-002140d2c48bc79db.us-east-1.aws.nitro-enclaves",
                    "validity": {
                        "not_before": demoNotBefore.toUTCString(),
                        "not_after": demoNotAfter.toUTCString()
                    }
                },
                {
                    "issuer": "C=US, ST=Washington, L=Seattle, O=Amazon, OU=AWS, CN=i-002140d2c48bc79db.us-east-1.aws.nitro-enclaves",
                    "subject": "C=US, ST=Washington, L=Seattle, O=Amazon, OU=AWS, CN=i-002140d2c48bc79db-enc01849c6af9badfd2.us-east-1.aws",
                    "validity": {
                        "not_before": demoNotBefore.toUTCString(),
                        "not_after": demoNotAfter.toUTCString()
                    }
                }
            ],
            "public_key": "MIIBCgKCAQEAyY9b3O0t0zDH3pcxYWW2TBjW302L3eL+S4C1rmW6OFIXa6U1ZrBtSvMvI3ievCVHq7AOof6xkbXXqobgbokc0514+7stOsq/CqnXGWhWwW+aCIj5FFi+gf4kXbXvUYKhUVFFJm5Rq71r5stt3B1pjYC0Nm391GjR98gO9Sw8TGYx21Q7KuNFsfMa/dtYboFX38fQFw4eTHvSafErgZNOMUmzLPibM+1zXqHbXX1M5hyFMBJE28zNi+TmvopdMxsG/a2yTiM1j6Srw2Y5ZrE6O1Rr8MxrAepPbmybNOn0K0YIcf/KZurDuvOIuhsurxFgGTVQhsMZ0iNaXA0usFM+pQIDAQAB",
            "user_data": null,
            "nonce": null,
            "verify_error": null
        }

        if (demo) data = demoData;

        updateValue("#module_id", data.module_id);
        updateValue("#timestamp", data.timestamp);
        updateValue("#nonce", data.nonce);
        updateValue("#user_data", data.user_data);
        updateValue("#public_key", data.public_key);
        updateChain("#cert-chain", data.certs);
        updatePCRs("#pcrs", data.pcrs);
        updateStatus("#status", data.verification_error);
    }
});
