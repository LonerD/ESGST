function loadUserTags() {
    for (var key in esgst.currentUsers) {
        for (var i = 0, n = esgst.currentUsers[key].length; i < n; ++i) {
            addPUTButton(esgst.currentUsers[key][i], key);
        }
    }
    if (Object.keys(esgst.currentUsers).length) {
        var SavedUsers = GM_getValue("Users");
        for (var I = 0, N = SavedUsers.length; I < N; ++I) {
            var UserID = esgst.sg ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (esgst.currentUsers[UserID] && SavedUsers[I].Tags) {
                addPUTTags(UserID, SavedUsers[I].Tags);
            }
        }
    }
}

function addPUTButton(Context, UserID) {
    var Container, User;
    Container = Context.parentElement;
    if (Container.classList.contains("comment__username")) {
        Context = Container;
    }
    Context.insertAdjacentHTML(
        "afterEnd",
        "<a class=\"PUTButton\">" +
        "    <i class=\"fa fa-tag\"></i>" +
        "    <span class=\"PUTTags\"></span>" +
        "</a>"
    );
    User = {};
    User[esgst.sg ? "Username" : "SteamID64"] = UserID;
    Context.nextElementSibling.addEventListener("click", function() {
        var Popup;
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-tag");
        Popup.Title.innerHTML = "Edit user tags for <span>" + UserID + "</span>:";
        Popup.TextInput.classList.remove("rhHidden");
        Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Use commas to separate tags, for example: Tag1, Tag2, ..."));
        createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
            User.Tags = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
                return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
            });
            queueSave(Popup, function() {
                saveUser(User, Popup, function() {
                    GM_setValue("LastSave", 0);
                    addPUTTags(UserID, getUser(User).Tags);
                    Callback();
                    Popup.Close.click();
                });
            });
        });
        Popup.popUp(function() {
            var SavedUser;
            Popup.TextInput.focus();
            SavedUser = getUser(User);
            if (SavedUser && SavedUser.Tags) {
                Popup.TextInput.value = SavedUser.Tags;
            }
        });
    });
}

function addPUTTags(UserID, Tags) {
    var Matches, Prefix, Suffix, HTML, I, N, Context, Container;
    Matches = esgst.users[UserID];
    Prefix = "<span class=\"global__image-outer-wrap author_avatar is_icon\">";
    Suffix = "</span>";
    HTML = Tags ? Tags.replace(/^|,\s|$/g, function(Match, Offset, String) {
        return ((Offset === 0) ? Prefix : ((Offset == (String.length - Match.length)) ? Suffix : (Suffix + Prefix)));
    }) : "";
    for (I = 0, N = Matches.length; I < N; ++I) {
        Context = Matches[I];
        Container = Context.parentElement;
        if (Container) {
            if (Container.classList.contains("comment__username")) {
                Context = Container;
            }
            Context.parentElement.getElementsByClassName("PUTTags")[0].innerHTML = HTML;
        }
    }
}
