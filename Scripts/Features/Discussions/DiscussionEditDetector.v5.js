function loadDiscussionEditDetector() {
    addDEDButton(esgst.replyBox);
}

function addDEDButton(Context, CommentURL, DEDCallback) {
    var TradeCode, ParentID, Description, URL, DEDButton, DEDStatus, ResponseHTML;
    TradeCode = Context.querySelector("[name='trade_code']");
    TradeCode = TradeCode ? TradeCode.value : "";
    ParentID = Context.querySelector("[name='parent_id']");
    Description = Context.querySelector("[name='description']");
    URL = esgst.sg ? window.location.href.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php";
    Context = Context.getElementsByClassName(esgst.sg ? "align-button-container" : "btn_actions")[0];
    Context.firstElementChild.remove();
    Context.insertAdjacentHTML("afterBegin", "<div class=\"DEDButton\"></div>");
    Context.insertAdjacentHTML("beforeEnd", "<div class=\"comment__actions action_list DEDStatus\"></div>");
    DEDButton = Context.firstElementChild;
    DEDStatus = Context.lastElementChild;
    createButton(DEDButton, "fa-send", "Submit", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
        DEDStatus.innerHTML = "";
        if (CommentURL) {
            makeRequest(null, CommentURL, DEDStatus, function(Response) {
                ResponseHTML = parseHTML(Response.responseText);
                TradeCode = esgst.sg ? "" : Response.finalUrl.match(/\/trade\/(.+?)\//)[1];
                ParentID = ResponseHTML.getElementById(CommentURL.match(/\/comment\/(.+)/)[1]);
                ParentID = esgst.sg ? ParentID.closest(".comment").getAttribute("data-comment-id") : ParentID.getAttribute("data-id");
                URL = esgst.sg ? Response.finalUrl.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php";
                saveComment(TradeCode, ParentID, Description.value, URL, DEDStatus, Callback, DEDCallback);
            });
        } else {
            saveComment(TradeCode, ParentID.value, Description.value, URL, DEDStatus, Callback, DEDCallback);
        }
    }, null, true);
}
