function load_visible_attached_images(context) {
    var matches, i, n;
    if (!context) {
        context = document;
    }
    matches = context.getElementsByClassName(esgst.attached_class);
    for (i = 0, n = matches.length; i < n; ++i) {
        matches[i].nextElementSibling.firstElementChild.classList.remove(esgst.hidden_class);
    }
}
