function loadGiveawayTemplates() {
    var GTS;
    GTS = {
        Name: ""
    };
    addGTSView(GTS);
    addGTSSave(GTS);
}

function addGTSView(GTS) {
    var Context, GTSContainer, GTSView, Popout, Templates, N, I;
    Context = document.getElementsByClassName("page__heading")[0];
    Context.insertAdjacentHTML(
        "afterBegin",
        "<div>" +
        "    <a class=\"GTSView\" title=\"View saved templates.\">" +
        "        <i class=\"fa fa-file\"></i>" +
        "    </a>" +
        "</div>"
    );
    GTSContainer = Context.firstElementChild;
    GTSView = GTSContainer.firstElementChild;
    Popout = createPopout(GTSContainer);
    Popout.customRule = function(Target) {
        return !GTSContainer.contains(Target);
    };
    Templates = GM_getValue("Templates");
    N = Templates.length;
    if (N) {
        for (I = 0; I < N; ++I) {
            Popout.Popout.insertAdjacentHTML(
                "beforeEnd",
                "<div class=\"GTSTemplate\">" +
                "    <span class=\"popup__actions GTSApply\">" +
                "        <a>" + Templates[I].Name + "</a>" +
                "    </span>" +
                "    <i class=\"fa fa-trash GTSDelete\" title=\"Delete template.\"></i>" +
                "</div>");
            setGTSTemplate(Popout.Popout.lastElementChild, Templates[I], GTS);
        }
    } else {
        Popout.Popout.textContent = "No templates saved.";
    }
    GTSView.addEventListener("click", function() {
        if (Popout.Popout.classList.contains("rhHidden")) {
            Popout.popOut(GTSContainer);
        } else {
            Popout.Popout.classList.add("rhHidden");
        }
    });
}

function setGTSTemplate(GTSTemplate, Template, GTS) {
    GTSTemplate.firstElementChild.addEventListener("click", function() {
        var CurrentDate, Context, Groups, Matches, I, N, ID, Selected, J;
        CurrentDate = Date.now();
        document.querySelector("[name='start_time']").value = formatDate(new Date(CurrentDate + Template.Delay));
        document.querySelector("[name='end_time']").value = formatDate(new Date(CurrentDate + Template.Delay + Template.Duration));
        document.querySelector("[data-checkbox-value='" + Template.Region + "']").click();
        document.querySelector("[data-checkbox-value='" + Template.Type + "']").click();
        if (Template.Type == "groups") {
            if (Template.Whitelist == 1) {
                Context = document.getElementsByClassName("form__group--whitelist")[0];
                if (!Context.classList.contains("is-selected")) {
                    Context.click();
                }
            }
            if (Template.Groups) {
                Groups = Template.Groups.trim().split(/\s/);
                Matches = document.getElementsByClassName("form__group--steam");
                for (I = 0, N = Matches.length; I < N; ++I) {
                    Context = Matches[I];
                    ID = Context.getAttribute("data-group-id");
                    Selected = Context.classList.contains("is-selected");
                    J = Groups.indexOf(ID);
                    if ((Selected && (J < 0)) || (!Selected && (J >= 0))) {
                        Context.click();
                    }
                }
            }
        }
        if (Template.Level > 0) {
            document.getElementsByClassName("ui-slider-range")[0].style.width = "100%";
            document.getElementsByClassName("form__level")[0].textContent = "level " + Template.Level;
            document.getElementsByClassName("form__input-description--no-level")[0].classList.add("is-hidden");
            document.getElementsByClassName("form__input-description--level")[0].classList.remove("is-hidden");
        } else {
            document.getElementsByClassName("ui-slider-range")[0].style.width = "0%";
            document.getElementsByClassName("form__input-description--level")[0].classList.add("is-hidden");
            document.getElementsByClassName("form__input-description--no-level")[0].classList.remove("is-hidden");
        }
        document.getElementsByClassName("ui-slider-handle")[0].style.left = (Template.Level * 10) + "%";
        document.querySelector("[name='contributor_level']").value = Template.Level;
        document.querySelector("[name='description']").value = Template.Description;
        GTS.Name = Template.Name;
    });
    GTSTemplate.lastElementChild.addEventListener("click", function() {
        var Templates, I, N;
        if (window.confirm("Are you sure you want to delete this template?")) {
            Templates = GM_getValue("Templates");
            for (I = 0, N = Templates.length; (I < N) && (Templates[I].Name != Template.Name); ++I);
            Templates.splice(I, 1);
            GM_setValue("Templates", Templates);
            if (GTS.Name == Template.Name) {
                GTS.Name = "";
            }
            GTSTemplate.remove();
        }
    });
}

function addGTSSave(GTS) {
    var Context;
    Context = document.getElementsByClassName("form__submit-button")[0];
    Context.insertAdjacentHTML("afterEnd", "<div class=\"GTSSave\"></div>");
    createButton(Context.nextElementSibling, "fa-file", "Save Template", "", "", function(Callback) {
        var Popup;
        Callback();
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-file");
        Popup.Title.textContent = "Save template:";
        Popup.TextInput.classList.remove("rhHidden");
        Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Enter a name for this template."));
        Popup.TextInput.value = GTS.Name;
        createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
            var StartTime, Delay, Template, Templates, I, N;
            if (Popup.TextInput.value) {
                StartTime = new Date(document.querySelector("[name='start_time']").value).getTime();
                Delay = StartTime - (new Date().getTime());
                Template = {
                    Name: Popup.TextInput.value,
                    Delay: (Delay > 0) ? Delay : 0,
                    Duration: (new Date(document.querySelector("[name='end_time']").value).getTime()) - StartTime,
                    Region: document.querySelector("[name='region']").value,
                    Type: document.querySelector("[name='who_can_enter']").value,
                    Whitelist: document.querySelector("[name='whitelist']").value,
                    Groups: document.querySelector("[name='group_string']").value,
                    Level: document.querySelector("[name='contributor_level']").value,
                    Description: document.querySelector("[name='description']").value
                };
                Templates = GM_getValue("Templates");
                if (GTS.Name == Popup.TextInput.value) {
                    for (I = 0, N = Templates.length; (I < N) && (Templates[I].Name != GTS.Name); ++I);
                    if (I < N) {
                        Templates[I] = Template;
                    } else {
                        Templates.push(Template);
                    }
                } else {
                    Templates.push(Template);
                }
                GM_setValue("Templates", Templates);
                Callback();
                Popup.Close.click();
            } else {
                Popup.Progress.innerHTML =
                    "<i class=\"fa fa-times-circle\"></i> " +
                    "<span>You must enter a name.</span>";
                Callback();
            }
        });
        Popup.popUp(function() {
            Popup.TextInput.focus();
        });
    });
}
