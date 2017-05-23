var gf;

function loadGiveawayFilters() {
    var type = window.location.search.match(/type=(wishlist|group)/);
    if (type) {
        type = type[1].replace(/^(.)/, function(m, p1) {
            return p1.toUpperCase();
        });
    } else {
        type = ``;
    }
    gf = {
        type: type,
        rangeFilters: [
            {
                name: `Level`,
                minValue: 0,
                maxValue: 10
            },
            {
                name: `Entries`,
                minValue: 0
            },
            {
                name: `Copies`,
                minValue: 1
            },
            {
                name: `Points`,
                minValue: 0,
                maxValue: 300
            }
        ],
        checkboxFilters: [
            {
                name: `Pinned`,
                key: `pinned`
            },
            {
                name: `Group`,
                key: `group`
            },
            {
                name: `Whitelist`,
                key: `whitelist`
            },
            {
                name: `Region Restricted`,
                key: `regionRestricted`
            },
            {
                name: `Entered`,
                key: `entered`
            }
        ],
        categoryFilters: [
            {
                id: `gc_b`,
                name: esgst.gc_b_r ? `Not Bundled` : `Bundled`,
                key: `bundled`
            },
            {
                id: `gc_tc`,
                name: `Trading Cards`,
                key: `tradingCards`
            },
            {
                id: `gc_a`,
                name: `Achievements`,
                key: `achievements`
            },
            {
                id: `gc_mp`,
                name: `Multiplayer`,
                key: `multiplayer`
            },
            {
                id: `gc_sc`,
                name: `Steam Cloud`,
                key: `steamCloud`
            },
            {
                id: `gc_l`,
                name: `Linux`,
                key: `linux`
            },
            {
                id: `gc_m`,
                name: `Mac`,
                key: `mac`
            },
            {
                id: `gc_dlc`,
                name: `DLC`,
                key: `dlc`
            }
        ],
        exceptionFilters: [
            {
                name: `Pinned`,
                key: `exceptionPinned`
            },
            {
                name: `Group`,
                key: `exceptionGroup`
            },
            {
                name: `Whitelist`,
                key: `exceptionWhitelist`
            },
            {
                name: `Region Restricted`,
                key: `exceptionRegionRestricted`
            },
            {
                name: `Copies above`,
                key: `exceptionMultiple`
            }
        ]
    };
    var html = `
        <div class="pinned-giveaways__outer-wrap esgst-gf-container">
            <div class="pinned-giveaways__inner-wrap esgst-gf-box">
                <div class="esgst-gf-filters esgst-hidden">
                    <div class="esgst-gf-range-filters"></div>
                    <div class="esgst-gf-checkbox-filters"></div>
                    <div class="esgst-gf-category-filters"></div>
                    <div class="esgst-gf-exception-filters">
                        <div>Exceptions:</div>
                    </div>
                    <div>
                        <div><i class="fa fa-circle-o"></i> - Hide all.</div>
                        <div><i class="fa fa-circle"></i> - Show only.</div>
                        <div><i class="fa fa-check-circle"></i> - Show all.</div>
                    </div>
                </div>
            </div>
            <div class="pinned-giveaways__button esgst-gf-button">
                <span>Expand</span><span class="esgst-hidden">Collapse</span> giveaway filters (<span>0</span> giveaways currently filtered out).
            </div>
        </div>
    `;
    esgst.mainPageHeading.insertAdjacentHTML(`beforeBegin`, html);
    var container = esgst.mainPageHeading.previousElementSibling;
    var box = container.firstElementChild;
    var filters = box.firstElementChild;
    var rangeFilters = filters.firstElementChild;
    var checkboxFilters = rangeFilters.nextElementSibling;
    var categoryFilters = checkboxFilters.nextElementSibling;
    var exceptionFilters = categoryFilters.nextElementSibling;
    var button = box.nextElementSibling;
    var expand = button.firstElementChild;
    var collapse = expand.nextElementSibling;
    gf.filtered = collapse.nextElementSibling;
    for (var i = 0, n = gf.rangeFilters.length; i < n; ++i) {
        var rangeFilter = gf.rangeFilters[i];
        var name = rangeFilter.name;
        var minValue = rangeFilter.minValue;
        var maxValue = rangeFilter.maxValue;
        var values = ``;
        if (typeof minValue != `undefined`) {
            values += ` min="${minValue}"`;
        }
        if (typeof maxValue != `undefined`) {
            values += ` max="${maxValue}"`;
        }
        var minKey = `min${name}`;
        var maxKey = `max${name}`;
        var minSavedValue = GM_getValue(`gf_${minKey}${gf.type}`);
        var maxSavedValue = GM_getValue(`gf_${maxKey}${gf.type}`);
        gf[minKey] = minSavedValue;
        gf[maxKey] = maxSavedValue;
        html = `
            <div class="esgst-gf-range-filter">
                <div>Min ${name} <input ${values} type="number" value="${minSavedValue}"></div>
                <div>Max ${name} <input ${values} type="number" value="${maxSavedValue}"></div>
            </div>
        `;
        rangeFilters.insertAdjacentHTML(`beforeEnd`, html);
        var gfRangeFilter = rangeFilters.lastElementChild;
        var minFilter = gfRangeFilter.firstElementChild.firstElementChild;
        var maxFilter = gfRangeFilter.lastElementChild.firstElementChild;
        minFilter.addEventListener(`change`, saveGfValue.bind(null, minKey, `gf_${minKey}${gf.type}`, null));
        maxFilter.addEventListener(`change`, saveGfValue.bind(null, maxKey, `gf_${maxKey}${gf.type}`, null));
    }
    for (var i = 0, n = gf.checkboxFilters.length; i < n; ++i) {
        var checkboxFilter = gf.checkboxFilters[i];
        var name = checkboxFilter.name;
        var key = checkboxFilter.key;
        html = `
            <div class="esgst-gf-checkbox-filter">
                <span>${name}</span>
            </div>
        `;
        checkboxFilters.insertAdjacentHTML(`beforeEnd`, html);
        var gfCheckboxFilter = checkboxFilters.lastElementChild;
        var value = GM_getValue(`gf_${key}${gf.type}`);
        gf[key] = value;
        var checkbox = createCheckbox_v6(gfCheckboxFilter, value, true);
        checkbox.checkbox.addEventListener(`click`, saveGfValue.bind(null, key, `gf_${key}${gf.type}`, checkbox));
    }
    if (esgst.gc) {
        for (var i = 0, n = gf.categoryFilters.length; i < n; ++i) {
            var categoryFilter = gf.categoryFilters[i];
            var id = categoryFilter.id;
            if (esgst[id]) {
                var name = categoryFilter.name;
                var key = categoryFilter.key;
                html = `
                    <div class="esgst-gf-category-filter">
                        <span>${name}</span>
                    </div>
                `;
                categoryFilters.insertAdjacentHTML(`beforeEnd`, html);
                var gfCategoryFilter = categoryFilters.lastElementChild;
                var value = GM_getValue(`gf_${key}${gf.type}`);
                gf[key] = value;
                var checkbox = createCheckbox_v6(gfCategoryFilter, value, true);
                checkbox.checkbox.addEventListener(`click`, saveGfValue.bind(null, key, `gf_${key}${gf.type}`, checkbox));
            }
        }
    }
    for (var i = 0, n = gf.exceptionFilters.length; i < n; ++i) {
        var exceptionFilter = gf.exceptionFilters[i];
        var name = exceptionFilter.name;
        var key = exceptionFilter.key;
        html = `
            <div class="esgst-gf-exception-filter">
                <span>${name} ${(key == `exceptionMultiple`) ? `<input type="number" min="1">` : ``}</span>
            </div>
        `;
        exceptionFilters.insertAdjacentHTML(`beforeEnd`, html);
        var gfExceptionFilter = exceptionFilters.lastElementChild;
        var value = GM_getValue(`gf_${key}${gf.type}`);
        gf[key] = value;
        var checkbox = createCheckbox_v6(gfExceptionFilter, value);
        checkbox.checkbox.addEventListener(`click`, saveGfValue.bind(null, key, `gf_${key}${gf.type}`, checkbox));
        if (key == `exceptionMultiple`) {
            var input = gfExceptionFilter.lastElementChild.lastElementChild;
            var value = GM_getValue(`gf_exceptionMultipleCopies${gf.type}`);
            input.value = value;
            gf.exceptionMultipleCopies = value;
            input.addEventListener(`change`, saveGfValue.bind(null, `exceptionMultipleCopies`, `gf_exceptionMultipleCopies${gf.type}`, null));
        }
    }
    button.addEventListener("click", toggleGfFilters.bind(null, filters, expand, collapse));
    filterGfGiveaways();
    esgst.endlessFeatures.push(filterGfGiveaways);
}

