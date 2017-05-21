function loadUserNotes(Context, User) {
    var PUNButton, UserID, PUNIcon, SavedUser;
    if (!Context.context) {
        Context = esgst.featuredHeading;
        User = esgst.user;
    }
    if (Context) {
        if (Context.heading) {
            Context = Context.heading;
        }
        Context.insertAdjacentHTML(
            esgst.sg ? "beforeEnd" : "afterBegin",
            "<a class=\"page_heading_btn PUNButton\">" +
            "    <i class=\"fa PUNIcon\"></i>" +
            "</a>"
        );
        PUNButton = Context[esgst.sg ? "lastElementChild" : "firstElementChild"];
        UserID = esgst.sg ? User.Username : User.SteamID64;
        PUNIcon = PUNButton.firstElementChild;
        SavedUser = getUser(User);
        PUNIcon.classList.add((SavedUser && SavedUser.Notes) ? "fa-sticky-note" : "fa-sticky-note-o");
        PUNButton.addEventListener("click", function() {
            var Popup;
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-sticky-note");
            Popup.Title.innerHTML = "Edit user notes for <span>" + UserID + "</span>:";
            Popup.TextArea.classList.remove("rhHidden");
            createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                User.Notes = Popup.TextArea.value.trim();
                queueSave(Popup, function() {
                    saveUser(User, Popup, function() {
                        GM_setValue("LastSave", 0);
                        if (User.Notes) {
                            PUNIcon.classList.remove("fa-sticky-note-o");
                            PUNIcon.classList.add("fa-sticky-note");
                        } else {
                            PUNIcon.classList.remove("fa-sticky-note");
                            PUNIcon.classList.add("fa-sticky-note-o");
                        }
                        Callback();
                        Popup.Close.click();
                    });
                });
            });
            Popup.popUp(function() {
                Popup.TextArea.focus();
                SavedUser = getUser(User);
                if (SavedUser && SavedUser.Notes) {
                    Popup.TextArea.value = SavedUser.Notes;
                }
            });
        });
    }
}
