$(document).ready(function() {
    // Don't active hover on mobile
    if ($(window).width() > 800) {
        $("#nav .nav-dropdown").hover(
            function() {
                $(this).addClass("nav-active");
            },
            function() {
                $(this).removeClass("nav-active");
            }
        )
    }

    // React to hamburger menu on mobile
    $("#nav-mobile").click(function() {
        if (this.checked) {
            $(".nav-right ul").show();
        } else {
            $(".nav-right ul").hide();
        }
        $("#nav .nav-dropdown").addClass("nav-active");
    });
});
