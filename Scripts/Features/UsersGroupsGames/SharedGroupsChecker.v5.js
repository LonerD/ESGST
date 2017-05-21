function loadSharedGroupsChecker(Context, User) {
    var SGCButton, Popup;
    if (!Context.context && esgst.userPath) {
        Context = document;
        User = esgst.user;
    }
    if (Context && User && (User.Username != GM_getValue(`Username`))) {
        if (Context.context) {
            Context = Context.context;
        }
        Context = Context.getElementsByClassName("sidebar__shortcut-inner-wrap")[0];
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<div class=\"SGCButton\">" +
            "    <i class=\"fa fa-fw fa-users\"></i>" +
            "</div>"
        );
        SGCButton = Context.lastElementChild;
        Context = document.getElementsByClassName("js-tooltip")[0];
        if (Context) {
            SGCButton.addEventListener("mouseenter", function() {
                Context.textContent = "Check Shared Groups";
                setSiblingsOpacity(SGCButton, "0.5");
            });
            SGCButton.addEventListener("mouseleave", function() {
                setSiblingsOpacity(SGCButton, "1");
            });
        }
        SGCButton.addEventListener("click", function() {
            var SGCPopup;
            if (Popup) {
                Popup.popUp();
            } else {
                Popup = createPopup();
                Popup.Icon.classList.add("fa-users");
                Popup.Title.textContent = "Shared Groups";
                Popup.OverallProgress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Checking shared groups...</span>";
                SGCPopup = Popup.popUp();
                makeRequest(null, "http://www.steamcommunity.com/profiles/" + User.SteamID64 + "/groups", Popup.Progress, function(Response) {
                    var ResponseHTML, Matches, Groups, I, NumMatches, Name, J, NumGroups, Avatar;
                    Popup.OverallProgress.innerHTML = "";
                    ResponseHTML = parseHTML(Response.responseText);
                    Matches = ResponseHTML.getElementsByClassName("linkTitle");
                    Groups = GM_getValue("Groups");
                    for (I = 0, NumMatches = Matches.length; I < NumMatches; ++I) {
                        Name = Matches[I].textContent;
                        for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Name != Name); ++J);
                        if (J < NumGroups) {
                            Avatar = Matches[I].parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.getAttribute("src");
                            Popup.Results.insertAdjacentHTML(
                                "beforeEnd",
                                "<li class=\"table__row-outer-wrap\">" +
                                "    <div class=\"table__row-inner-wrap\">" +
                                "        <div>" +
                                "            <span>" +
                                "                <a class=\"global__image-outer-wrap global__image-outer-wrap--avatar-small\" href=\"/group/" + Groups[J].Code + "/\">" +
                                "                    <div class=\"global__image-inner-wrap\" style=\"background-image:url(" + Avatar + ");\"></div>" +
                                "                </a>" +
                                "            </span>" +
                                "        </div>" +
                                "        <div class=\"table__column--width-fill\">" +
                                "            <a class=\"table__column__heading\" href=\"/group/" + Groups[J].Code + "/\">" + Groups[J].Name + "</a>" +
                                "        </div>" +
                                "    </div>" +
                                "</li>"
                            );
                        }
                    }
                    if (!Popup.Results.innerHTML) {
                        Popup.Results.innerHTML = "<div>No shared groups found.</div>";
                    }
                    loadEndlessFeatures(Popup.Results);
                    SGCPopup.reposition();
                });
            }
        });
    }
}
