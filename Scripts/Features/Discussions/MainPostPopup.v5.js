function loadMainPostPopup() {
    var MPPPost, Sibling, Visited, Timestamp, Hidden;
    var Context = esgst.mainPageHeading;
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"MPPButton\" title=\"Open the main post.\">" +
        "    <i class=\"fa fa-home\"></i>" +
        "</a>"
    );
    MPPPost = document.createElement("div");
    MPPPost.className = "page__outer-wrap";
    do {
        Sibling = Context.previousElementSibling;
        if (Sibling) {
            MPPPost.insertBefore(Sibling, MPPPost.firstElementChild);
        }
    } while (Sibling);
    Context.parentElement.insertBefore(MPPPost, Context);
    if (GM_getValue("CT")) {
        Visited = GM_getValue("Comments" + (esgst.sg ? "" : "_ST"))[window.location.pathname.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3]];
        Timestamp = MPPPost.querySelectorAll("[data-timestamp]");
        Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
        Hidden = Visited ? (((Visited[""] == Timestamp) || (GM_getValue("MPP_FV") && Visited.Visited)) ? true : false) : false;
    } else {
        Hidden = true;
    }
    MPPPost.classList.add(Hidden ? "MPPPostOpen" : "MPPPostDefault");
    Context.firstElementChild.addEventListener("click", function() {
        if (!Hidden) {
            MPPPost.classList.remove("MPPPostDefault");
            MPPPost.classList.add("MPPPostOpen");
        }
        $(MPPPost).bPopup({
            amsl: [0],
            fadeSpeed: 200,
            followSpeed: 500,
            modalColor: "#3c424d",
            opacity: 0.85,
            onClose: function() {
                if (!Hidden) {
                    MPPPost.classList.remove("MPPPostOpen");
                    MPPPost.classList.add("MPPPostDefault");
                    MPPPost.removeAttribute("style");
                    Context.parentElement.insertBefore(MPPPost, Context);
                }
            }
        });
    });
}
