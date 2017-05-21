function loadStickiedGiveawayGroups(context) {
    if (!esgst.newGiveawayPath) {
        esgst.endlessFeatures.push(getSGGGroups);
    }
    getSGGGroups(context);
}

function getSGGGroups(context) {
    var matches = context.getElementsByClassName(`table__row-inner-wrap`);
    setSGGGroups(matches);
}

function setSGGGroups(Matches) {
    var StickiedGroups, SGG, Groups, I, NumMatches, Context, ID, Name, J, NumGroups;
    StickiedGroups = GM_getValue("StickiedGroups");
    if (esgst.newGiveawayPath) {
        SGG = {
            Container: document.getElementsByClassName("form__groups")[0]
        };
        SGG.Separator = SGG.Container.firstElementChild.nextElementSibling;
        Matches = SGG.Container.getElementsByClassName("form__group--steam");
        Groups = GM_getValue("Groups");
        for (I = 0, NumMatches = Matches.length; I < NumMatches; ++I) {
            Context = Matches[I];
            ID = Context.getAttribute("data-group-id");
            Name = Context.getElementsByClassName("form__group__name")[0].textContent.substr(0, 22);
            if (StickiedGroups.indexOf(ID) < 0) {
                setSGGButton(Context, true, ID, SGG);
            } else {
                if (Context == SGG.Separator) {
                    SGG.Separator = SGG.Separator.nextElementSibling;
                }
                SGG.Container.insertBefore(Context, SGG.Separator);
                setSGGButton(Context, false, ID, SGG);
            }
            for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Name.substr(0, 22) != Name); ++J);
            if ((J < NumGroups) && !Groups[J].ID) {
                Groups[J].ID = ID;
            }
        }
        GM_setValue("Groups", Groups);
    } else {
        Groups = GM_getValue("Groups");
        for (I = 0, NumMatches = Matches.length; I < NumMatches; ++I) {
            Context = Matches[I];
            Name = Context.getElementsByClassName("table__column__heading")[0].textContent;
            for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Name != Name); ++J);
            if (J < NumGroups) {
                ID = Groups[J].ID;
                if (ID) {
                    setSGGButton(Context, StickiedGroups.indexOf(ID) < 0, ID);
                }
            }
        }
    }
}

function setSGGButton(Context, Sticky, ID, SGG) {
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"" + (Sticky ? "SGGSticky" : "SGGUnsticky") + "\" title=\"" + (Sticky ? "Sticky" : "Unsticky") + " group.\">" +
        "    <i class=\"fa fa-thumb-tack\"></i>" +
        "</a>"
    );
    Context.firstElementChild.addEventListener("click", function(Event) {
        var StickiedGroups;
        Event.stopPropagation();
        StickiedGroups = GM_getValue("StickiedGroups");
        if (Sticky) {
            StickiedGroups.push(ID);
            if (SGG) {
                if (Context == SGG.Separator) {
                    SGG.Separator = SGG.Separator.nextElementSibling;
                }
                SGG.Container.insertBefore(Context, SGG.Separator);
            }
        } else {
            StickiedGroups.splice(StickiedGroups.indexOf(ID), 1);
            if (SGG) {
                SGG.Container.insertBefore(Context, SGG.Separator);
                SGG.Separator = SGG.Separator.previousElementSibling;
            }
        }
        GM_setValue("StickiedGroups", StickiedGroups);
        Event.currentTarget.remove();
        setSGGButton(Context, !Sticky, ID, SGG);
    });
}
