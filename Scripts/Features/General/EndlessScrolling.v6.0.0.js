function loadEndlessScrolling() {
    var pagination, context, currentPage, nextPage, reversePages,
        esPageHeading, title,
        mainPageBottom, mainSearchUrlBackup, mainTitleBackup, mainPaginationNavigationBackup,
        esRefreshButton, esPauseButton;
    pagination = esgst.pagination;
    context = pagination.previousElementSibling;
    if (esgst.paginationNavigation) {
        if (esgst.es_rs && esgst.discussionPath) {
            if (esgst.currentPage == 1) {
                pagination.classList.add(`esgst-hidden`);
                context.classList.add(`esgst-hidden`);
                currentPage = parseInt(esgst.paginationNavigation.lastElementChild.getAttribute(`data-page-number`));
                nextPage = currentPage;
                reversePages = true;
                activateEndlessScrolling();
            } else {
                reverseComments(context);
                currentPage = esgst.currentPage;
                nextPage = currentPage - 1;
                reversePages = false;
                activateEndlessScrolling();
            }
        } else if (!esgst.paginationNavigation.lastElementChild.classList.contains(esgst.selectedClass)) {
            currentPage = esgst.currentPage;
            nextPage = currentPage + 1;
            activateEndlessScrolling();
        }
    } else if (esgst.es_rs && esgst.discussionPath) {
        reverseComments(context);
    }

    function activateEndlessScrolling() {
        var html;
        if (!esgst.fmph) {
            loadFixedMainPageHeading();
        }
        if (!esgst.pnot) {
            loadPaginationNavigationOnTop();
        }
        esgst.mainPageHeadingPlaceholder.id = `esgst-es-page-${currentPage}`;
        title = document.title.replace(/ - Page (\d+)/, ``);
        if (currentPage == 1) {
            mainSearchUrlBackup = esgst.originalUrl;
            mainTitleBackup = esgst.originalTitle;
        } else {
            mainSearchUrlBackup = `${esgst.searchUrl}${currentPage}`;
            mainTitleBackup = `${title} - Page ${currentPage}`;
        }
        window.history.replaceState({}, null, mainSearchUrlBackup);
        document.title = mainTitleBackup;
        mainPaginationNavigationBackup = esgst.paginationNavigation.innerHTML;
        document.addEventListener(`scroll`, loadNextPage);
        if (!reversePages) {
            document.addEventListener(`scroll`, restoreMainPaginationNavigation);
        }
        html = `
            <div class="page_heading_btn esgst-es-refresh-button" title="Refresh the current page.">
                <i class="fa fa-refresh"></i>
            </div>
            <div class="page_heading_btn esgst-es-pause-button" title="Pause the endless scrolling.">
                <i class="fa fa-pause"></i>
            </div>
        `;
        esgst.mainPageHeading.insertAdjacentHTML(`beforeEnd`, html);
        esPauseButton = esgst.mainPageHeading.lastElementChild;
        esRefreshButton = esPauseButton.previousElementSibling;
        esRefreshButton.addEventListener(`click`, refreshPage);
        esPauseButton.addEventListener(`click`, pauseEndlessScrolling);
        setEsPaginationNavigation();
        window.setTimeout(loadNextPage, 0);
    }

    function loadNextPage() {
        var html;
        if (window.scrollY >= (document.body.offsetHeight - (window.innerHeight * 2))) {
            document.removeEventListener(`scroll`, loadNextPage);
            if (reversePages) {
                html = `
                    <div>
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                        <span>Reversing pages...</span>
                    </div>
                `;
                esgst.mainPageHeading.insertAdjacentHTML(`afterBegin`, html);
                esPageHeading = esgst.mainPageHeading.firstElementChild;
            } else {
                html = `
                    <div class="${esgst.pageHeadingClass} esgst-es-page-heading">
                        <div class="${esgst.pageHeadingBreadcrumbsClass}">
                            <i class="fa fa-circle-o-notch fa-spin"></i>
                            <span>Loading next page...</span>
                        </div>
                    </div>
                `;
                pagination.insertAdjacentHTML(`afterEnd`, html);
                esPageHeading = pagination.nextElementSibling;
            }
            makeRequest(null, `${esgst.searchUrl}${nextPage}`, null, setNextPage);
        }
    }

    function setNextPage(response) {
        var responseHtml, previousPaginationBackup, paginationNavigation, paginationNavigationBackup,
            searchUrlBackup, titleBackup, paginationBackup, parent;
        responseHtml = parseHTML(response.responseText);
        previousPaginationBackup = pagination;
        pagination = responseHtml.getElementsByClassName(`pagination`)[0];
        context = pagination.previousElementSibling;
        loadEndlessFeatures(context);
        setESHide(context);
        setESRemoveEntry(context);
        paginationNavigation = pagination.getElementsByClassName(esgst.paginationNavigationClass)[0];
        paginationNavigationBackup = paginationNavigation.innerHTML;
        searchUrlBackup = `${esgst.searchUrl}${nextPage}`;
        titleBackup = `${title} - Page ${nextPage}`;
        paginationBackup = pagination;
        if (reversePages) {
            esPageHeading.remove();
            esPageHeading = esgst.pagination;
            esgst.paginationNavigation.innerHTML = paginationNavigationBackup;
            setEsPaginationNavigation();
            reversePages = false;
        } else {
            esPageHeading.firstElementChild.innerHTML = `
                <a href="${esgst.searchUrl}${nextPage}">Page ${nextPage}</a>
            `;
            esPageHeading.id = `esgst-es-page-${nextPage}`;
        }
        parent = esPageHeading.parentElement;
        parent.insertBefore(context, esPageHeading.nextElementSibling);
        parent.insertBefore(pagination, context.nextElementSibling);
        if (esgst.es_rs && esgst.discussionPath) {
            reverseComments(context);
            --nextPage;
            if (nextPage > 0) {
                document.addEventListener(`scroll`, loadNextPage);
            }
        } else {
            ++nextPage;
            if (!paginationNavigation.lastElementChild.classList.contains(esgst.selectedClass)) {
                document.addEventListener(`scroll`, loadNextPage);
            }
        }
        paginationNavigation.remove();
        document.addEventListener(`scroll`, changePaginationNavigation);
        loadNextPage();

        function changePaginationNavigation() {
            var pageTop, pageBottom;
            pageTop = previousPaginationBackup.offsetTop - esgst.pageTop;
            pageBottom = paginationBackup.offsetTop;
            if ((window.scrollY >= pageTop) && (window.scrollY <= pageBottom)) {
                if (window.location.href != searchUrlBackup) {
                    window.history.replaceState({}, null, searchUrlBackup);
                    document.title = titleBackup;
                    esgst.paginationNavigation.innerHTML = paginationNavigationBackup;
                    setEsPaginationNavigation();
                }
            }
        }
    }

    function restoreMainPaginationNavigation() {
        var mainPageBottom;
        mainPageBottom = esgst.pagination.offsetTop;
        if ((window.scrollY >= 0) && (window.scrollY <= mainPageBottom)) {
            if (window.location.href != mainSearchUrlBackup) {
                window.history.replaceState({}, null, mainSearchUrlBackup);
                document.title = mainTitleBackup;
                esgst.paginationNavigation.innerHTML = mainPaginationNavigationBackup;
                setEsPaginationNavigation();
            }
        }
    }

    function refreshPage() {
        var page;
        esRefreshButton.removeEventListener(`click`, refreshPage);
        esRefreshButton.innerHTML = `
            <i class="fa fa-circle-o-notch fa-spin"></i>
        `;
        page = window.location.href.match(/page=(\d+)/);
        if (page) {
            page = page[1];
        } else {
            page = 1;
        }
        makeRequest(null, window.location.href, null, setRefreshedPage);

        function setRefreshedPage(response) {
            var responseHtml, new_context, element, parent;
            responseHtml = parseHTML(response.responseText);
            newContext = responseHtml.getElementsByClassName(`pagination`)[0].previousElementSibling;
            loadEndlessFeatures(newContext);
            setESHide(newContext);
            setESRemoveEntry(newContext);
            if (esgst.es_rs && esgst.discussionPath) {
                reverseComments(newContext);
            }
            element = document.getElementById(`esgst-es-page-${page}`);
            if (element.classList.contains(`esgst-fmph-placeholder`)) {
                element = esgst.pagination.previousElementSibling.previousElementSibling;
            }
            element.nextElementSibling.remove();
            parent = element.parentElement;
            parent.insertBefore(newContext, element.nextElementSibling);
            esRefreshButton.innerHTML = `
                <i class="fa fa-refresh"></i>
            `;
            esRefreshButton.addEventListener(`click`, refreshPage);
        }
    }

    function pauseEndlessScrolling() {
        document.removeEventListener(`scroll`, loadNextPage);
        esPauseButton.removeEventListener(`click`, pauseEndlessScrolling);
        esPauseButton.title = `Resume the endless scrolling.`;
        esPauseButton.innerHTML = `
            <i class="fa fa-play"></i>
        `;
        esPauseButton.addEventListener(`click`, resumeEndlessScrolling);
    }

    function resumeEndlessScrolling() {
        esPauseButton.removeEventListener(`click`, resumeEndlessScrolling);
        esPauseButton.title = `Pause the endless scrolling.`;
        esPauseButton.innerHTML = `
            <i class="fa fa-pause"></i>
        `;
        esPauseButton.addEventListener(`click`, pauseEndlessScrolling);
        document.addEventListener(`scroll`, loadNextPage);
        loadNextPage();
    }
}

