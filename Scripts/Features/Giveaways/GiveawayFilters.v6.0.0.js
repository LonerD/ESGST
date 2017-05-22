function loadGiveawayFilters() {
    var html = `
        <div class="pinned-giveaways__outer-wrap esgst-gf-container">
            <div class="pinned-giveaways__inner-wrap esgst-gf-box">
                <div class="esgst-gf-filters esgst-hidden">
                    <div class="esgst-gf-range-filters"></div>
                    <div class="esgst-gf-checkbox-filters"></div>
                    <div class="esgst-gf-category-filters"></div>
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
    var button = box.nextElementSibling;
    var expand = button.firstElementChild;
    var collapse = expand.nextElementSibling;
    esgst.gfFilteredCount = collapse.nextElementSibling;
    esgst.gfRangeFilters = [
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
    ];
    for (var i = 0, n = esgst.gfRangeFilters.length; i < n; ++i) {
        var rangeFilter = esgst.gfRangeFilters[i];
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
        var minKey = `gfMin${name}`;
        var maxKey = `gfMax${name}`;
        var minSavedValue = GM_getValue(`gf_min${name}`);
        var maxSavedValue = GM_getValue(`gf_max${name}`);
        esgst[minKey] = minSavedValue;
        esgst[maxKey] = maxSavedValue;
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
        minFilter.addEventListener(`change`, saveGfValue.bind(null, minKey, `gf_min${name}`, null));
        maxFilter.addEventListener(`change`, saveGfValue.bind(null, maxKey, `gf_max${name}`, null));
    }
    esgst.gfCheckboxFilters = [
        {
            name: `Region Restricted`,
            saveKey: `regionRestricted`,
            key: `gfRegionRestricted`
        },
        {
            name: `Entered`,
            saveKey: `entered`,
            key: `gfEntered`
        }
    ];
    for (var i = 0, n = esgst.gfCheckboxFilters.length; i < n; ++i) {
        var checkboxFilter = esgst.gfCheckboxFilters[i];
        var name = checkboxFilter.name;
        var saveKey = checkboxFilter.saveKey;
        var key = checkboxFilter.key;
        html = `
            <div class="esgst-gf-checkbox-filter">
                <span></span>
                <span>${name}</span>
            </div>
        `;
        checkboxFilters.insertAdjacentHTML(`beforeEnd`, html);
        var gfCheckboxFilter = checkboxFilters.lastElementChild;
        var checkbox = gfCheckboxFilter.firstElementChild;
        var value = GM_getValue(`gf_${saveKey}`);
        esgst[key] = value;
        var input = createCheckbox(checkbox, value).Checkbox;
        checkbox.addEventListener(`click`, saveGfValue.bind(null, key, `gf_${saveKey}`, input))
    }
    if (esgst.gc) {
        esgst.gfCategoryFilters = [
            {
                id: `gc_b`,
                name: esgst.gc_b_r ? `Not Bundled` : `Bundled`,
                saveKey: `bundled`,
                key: `gfBundled`
            },
            {
                id: `gc_tc`,
                name: `Trading Cards`,
                saveKey: `tradingCards`,
                key: `gfTradingCards`
            },
            {
                id: `gc_a`,
                name: `Achievements`,
                saveKey: `achievements`,
                key: `gfAchievements`
            },
            {
                id: `gc_mp`,
                name: `Multiplayer`,
                saveKey: `multiplayer`,
                key: `gfMultiplayer`
            },
            {
                id: `gc_sc`,
                name: `Steam Cloud`,
                saveKey: `steamCloud`,
                key: `gfSteamCloud`
            },
            {
                id: `gc_l`,
                name: `Linux`,
                saveKey: `linux`,
                key: `gfLinux`
            },
            {
                id: `gc_m`,
                name: `Mac`,
                saveKey: `mac`,
                key: `gfMac`
            },
            {
                id: `gc_dlc`,
                name: `DLC`,
                saveKey: `dlc`,
                key: `gfDlc`
            }
        ];
        for (var i = 0, n = esgst.gfCategoryFilters.length; i < n; ++i) {
            var categoryFilter = esgst.gfCategoryFilters[i];
            var id = categoryFilter.id;
            if (esgst[id]) {
                var name = categoryFilter.name;
                var saveKey = categoryFilter.saveKey;
                var key = categoryFilter.key;
                html = `
                    <div class="esgst-gf-category-filter">
                        <span></span>
                        <span>${name}</span>
                    </div>
                `;
                categoryFilters.insertAdjacentHTML(`beforeEnd`, html);
                var gfCategoryFilter = categoryFilters.lastElementChild;
                var checkbox = gfCategoryFilter.firstElementChild;
                var value = GM_getValue(`gf_${saveKey}`);
                esgst[key] = value;
                var input = createCheckbox(checkbox, value).Checkbox;
                checkbox.addEventListener(`click`, saveGfValue.bind(null, key, `gf_${saveKey}`, input));
            }
        }
    }
    button.addEventListener("click", toggleGfFilters.bind(null, filters, expand, collapse));
    filterGfGiveaways();
    esgst.endlessFeatures.push(filterGfGiveaways);
}

function saveGfValue(key, name, input, event) {
    var value;
    if (input) {
        value = input.checked;
    } else {
        value = parseInt(event.currentTarget.value);
    }
    esgst[key] = value;
    GM_setValue(name, value);
    filterGfGiveaways();
}

function filterGfGiveaways() {
    var giveaways = getGfGiveaways();
    for (var i = 0, n = giveaways.length; i < n; ++i) {
        var giveaway = giveaways[i];
        var filtered = false;
        for (var j = 0, numRangeFilters = esgst.gfRangeFilters.length; !filtered && (j < numRangeFilters); ++j) {
            var name = esgst.gfRangeFilters[j].name;
            var minKey = `gfMin${name}`;
            var maxKey = `gfMax${name}`;
            var key = name.toLowerCase();
            if ((giveaway[key] < esgst[minKey]) || (giveaway[key] > esgst[maxKey])) {
                filtered = true;
            }
        }
        for (var j = 0, numCheckboxFilters = esgst.gfCheckboxFilters.length; !filtered && (j < numCheckboxFilters); ++j) {
            var checkboxFilter = esgst.gfCheckboxFilters[j];
            var key = checkboxFilter.key;
            var saveKey = checkboxFilter.saveKey;
            if (!esgst[key] && giveaway[saveKey]) {
                filtered = true;
            }
        }
        if (esgst.gc) {
            for (var j = 0, numCategoryFilters = esgst.gfCategoryFilters.length; !filtered && (j < numCategoryFilters); ++j) {
                var categoryFilter = esgst.gfCategoryFilters[j];
                var key = categoryFilter.key;
                var saveKey = categoryFilter.saveKey;
                if (!esgst[key] && giveaway[saveKey]) {
                    filtered = true;
                }
            }
        }
        var count = parseInt(esgst.gfFilteredCount.textContent);
        if (filtered) {
            if (!giveaway.giveaway.classList.contains(`esgst-hidden`)) {
                esgst.gfFilteredCount.textContent = count + 1;
                giveaway.giveaway.classList.add(`esgst-hidden`);
            }
        } else if (giveaway.giveaway.classList.contains(`esgst-hidden`)) {
            esgst.gfFilteredCount.textContent = count - 1;
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
        if (context.firstElementChild.classList.contains(`esgst-faded`)) {
            giveaway.entered = true;
        }
        if (context.getElementsByClassName(`giveaway__column--region-restricted`)[0]) {
            giveaway.regionRestricted = true;
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
