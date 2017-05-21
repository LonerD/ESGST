function loadReplyMentionLink(context) {
    var matches = context.getElementsByClassName(esgst.sg ? "comment__children" : "comment_children");
    for (var i = 0, n = matches.length; i < n; ++i) {
        var Matches = matches[i].children;
        if (Matches.length) {
            addRMLLink(esgst.sg ? matches[i].parentElement.getElementsByClassName("comment__summary")[0] : matches[i].parentElement, Matches);
        }
    }
}

function addRMLLink(Context, Matches) {
    var Username, ID, I, N, RMLLink;
    Username = Context.getElementsByClassName(esgst.sg ? "comment__username" : "author_name")[0].textContent.trim();
    ID = Context.id;
    for (I = 0, N = Matches.length; I < N; ++I) {
        Context = Matches[I].getElementsByClassName(esgst.sg ? "comment__actions" : "action_list")[0];
        RMLLink = Context.getElementsByClassName("RMLLink")[0];
        if (RMLLink) {
            RMLLink.textContent = "@" + Username;
        } else {
            Context.insertAdjacentHTML("beforeEnd", "<a class=\"comment__actions__button RMLLink\" href=\"#" + ID + "\">@" + Username + "</a>");
        }
    }
}