function saveGfValue(key, name, checkbox, event) {
    var value;
    if (checkbox) {
        value = checkbox.value;
    } else {
        value = parseInt(event.currentTarget.value);
    }
    gf[key] = value;
    GM_setValue(name, value);
    filterGfGiveaways();
}

function filterGfGiveaways() {
    var giveaways = getGfGiveaways();
    for (var i = 0, n = giveaways.length; i < n; ++i) {
        var giveaway = giveaways[i];
        var count = parseInt(gf.filtered.textContent);
        var filtered = false;
        if ((giveaway.pinned && !gf.exceptionPinned) ||
            (giveaway.group && !gf.exceptionGroup) ||
            (giveaway.whitelist && !gf.exceptionWhitelist) ||
            (giveaway.regionRestricted && !gf.exceptionRegionRestricted) ||
            ((giveaway.copies > gf.exceptionMultipleCopies) && !gf.exceptionMultiple) ||
            (!giveaway.pinned && !giveaway.group && !giveaway.whitelist && !giveaway.regionRestricted && (giveaway.copies <= gf.exceptionMultipleCopies))
        ) {
            for (var j = 0, numRangeFilters = gf.rangeFilters.length; !filtered && (j < numRangeFilters); ++j) {
                var name = gf.rangeFilters[j].name;
                var minKey = `min${name}`;
                var maxKey = `max${name}`;
                var key = name.toLowerCase();
                if ((giveaway[key] < gf[minKey]) || (giveaway[key] > gf[maxKey])) {
                    filtered = true;
                }
            }
            if (esgst.gc) {
                for (var j = 0, numCategoryFilters = gf.categoryFilters.length; !filtered && (j < numCategoryFilters); ++j) {
                    var categoryFilter = gf.categoryFilters[j];
                    var key = categoryFilter.key;
                    if (((gf[key] == `disabled`) && giveaway[key]) || ((gf[key] == `none`) && !giveaway[key])) {
                        filtered = true;
                    }
                }
            }
        }
        for (var j = 0, numCheckboxFilters = gf.checkboxFilters.length; !filtered && (j < numCheckboxFilters); ++j) {
            var checkboxFilter = gf.checkboxFilters[j];
            var key = checkboxFilter.key;
            if (((gf[key] == `disabled`) && giveaway[key]) || ((gf[key] == `none`) && !giveaway[key])) {
                filtered = true;
            }
        }
        if (filtered) {
            if (!giveaway.giveaway.classList.contains(`esgst-hidden`)) {
                gf.filtered.textContent = count + 1;
                giveaway.giveaway.classList.add(`esgst-hidden`);
            }
        } else if (giveaway.giveaway.classList.contains(`esgst-hidden`)) {
            gf.filtered.textContent = count - 1;
            giveaway.giveaway.classList.remove(`esgst-hidden`);
        }
    }
}

