function loadGroupsHighlighter(context) {
    var matches = context.querySelectorAll(`.table__column__heading[href*="/group/"]`);
    highlightGHGroups(matches);
}

function highlightGHGroups(Matches) {
    var I, N, Groups, Group, J, NumGroups;
    Groups = GM_getValue("Groups");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Group = Matches[I].getAttribute("href").match(/\/group\/(.+)\//)[1];
        for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Code != Group); ++J);
        if (J < NumGroups) {
            Matches[I].closest(".table__row-outer-wrap").classList.add("GHHighlight");
        }
    }
}
