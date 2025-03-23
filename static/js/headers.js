$(document).ready(function() {
    $("h2, h3, h4").each(function() {
        var anchor = $(this).attr("id")

        if (anchor != undefined) {
            $(this).append("<a href='#" + anchor + "' class='header-anchor-icon'>&#128279;</a>");
        }
    });
});
