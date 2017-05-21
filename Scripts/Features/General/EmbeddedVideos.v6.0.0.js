function loadEmbeddedVideos(context) {
    for (var i = 0, numTypes = esgst.videoTypes.length; i < numTypes; ++i) {
        var type = esgst.videoTypes[i];
        var videos = context.querySelectorAll(`a[href*="${type.url}"]`);
        for (var j = 0, numVideos = videos.length; j < numVideos; ++j) {
            var video = videos[j];
            var url = video.getAttribute(`href`);
            if ((url == video.textContent) && (video.parentElement.textContent == video.textContent)) {
                video.outerHTML = `
                    <iframe width="640" height="360" src="${type.getEmbedUrl(url)}" frameborder="0" allowfullscreen></iframe>
                `;
            }
        }
    }
}

function getYoutubeComEmbedUrl(url) {
  return `https://www.youtube.com/embed/${url.match(/watch\?v=(.+)/)[1]}`;
}

function getYoutuBeEmbedUrl(url) {
  return `https://www.youtube.com/embed/${url.match(/youtu.be\/(.+)/)[1]}`;
}

function getVimeoEmbedUrl(url) {
  return `https://player.vimeo.com/video/${url.match(/vimeo.com\/(.+)/)[1]}`;
}
