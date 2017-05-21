function loadGiveawayGroupsPopup(context) {
    var matches = context.getElementsByClassName(`giveaway__column--group`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        addGGPBox(matches[i]);
    }
}

function addGGPBox(Context) {
    var URL, GGPButton, Popup;
    URL = Context.getAttribute("href");
    GGPButton = Context;
    GGPButton.classList.add("GGPButton");
    GGPButton.removeAttribute("href");
    GGPButton.addEventListener("click", function() {
        var GGPPopup;
        if (Popup) {
            Popup.popUp();
        } else {
            Popup = createPopup();
            Popup.Icon.classList.add("fa-user");
            Popup.Title.innerHTML = "<a href=\"" + URL + "\">Giveaway Groups</a>";
            Popup.OverallProgress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Loading giveaway groups...</span>";
            GGPPopup = Popup.popUp();
            getGGPGroups(URL + "/search?page=", 1, Popup.Progress, [], function(Groups) {
                var I, N;
                Popup.OverallProgress.innerHTML = "";
                for (I = 0, N = Groups.length; I < N; ++I) {
                    Popup.Results.appendChild(Groups[I]);
                }
                loadEndlessFeatures(Popup.Results);
                GGPPopup.reposition();
            });
        }
    });
}

function getGGPGroups(URL, NextPage, Context, Groups, Callback) {
    makeRequest(null, URL + NextPage, Context, function(Response) {
        var ResponseHTML, Matches, I, N, Pagination;
        ResponseHTML = parseHTML(Response.responseText);
        Matches = ResponseHTML.getElementsByClassName("table__row-outer-wrap");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Groups.push(Matches[I]);
        }
        Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
        if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
            getGGPGroups(URL, ++NextPage, Context, Groups, Callback);
        } else {
            Callback(Groups);
        }
    });
}
