function loadEmbeddedVideos(context) {
    for (var i = 0, numTypes = esgst.videoTypes.length; i < numTypes; ++i) {
        var type = esgst.videoTypes[i];
        var videos = context.querySelectorAll(`a[href*="${type.url}"]`);
        for (var j = 0, numVideos = videos.length; j < numVideos; ++j) {
            var video = videos[j];
            var url = video.getAttribute(`href`);
            var text = video.textContent;
            var next = video.nextSibling;
            var previous = video.previousSibling;
            if ((!previous || (previous.textContent == `\n`)) && (!next || !next.textContent || (next.textContent.match(/\.|:/)))) {
                video.outerHTML = `
                    <div>
                        ${(url != text) ? `<div>${text}</div>${next ? next.textContent : ``}` : ``}
                        <iframe width="640" height="360" src="${type.getEmbedUrl(url)}" frameborder="0" allowfullscreen></iframe>
                    </div>
                `;
                if (next) {
                    next.remove();
                }
            }
        }
    }
}

function getYoutubeComEmbedUrl(url) {
  return `https://www.youtube.com/embed/${url.match(/watch\?v=(.+?)(&.*)?$/)[1]}`;
}

function getYoutuBeEmbedUrl(url) {
  return `https://www.youtube.com/embed/${url.match(/youtu.be\/(.+)/)[1]}`;
}

function getVimeoEmbedUrl(url) {
  return `https://player.vimeo.com/video/${url.match(/vimeo.com\/(.+)/)[1]}`;
}
