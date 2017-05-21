function loadReplyBoxPopup() {
    var CommentBox, Popup, ESCommentBox;
    var Context = esgst.mainPageHeading;
    Popup = createPopup();
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add("fa-comment");
    Popup.Title.textContent = "Add a comment:";
    Popup.TextArea.classList.remove("rhHidden");
    if (esgst.cfh) {
        addCFHPanel(Popup.TextArea);
    }
    createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
        Popup.Progress.innerHTML = "";
        saveComment(esgst.sg ? "" : document.querySelector("[name='trade_code']").value, "", Popup.TextArea.value, esgst.sg ? window.location.href.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php", Popup.Progress,
                    Callback);
    });
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"page_heading_btn MCBPButton\" title=\"Add a comment.\">" +
        "    <i class=\"fa fa-comment\"></i>" +
        "</a>"
    );
    Context.firstElementChild.addEventListener("click", function() {
        Popup.popUp(function() {
            Popup.TextArea.focus();
        });
    });
}