function reverseComments(context) {
    var i, n;
    var frag = document.createDocumentFragment();
    for (i = 0, n = context.children.length; i < n; ++i) {
        frag.appendChild(context.lastElementChild);
    }
    context.appendChild(frag);
}

function setEsPaginationNavigation() {
    var matches, i, n;
    matches = esgst.paginationNavigation.children;
    for (i = 0, n = matches.length; i < n; ++i) {
        matches[i].addEventListener(`click`, setEsPaginationNavigationItem);
    }
}

function setEsPaginationNavigationItem(event) {
    var page, id;
    event.preventDefault();
    page = event.currentTarget.getAttribute(`data-page-number`);
    id = `esgst-es-page-${page}`;
    if (document.getElementById(id)) {
        window.location.hash = id;
    } else {
        window.location.href = event.currentTarget.getAttribute(`href`);
    }
}

function setESHide(Context) {
    var Matches, I, N;
    Matches = Context.getElementsByClassName("giveaway__hide trigger-popup");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Matches[I].addEventListener("click", function(Event) {
            var Popup, Giveaway;
            Popup = document.getElementsByClassName("popup--hide-games")[0];
            Giveaway = Event.currentTarget.closest(".giveaway__row-outer-wrap");
            Popup.querySelector("[name=game_id]").value = Giveaway.getAttribute("data-game-id");
            Popup.getElementsByClassName("popup__heading__bold")[0].textContent = Giveaway.getElementsByClassName("giveaway__heading__name")[0].textContent;
            $(Popup).bPopup().close();
            $(Popup).bPopup({
                amsl: [0],
                fadeSpeed: 200,
                followSpeed: 500,
                modalColor: "#3c424d",
                opacity: 0.85
            });
        });
    }
}

