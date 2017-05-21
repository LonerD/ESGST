function loadVisibleAttachedImages(context) {
    var images = context.getElementsByClassName(esgst.attachedImagesClass);
    for (var i = 0, n = images.length; i < n; ++i) {
        var image = images[i].nextElementSibling.firstElementChild;
        if (image) {
            if (image.getAttribute(`src`).match(/\.gifv/)) {
                image.setAttribute(`src`, image.getAttribute(`src`).replace(/\.gifv/, `.gif`));
            }
            image.classList.remove(esgst.hiddenClass);
        }
    }
}
