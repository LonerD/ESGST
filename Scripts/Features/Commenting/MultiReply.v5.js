function loadMultiReply(context) {
    var matches = context.getElementsByClassName(esgst.sg ? `comment__actions` : `action_list`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        addMRButton(matches[i]);
    }
}

function addMRButton(Context) {
    var MR, Parent, ReplyButton, Permalink;
    MR = {
        Context: Context,
        Comment: Context.closest(esgst.sg ? ".comment" : ".comment_outer")
    };
    if (MR.Comment) {
        Parent = MR.Comment.closest(esgst.sg ? ".comment" : ".comment_outer");
        MR.Container = MR.Comment.getElementsByClassName(esgst.sg ? "comment__summary" : "comment_inner")[0];
        MR.Timestamp = MR.Context.firstElementChild;
        ReplyButton = MR.Context.getElementsByClassName(esgst.sg ? "js__comment-reply" : "js_comment_reply")[0];
        Permalink = MR.Context.lastElementChild;
        if (ReplyButton || window.location.pathname.match(/^\/messages/)) {
            if (ReplyButton) {
                ReplyButton.remove();
                MR.ParentID = Parent.getAttribute(esgst.sg ? "data-comment-id" : "data-id");
                if (window.location.pathname.match(/^\/messages/)) {
                    MR.URL = Permalink.getAttribute("href");
                }
            } else {
                MR.URL = Permalink.getAttribute("href");
                MR.Comment.insertAdjacentHTML("beforeEnd", "<div class=\"comment__children comment_children\"></div>");
            }
            if (esgst.sg) {
                MR.TradeCode = "";
            } else {
                if (!window.location.pathname.match(/^\/messages/)) {
                    MR.TradeCode = window.location.pathname.match(/^\/trade\/(.+?)\//)[1];
                }
                MR.Username = MR.Comment.getElementsByClassName("author_name")[0].textContent;
            }
            MR.Timestamp.insertAdjacentHTML("afterEnd", "<a class=\"comment__actions__button MRReply\">Reply</a>");
            MR.Timestamp.nextElementSibling.addEventListener("click", function() {
                if (!MR.Box) {
                    addMRBox(MR);
                } else {
                    MR.Description.focus();
                }
            });
        }
        MR.Children = MR.Comment.getElementsByClassName(esgst.sg ? "comment__children" : "comment_children")[0];
        setMREdit(MR);
    }
}

function addMRBox(MR) {
    var Username;
    Username = GM_getValue("Username");
    MR.Children.insertAdjacentHTML(
        "afterBegin",
        "<div class=\"comment reply_form MRBox\">" + (esgst.sg ? (
            "<div class=\"comment__child\">" +
            "    <a href=\"/user/" + Username + "\" class=\"global__image-outer-wrap global__image-outer-wrap--avatar-small\">" +
            "        <div class=\"global__image-inner-wrap\" style=\"background-image: url(" + GM_getValue("Avatar") + ");\"></div>" +
            "    </a>" +
            "    <div class=\"comment__summary\">" +
            "        <div class=\"comment__author\">" +
            "            <div class=\"comment__username\">" +
            "                <a href=\"/user/" + Username + "\">" + Username + "</a>" +
            "            </div>" +
            "        </div>" +
            "        <div class=\"comment__display-state\">" +
            "            <div class=\"comment__description\">") : "") +
        "                    <input name=\"trade_code\" type=\"hidden\" value=\"" + MR.TradeCode + "\">" +
        "                    <input name=\"parent_id\" type=\"hidden\" value=\"" + MR.ParentID + "\">" +
        "                    <textarea class=\"MRDescription\" name=\"description\"" + (esgst.sg ? "" : " placeholder=\"Write a reply to " + MR.Username + "...\"") + "></textarea>" +
        "                    <div class=\"align-button-container btn_actions\">" +
        "                        <div></div>" +
        "                        <div class=\"comment__cancel-button btn_cancel MRCancel\">" +
        "                            <span>Cancel</span>" +
        "                        </div>" +
        "                    </div>" + (esgst.sg ? (
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "</div>") : "") +
        "</div>"
    );
    MR.Box = MR.Children.firstElementChild;
    MR.Description = MR.Box.getElementsByClassName("MRDescription")[0];
    MR.Cancel = MR.Box.getElementsByClassName("MRCancel")[0];
    if (esgst.cfh) {
        addCFHPanel(MR.Description);
    }
    MR.Description.focus();
    addDEDButton(MR.Box, MR.URL, function(Response, DEDStatus) {
        var ReplyID, Reply, ResponseJSON;
        if (esgst.sg) {
            ReplyID = Response.finalUrl.match(/#(.+)/);
            if (ReplyID) {
                MR.Box.remove();
                Reply = parseHTML(Response.responseText).getElementById(ReplyID[1]).closest(".comment");
                addRMLLink(MR.Container, [Reply]);
                loadEndlessFeatures(Reply);
                MR.Children.appendChild(Reply);
                window.location.hash = ReplyID[1];
            } else {
                DEDStatus.innerHTML =
                    "<i class=\"fa fa-times\"></i> " +
                    "<span>Failed!</span>";
            }
        } else {
            ResponseJSON = parseJSON(Response.responseText);
            if (ResponseJSON.success) {
                MR.Box.remove();
                Reply = parseHTML(ResponseJSON.html).getElementsByClassName("comment_outer")[0];
                addRMLLink(MR.Container, [Reply]);
                loadEndlessFeatures(Reply);
                MR.Children.appendChild(Reply);
                window.location.hash = Reply.id;
            } else {
                DEDStatus.innerHTML =
                    "<i class=\"fa fa-times\"></i> " +
                    "<span>Failed!</span>";
            }
        }
    });
    MR.Cancel.addEventListener("click", function() {
        MR.Box.remove();
        MR.Box = null;
    });
}

function setMREdit(MR) {
    var DisplayState, EditState, EditSave, ID, AllowReplies, Description;
    MR.Edit = MR.Context.getElementsByClassName(esgst.sg ? "js__comment-edit" : "js_comment_edit")[0];
    if (MR.Edit) {
        MR.Edit.insertAdjacentHTML("afterEnd", "<a class=\"comment__actions__button MREdit\">Edit</a>");
        MR.Edit = MR.Edit.nextElementSibling;
        MR.Edit.previousElementSibling.remove();
        DisplayState = MR.Comment.getElementsByClassName(esgst.sg ? "comment__display-state" : "comment_body_default")[0];
        EditState = MR.Comment.getElementsByClassName(esgst.sg ? "comment__edit-state" : "edit_form")[0];
        EditSave = EditState.getElementsByClassName(esgst.sg ? "js__comment-edit-save" : "js_submit")[0];
        EditSave.insertAdjacentHTML(
            "afterEnd",
            "<a class=\"comment__submit-button btn_action white EditSave\">" +
            "    <i class=\"fa fa-edit\"></i>" +
            "    <span>Edit</span>" +
            "</a>"
        );
        EditSave = EditSave.nextElementSibling;
        EditSave.previousElementSibling.remove();
        ID = EditState.querySelector("[name='comment_id']").value;
        AllowReplies = esgst.sg ? EditState.querySelector("[name='allow_replies']").value : "";
        Description = EditState.querySelector("[name='description']");
        MR.Edit.addEventListener("click", function() {
            var Temp;
            if (esgst.sg) {
                DisplayState.classList.add("is-hidden");
                MR.Context.classList.add("is-hidden");
            } else {
                MR.Container.classList.add("is_hidden");
            }
            EditState.classList.remove(esgst.sg ? "is-hidden" : "is_hidden");
            Temp = Description.value;
            Description.focus();
            Description.value = "";
            Description.value = Temp;
        });
        EditSave.addEventListener("click", function() {
            makeRequest("xsrf_token=" + esgst.xsrfToken + "&do=comment_edit&comment_id=" + ID + "&allow_replies=" + AllowReplies + "&description=" + encodeURIComponent(Description.value),
                        "/ajax.php", null, function(Response) {
                var ResponseJSON, ResponseHTML;
                ResponseJSON = parseJSON(Response.responseText);
                if (ResponseJSON.type == "success" || ResponseJSON.success) {
                    ResponseHTML = parseHTML(ResponseJSON[esgst.sg ? "comment" : "html"]);
                    DisplayState.innerHTML = ResponseHTML.getElementsByClassName(esgst.sg ? "comment__display-state" : "comment_body_default")[0].innerHTML;
                    EditState.classList.add(esgst.sg ? "is-hidden" : "is_hidden");
                    MR.Timestamp.innerHTML = ResponseHTML.getElementsByClassName(esgst.sg ? "comment__actions" : "action_list")[0].firstElementChild.innerHTML;
                    loadAccurateTimestamps(MR.Timestamp);
                    if (esgst.sg) {
                        DisplayState.classList.remove("is-hidden");
                        MR.Context.classList.remove("is-hidden");
                    } else {
                        MR.Container.classList.remove("is_hidden");
                    }
                }
            });
        });
    }
}