function setESRemoveEntry(Context) {
    var Matches, I, N;
    Matches = Context.getElementsByClassName("table__row-inner-wrap");
    for (I = 0, N = Matches.length; I < N; ++I) {
        removeESEntry(Matches[I]);
    }
}

function removeESEntry(Context) {
    var Default, Loading, Complete, Data;
    Default = Context.getElementsByClassName("table__remove-default")[0];
    if (Default) {
        Loading = Default.nextElementSibling;
        Complete = Loading.nextElementSibling;
        Default.addEventListener("click", function() {
            var Values, I, N;
            Default.classList.toggle("is-hidden");
            Loading.classList.toggle("is-hidden");
            Values = Context.getElementsByTagName("input");
            Data = "";
            for (I = 0, N = Values.length; I < N; ++I) {
                Data += Values[I].getAttribute("name") + "=" + Values[I].value + ((I < (N - 1)) ? "&" : "");
            }
            makeRequest(Data, "/ajax.php", null, function(Response) {
                Loading.classList.toggle("is-hidden");
                if (parseJSON(Response.responseText).type == "success") {
                    Context.classList.add("is-faded");
                    Complete.classList.toggle("is-hidden");
                } else {
                    Default.classList.toggle("is-hidden");
                }
            });
        });
    }
}

function loadEndlessFeatures(Context) {
    getUsersGames(Context);
    for (var i = 0, n = esgst.endlessFeatures.length; i < n; ++i) {
        esgst.endlessFeatures[i](Context);
    }
}
