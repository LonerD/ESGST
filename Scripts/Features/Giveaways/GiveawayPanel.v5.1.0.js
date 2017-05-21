function loadGiveawayPanel(context) {
    if (context == document) {
        if (esgst.gpGwc && esgst.enteredPath) {
            addGWCHeading();
        }
    }
    var className, callback;
    if (esgst.enteredPath && esgst.gpGwc) {
        className = `table__row-inner-wrap`;
        callback = addGWCChance;
    } else {
        className = `giveaway__row-inner-wrap`;
        callback = addGPPanel;
    }
    var matches = context.getElementsByClassName(className);
    for (var i = 0, n = matches.length; i < n; ++i) {
        callback(matches[i]);
    }
    if (esgst.gpGwc && esgst.giveawayPath && !document.querySelector(".table.table--summary")) {
        addGWCChance();
    }
}

function addGPPanel(Context) {
    var Columns, Heading, GP, GPLinks, GPPanel, Matches, Match, I, EntryPoints;
    Columns = Context.getElementsByClassName("giveaway__columns")[0];
    if (Columns.innerHTML.match(/remaining/)) {
        Heading = Context.getElementsByClassName("giveaway__heading__name")[0];
        GP = {};
        GP.URL = Heading.getAttribute("href");
        if (GP.URL) {
            GP.Title = Heading.textContent;
            if (!GP.Title.match(/^Invite Only$/)) {
                GPLinks = Context.getElementsByClassName("giveaway__links")[0];
                GPLinks.classList.add("GPLinks");
                GPLinks.insertAdjacentHTML("afterEnd", "<div class=\"giveaway__columns GPPanel\"></div>");
                GP.Entries = GPLinks.firstElementChild.lastElementChild;
                GPPanel = GPLinks.nextElementSibling;
                while (!Columns.lastElementChild.classList.contains("giveaway__column--width-fill")) {
                    GPPanel.insertBefore(Columns.lastElementChild, GPPanel.firstElementChild);
                }
                GPPanel.insertAdjacentHTML(
                    "beforeEnd",
                    "<div " + (esgst.gpGwc ? "" : "class=\"rhHidden\" ") + "title=\"Giveaway Winning Chance\">" +
                    "    <i class=\"fa fa-line-chart\"></i>" +
                    "    <span class=\"GWCChance\"></span>" +
                    "</div>" +
                    "<a class=\"GDCBPButton" + (esgst.gpGdrbp ? "" : " rhHidden") + "\" title=\"Read giveaway description / add a comment to the giveaway.\">" +
                    "    <i class=\"fa fa-file-text\"></i>" +
                    "    <i class=\"fa fa-comment\"></i>" +
                    "</a>" +
                    "<div class=\"" + ((esgst.gpElgb && !window.location.pathname.match(new RegExp("^\/user\/" + GM_getValue("Username")))) ? "ELGBButton" : "rhHidden") + "\"></div>" +
                    "<div class=\"rhHidden\">" +
                    "    <div class=\"sidebar__error is-disabled\">" +
                    "        <i class=\"fa fa-exclamation-circle\"></i> " +
                    "        <span>Not Enough Points</span>" +
                    "    </div>" +
                    "</div>"
                );
                GP.ELGBButton = GPPanel.lastElementChild.previousElementSibling;
                GP.GDCBPButton = GP.ELGBButton.previousElementSibling;
                GP.GWCChance = GP.GDCBPButton.previousElementSibling.lastElementChild;
                GP.Code = GP.URL.match(/\/giveaway\/(.+?)\//)[1];
                Matches = Heading.parentElement.getElementsByClassName("giveaway__heading__thin");
                Match = Matches[0].textContent.match(/\((.+) Copies\)/);
                if (Match) {
                    GP.Copies = parseInt(Match[1].replace(/,/g, ""));
                    I = 1;
                } else {
                    GP.Copies = 1;
                    I = 0;
                }
                EntryPoints = parseInt(Matches[I].textContent.match(/\d+/)[0]);
                GP.ELGBButton.setAttribute("data-points", EntryPoints);
                GP.Username = window.location.pathname.match(/^\/user\//) ?
                    document.getElementsByClassName("featured__heading__medium")[0].textContent : Context.getElementsByClassName("giveaway__username")[0].textContent;
                GP.Points = document.getElementsByClassName("nav__points")[0];
                if (esgst.gpElgb && !window.location.pathname.match(new RegExp("^\/user\/" + GM_getValue("Username")))) {
                    if (Context.classList.contains("is-faded")) {
                        Context.classList.remove("is-faded");
                        Context.classList.add("rhFaded");
                        GP.ELGBButton.setAttribute("data-entered", true);
                        setELGBButton(GP, "fa-minus-circle", "Leave", "Leaving...", "entry_delete", Context, true);
                    } else {
                        if (EntryPoints > parseInt(GP.Points.textContent)) {
                            GP.ELGBButton.nextElementSibling.classList.remove("rhHidden");
                        }
                        setELGBButton(GP, "fa-plus-circle", "Enter", "Entering...", "entry_insert", Context);
                    }
                }
                setGWCChance(GP.GWCChance, GP.Entries, GP.Copies);
                GP.GDCBPButton.addEventListener("click", function() {
                    displayGDCBPPopup(GP);
                });
            }
        }
    }
}

function setELGBButton(GP, Icon, Name, Message, Type, Context, Yellow) {
    createButton(GP.ELGBButton, Icon, Name, "fa-circle-o-notch fa-spin", Message, function() {
        enterLeaveELGBGiveaway(GP, Icon, Name, Message, Type, Context, Yellow);
    }, null, false, Yellow);
}

function enterLeaveELGBGiveaway(GP, Icon, Name, Message, Type, Context, Yellow) {
    var Data, URL;
    Data = "xsrf_token=" + esgst.xsrfToken + "&do=" + Type + "&code=" + GP.Code;
    URL = "/ajax.php";
    makeRequest(Data, URL, null, function(Response) {
        var ResponseJSON;
        ResponseJSON = parseJSON(Response.responseText);
        if (ResponseJSON.type == "success") {
            Context.classList.toggle("rhFaded");
            GP.Entries.textContent = ResponseJSON.entry_count + " entries";
            GP.Points.textContent = ResponseJSON.points;
            setGWCChance(GP.GWCChance, GP.Entries, GP.Copies);
            if (GP.ELGBButton.getAttribute("data-entered")) {
                GP.ELGBButton.removeAttribute("data-entered");
                setELGBButton(GP, "fa-plus-circle", "Enter", "Entering...", "entry_insert", Context);
            } else {
                if (esgst.gpGdrbp && esgst.gpGdrbp_eg) {
                    displayGDCBPPopup(GP, true);
                }
                if (esgst.gh) {
                    saveEGHGame(Context);
                }
                GP.ELGBButton.setAttribute("data-entered", true);
                GP.ELGBButton.nextElementSibling.classList.add("rhHidden");
                setELGBButton(GP, "fa-minus-circle", "Leave", "Leaving...", "entry_delete", Context, true);
            }
        } else if (parseInt(GP.ELGBButton.getAttribute("data-points")) <= ResponseJSON.points) {
            GP.Points.textContent = ResponseJSON.points;
            GP.ELGBButton.innerHTML =
                "<div class=\"sidebar__error is-disabled\">" +
                "    <i class=\"fa fa-exclamation-circle\"></i> " +
                "    <span>" + ResponseJSON.msg + "</span>" +
                "</div>";
        } else {
            setELGBButton(GP, "fa-plus-circle", "Enter", "Entering...", "entry_insert", Context);
        }
        updateELGBButtons(ResponseJSON.points);
    });
}

function updateELGBButtons(Points) {
    var Matches, I, N;
    Matches = document.getElementsByClassName("ELGBButton");
    for (I = 0, N = Matches.length; I < N; ++I) {
        if (!Matches[I].getAttribute("data-entered")) {
            if (parseInt(Matches[I].getAttribute("data-points")) <= Points) {
                Matches[I].nextElementSibling.classList.add("rhHidden");
            } else {
                Matches[I].nextElementSibling.classList.remove("rhHidden");
            }
        }
    }
}

GM_addStyle(".GDCBPDescription { text-align: left; }");

function displayGDCBPPopup(GP, Enter) {
    GP.GDCBPButton.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
    makeRequest(null, GP.URL, null, function(Response) {
        var Description, Popup;
        GP.GDCBPButton.innerHTML =
            "<i class=\"fa fa-file-text\"></i> " +
            "<i class=\"fa fa-comment\"></i>";
        Description = parseHTML(Response.responseText).getElementsByClassName("page__description")[0];
        if (Description || (!Description && ((Enter && !esgst.gpGdrbp_d) || !Enter))) {
            Popup = createPopup(true);
            Popup.Popup.classList.add("GDCBPPopup");
            Popup.Icon.classList.add("fa-file-text");
            Popup.Title.innerHTML = "<span><a href=\"" + GP.URL + "\">" + GP.Title + "</a></span> by <a href=\"/user/" + GP.Username + "\">" + GP.Username + "</a>";
            if (Description) {
                Description.classList.add("GDCBPDescription");
                Popup.Description.insertBefore(Description, Popup.Description.firstElementChild);
                loadEndlessFeatures(Description);
            }
            Popup.TextArea.classList.remove("rhHidden");
            if (GM_getValue("CFH")) {
                addCFHPanel(Popup.TextArea);
            }
            createButton(Popup.Button, "fa-send", "Submit Comment", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                saveComment("", "", Popup.TextArea.value, GP.URL, Popup.Progress, Callback, function() {
                    makeRequest(null, GP.URL, Popup.Progress, function(Response) {
                        GP.Entries.parentElement.nextElementSibling.lastElementChild.textContent =
                            parseHTML(Response.responseText).getElementsByClassName("sidebar__navigation__item__count")[0].textContent + " comments";
                        Callback();
                        Popup.Close.click();
                    });
                });
            });
            Popup.popUp(function() {
                Popup.TextArea.focus();
            });
        }
    });
}

function setGWCChance(GWCChance, Entries, Copies) {
    var Chance;
    Entries = parseInt(Entries.textContent.replace(/,/g, "").match(/\d+/)[0]);
    Chance = (Entries > 0) ? (Math.round(Copies / Entries * 10000) / 100) : 100;
    if (Chance > 100) {
        Chance = 100;
    }
    GWCChance.textContent = Chance + "% (" + Math.round(Entries / Copies) + ":1)";
}

function addGWCHeading() {
    document.getElementsByClassName("table__heading")[0].firstElementChild.nextElementSibling.insertAdjacentHTML(
        "afterEnd",
        "<div class=\"table__column--width-small text-center\">Chance</div>"
    );
}

function addGWCChance(Context) {
    var Entered, Entries, Copies;
    Entered = true;
    if (!Context) {
        Context = document;
        Entered = false;
    }
    Entries = Context.getElementsByClassName(Entered ? "table__column--width-small" : "live__entry-count")[0];
    Copies = Context.getElementsByClassName(Entered ? "table__column__heading" : "featured__heading")[0].textContent.match(/\((.+) Copies\)/);
    Copies = Copies ? parseInt(Copies[1].replace(/,/g, "")) : 1;
    Context = Entered ? Entries : Context.getElementsByClassName("featured__column")[0];
    Context.insertAdjacentHTML(
        "afterEnd",
        "<div class=\"" + (Entered ? "table__column--width-small text-center" : "featured__column") + " GWCChance\" title=\"Giveaway winning chance.\">" + (Entered ? "" : (
            "<i class=\"fa fa-line-chart\"></i>")) +
        "    <span></span>" +
        "</div>"
    );
    setGWCChance(Context.nextElementSibling.lastElementChild, Entries, Copies);
}