function toggleGfFilters(filters, expand, collapse) {
    filters.classList.toggle("esgst-hidden");
    expand.classList.toggle("esgst-hidden");
    collapse.classList.toggle("esgst-hidden");
}

function getGfGiveaways() {
    var giveaways = [];
    var matches = document.getElementsByClassName(`giveaway__row-outer-wrap`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        var context = matches[i];
        var giveaway = {
            giveaway: context
        };
        var level = context.getElementsByClassName(`giveaway__column--contributor-level`)[0];
        if (level) {
            giveaway.level = parseInt(level.textContent.match(/\d+/));
        } else {
            giveaway.level = 0;
        }
        giveaway.entries = parseInt(context.getElementsByClassName(`giveaway__links`)[0].firstElementChild.lastElementChild.textContent.replace(/,/g, ``).match(/\d+/));
        var headingThins = context.getElementsByClassName(`giveaway__heading__thin`);
        var copies = 0, points = 0;
        for (var j = 0, nt = headingThins.length; j < nt; ++j) {
            var copiesMatch = headingThins[j].textContent.match(/(\d+) Copies/);
            var pointsMatch = headingThins[j].textContent.match(/(\d+)P/);
            if (copiesMatch) {
                copies = parseInt(copiesMatch[1]);
            } else if (pointsMatch) {
                points = parseInt(pointsMatch[1]);
            }
        }
        if (!copies) {
            copies = 1;
        }
        giveaway.copies = copies;
        giveaway.points = points;
        if (context.getElementsByClassName(`giveaway__row-inner-wrap`)[0].classList.contains(`esgst-faded`)) {
            giveaway.entered = true;
        }
        if (context.getElementsByClassName(`giveaway__column--region-restricted`)[0]) {
            giveaway.regionRestricted = true;
        }
        if (context.getElementsByClassName(`giveaway__column--whitelist`)[0]) {
            giveaway.whitelist = true;
        }
        if (context.getElementsByClassName(`giveaway__column--group`)[0]) {
            giveaway.group = true;
        }
        if (context.closest(`.pinned-giveaways__outer-wrap`)) {
            giveaway.pinned = true;
        }
        if (esgst.gc) {
            var categories = [`bundled`, `tradingCards`, `achievements`, `multiplayer`, `steamCloud`, `linux`, `mac`, `dlc`];
            for (var j = 0, numCategories = categories.length; j < numCategories; ++j) {
                var id = categories[j];
                if (context.getElementsByClassName(`esgst-gc ${id}`)[0]) {
                    giveaway[id] = true;
                }
            }
        }
        giveaways.push(giveaway);
    }
    return giveaways;
}
