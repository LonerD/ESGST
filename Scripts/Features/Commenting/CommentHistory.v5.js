function saveCHComment(Context, URL, Title, ID) {
    var Username;
    Username = Context ? Context.previousElementSibling.getElementsByClassName("comment__username")[0].textContent : null;
    GM_setValue(
        "CommentHistory",
        "<div>" +
        "    You " + (Username ? ("replied to <a class=\"rhBold\" href=\"/user/" + Username + "\">" + Username + "</a> on") : "added a comment to") +
        "    <a class=\"rhBold\" href=\"" + URL + "\">" + Title + "</a> at" +
        "    <a class=\"rhBold\" data-timestamp=\"" + Math.floor((new Date().getTime()) / 1000) + "\" href=\"/go/comment/" + ID + "\"></a>." +
        "</div>" +
        GM_getValue("CommentHistory")
    );
}
