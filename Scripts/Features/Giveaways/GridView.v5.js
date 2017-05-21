function loadGridView(context) {
    var matches = context.getElementsByClassName(`giveaway__row-outer-wrap`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        setGVContainer(matches[i]);
    }
}

function setGVContainer(Context) {
    var GVBox, GVInfo, Columns, GVIcons, Element;
    Context.parentElement.classList.add("GVView");
    Context.classList.add("GVContainer");
    GVBox = Context.getElementsByClassName("giveaway__row-inner-wrap")[0];
    GVBox.classList.add("GVBox");
    GVBox.insertAdjacentHTML("afterBegin", "<div class=\"global__image-outer-wrap GVInfo rhHidden\"></div>");
    GVInfo = GVBox.firstElementChild;
    do {
        Element = GVInfo.nextElementSibling;
        if (Element) {
            GVInfo.appendChild(Element);
        }
    } while (Element);
    GVBox.insertBefore(Context.getElementsByClassName("global__image-outer-wrap--game-medium")[0], GVInfo);
    Columns = Context.getElementsByClassName("giveaway__columns")[0];
    Context.insertAdjacentHTML("afterBegin", "<div class=\"GVIcons giveaway__columns\"></div>");
    GVIcons = Context.firstElementChild;
    while (!Columns.lastElementChild.classList.contains("giveaway__column--width-fill")) {
        Element = Columns.lastElementChild;
        if (Element.textContent.match(/Level/)) {
            Element.textContent = Element.textContent.replace(/Level\s/, "");
        }
        GVIcons.appendChild(Element);
    }
    GVBox.addEventListener("mouseenter", function() {
        GVInfo.classList.remove("rhHidden");
        GVInfo.removeAttribute("style");
        repositionPopout(GVInfo, GVBox);
    });
    GVBox.addEventListener("mouseleave", function() {
        GVInfo.classList.add("rhHidden");
    });
}
