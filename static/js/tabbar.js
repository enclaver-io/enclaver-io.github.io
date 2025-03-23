$(document).ready(function() {
    $(".tabbar").each(function() {

        currentBar = $(this);
        currentTab = currentBar.find(".tabbar-tab-active");

        // Initialize to default state, tab with active class on it
        // Otherwise, show the first tab's of content and set it as active
        if (currentTab.length > 0) {
            $("#" + currentTab.attr("data-tab")).show();
        } else {
            defaultTab = currentBar.find(".tabbar-content").first();
            defaultTab.toggle();
            // find the tab corresponding to the default ID and set it active
            currentBar.children(".tabbar-tabs").children("a[data-tab='" + defaultTab.attr("id") + "']").addClass("tabbar-tab-active");
        }
    });

    $(".tabbar-tab").click(function() {
        // Walk up to our parent bar
        currentBar = $(this).parents(".tabbar");
        currentTab = $(this);

        // Reset current tab and activate new one
        currentBar.find(".tabbar-tab-active").removeClass("tabbar-tab-active");
        currentTab.addClass("tabbar-tab-active");

        // Reset visible content and show new one
        currentBar.find(".tabbar-content").hide()
        $("#" + currentTab.attr("data-tab")).show();

    });
});
