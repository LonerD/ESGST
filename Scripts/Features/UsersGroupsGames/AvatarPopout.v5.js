function loadAvatarPopout(context) {
    var matches = context.getElementsByClassName(`global__image-outer-wrap--avatar-small`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        addAPContainer(matches[i]);
    }
}

function addAPContainer(APAvatar) {
    var URL, Match, Key, ID, APContainer, Context;
    URL = APAvatar.getAttribute("href");
    Match = URL ? URL.match(/\/(user|group)\/(.+)/) : null;
    if (Match) {
        Key = Match[1];
        ID = Match[2];
        APAvatar.classList.add("APAvatar");
        APAvatar.removeAttribute("href");
        APAvatar.insertAdjacentHTML("afterEnd", "<span class=\"APContainer\"></span>");
        APContainer = APAvatar.nextElementSibling;
        APContainer.appendChild(APAvatar);
        Context = APContainer.closest(".SGCBox") || APContainer.closest(".GGPBox");
        if (Context) {
            Context.insertAdjacentHTML("afterEnd", "<div></div>");
            Context = Context.nextElementSibling;
        } else {
            Context = APContainer;
        }
        APAvatar.addEventListener("click", function() {
            var APBox;
            APBox = esgst.APBoxes[ID];
            if (APBox) {
                if (APBox.Popout.classList.contains("rhHidden")) {
                    Context.appendChild(APBox.Popout);
                    APBox.customRule = function(Target) {
                        return (!APContainer.contains(Target) && !Context.contains(Target));
                    };
                    APBox.popOut(APAvatar);
                } else {
                    APBox.Popout.classList.add("rhHidden");
                }
            } else {
                esgst.APBoxes[ID] = APBox = createPopout(Context);
                APBox.Popout.classList.add("APBox");
                APBox.Popout.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Loading " + Key + "...</span>";
                APBox.customRule = function(Target) {
                    return (!APContainer.contains(Target) && !Context.contains(Target));
                };
                APBox.popOut(APAvatar);
                makeRequest(null, URL, APBox.Popout, function(Response) {
                    var ResponseHTML, Avatar, Columns, ReportButton, APLink, I, N;
                    ResponseHTML = parseHTML(Response.responseText);
                    APBox.Popout.innerHTML =
                        ResponseHTML.getElementsByClassName("featured__outer-wrap")[0].outerHTML +
                        "<div class=\"sidebar__shortcut-outer-wrap\">" + ResponseHTML.getElementsByClassName("sidebar__shortcut-inner-wrap")[0].outerHTML + "</div>";
                    Avatar = APBox.Popout.getElementsByClassName("global__image-outer-wrap--avatar-large")[0];
                    Columns = APBox.Popout.getElementsByClassName("featured__table__column");
                    ReportButton = APBox.Popout.getElementsByClassName("js__submit-form-inner")[0];
                    Avatar.insertAdjacentHTML("afterEnd", "<a class=\"APLink\"></a>");
                    APLink = Avatar.nextElementSibling;
                    APLink.appendChild(Avatar);
                    APLink.setAttribute("href", URL);
                    for (I = 0, N = Columns[1].children.length; I < N; ++I) {
                        Columns[0].appendChild(Columns[1].firstElementChild);
                    }
                    if (ReportButton) {
                        ReportButton.addEventListener("click", function() {
                            return ReportButton.getElementsByTagName("form")[0].submit();
                        });
                    }
                    if (Key == "user") {
                        loadProfileFeatures(APBox.Popout);
                    }
                    APBox.reposition(APAvatar);
                });
            }
        });
    }
}

function loadProfileFeatures(Context) {
    var Heading, SteamButton, User;
    Heading = Context.getElementsByClassName(esgst.sg ? "featured__heading" : "page_heading")[0];
    SteamButton = Context.querySelector("a[href*='/profiles/']");
    User = {};
    User.ID = Context.querySelector("[name='child_user_id']");
    User.ID = User.ID ? User.ID.value : "";
    User.SteamID64 = SteamButton.getAttribute("href").match(/\d+/)[0];
    User.Username = esgst.sg ? Heading.textContent : "";
    var pf = {
        context: Context,
        heading: Heading,
        steamButton: SteamButton
    };
    var Matches = Context.getElementsByClassName("featured__table__row__left");
    for (var I = 0, N = Matches.length; I < N; ++I) {
        var Match = Matches[I].textContent.match(/(Gifts (Won|Sent)|Contributor Level)/);
        if (Match) {
            var Key = Match[2];
            if (Key) {
                if (Key == "Won") {
                    pf.wonRow = Matches[I];
                } else {
                    pf.sentRow = Matches[I];
                }
            } else {
                pf.contributorLevelRow = Matches[I];
            }
        }
    }
    for (var i = 0, n = esgst.profileFeatures.length; i < n; ++i) {
        esgst.profileFeatures[i](pf, User);
    }
}
