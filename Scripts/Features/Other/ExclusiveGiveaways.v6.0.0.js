var eg = {};

function loadExclusiveGiveaways() {
    var context = document.getElementsByClassName(`nav__left-container`)[0];
    var html = `
        <div class="nav__button-container esgst-hidden">
            <div class="nav__button">
                <i class="fa fa-star"></i>
            </div>
        </div>
    `;
    context.insertAdjacentHTML(`beforeEnd`, html);
    eg.button = context.lastElementChild;
    eg.popup = createPopup();
    eg.popup.Icon.classList.add(`fa-star`);
    eg.popup.Title.textContent = `Exclusive Giveaways`;
    eg.button.addEventListener(`click`, function() {
        eg.popup.popUp();
    });
    getExclusiveGiveaways(document);
    esgst.endlessFeatures.push(getExclusiveGiveaways);
}

function getExclusiveGiveaways(context) {
    var matches = context.querySelectorAll(`[href^="ESGST-"]`);
    var n = matches.length;
    if (n > 0) {
        eg.button.classList.remove(`esgst-hidden`);
        for (var i = 0; i < n; ++i) {
            var code = matches[i].getAttribute(`href`).match(/ESGST-(.+)/)[1];
            var decodedCode = decodeGiveawayCode(code);
            var html = `<a href="/giveaway/${decodedCode}/">/giveaway/${decodedCode}/</a>`;
            eg.popup.Description.insertAdjacentHTML(`afterBegin`, html);
        }
    }
}

function decodeGiveawayCode(code) {
    var decodedCode = ``;
    var separatedCode = code.split(`-`);
    for (var i = 0, n = separatedCode.length; i < n; ++i) {
        decodedCode += String.fromCharCode(parseInt(separatedCode[i], 16));
    }
    return rot(decodedCode, 13);
}

function encodeGiveawayCode(code) {
    var rotatedCode = rot(code, 13);
    var encodedCode = [];
    for (var i = 0, n = rotatedCode.length; i < n; ++i) {
        encodedCode.push(rotatedCode.charCodeAt(i).toString(16));
    }
    return encodedCode.join(`-`);
}

function rot(string, n) {
    return string.replace(/[a-zA-Z]/g, function (char) {
        return String.fromCharCode(((char <= `Z`) ? 90 : 122) >= ((char = char.charCodeAt(0) + n)) ? char : (char - 26));
    });
}
