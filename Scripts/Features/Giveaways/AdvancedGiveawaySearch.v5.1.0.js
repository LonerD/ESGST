function loadAdvancedGiveawaySearch() {
    var Context, Input, Match, AGSPanel, AGS, Level, I, RegionRestricted;
    Context = document.getElementsByClassName("sidebar__search-container")[0];
    Context.firstElementChild.remove();
    Context.insertAdjacentHTML("afterBegin", "<input class=\"sidebar__search-input\" placeholder=\"Search...\" type=\"text\"/>");
    Input = Context.firstElementChild;
    Match = window.location.href.match(/q=(.*?)(&.+?)?$/);
    if (Match) {
        Input.value = Match[1];
    }
    Context.insertAdjacentHTML("afterEnd", "<div class=\"AGSPanel\"></div>");
    AGSPanel = Context.nextElementSibling;
    AGS = {};
    Level = "<select>";
    for (I = 0; I <= 10; ++I) {
        Level += "<option>" + I + "</option>";
    }
    Level += "</select>";
    createAGSFilters(AGSPanel, AGS, [{
        Title: "Level",
        HTML: Level,
        Key: "level",
    }, {
        Title: "Entries",
        HTML: "<input type=\"text\"/>",
        Key: "entry",
    }, {
        Title: "Copies",
        HTML: "<input type=\"text\"/>",
        Key: "copy"
    }]);
    AGS.level_max.selectedIndex = 10;
    AGSPanel.insertAdjacentHTML(
        "beforeEnd",
        "<div>" +
        "    <span></span>" +
        "    <span>Region Restricted</span>" +
        "</div>" +
        "<div>" +
        "    <span></span>" +
        "    <span>DLC</span>" +
        "</div>"
    );
    var dlc = AGSPanel.lastElementChild;
    var regionRestricted = dlc.previousElementSibling;
    RegionRestricted = createCheckbox(regionRestricted.firstElementChild).Checkbox;
    var DLC = createCheckbox(dlc.firstElementChild).Checkbox;
    Context.addEventListener("keydown", function(Event) {
        var Type, URL, Key;
        if (Event.key == "Enter") {
            Event.preventDefault();
            Type = window.location.href.match(/(type=(.+?))(&.+?)?$/);
            URL = "https://www.steamgifts.com/giveaways/search?q=" + Input.value + (Type ? ("&" + Type[1]) : "");
            for (Key in AGS) {
                if (AGS[Key].value) {
                    URL += "&" + Key + "=" + AGS[Key].value;
                }
            }
            URL += RegionRestricted.checked ? "&region_restricted=true" : "";
            URL += DLC.checked ? "&dlc=true" : "";
            window.location.href = URL;
        }
    });
}

function createAGSFilters(AGSPanel, AGS, Filters) {
    var I, N, AGSFilter;
    for (I = 0, N = Filters.length; I < N; ++I) {
        AGSPanel.insertAdjacentHTML(
            "beforeEnd",
            "<div class=\"AGSFilter\">" +
            "    <span>Min " + Filters[I].Title + " " + Filters[I].HTML + "</span>" +
            "    <span>Max " + Filters[I].Title + " " + Filters[I].HTML + "</span>" +
            "</div>"
        );
        AGSFilter = AGSPanel.lastElementChild;
        AGS[Filters[I].Key + "_min"] = AGSFilter.firstElementChild.firstElementChild;
        AGS[Filters[I].Key + "_max"] = AGSFilter.lastElementChild.firstElementChild;
    }
}
