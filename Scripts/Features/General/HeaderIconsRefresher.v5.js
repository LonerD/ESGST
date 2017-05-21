function loadHeaderIconsRefresher() {
    var CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons, Interval;
    HIR = {};
    if (esgst.sg) {
        HIR.Name = `Sg`;
        CreatedIcon = document.getElementsByClassName("nav__right-container")[0].firstElementChild;
        WonIcon = CreatedIcon.nextElementSibling;
        MessagesIcon = WonIcon.nextElementSibling;
    } else {
        HIR.Name = `St`;
        MessagesIcon = esgst.header.getElementsByClassName(`fa-envelope`)[0].parentElement.parentElement;
    }
    HIR.LastCount = 0;
    Background = esgst.hir_b;
    refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons);
    Interval = setInterval(function() {
        refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons);
    }, 60000);
    window.addEventListener("focus", function() {
        refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons);
        if (!Background && !Interval) {
            Interval = setInterval(function() {
                refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons);
            }, 60000);
        }
    });
    if (!Background) {
        window.addEventListener("blur", function() {
            clearInterval(Interval);
        });
    }
}

function refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons) {
    var Callback;
    Callback = function(Response) {
        var ResponseHTML, Created, Won, Matches, I, N, Context, Messages, Count;
        ResponseHTML = parseHTML(Response.responseText);
        if (esgst.sg) {
            Created = ResponseHTML.getElementsByClassName("nav__right-container")[0].firstElementChild;
            Won = Created.nextElementSibling;
            Messages = Won.nextElementSibling;
            CreatedIcon.className = Created.className;
            CreatedIcon.innerHTML = Created.innerHTML;
            WonIcon.className = Won.className;
            WonIcon.innerHTML = Won.innerHTML;
            if (esgst.dgn) {
                notifyDGNGift(ResponseHTML, WonIcon);
            }
        } else {
            Messages = ResponseHTML.getElementsByTagName(`header`)[0].getElementsByClassName(`fa-envelope`)[0].parentElement.parentElement;
        }
        MessagesIcon.className = Messages.className;
        MessagesIcon.innerHTML = Messages.innerHTML;
        Count = MessagesIcon.getElementsByClassName(esgst.sg ? "nav__notification" : "message_count")[0];
        Count = Count ? parseInt(Count.textContent) : 0;
        if (HIR.LastCount != Count) {
            HIR.LastCount = Count;
            if (Background) {
                if (document.hasFocus()) {
                    HIR.LastCount = 0;
                    document.querySelector("link[rel='shortcut icon']").href = GM_getResourceURL(`${esgst.name}Icon`);
                } else {
                    if (Count > 9) {
                        Count = 0;
                    }
                    document.querySelector("link[rel='shortcut icon']").href = GM_getResourceURL(`hir${HIR.Name}Icon${Count}`);
                }
            }
        } else if (document.hasFocus()) {
            HIR.LastCount = 0;
            document.querySelector("link[rel='shortcut icon']").href = GM_getResourceURL(`${esgst.name}Icon`);
        }
    };
    makeRequest(null, esgst.sg ? "/giveaways/won" : "/", null, Callback);
}
