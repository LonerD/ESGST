function loadRealWonSentCVLinks(context, user) {
    var wonRow, sentRow;
    if (context.context) {
        wonRow = context.wonRow;
        sentRow = context.sentRow;
    } else {
        wonRow = esgst.wonRow;
        sentRow = esgst.sentRow;
        user = esgst.user;
    }
    if (wonRow && sentRow) {
        addRWSCVLLink(wonRow, `Won`, user);
        addRWSCVLLink(sentRow, `Sent`, user);
    }
}

function addRWSCVLLink(Context, Key, User) {
    var URL, RWSCVL;
    URL = "http://www.sgtools.info/" + Key.toLowerCase() + "/" + User.Username;
    Context.innerHTML = "<a class=\"RWSCVLLink\" href=\"" + URL + (esgst.rwscvl_ro ? "/newestfirst" : "") +
        "\" target=\"_blank\">Gifts " + Key + "</a>";
    if (esgst.rwscvl_al) {
        Context = (Key == "Won") ? Context.nextElementSibling : Context.nextElementSibling.firstElementChild;
        Context.insertAdjacentHTML(
            "beforeEnd",
            " <span>" +
            "    <i class=\"fa fa-circle-o-notch fa-spin\"></i>" +
            "</span>"
        );
        RWSCVL = {
            Progress: Context.lastElementChild
        };
        queueSave(RWSCVL, function() {
            saveUser(User, RWSCVL, function() {
                GM_setValue("LastSave", 0);
                User.RWSCVL = getUser(User).RWSCVL;
                if (!User.RWSCVL) {
                    User.RWSCVL = {
                        WonCV: 0,
                        SentCV: 0,
                        LastWonCheck: 0,
                        LastSentCheck: 0
                    };
                }
                if ((new Date().getTime()) - User.RWSCVL["Last" + Key + "Check"] > 604800000) {
                    queueRequest(RWSCVL, null, URL, function(Response) {
                        var Value;
                        RWSCVL.Progress.remove();
                        Value = parseHTML(Response.responseText).getElementById("data").textContent.replace(/\s\$/, "");
                        User.RWSCVL[Key + "CV"] = Value;
                        User.RWSCVL["Last" + Key + "Check"] = new Date().getTime();
                        queueSave(RWSCVL, function() {
                            saveUser(User, RWSCVL, function() {
                                GM_setValue("LastSave", 0);
                                Context.insertAdjacentText("beforeEnd", " ($" + Value + " Real CV)");
                            });
                        });
                    });
                } else {
                    RWSCVL.Progress.remove();
                    Context.insertAdjacentText("beforeEnd", " ($" + User.RWSCVL[Key + "CV"] + " Real CV)");
                }
            });
        });
    }
}
