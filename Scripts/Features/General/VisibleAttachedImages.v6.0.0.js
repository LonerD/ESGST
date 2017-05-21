function loadVisibleAttachedImages(context) {
    var images = context.getElementsByClassName(esgst.attachedImagesClass);
    for (var i = 0, n = images.length; i < n; ++i) {
        images[i].nextElementSibling.firstElementChild.classList.remove(esgst.hiddenClass);
    }
}
