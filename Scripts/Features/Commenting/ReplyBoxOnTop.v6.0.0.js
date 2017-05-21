function loadReplyBoxOnTop() {
    var html = `
      <div class="esgst-rbot"></div>
    `;
    var sibling;
    if (esgst.mainPageHeadingBackground) {
      sibling = esgst.mainPageHeadingBackground;
    } else {
      sibling = esgst.mainPageHeading;
    }
    sibling.insertAdjacentHTML(`afterEnd`, html);
    var box = sibling.nextElementSibling;
    box.appendChild(esgst.replyBox);
    var button = box.getElementsByClassName(esgst.cancelButtonClass)[0];
    button.addEventListener(`click`, waitToRestoreReplyBox);

    function waitToRestoreReplyBox() {
      window.setTimeout(restoreReplyBox, 0);
    }

    function restoreReplyBox() {
      box.appendChild(esgst.replyBox);
    }
}
