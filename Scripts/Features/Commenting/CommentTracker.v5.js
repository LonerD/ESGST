function loadCommentTracker() {
    if (esgst.commentsPath) {
        addCTPanel(esgst.mainPageHeading);
        esgst.endlessFeatures.push(getCTComments);
        getCTComments(document);
    }
    esgst.endlessFeatures.push(loadCTVisited);
    loadCTVisited(document);
}

function loadCTVisited(context) {
    var matches = context.querySelectorAll(`.table__column__heading, .giveaway__heading__name, .column_flex h3 a`);
    checkCTVisited(matches);
}

function getCTComments(context) {
    var matches = context.querySelectorAll(`.comment__summary, .comment_inner`);
    setCTComment(matches);
}

function checkCTVisited(Matches) {
    var ID, Comments, I, N, Link, Match, Type, Key, Element, CommentsCount, Count, Read, LastUnread, CTPanel;
    ID = "Comments" + (esgst.sg ? "" : "_ST");
    Comments = GM_getValue(ID);
    for (I = 0, N = Matches.length; I < N; ++I) {
        Link = Matches[I].getAttribute("href");
        if (Link) {
            Match = Link.match(/\/(giveaway|discussion|support\/ticket|trade)\/(.+?)\//);
            if (Match) {
                Type = Match[1];
                Key = Match[2];
                if (Match && (((Type == "giveaway") && esgst.ct_g) || (Type != "giveaway")) && Comments[Key] && Comments[Key].Visited) {
                    Element = Matches[I].closest("div");
                    Element.style.opacity = "0.5";
                    setHoverOpacity(Element, "1", "0.5");
                }
                if (Type == "discussion") {
                    Element = Matches[I].closest(".table__column--width-fill");
                    CommentsCount = Element.nextElementSibling.firstElementChild;
                    Count = parseInt(CommentsCount.textContent.replace(/,/g, ""));
                    if (!Comments[Key]) {
                        Comments[Key] = {};
                    }
                    delete Comments[Key].Count;
                    Read = Object.keys(Comments[Key]).length - 3;
                    if (Read < 0) {
                        Read = 0;
                    }
                    if (Read <= Count) {
                        LastUnread = esgst.ct_lu;
                        CommentsCount.insertAdjacentHTML(
                            "afterEnd",
                            " <span class=\"CTPanel\">" + ((Read < Count) ? (
                                "<a class=\"CTGoToUnread\" title=\"Go to the " + (LastUnread ? "last" : "first") + " unread comment.\">" +
                                "    <i class=\"fa fa-comments-o\"></i>" +
                                "</a>" +
                                "<a class=\"CTMarkRead\" title=\"Mark all comments as read.\">" +
                                "    <i class=\"fa fa-eye\"></i>" +
                                "</a>") : "") +
                            "</span>"
                        );
                        CTPanel = CommentsCount.nextElementSibling;
                        if (Read < Count) {
                            CommentsCount.insertAdjacentText("beforeEnd", " (+" + (Count - Read) + ")");
                            setCTPanel(CTPanel, CommentsCount.href, Key, LastUnread, Element);
                        }
                        if (!Comments[Key].Visited) {
                            CTPanel.insertAdjacentHTML(
                                "beforeEnd",
                                "<a class=\"CTMarkVisited\" title=\"Mark discussion as visited.\">" +
                                "    <i class=\"fa fa-check\"></i>" +
                                "</a>"
                            );
                            setCTVisited(CTPanel, Key, Element);
                        }
                    }
                }
            }
        }
    }
}

function setCTPanel(CTPanel, URL, Key, LastUnread, Element) {
    var CTGoToUnread, CTMarkRead;
    CTGoToUnread = CTPanel.firstElementChild;
    CTMarkRead = CTGoToUnread.nextElementSibling;
    CTGoToUnread.addEventListener("click", function() {
        CTPanel.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
        markCTDiscussionRead({
            Progress: CTPanel
        }, URL + "/search?page=", 1, Key, true, LastUnread, LastUnread, function(ID) {
            window.location.href = ID ? "/go/comment/" + ID : URL;
        });
    });
    CTMarkRead.addEventListener("click", function() {
        Element.style.opacity = "0.5";
        setHoverOpacity(Element, "1", "0.5");
        CTPanel.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
        markCTDiscussionRead({
            Progress: CTPanel
        }, URL + "/search?page=", 1, Key, false, false, false, function() {
            CTPanel.remove();
        });
    });
}

function markCTDiscussionRead(CT, URL, NextPage, Key, Unread, LastUnread, LastUnreadFirst, Callback) {
    queueRequest(CT, null, URL + NextPage, function(Response) {
        var ResponseHTML, Matches, I, N, Comments, ID, Timestamp, Found, Pagination;
        ResponseHTML = parseHTML(Response.responseText);
        Matches = ResponseHTML.getElementsByClassName("comment__summary");
        for (I = 0, N = Matches.length; I < N; ++I) {
            if (!Matches[I].closest(".comment--submit")) {
                Comments = GM_getValue("Comments");
                if (!Comments[Key]) {
                    Comments[Key] = {
                        Visited: true
                    };
                } else if (!Comments[Key].Visited) {
                    Comments[Key].Visited = true;
                }
                ID = Matches[I].id;
                if (!Comments[Key][ID]) {
                    Comments[Key][ID] = 0;
                }
                Timestamp = Matches[I].getElementsByClassName("comment__actions")[0].firstElementChild.querySelectorAll("[data-timestamp]");
                Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
                if (Comments[Key][ID] < Timestamp) {
                    if (Unread) {
                        Found = true;
                        break;
                    } else {
                        Comments[Key][ID] = Timestamp;
                        GM_setValue("Comments", Comments);
                    }
                }
            }
        }
        Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
        if (Matches.length && !Found && ((LastUnread && (NextPage >= 1)) || (!LastUnread && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")))) {
            if (LastUnreadFirst) {
                if (Pagination) {
                    NextPage = parseInt(Pagination.lastElementChild.getAttribute("data-page-number")) + 1;
                } else {
                    Callback(ID);
                }
            } else if (LastUnread && (NextPage == 1)) {
                Callback(ID);
            }
            setTimeout(markCTDiscussionRead, 0, CT, URL, LastUnread ? --NextPage : ++NextPage, Key, Unread, LastUnread, false, Callback);
        } else {
            Callback(ID);
        }
    });
}

function setCTVisited(CTPanel, Key, Element) {
    var CTMarkVisited;
    CTMarkVisited = CTPanel.lastElementChild;
    CTMarkVisited.addEventListener("click", function() {
        var Comments;
        Comments = GM_getValue("Comments");
        if (!Comments[Key]) {
            Comments[Key] = {};
        }
        Comments[Key].Visited = true;
        GM_setValue("Comments", Comments);
        Element.style.opacity = "0.5";
        setHoverOpacity(Element, "1", "0.5");
        CTMarkVisited.remove();
    });
}

function addCTPanel(Context) {
    var CTGoToUnread;
    Context.insertAdjacentHTML(
        "afterBegin",
        "<div class=\"page_heading_btn CTPanel\">" +
        "    <a class=\"CTGoToUnread\" title=\"Go to the first unread comment.\">" +
        "        <i class=\"fa fa-comments-o\"></i>" +
        "    </a>" +
        "    <a class=\"CTMarkRead\" title=\"Mark all comments as read.\">" +
        "        <i class=\"fa fa-eye\"></i>" +
        "    </a>" +
        "</span>"
    );
    CTGoToUnread = Context.firstElementChild.firstElementChild;
    CTGoToUnread.addEventListener("click", function() {
        var Unread, ID;
        Unread = document.getElementsByClassName("CTButton")[0];
        if (Unread) {
            ID = esgst.sg ? Unread.closest(".comment__summary").id : Unread.closest(".comment_inner").parentElement.id;
            if (ID) {
                window.location.hash = "";
                window.location.hash = ID;
            } else {
                window.scrollTo(0, 0);
            }
        }
    });
    CTGoToUnread.nextElementSibling.addEventListener("click", function() {
        var Matches, ID, Key, I, N;
        Matches = document.getElementsByClassName("CTButton");
        ID = "Comments" + (esgst.sg ? "" : "_ST");
        Key = window.location.pathname.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3];
        for (I = 0, N = Matches.length; I < N; ++I) {
            Matches[0].closest(".comment__summary, .comment_inner").style.opacity = "0.5";
            markCTRead(Matches[0], ID, Key);
        }
    });
}

function setCTComment(Matches) {
    var ID, Comments, Key, I, N, Comment, CommentID, Timestamp, Context;
    ID = "Comments" + (esgst.sg ? "" : "_ST");
    Comments = GM_getValue(ID);
    Key = window.location.pathname.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3];
    if (!Comments[Key]) {
        Comments[Key] = {
            Visited: true
        };
        GM_setValue(ID, Comments);
    } else if (!Comments[Key].Visited) {
        Comments[Key].Visited = true;
        GM_setValue(ID, Comments);
    }
    for (I = 0, N = Matches.length; I < N; ++I) {
        Comment = Matches[I];
        if (!Comment.closest(".comment--submit")) {
            CommentID = esgst.sg ? Comment.id : Comment.parentElement.id;
            Timestamp = Comment.querySelectorAll("[data-timestamp]");
            Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
            if (Timestamp == Comments[Key][CommentID]) {
                Comment.style.opacity = "0.5";
                setHoverOpacity(Comment, "1", "0.5");
            } else {
                delete Comments[Key][CommentID];
                Context = Matches[I].getElementsByClassName(esgst.sg ? "comment__actions" : "action_list")[0];
                Context.insertAdjacentHTML(
                    "beforeEnd",
                    "<a class=\"CTButton\" title=\"Mark comment as read.\">" +
                    "    <i class=\"fa fa-eye\"></i>" +
                    "</a>"
                );
                Context.lastElementChild.addEventListener("click", function(Event) {
                    markCTRead(Event.currentTarget, ID, Key);
                });
            }
        }
    }
    GM_setValue(ID, Comments);
}

function markCTRead(CTButton, ID, Key) {
    var Timestamp, Comments, CommentID, Comment;
    Timestamp = CTButton.parentElement.firstElementChild.querySelectorAll("[data-timestamp]");
    Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
    Comments = GM_getValue(ID);
    Comment = CTButton.closest(".comment__summary, .comment_inner");
    CommentID = esgst.sg ? Comment.id : Comment.parentElement.id;
    Comments[Key][CommentID] = Timestamp;
    GM_setValue(ID, Comments);
    CTButton.remove();
    setHoverOpacity(Comment, "1", "0.5");
}
