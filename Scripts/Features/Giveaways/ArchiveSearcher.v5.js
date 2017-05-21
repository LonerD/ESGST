function loadArchiveSearcher() {
    var Popup, Category, AS, ASButton;
    var Context = esgst.mainPageHeading;
    Popup = createPopup();
    Popup.Popup.style.width = "600px";
    Popup.Icon.classList.add("fa-folder");
    Category = window.location.pathname.match(/^\/archive\/(coming-soon|open|closed|deleted)/);
    Popup.Title.textContent = "Search archive" + (Category ? (" for " + Category[1] + " giveaways") : "") + ":";
    Popup.TextInput.classList.remove("rhHidden");
    AS = {};
    createOptions(Popup.Options, AS, [{
        Check: function() {
            return true;
        },
        Description: "Search by AppID.",
        Title: "If unchecked, a search by exact title will be performed.",
        Key: "AIS",
        Name: "AppIDSearch",
        ID: "AS_AIS"
    }]);
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"ASButton\" title=\"Search archive.\">" +
        "    <i class=\"fa fa-folder\"></i>" +
        "    <i class=\"fa fa-search\"></i>" +
        "</a>"
    );
    ASButton = Context.firstElementChild;
    createButton(Popup.Button, "fa-search", "Search", "fa-times-circle", "Cancel", function(Callback) {
        ASButton.classList.add("rhBusy");
        AS.Progress.innerHTML = AS.OverallProgress.innerHTML = AS.Results.innerHTML = "";
        AS.Popup.reposition();
        AS.Canceled = false;
        AS.Query = Popup.TextInput.value;
        if (AS.Query) {
            if (AS.AIS.checked) {
                AS.Progress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Retrieving game title...</span>";
                makeRequest(null, "https://steamcommunity.com/app/" + AS.Query, AS.Progress, function(Response) {
                    var Title;
                    Title = parseHTML(Response.responseText).getElementsByClassName("apphub_AppName")[0];
                    if (Title) {
                        AS.Query = Title.textContent;
                        setASSearch(AS, ASButton, Callback);
                    } else {
                        ASButton.classList.remove("rhBusy");
                        AS.Progress.innerHTML =
                            "<i class=\"fa fa-times-circle\"></i> " +
                            "<span>Game title not found. Make sure you are entering a valid AppID. For example, 229580 is the AppID for Dream (http://steamcommunity.com/app/229580).</span>";
                        Callback();
                    }
                });
            } else {
                setASSearch(AS, ASButton, Callback);
            }
        } else {
            ASButton.classList.remove("rhBusy");
            AS.Progress.innerHTML =
                "<i class=\"fa fa-times-circle\"></i> " +
                "<span>Please enter a title / AppID.</span>";
            Callback();
        }
    }, function() {
        clearInterval(AS.Request);
        AS.Canceled = true;
        setTimeout(function() {
            AS.Progress.innerHTML = "";
        }, 500);
        ASButton.classList.remove("rhBusy");
    });
    AS.Progress = Popup.Progress;
    AS.OverallProgress = Popup.OverallProgress;
    AS.Results = Popup.Results;
    ASButton.addEventListener("click", function() {
        AS.Popup = Popup.popUp(function() {
            Popup.TextInput.focus();
        });
    });
}

function setASSearch(AS, ASButton, Callback) {
    AS.Query = ((AS.Query.length >= 50) ? AS.Query.slice(0, 50) : AS.Query).toLowerCase();
    searchASGame(AS, window.location.href.match(/(.+?)(\/search.+?)?$/)[1] + "/search?q=" + encodeURIComponent(AS.Query) + "&page=", 1, function() {
        ASButton.classList.remove("rhBusy");
        AS.Progress.innerHTML = "";
        Callback();
    });
}

function searchASGame(AS, URL, NextPage, Callback) {
    if (!AS.Canceled) {
        AS.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Loading page " + NextPage + "...</span>";
        queueRequest(AS, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches, I, N, Title, Pagination;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__row-outer-wrap");
            for (I = 0, N = Matches.length; I < N; ++I) {
                Title = Matches[I].getElementsByClassName("table__column__heading")[0].textContent.match(/(.+?)( \(.+ Copies\))?$/)[1];
                if (Title.toLowerCase() == AS.Query) {
                    AS.Results.appendChild(Matches[I].cloneNode(true));
                    loadEndlessFeatures(AS.Results.lastElementChild);
                    AS.Popup.reposition();
                }
            }
            AS.OverallProgress.textContent = AS.Results.children.length + " giveaways found...";
            Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                searchASGame(AS, URL, ++NextPage, Callback);
            } else {
                Callback();
            }
        });
    }
}
