function load_embedded_videos() {
    var matches, i, n;
    matches = document.querySelectorAll(`a[href*=youtube.com]`);
    for (i = 0, n = matches.length; i < n; ++i) {
        matches[i].outerHTML = `
            <iframe width="420" height="315"
            src="https://www.youtube.com/embed/${matches[i].getAttribute(`href`).match(/=(.+)/)[1]}"></iframe>
        `;
    }
    matches = document.querySelectorAll(`a[href*=youtu.be]`);
    for (i = 0, n = matches.length; i < n; ++i) {
        matches[i].outerHTML = `
            <iframe width="420" height="315"
            src="https://www.youtube.com/embed/${matches[i].getAttribute(`href`).match(/youtu.be\/(.+)/)[1]}"></iframe>
        `;
    }
}
