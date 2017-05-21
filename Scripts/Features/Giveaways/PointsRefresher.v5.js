function loadPointsRefresher() {
    var Points, PR, Title, Background, Interval;
    Points = document.getElementsByClassName("nav__points")[0];
    PR = {};
    PR.LastPoints = -1;
    Title = document.getElementsByTagName("title")[0].textContent;
    Background = GM_getValue("PR_B");
    Interval = setInterval(function() {
        refreshPRPoints(Points, PR, Title, Background);
    }, 60000);
    window.addEventListener("focus", function() {
        refreshPRPoints(Points, PR, Title, Background);
        if (!Background && !Interval) {
            Interval = setInterval(function() {
                refreshPRPoints(Points, PR, Title, Background);
            }, 60000);
        }
    });
    if (!Background) {
        window.addEventListener("blur", function() {
            clearInterval(Interval);
        });
    }
}

function refreshPRPoints(Points, PR, Title, Background) {
    var Callback;
    Callback = function(Response) {
        var NumPoints, Matches, I, N, Context;
        NumPoints = parseJSON(Response.responseText).points;
        Points.textContent = NumPoints;
        if (PR.LastPoints != NumPoints) {
            PR.LastPoints = NumPoints;
            updateELGBButtons(NumPoints);
            if (Background) {
                if (document.hasFocus()) {
                    PR.LastPoints = -1;
                    document.getElementsByTagName("title")[0].textContent = Title;
                } else {
                    document.getElementsByTagName("title")[0].textContent = "(" + NumPoints + "P) " + Title;
                }
            }
        } else if (document.hasFocus()) {
            PR.LastPoints = -1;
            document.getElementsByTagName("title")[0].textContent = Title;
        }
    };
    makeRequest("xsrf_token=" + esgst.xsrfToken + "&do=entry_insert", "/ajax.php", null, Callback);
}
