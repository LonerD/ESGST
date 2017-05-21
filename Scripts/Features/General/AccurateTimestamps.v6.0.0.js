function loadAccurateTimestamps(context) {
    var timestamps = context.querySelectorAll(`[data-timestamp]`);
    for (var i = 0, n = timestamps.length; i < n; ++i) {
        var timestamp = timestamps[i];
        var accurateTimestamp = getTimestamp(parseInt(timestamp.getAttribute(`data-timestamp`)));
        var content = timestamp.textContent;
        var edited = content.match(/\*/);
        if (edited) {
          accurateTimestamp = ` (Edited ${accurateTimestamp})`;
        } else if (content) {
          accurateTimestamp = `${accurateTimestamp} - ${content}`;
        }
        timestamp.textContent = accurateTimestamp;
    }
}
