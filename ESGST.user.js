// ==UserScript==
// @name ESGST
// @namespace ESGST
// @description Enhances SteamGifts and SteamTrades by adding some cool features to them.
// @icon https://github.com/revilheart/ESGST/raw/master/Resources/esgstIcon.ico
// @version 6.Beta.3.4
// @author revilheart
// @contributor Royalgamer06
// @downloadURL https://github.com/revilheart/ESGST/raw/master/ESGST.user.js
// @updateURL https://github.com/revilheart/ESGST/raw/master/ESGST.meta.js
// @match https://www.steamgifts.com/*
// @match https://www.steamtrades.com/*
// @connect api.steampowered.com
// @connect store.steampowered.com
// @connect script.google.com
// @connect script.googleusercontent.com
// @connect sgtools.info
// @connect steamcommunity.com
// @connect steamgifts.com
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_xmlhttpRequest
// @resource esgstIcon https://github.com/revilheart/ESGST/raw/master/Resources/esgstIcon.ico
// @resource sgIcon https://cdn.steamgifts.com/img/favicon.ico
// @resource stIcon https://cdn.steamtrades.com/img/favicon.ico
// @resource hirSgIcon0 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon0.ico
// @resource hirSgIcon1 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon1.ico
// @resource hirSgIcon2 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon2.ico
// @resource hirSgIcon3 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon3.ico
// @resource hirSgIcon4 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon4.ico
// @resource hirSgIcon5 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon5.ico
// @resource hirSgIcon6 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon6.ico
// @resource hirSgIcon7 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon7.ico
// @resource hirSgIcon8 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon8.ico
// @resource hirSgIcon9 https://github.com/revilheart/ESGST/raw/master/Resources/hirSgIcon9.ico
// @resource hirStIcon0 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon0.ico
// @resource hirStIcon1 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon1.ico
// @resource hirStIcon2 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon2.ico
// @resource hirStIcon3 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon3.ico
// @resource hirStIcon4 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon4.ico
// @resource hirStIcon5 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon5.ico
// @resource hirStIcon6 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon6.ico
// @resource hirStIcon7 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon7.ico
// @resource hirStIcon8 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon8.ico
// @resource hirStIcon9 https://github.com/revilheart/ESGST/raw/master/Resources/hirStIcon9.ico
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require https://github.com/dinbror/bpopup/raw/master/jquery.bpopup.min.js
// @require https://cdn.steamgifts.com/js/highcharts.js
// @noframes
// ==/UserScript==

try {
    // closest Polyfill
    if (window.Element && !window.Element.prototype.closest) {
        window.Element.prototype.closest = function(query) {
            var i;
            var matches = (this.document || this.ownerDocument).querySelectorAll(query);
            var element = this;
            do {
                i = matches.length - 1;
                while ((i >= 0) && (matches[i] != element)) {
                    --i;
                }
            } while ((i < 0) && (element = element.parentElement));
            return element;
        };
    }

    // Script Execution
    var esgst = {};
    loadEsgst();

    // Page Events
    window.addEventListener("beforeunload", function(event) {
        if (document.getElementsByClassName("rhBusy")[0]) {
            event.returnValue = true;
            return true;
        }
    });
    window.addEventListener("hashchange", function() {
        goToComment();
    });
} catch (error) {
    console.log(error);
    window.alert(`ESGST has failed to load. Check the console for more info.`);
}

function loadEsgst() {
    addStyles();
    esgst.sg = window.location.hostname.match(/www.steamgifts.com/);
    esgst.st = window.location.hostname.match(/www.steamtrades.com/);
    if (esgst.sg) {
        esgst.pageOuterWrapClass = `page__outer-wrap`;
        esgst.pageHeadingClass = `page__heading`;
        esgst.pageHeadingBreadcrumbsClass = `page__heading__breadcrumbs`;
        esgst.footer = document.getElementsByClassName(`footer__outer-wrap`)[0];
        esgst.replyBox = document.getElementsByClassName(`comment--submit`)[0];
        esgst.cancelButtonClass = `comment__cancel-button`;
        esgst.paginationNavigationClass = `pagination__navigation`;
        esgst.attachedImagesClass = `comment__toggle-attached`;
        esgst.hiddenClass = `is-hidden`;
        esgst.name = `sg`;
        esgst.selectedClass = `is-selected`;
    } else {
        esgst.pageOuterWrapClass = `page_outer_wrap`;
        esgst.pageHeadingClass = `page_heading`;
        esgst.pageHeadingBreadcrumbsClass = `page_heading_breadcrumbs`;
        esgst.footer = document.getElementsByTagName(`footer`)[0];
        esgst.replyBox = document.getElementsByClassName(`reply_form`)[0];
        esgst.cancelButtonClass = `btn_cancel`;
        esgst.paginationNavigationClass = `pagination_navigation`;
        esgst.attachedImagesClass = `view_attached`;
        esgst.hiddenClass = `is_hidden`;
        esgst.name = `st`;
        esgst.selectedClass = `is_selected`;
    }
    esgst.currentPage = window.location.href.match(/page=(\d+)/);
    if (esgst.currentPage) {
        esgst.currentPage = parseInt(esgst.currentPage[1]);
    } else {
        esgst.currentPage = 1;
    }
    var url = window.location.href.replace(window.location.search, ``).replace(window.location.hash, ``).replace(`/search`, ``);
    esgst.originalUrl = url;
    esgst.originalTitle = document.title;
    esgst.mainPath = window.location.pathname.match(/^\/$/);
    if (esgst.mainPath) {
        url += esgst.sg ? `giveaways` : `trades`;
    }
    url += `/search?`;
    var parameters = window.location.search.replace(/^\?/, ``).split(/&/);
    for (var i = 0, n = parameters.length; i < n; ++i) {
        if (parameters[i] && !parameters[i].match(/page/)) {
            url += parameters[i] + `&`;
        }
    }
    if (window.location.search) {
        esgst.originalUrl = url.replace(/&$/, ``);
        if (esgst.currentPage > 1) {
            esgst.originalUrl += `&page=${esgst.currentPage}`;
        }
    }
    url += `page=`;
    esgst.searchUrl = url;
    esgst.userPath = window.location.pathname.match(/^\/user\//);
    esgst.winnersPath = window.location.pathname.match(/^\/giveaway\/.+\/winners/);
    esgst.giveawaysPath = window.location.pathname.match(/^\/($|giveaways(?!.*\/(new|wishlist|created|entered|won)))/);
    esgst.giveawayCommentsPath = window.location.pathname.match(/^\/giveaway\/(?!.+\/(entries|winners|groups))/);
    esgst.discussionsTicketsTradesPath = (esgst.st && window.location.pathname.match(/^\/$/)) ||
        window.location.pathname.match(/^\/(discussions|support\/tickets|trades)/);
    esgst.originalHash = window.location.hash;
    esgst.discussionTicketTradeCommentsPath = window.location.pathname.match(/^\/(discussion|support\/ticket|trade)\//);
    esgst.archivePath = window.location.pathname.match(/^\/archive/);
    esgst.profilePath = window.location.pathname.match(/^\/account\/settings\/profile/);
    esgst.giveawayPath = window.location.pathname.match(/^\/giveaway\//);
    esgst.discussionPath = window.location.pathname.match(/^\/discussion\//);
    esgst.discussionsPath = window.location.pathname.match(/^\/discussions/);
    esgst.newGiveawayPath = window.location.pathname.match(/^\/giveaways\/new/);
    esgst.newTicketPath = window.location.pathname.match(/^\/support\/tickets\/new/);
    esgst.createdPath = window.location.pathname.match(/^\/giveaways\/created/);
    esgst.enteredPath = window.location.pathname.match(/^\/giveaways\/entered/);
    esgst.commentsPath = window.location.pathname.match(/^\/(giveaway\/(?!.*\/(entries|winners|groups))|discussion\/|support\/ticket\/|trade\/)/);
    esgst.accountPath = window.location.pathname.match(/^\/account/);
    esgst.inboxPath = window.location.pathname.match(/^\/messages/);
    esgst.groupsPath = window.location.pathname.match(/^\/account\/steam\/groups/);
    esgst.esgstHash = window.location.hash.match(/#ESGST/);
    esgst.header = document.getElementsByTagName(`header`)[0];
    esgst.pagination = document.getElementsByClassName(`pagination`)[0];
    esgst.featuredContainer = document.getElementsByClassName(`featured__container`)[0];
    esgst.pageOuterWrap = document.getElementsByClassName(esgst.pageOuterWrapClass)[0];
    esgst.paginationNavigation = document.getElementsByClassName(esgst.paginationNavigationClass)[0];
    esgst.sidebar = document.getElementsByClassName(`sidebar`)[0];
    esgst.activeDiscussions = document.getElementsByClassName(`widget-container--margin-top`)[0];
    esgst.pinnedGiveawaysButton = document.getElementsByClassName(`pinned-giveaways__button`)[0];
    var mainPageHeadingIndex;
    if (esgst.commentsPath) {
        mainPageHeadingIndex = 1;
    } else {
        mainPageHeadingIndex = 0;
    }
    esgst.mainPageHeading = document.getElementsByClassName(esgst.pageHeadingClass)[mainPageHeadingIndex];
    if (!esgst.mainPageHeading && mainPageHeadingIndex === 1) {
        esgst.mainPageHeading = document.getElementsByClassName(esgst.pageHeadingClass)[0];
    }
    if (esgst.userPath) {
        esgst.featuredHeading = document.getElementsByClassName(esgst.sg ? "featured__heading" : "page_heading")[0];
        esgst.steamButton = document.querySelector("a[href*='/profiles/']");
        esgst.user = {};
        esgst.user.ID = document.querySelector("[name='child_user_id']");
        if (esgst.user.ID) {
            esgst.user.ID = esgst.user.ID.value;
        }
        esgst.user.SteamID64 = esgst.steamButton.getAttribute("href").match(/\d+/)[0];
        esgst.user.Username = esgst.sg ? esgst.featuredHeading.textContent : "";
        var matches = document.getElementsByClassName("featured__table__row__left");
        for (var i = 0, n = matches.length; i < n; ++i) {
            var match = matches[i].textContent.match(/(Gifts (Won|Sent)|Contributor Level)/);
            if (match) {
                if (match[2]) {
                    if (match[2] == `Won`) {
                        esgst.wonRow = matches[i];
                    } else {
                        esgst.sentRow = matches[i];
                    }
                } else {
                    esgst.contributorLevelRow = matches[i];
                }
            }
        }
    }
    var logoutButton = document.getElementsByClassName(esgst.sg ? "js__logout" : "js_logout")[0];
    if (logoutButton) {
        esgst.xsrfToken = logoutButton.getAttribute("data-form").match(/xsrf_token=(.+)/)[1];
    }
    esgst.dateMonths = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
    esgst.pageTop = 25;
    esgst.commentsTop = 0;
    esgst.APBoxes = {};
    esgst.users = {};
    esgst.games = {};
    esgst.giveaways = [];
    esgst.oldValues = {
        sm_ebd: `SM_D`,
        fh: `FE_H`,
        fs: `FE_S`,
        fmph: `FE_HG`,
        ff: `FE_F`,
        hir: `HIR`,
        hir_b: `HIR_B`,
        hbs: `BSH`,
        vai: `VAI`,
        ev: `ev`,
        at: `AT`,
        at_g: `AT_G`,
        pnot: `pnot`,
        es: `ES`,
        es_gt: `ES_G`,
        es_gtc: `ES_GC`,
        es_dt: `ES_D`,
        es_dtc: `ES_DC`,
        es_r: `ES_R`,
        es_rs: `ES_RS`,
        dgn: `DGN`,
        pr: `PR`,
        pr_b: `PR_B`,
        hfc: `FCH`,
        ags: `AGS`,
        pgb: `PGB`,
        gf: `gf`,
        gv: `GV`,
        gp: `gp`,
        gpGwc: `GWC`,
        gpGdrbp: `GDCBP`,
        gpElgb: `ELGB`,
        gpGdrbp_eg: `GDCBP_EG`,
        gpGdrbp_d: `GDCBP_D`,
        ggp: `GGP`,
        gt: `GTS`,
        sgg: `SGG`,
        rcvc: `rcvc`,
        ugs: `UGS`,
        er: `ER`,
        er_s: `ER_S`,
        adot: `ADOT`,
        dh: `DH`,
        mpp: `MPP`,
        mpp_fv: `MPP_FV`,
        ded: `DED`,
        ch: `CH`,
        ct: `CT`,
        ct_g: `CT_G`,
        ct_lu: `CT_LU`,
        cfh: `CFH`,
        cfh_i: `CFH_I`,
        cfh_b: `CFH_B`,
        cfh_s: `CFH_S`,
        cfh_st: `CFH_ST`,
        cfh_h1: `CFH_H1`,
        cfh_h2: `CFH_H2`,
        cfh_h3: `CFH_H3`,
        cfh_bq: `CFH_BQ`,
        cfh_lb: `CFH_LB`,
        cfh_ol: `CFH_OL`,
        cfh_ul: `CFH_UL`,
        cfh_ic: `CFH_IC`,
        cfh_lc: `CFH_LC`,
        cfh_pc: `CFH_PC`,
        cfh_l: `CFH_L`,
        cfh_img: `CFH_IMG`,
        cfh_t: `CFH_T`,
        cfh_e: `CFH_E`,
        cfh_eg: `cfh_eg`,
        rbot: `rbot`,
        rbp: `MCBP`,
        mr: `MR`,
        rfi: `RFI`,
        rml: `RML`,
        ap: `AP`,
        uh: `UH`,
        un: `PUN`,
        rwscvl: `RWSCVL`,
        rwscvl_al: `RWSCVL_AL`,
        rwscvl_ro: `RWSCVL_RO`,
        ugd: `UGD`,
        gwl: `GWL`,
        gesl: `GESL`,
        as: `AS`,
        namwc: `NAMWC`,
        namwc_h: `NAWMC_H`,
        nrf: `NRF`,
        swr: `SWR`,
        luc: `LUC`,
        sgpb: `SGPB`,
        stpb: `STPB`,
        sgc: `SGC`,
        wbc: `WBC`,
        wbc_b: `WBC_B`,
        wbc_h: `WBC_H`,
        wbc_n: `wbc_n`,
        wbh: `WBH`,
        ut: `UH`,
        iwh: `IWH`,
        gh: `GH`,
        gs: `GS`,
        ggh: `EGH`,
        ggt: `GT`,
        gc: `gc`,
        gc_b: `gc`,
        gc_b_r: `gc_b_r`,
        gc_w: `gc_w`,
        gc_o: `gc_o`,
        gc_tc: `gc_tc`,
        gc_a: `gc_a`,
        gc_mp: `gc_mp`,
        gc_sc: `gc_sc`,
        gc_dlc: `gc_dlc`,
        gc_l: `gc_l`,
        gc_m: `gc_m`,
        gc_g: `gc_g`,
        mt: `MT`,
        eg: `eg`
    };
    esgst.defaultValues = {
        eg: true,
        sm_hb: true,
        sm_ebd: false,
        gp: true,
        gc_b_color: `#ffffff`,
        gc_w_color: `#ffffff`,
        gc_o_color: `#ffffff`,
        gc_tc_color: `#ffffff`,
        gc_a_color: `#ffffff`,
        gc_mp_color: `#ffffff`,
        gc_sc_color: `#ffffff`,
        gc_l_color: `#ffffff`,
        gc_m_color: `#ffffff`,
        gc_dlc_color: `#ffffff`,
        gc_g_color: `#ffffff`,
        gc_b_bgColor: `#7b241c`,
        gc_w_bgColor: `#f39c12`,
        gc_o_bgColor: `#2ecc71`,
        gc_tc_bgColor: `#1a5276`,
        gc_a_bgColor: `#117864`,
        gc_mp_bgColor: `#212f3c`,
        gc_sc_bgColor: `#196f3d`,
        gc_l_bgColor: `#9a7d0a`,
        gc_m_bgColor: `#935116`,
        gc_dlc_bgColor: `#63397a`,
        gc_g_bgColor: `#5f6a6a`,
        gf_minLevel: 0,
        gf_maxLevel: 10,
        gf_minEntries: 0,
        gf_maxEntries: 999999999,
        gf_minCopies: 1,
        gf_maxCopies: 999999999,
        gf_minPoints: 0,
        gf_maxPoints: 300,
        gf_pinned: `enabled`,
        gf_group: `enabled`,
        gf_whitelist: `enabled`,
        gf_regionRestricted: `enabled`,
        gf_entered: `enabled`,
        gf_bundled: `enabled`,
        gf_tradingCards: `enabled`,
        gf_achievements: `enabled`,
        gf_multiplayer: `enabled`,
        gf_steamCloud: `enabled`,
        gf_linux: `enabled`,
        gf_mac: `enabled`,
        gf_dlc: `enabled`,
        gf_exceptionWishlist: false,
        gf_exceptionPinned: false,
        gf_exceptionGroup: false,
        gf_exceptionWhitelist: false,
        gf_exceptionRegionRestricted: false,
        gf_exceptionMultiple: false,
        gf_exceptionMultipleCopies: 1,
        gf_minLevelWishlist:0,
        gf_maxLevelWishlist:10,
        gf_minEntriesWishlist:0,
        gf_maxEntriesWishlist:999999999,
        gf_minCopiesWishlist:1,
        gf_maxCopiesWishlist:999999999,
        gf_minPointsWishlist:0,
        gf_maxPointsWishlist:300,
        gf_pinnedWishlist:`enabled`,
        gf_groupWishlist:`enabled`,
        gf_whitelistWishlist:`enabled`,
        gf_regionRestrictedWishlist:`enabled`,
        gf_enteredWishlist:`enabled`,
        gf_bundledWishlist:`enabled`,
        gf_tradingCardsWishlist:`enabled`,
        gf_achievementsWishlist:`enabled`,
        gf_multiplayerWishlist:`enabled`,
        gf_steamCloudWishlist:`enabled`,
        gf_linuxWishlist:`enabled`,
        gf_macWishlist:`enabled`,
        gf_dlcWishlist:`enabled`,
        gf_exceptionWishlistWishlist: false,
        gf_exceptionPinnedWishlist:false,
        gf_exceptionGroupWishlist:false,
        gf_exceptionWhitelistWishlist:false,
        gf_exceptionRegionRestrictedWishlist:false,
        gf_exceptionMultipleWishlist:false,
        gf_exceptionMultipleCopiesWishlist:1,
        gf_minLevelGroup:0,
        gf_maxLevelGroup:10,
        gf_minEntriesGroup:0,
        gf_maxEntriesGroup:999999999,
        gf_minCopiesGroup:1,
        gf_maxCopiesGroup:999999999,
        gf_minPointsGroup:0,
        gf_maxPointsGroup:300,
        gf_pinnedGroup:`enabled`,
        gf_groupGroup:`enabled`,
        gf_whitelistGroup:`enabled`,
        gf_regionRestrictedGroup:`enabled`,
        gf_enteredGroup:`enabled`,
        gf_bundledGroup:`enabled`,
        gf_tradingCardsGroup:`enabled`,
        gf_achievementsGroup:`enabled`,
        gf_multiplayerGroup:`enabled`,
        gf_steamCloudGroup:`enabled`,
        gf_linuxGroup:`enabled`,
        gf_macGroup:`enabled`,
        gf_dlcGroup:`enabled`,
        gf_exceptionWishlistGroup: false,
        gf_exceptionPinnedGroup:false,
        gf_exceptionGroupGroup:false,
        gf_exceptionWhitelistGroup:false,
        gf_exceptionRegionRestrictedGroup:false,
        gf_exceptionMultipleGroup:false,
        gf_exceptionMultipleCopiesGroup:1,
        Avatar: "",
        Username: "",
        SteamID64: "",
        OwnedGames: [],
        Users: [],
        Games: {},
        Groups: [],
        LastRequest: 0,
        LastSave: 0,
        LastSync: 0,
        LastBundleSync: 0,
        SyncFrequency: 7,
        Comments: {},
        Comments_ST: {},
        Emojis: "",
        Rerolls: [],
        CommentHistory: "",
        StickiedGroups: [],
        Templates: [],
        Winners: {}
    };
    esgst.features = [
        // Order is important.
        {
            id: `sm_hb`,
            name: `Header Button`,
            check: getValue(`sm_hb`),
            load: loadHeaderButton
        },
        {
            id: `sm_ebd`,
            name: `Enable new features and functionalities by default.`,
            check: getValue(`sm_ebd`)
        },
        {
            id: `fh`,
            name: `Fixed Header`,
            check: getValue(`fh`),
            load: loadFixedHeader
        },
        {
            id: `fs`,
            name: `Fixed Sidebar`,
            check: getValue(`fs`) && esgst.sg && esgst.sidebar,
            load: loadFixedSidebar
        },
        {
            id: `fmph`,
            name: `Fixed Main Page Heading`,
            check: getValue(`fmph`) && esgst.mainPageHeading,
            load: loadFixedMainPageHeading
        },
        {
            id: `ff`,
            name: `Fixed Footer`,
            check: getValue(`ff`),
            load: loadFixedFooter
        },
        {
            id: `hir`,
            name: `Header Icons Refresher`,
            options: [
                {
                    id: `hir_b`,
                    name: `Run in the background and update the icon of the tab.`,
                    check: getValue(`hir_b`)
                }
            ],
            check: getValue(`hir`),
            load: loadHeaderIconsRefresher
        },
        {
            id: `hbs`,
            name: `Hidden Blacklist Stats`,
            check: getValue(`hbs`) && window.location.pathname.match(/^\/stats\/personal\/community/),
            load: loadHiddenBlacklistStats
        },
        {
            id: `vai`,
            name: `Visible Attached Images`,
            check: getValue(`vai`),
            load: loadVisibleAttachedImages,
            endless: true
        },
        {
            id: `ev`,
            name: `Embedded Videos`,
            check: getValue(`ev`),
            load: loadEmbeddedVideos
        },
        {
            id: `at`,
            name: `Accurate Timestamps`,
            options: [
                {
                    id: `at_g`,
                    name: `Enable in the main giveaway pages.`,
                    check: getValue(`at_g`)
                }
            ],
            check: getValue(`at`) && ((esgst.giveawaysPath && esgst.at_g) || !esgst.giveawaysPath),
            load: loadAccurateTimestamps,
            endless: true
        },
        {
            id: `pnot`,
            name: `Pagination Navigation On Top`,
            check: getValue(`pnot`) && esgst.paginationNavigation,
            load: loadPaginationNavigationOnTop
        },
        {
            id: `dgn`,
            name: `Delivered Gifts Notifier`,
            check: getValue(`dgn`),
            load: loadDeliveredGiftsNotifier
        },
        {
            id: `pr`,
            name: `Points Refresher`,
            options: [
                {
                    id: `pr_b`,
                    name: `Run in the background and update the title of the tab.`,
                    check: getValue(`pr_b`)
                }
            ],
            check: getValue(`pr`) && esgst.sg,
            load: loadPointsRefresher
        },
        {
            id: `hfc`,
            name: `Hidden Featured Container`,
            check: getValue(`hfc`) && esgst.featuredContainer && esgst.giveawaysPath,
            load: loadHiddenFeaturedContainer
        },
        {
            id: `ags`,
            name: `Advanced Giveaway Search`,
            check: getValue(`ags`) && esgst.sg && esgst.giveawaysPath,
            load: loadAdvancedGiveawaySearch
        },
        {
            id: `pgb`,
            name: `Pinned Giveaways Button`,
            check: getValue(`pgb`) && esgst.pinnedGiveawaysButton,
            load: loadPinnedGiveawaysButton
        },
        {
            id: `gf`,
            name: `Giveaway Filters`,
            check: getValue(`gf`) && esgst.sg && esgst.giveawaysPath && !window.location.search.match(/q=(.+)&/),
            load: loadGiveawayFilters
        },
        {
            id: `gv`,
            name: `Grid View`,
            check: getValue(`gv`) && esgst.giveawaysPath,
            load: loadGridView,
            endless: true
        },
        {
            id: `gp`,
            name: `Giveaway Panel`,
            options: [
                {
                    id: `gpGwc`,
                    name: `Giveaway Winning Chance`,
                    check: getValue(`gpGwc`)
                },
                {
                    id: `gpGdrbp`,
                    name: `Giveaway Description/Reply Box Popup`,
                    check: getValue(`gpGdrbp`)
                },
                {
                    id: `gpElgb`,
                    name: `Enter/Leave Giveaway Button`,
                    check: getValue(`gpElgb`)
                },
                {
                    id: `gpGdrbp_eg`,
                    name: `Pop the giveaway description up when entering a giveaway.`,
                    check: getValue(`gpGdrbp_eg`)
                },
                {
                    id: `gpGdrbp_d`,
                    name: `Only pop the giveaway description up if there is any.`,
                    check: getValue(`gpGdrbp_d`)
                }
            ],
            check: getValue(`gp`) && (esgst.gpGwc || esgst.gpGdrbp || esgst.gpElgb),
            load: loadGiveawayPanel,
            endless: true
        },
        {
            id: `ggp`,
            name: `Giveaway Groups Popup`,
            check: getValue(`ggp`) && esgst.sg,
            load: loadGiveawayGroupsPopup,
            endless: true
        },
        {
            id: `gt`,
            name: `Giveaway Templates`,
            check: getValue(`gt`) && esgst.sg && esgst.newGiveawayPath && !document.getElementsByClassName("table--summary")[0],
            load: loadGiveawayTemplates
        },
        {
            id: `sgg`,
            name: `Stickied Giveaway Groups`,
            check: getValue(`sgg`) && esgst.sg && (esgst.groupsPath || (esgst.newGiveawayPath && !document.getElementsByClassName("table--summary")[0])),
            load: loadStickiedGiveawayGroups
        },
        {
            id: `rcvc`,
            name: `Real CV Calculator`,
            check: getValue(`rcvc`) && esgst.newGiveawayPath,
            load: loadRealCvCalculator
        },
        {
            id: `ugs`,
            name: `Unsent Gifts Sender`,
            check: getValue(`ugs`) && esgst.sg && (esgst.newTicketPath || (esgst.createdPath && esgst.mainPageHeading)),
            load: loadUnsentGiftsSender
        },
        {
            id: `er`,
            name: `Entries Remover`,
            options: [
                {
                    id: `er_s`,
                    name: `Remove entries upon syncing.`,
                    check: getValue(`er_s`)
                }
            ],
            check: getValue(`er`) && ((esgst.mainPageHeading && esgst.enteredPath) || (esgst.er_s && esgst.profilePath)),
            load: loadEntriesRemover
        },
        {
            id: `gwl`,
            name: `Giveaway Winners Link`,
            check: getValue(`gwl`),
            load: loadGiveawayWinnersLink,
            endless: true
        },
        {
            id: `gesl`,
            name: `Giveaway Error Search Links`,
            check: getValue(`gesl`) && esgst.giveawayPath,
            load: loadGiveawayErrorSearchLinks
        },
        {
            id: `as`,
            name: `Archive Searcher`,
            check: getValue(`as`) && esgst.archivePath,
            load: loadArchiveSearcher
        },
        {
            id: `adot`,
            name: `Active Discussions On Top`,
            check: getValue(`adot`) && esgst.activeDiscussions,
            load: loadActiveDiscussionsOnTop
        },
        {
            id: `dh`,
            name: `Discussions Highlighter`,
            check: getValue(`dh`) && (esgst.discussionsPath || esgst.discussionPath),
            load: loadDiscussionsHighlighter
        },
        {
            id: `mpp`,
            name: `Main Post Popup`,
            options: [
                {
                    id: `mpp_fv`,
                    name: `Hide main post after first visit.`,
                    check: getValue(`mpp_fv`)
                }
            ],
            check: getValue(`mpp`) && esgst.discussionPath && esgst.mainPageHeading,
            load: loadMainPostPopup
        },
        {
            id: `ded`,
            name: `Discussion Edit Detector`,
            check: getValue(`ded`) && esgst.replyBox && !esgst.userPath,
            load: loadDiscussionEditDetector
        },
        {
            id: `ch`,
            name: `Comment History`,
            check: getValue(`ch`)
        },
        {
            id: `ct`,
            name: `Comment Tracker`,
            options: [
                {
                    id: `ct_g`,
                    name: `Fade out visited giveaways.`,
                    check: getValue(`ct_g`)
                },
                {
                    id: `ct_lu`,
                    name: `Go to the last unread comment of a discussion instead of the first one from the discussions page.`,
                    check: getValue(`ct_lu`)
                }
            ],
            check: getValue(`ct`),
            load: loadCommentTracker
        },
        {
            id: `cfh`,
            name: `Comment Formatting Helper`,
            options: [
                {
                    id: `cfh_i`,
                    name: `Italic`,
                    check: getValue(`cfh_i`)
                },
                {
                    id: `cfh_b`,
                    name: `Bold`,
                    check: getValue(`cfh_b`)
                },
                {
                    id: `cfh_s`,
                    name: `Spoiler`,
                    check: getValue(`cfh_s`)
                },
                {
                    id: `cfh_st`,
                    name: `Strikethrough`,
                    check: getValue(`cfh_st`)
                },
                {
                    id: `cfh_h1`,
                    name: `Heading 1`,
                    check: getValue(`cfh_h1`)
                },
                {
                    id: `cfh_h2`,
                    name: `Heading 2`,
                    check: getValue(`cfh_h2`)
                },
                {
                    id: `cfh_h3`,
                    name: `Heading 3`,
                    check: getValue(`cfh_h3`)
                },
                {
                    id: `cfh_bq`,
                    name: `Blockquote`,
                    check: getValue(`cfh_bq`)
                },
                {
                    id: `cfh_lb`,
                    name: `Line Break`,
                    check: getValue(`cfh_lb`)
                },
                {
                    id: `cfh_ol`,
                    name: `Ordered List`,
                    check: getValue(`cfh_ol`)
                },
                {
                    id: `cfh_ul`,
                    name: `Unordered List`,
                    check: getValue(`cfh_ul`)
                },
                {
                    id: `cfh_ic`,
                    name: `Inline Code`,
                    check: getValue(`cfh_ic`)
                },
                {
                    id: `cfh_lc`,
                    name: `Line Code`,
                    check: getValue(`cfh_lc`)
                },
                {
                    id: `cfh_pc`,
                    name: `Paragraph Code`,
                    check: getValue(`cfh_pc`)
                },
                {
                    id: `cfh_l`,
                    name: `Link`,
                    check: getValue(`cfh_l`)
                },
                {
                    id: `cfh_img`,
                    name: `Image`,
                    check: getValue(`cfh_img`)
                },
                {
                    id: `cfh_t`,
                    name: `Table`,
                    check: getValue(`cfh_t`)
                },
                {
                    id: `cfh_e`,
                    name: `Emojis`,
                    check: getValue(`cfh_e`)
                },
                {
                    id: `cfh_eg`,
                    name: `Exclusive Giveaways`,
                    check: getValue(`cfh_eg`)
                }
            ],
            check: getValue(`cfh`),
            load: loadCommentFormattingHelper,
            endless: true
        },
        {
            id: `rbot`,
            name: `Reply Box On Top`,
            check: getValue(`rbot`) && esgst.replyBox,
            load: loadReplyBoxOnTop
        },
        {
            id: `rbp`,
            name: `Reply Box Popup`,
            check: getValue(`rbp`) && esgst.replyBox && esgst.commentsPath,
            load: loadReplyBoxPopup
        },
        {
            id: `mr`,
            name: `Multi-Reply`,
            check: getValue(`mr`) && !esgst.inboxPath,
            load: loadMultiReply,
            endless: true
        },
        {
            id: `rfi`,
            name: `Reply From Inbox`,
            check: getValue(`rfi`) && esgst.inboxPath,
            load: loadMultiReply,
            endless: true
        },
        {
            id: `rml`,
            name: `Reply Mention Link`,
            check: getValue(`rml`),
            load: loadReplyMentionLink,
            endless: true
        },
        {
            id: `ap`,
            name: `Avatar Popout`,
            check: getValue(`ap`) && esgst.sg,
            load: loadAvatarPopout,
            endless: true
        },
        {
            id: `uh`,
            name: `Username History`,
            check: getValue(`uh`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadUsernameHistory,
            profile: true
        },
        {
            id: `un`,
            name: `User Notes`,
            check: getValue(`un`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadUserNotes,
            profile: true
        },
        {
            id: `rwscvl`,
            name: `Real Won/Sent CV Links`,
            options: [
                {
                    id: `rwscvl_al`,
                    name: `Automatically load real CV and show it on the profile.`,
                    check: getValue(`rwscvl_al`)
                },
                {
                    id: `rwscvl_ro`,
                    name: `Reverse order (from newest to oldest).`,
                    check: getValue(`rwscvl_ro`)
                }
            ],
            check: getValue(`rwscvl`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadRealWonSentCVLinks,
            profile: true
        },
        {
            id: `ugd`,
            name: `User Giveaways Data`,
            check: getValue(`ugd`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadUserGiveawaysData,
            profile: true
        },
        {
            id: `namwc`,
            name: `Not Activated/Multiple Wins Checker`,
            options: [
                {
                    id: `namwc_h`,
                    name: `Highlight users.`,
                    check: getValue(`namwc_h`)
                }
            ],
            check: getValue(`namwc`) && esgst.sg && (esgst.userPath || esgst.winnersPath || esgst.esgstHash || esgst.ap || esgst.namwc_h),
            load: loadNotActivatedMultipleWinsChecker
        },
        {
            id: `nrf`,
            name: `Not Received Finder`,
            check: getValue(`nrf`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadNotReceivedFinder,
            profile: true
        },
        {
            id: `swr`,
            name: `Sent/Won Ratio`,
            check: getValue(`swr`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadSentWonRatio,
            profile: true
        },
        {
            id: `luc`,
            name: `Level Up Calculator`,
            check: getValue(`luc`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadLevelUpCalculator,
            profile: true
        },
        {
            id: `sgpb`,
            name: `SteamGifts Profile Button`,
            check: getValue(`sgpb`) && esgst.st && esgst.userPath,
            load: loadSteamGiftsProfileButton,
            profile: true
        },
        {
            id: `stpb`,
            name: `SteamTrades Profile Button`,
            check: getValue(`stpb`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadSteamTradesProfileButton,
            profile: true
        },
        {
            id: `sgc`,
            name: `Shared Groups Checker`,
            check: getValue(`sgc`) && esgst.sg && (esgst.userPath || esgst.ap),
            load: loadSharedGroupsChecker,
            profile: true
        },
        {
            id: `wbc`,
            name: `Whitelist/Blacklist Checker`,
            options: [
                {
                    id: `wbc_b`,
                    name: `Show blacklist information.`,
                    check: getValue(`wbc_b`)
                },
                {
                    id: `wbc_h`,
                    name: `Highlight users who have whitelisted/blacklisted you.`,
                    check: getValue(`wbc_h`)
                },
                {
                    id: `wbc_n`,
                    name: `Save automatic notes to users that you have returned whitelist/blacklist for.`,
                    check: getValue(`wbc_n`)
                }
            ],
            check: getValue(`wbc`) && esgst.sg && esgst.mainPageHeading,
            load: loadWhitelistBlacklistChecker
        },
        {
            id: `wbh`,
            name: `Whitelist/Blacklist Highlighter`,
            check: getValue(`wbh`) && !esgst.accountPath,
            load: loadWhitelistBlacklistHighlighter,
            endless: true
        },
        {
            id: `ut`,
            name: `User Tags`,
            check: getValue(`ut`),
            load: loadUserTags,
            endless: true
        },
        {
            id: `iwh`,
            name: `Inbox Winners Highlighter`,
            check: getValue(`iwh`) && esgst.sg && (esgst.winnersPath || esgst.inboxPath),
            load: loadInboxWinnersHighlighter,
            endless: true
        },
        {
            id: `gh`,
            name: `Groups Highlighter`,
            check: getValue(`gh`) && esgst.sg && !esgst.accountPath,
            load: loadGroupsHighlighter,
            endless: true
        },
        {
            id: `gs`,
            name: `Groups Stats`,
            check: getValue(`gs`) && esgst.sg && esgst.groupsPath,
            load: loadGroupsStats,
            endless: true
        },
        {
            id: `ggh`,
            name: `Games Highlighter`,
            check: getValue(`ggh`) && esgst.sg,
            load: loadGamesHighlighter
        },
        {
            id: `ggt`,
            name: `Game Tags`,
            check: getValue(`ggt`) && esgst.sg,
            load: loadGameTags,
            endless: true
        },
        {
            id: `gc`,
            name: `Game Categories`,
            options: [
                {
                    id: `gc_b`,
                    name: `Bundled`,
                    options: [
                        {
                            id: `gc_b_r`,
                            name: `Reverse (show only if not bundled).`,
                            check: getValue(`gc_b_r`)
                        }
                    ],
                    check: getValue(`gc_b`)
                },
                {
                    id: `gc_w`,
                    name: `Wishlist`,
                    check: getValue(`gc_w`)
                },
                {
                    id: `gc_o`,
                    name: `Owned`,
                    check: getValue(`gc_o`)
                },
                {
                    id: `gc_tc`,
                    name: `Trading Cards`,
                    check: getValue(`gc_tc`)
                },
                {
                    id: `gc_a`,
                    name: `Achivements`,
                    check: getValue(`gc_a`)
                },
                {
                    id: `gc_mp`,
                    name: `Multiplayer`,
                    check: getValue(`gc_mp`)
                },
                {
                    id: `gc_sc`,
                    name: `Steam Cloud`,
                    check: getValue(`gc_sc`)
                },
                {
                    id: `gc_l`,
                    name: `Linux`,
                    check: getValue(`gc_l`)
                },
                {
                    id: `gc_m`,
                    name: `Mac`,
                    check: getValue(`gc_m`)
                },
                {
                    id: `gc_dlc`,
                    name: `DLC`,
                    check: getValue(`gc_dlc`)
                },
                {
                    id: `gc_g`,
                    name: `Genres`,
                    check: getValue(`gc_g`)
                }
            ],
            check: getValue(`gc`) && esgst.sg,
            load: loadGameCategories
        },
        {
            id: `mt`,
            name: `Multi-Tag`,
            check: getValue(`mt`) && (esgst.ut || esgst.ggt) && !esgst.accountPath && esgst.mainPageHeading,
            load: loadMultiTag
        },
        {
            id: `eg`,
            name: `Exclusive Giveaways`,
            check: getValue(`eg`) && esgst.sg,
            load: loadExclusiveGiveaways
        },
        {
            id: `es`,
            name: `Endless Scrolling`,
            options: [
                {
                    id: `es_g`,
                    name: `Enable in the main giveaway pages.`,
                    check: getValue(`es_g`)
                },
                {
                    id: `es_gc`,
                    name: `Enable in the giveaway comment pages.`,
                    check: getValue(`es_gc`)
                },
                {
                    id: `es_dtt`,
                    name: `Enable in the main discussion/ticket/trade pages.`,
                    check: getValue(`es_dtt`)
                },
                {
                    id: `es_dttc`,
                    name: `Enable in the discussion/ticket/trade comment pages.`,
                    check: getValue(`es_dttc`)
                },
                {
                    id: `es_r`,
                    name: `Enable in the rest of the pages.`,
                    check: getValue(`es_r`)
                },
                {
                    id: `es_rs`,
                    name: `Enable reverse scrolling for discussions.`,
                    check: getValue(`es_rs`)
                },
            ],
            check: getValue(`es`) && esgst.pagination && (
                (esgst.es_g && esgst.giveawaysPath) ||
                (esgst.es_gc && esgst.giveawayCommentsPath) ||
                (esgst.es_dtt && esgst.discussionsTicketsTradesPath) ||
                (esgst.es_dttc && esgst.discussionTicketTradeCommentsPath) ||
                (esgst.es_r && !esgst.giveawaysPath && !esgst.giveawayCommentsPath &&
                    !esgst.discussionsTicketsTradesPath && !esgst.discussionTicketTradeCommentsPath)
                ),
            load: loadEndlessScrolling
        }
    ];
    esgst.failedToLoad = [];
    esgst.endlessFeatures = [];
    esgst.profileFeatures = [];
    for (var key in esgst.defaultValues) {
        getValue(key);
    }
    if (esgst.accountPath) {
        addSMButton();
    }
    getUsersGames(document);
    fixFadedClass(document);
    esgst.endlessFeatures.push(fixFadedClass);
    loadFeatures();
    if (esgst.sg) {
        checkSync();
        updateGroups();
    }
    goToComment(esgst.originalHash);
}

function fixFadedClass(context) {
    var matches = context.getElementsByClassName(`giveaway__row-inner-wrap`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        if (matches[i].classList.contains(`is-faded`)) {
            matches[i].classList.remove(`is-faded`);
            matches[i].classList.add(`esgst-faded`);
        }
    }
}

function getUsersGames(Context) {
    var Matches, CurrentUsers, I, N, UserID, Match, SteamLink, Game, Title, CurrentGames, SavedUsers, SavedGames;
    Matches = Context.querySelectorAll("a[href*='/user/']");
    esgst.currentUsers = {};
    for (I = 0, N = Matches.length; I < N; ++I) {
        Match = Matches[I].getAttribute("href").match(/\/user\/(.+)/);
        if (Match) {
            UserID = Match[1];
            if (((esgst.sg && Matches[I].textContent == UserID) || (!esgst.sg && Matches[I].textContent && !Matches[I].children.length)) && !Matches[I].closest(".markdown")) {
                if (!esgst.users[UserID]) {
                    esgst.users[UserID] = [];
                }
                if (!esgst.currentUsers[UserID]) {
                    esgst.currentUsers[UserID] = [];
                }
                esgst.users[UserID].push(Matches[I]);
                esgst.currentUsers[UserID].push(Matches[I]);
            }
        }
    }
    Matches = Context.querySelectorAll(window.location.pathname.match(/^\/giveaway\//) ? ".featured__heading" : ".giveaway__heading, .table__column__heading");
    esgst.currentGames = {};
    for (I = 0, N = Matches.length; I < N; ++I) {
        Match = Matches[I];
        SteamLink = Match.querySelector("a[href*='store.steampowered.com']");
        if (SteamLink) {
            Game = SteamLink.getAttribute("href").match(/\d+/)[0];
            Title = Match.firstElementChild.textContent;
        } else if (!Match.classList.contains("giveaway__heading") && !window.location.pathname.match(/^\/giveaway\//)) {
            Title = Match.textContent;
            Game = Match.closest(".table__row-outer-wrap").getElementsByClassName("global__image-inner-wrap")[0];
            if (Game) {
                Game = Game.getAttribute("style").match(/\/(apps|subs)\/(.+)\//);
                if (Game) {
                    Game = Game[2];
                }
            }
            Match = Match.parentElement;
        }
        if (Game) {
            if (!esgst.games[Game]) {
                esgst.games[Game] = [];
            }
            if (!esgst.currentGames[Game]) {
                esgst.currentGames[Game] = [];
            }
            esgst.games[Game].push(Match);
            esgst.currentGames[Game].push({
                match: Match,
                title: Title
            });
        }
    }
}

function loadFeatures() {
    var features = esgst.features;
    for (var i = 0, n = features.length; i < n; ++i) {
        var feature = features[i];
        if (feature.check) {
            if (feature.load) {
                try {
                    feature.load(document);
                    if (feature.endless) {
                        esgst.endlessFeatures.push(feature.load);
                    }
                    if (feature.profile) {
                        esgst.profileFeatures.push(feature.load);
                    }
                } catch (error) {
                    console.log(error);
                    esgst.failedToLoad.push(feature.name);
                }
            }
        }
    }
    var numFailed = esgst.failedToLoad.length;
    if (numFailed > 0) {
        window.alert(`${numFailed} ESGST features failed to load: ${esgst.failedToLoad.join(`, `)}. Check the console for more info.`);
    }
}

function getValue(name) {
    var value = GM_getValue(name);
    if (typeof value == `undefined`) {
        var oldName = esgst.oldValues[name];
        var oldValue;
        if (oldName) {
            oldValue = GM_getValue(oldName);
        }
        if (typeof oldValue == `undefined`) {
            var defaultValue = esgst.defaultValues[name];
            if (typeof defaultValue == `undefined`) {
                value = esgst.sm_ebd;
            } else {
                value = defaultValue;
            }
        } else {
            value = oldValue;
        }
        GM_setValue(name, value);
    }
    esgst[name] = value;
    return value;
}

function getTimestamp(unixTimestamp) {
  var date = new Date(unixTimestamp * 1e3);
  var month = date.getMonth();
  var day = date.getDate();
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = `0${date.getMinutes()}`.slice(-2);
  var period;
  if (hours < 12) {
    period = `am`;
  } else {
    period = `pm`;
  }
  hours %= 12;
  if (hours === 0) {
    hours = 12;
  }
  return `${esgst.dateMonths[month]} ${day}, ${year}, ${hours}:${minutes}${period}`;
}

function queueRequest(Element, Data, URL, Callback) {
    var CurrentDate, HTML;
    HTML = Element.Progress ? Element.Progress.innerHTML : "";
    Element.Request = setInterval(function() {
        CurrentDate = new Date().getTime();
        if ((CurrentDate - GM_getValue("LastRequest")) > 5000) {
            clearInterval(Element.Request);
            GM_setValue("LastRequest", CurrentDate);
            if (Element.Progress) {
                Element.Progress.innerHTML = HTML;
            }
            makeRequest(Data, URL, Element.Progress, function(Response) {
                GM_setValue("LastRequest", 0);
                Callback(Response);
            });
        } else if (Element.Progress) {
            Element.Progress.innerHTML =
                "<i class=\"fa fa-clock-o\"></i> " +
                "<span>Waiting for a free request slot...</span>";
        }
    }, 500);
}

function makeRequest(Data, URL, Context, Callback) {
    GM_xmlhttpRequest({
        data: Data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: (Data ? "POST" : "GET"),
        timeout: 300000,
        url: URL,
        onerror: function() {
            displayMessage(Context, "An error has ocurred.");
        },
        ontimeout: function() {
            displayMessage(Context, "The connection has timed out.");
        },
        onload: Callback
    });
}

function displayMessage(Context, Message) {
    if (Context) {
        Context.innerHTML =
            "<i class=\"fa fa-times-circle\"></i> " +
            "<span>" + Message + "</span>";
    } else {
        console.log(Message);
    }
}

function queueSave(Element, Callback) {
    var CurrentDate;
    Element.Save = setInterval(function() {
        CurrentDate = new Date().getTime();
        if ((CurrentDate - GM_getValue("LastSave")) > 5000) {
            clearInterval(Element.Save);
            GM_setValue("LastSave", CurrentDate);
            if (Element.Progress) {
                Element.Progress.innerHTML = "";
            }
            Callback();
        } else if (Element.Progress) {
            Element.Progress.innerHTML =
                "<i class=\"fa fa-clock-o\"></i> " +
                "<span>Waiting for a free save slot...</span>";
        }
    }, 100);
}

function updateUsers(UpdatedUsers) {
    var SavedUsers, I, N, User, J, Key;
    SavedUsers = GM_getValue("Users");
    for (I = 0, N = UpdatedUsers.length; I < N; ++I) {
        User = UpdatedUsers[I];
        J = getUserIndex(User, SavedUsers);
        if (J >= 0) {
            for (Key in User) {
                SavedUsers[J][Key] = User[Key];
            }
        } else {
            SavedUsers.push(User);
        }
    }
    GM_setValue("Users", SavedUsers);
}

function saveUser(User, Element, Callback) {
    var SavedUsers, I;
    SavedUsers = GM_getValue("Users");
    I = getUserIndex(User, SavedUsers);
    if (I >= 0) {
        checkUsernameChange(User, SavedUsers[I]);
        GM_setValue("Users", SavedUsers);
        Callback();
    } else if (User.Username && User.SteamID64) {
        SavedUsers.push(User);
        GM_setValue("Users", SavedUsers);
        Callback();
    } else {
        setUser(Element, User, function() {
            if (esgst.sg) {
                I = getUserIndex(User, SavedUsers);
                if (I >= 0) {
                    checkUsernameChange(User, SavedUsers[I]);
                } else {
                    SavedUsers.push(User);
                }
            } else {
                SavedUsers.push(User);
            }
            GM_setValue("Users", SavedUsers);
            Callback();
        });
    }
}

function setUser(Element, User, Callback) {
    queueRequest(Element, null, "https://www.steamgifts.com" + (esgst.sg ? "" : "/go") + "/user/" + (esgst.sg ? User.Username : User.SteamID64), function(Response) {
        var ResponseHTML;
        ResponseHTML = parseHTML(Response.responseText);
        if (esgst.sg) {
            User.SteamID64 = ResponseHTML.querySelector("a[href*='/profiles/']").getAttribute("href").match(/\d+/)[0];
        } else {
            User.Username = Response.finalUrl.match(/\/user\/(.+)/)[1];
        }
        User.ID = ResponseHTML.querySelector("input[name='child_user_id']");
        User.ID = User.ID ? User.ID.value : "";
        Callback();
    });
}

function getUserID(User, Element, Callback) {
    var SavedUser;
    SavedUser = getUser(User);
    if (SavedUser.ID) {
        User.ID = SavedUser.ID;
        Callback();
    } else {
        queueRequest(Element, null, "/user/" + User.Username, function(Response) {
            User.ID = parseHTML(Response.responseText).querySelector("[name='child_user_id']").value;
            Callback();
        });
    }
}

function getUser(User) {
    var SavedUsers, I;
    SavedUsers = GM_getValue("Users");
    I = getUserIndex(User, SavedUsers);
    return ((I >= 0) ? SavedUsers[I] : null);
}

function getUserIndex(User, SavedUsers) {
    var Query, Key, I;
    if (User.SteamID64) {
        Query = User.SteamID64;
        Key = "SteamID64";
    } else {
        Query = User.Username;
        Key = "Username";
    }
    for (I = SavedUsers.length - 1; (I >= 0) && (SavedUsers[I][Key] != Query); --I);
    return I;
}

function checkUsernameChange(User, SavedUser) {
    var Key;
    for (Key in User) {
        if (User.Username && (User.Username != SavedUser.Username) && (Key == "Tags")) {
            if (SavedUser.Tags) {
                if (User.Tags) {
                    SavedUser.Tags += ", " + User.Tags;
                }
            } else if (User.Tags) {
                SavedUser.Tags = User.Tags;
            }
        } else {
            SavedUser[Key] = User[Key];
        }
    }
}

function saveComment(TradeCode, ParentID, Description, URL, DEDStatus, Callback, DEDCallback) {
    var Data;
    Data = "xsrf_token=" + esgst.xsrfToken + "&do=" + (esgst.sg ? "comment_new" : "comment_insert") + "&trade_code=" + TradeCode + "&parent_id=" + ParentID + "&description=" +
        encodeURIComponent(Description);
    makeRequest(Data, URL, DEDStatus, function(Response) {
        var Match, ResponseJSON;
        if (esgst.sg) {
            Match = Response.finalUrl.match(/(.+?)(#(.+))?$/);
            if (Match[3]) {
                Callback();
                if (esgst.ch) {
                    saveCHComment(DEDStatus.closest(".comment__children"), Match[1], parseHTML(Response.responseText).getElementsByTagName("title")[0].textContent, Match[3]);
                }
                if (DEDCallback) {
                    DEDCallback(Response, DEDStatus);
                } else {
                    window.location.href = "/go/comment/" + Match[3];
                }
            } else if (URL != Match[1]) {
                makeRequest(Data, Match[1], DEDStatus, function(Response) {
                    Callback();
                    Match = Response.finalUrl.match(/(.+?)(#(.+))?$/);
                    if (esgst.ch) {
                        saveCHComment(DEDStatus.closest(".comment__children"), Match[1], parseHTML(Response.responseText).getElementsByTagName("title")[0].textContent, Match[3]);
                    }
                    if (DEDCallback) {
                        DEDCallback(Response, DEDStatus);
                    } else {
                        window.location.href = "/go/comment/" + Match[3];
                    }
                });
            } else {
                Callback();
                if (DEDCallback) {
                    DEDCallback(Response, DEDStatus);
                } else {
                    DEDStatus.innerHTML =
                        "<i class=\"fa fa-times-circle\"></i> " +
                        "<span>Failed!</span>";
                }
            }
        } else {
            ResponseJSON = parseJSON(Response.responseText);
            if (ResponseJSON.success) {
                Callback();
                if (DEDCallback) {
                    DEDCallback(Response, DEDStatus);
                } else {
                    window.location.href = "/go/comment/" + parseHTML(ResponseJSON.html).getElementsByClassName("comment_outer")[0].id;
                }
            } else {
                Callback();
                if (DEDCallback) {
                    DEDCallback(Response, DEDStatus);
                } else {
                    DEDStatus.innerHTML =
                        "<i class=\"fa fa-times-circle\"></i> " +
                        "<span>Failed!</span>";
                }
            }
        }
    });
}

function checkSync(Update, Callback) {
    var SyncFrequency, CurrentDate;
    SyncFrequency = GM_getValue("SyncFrequency");
    CurrentDate = new Date().getTime();
    if (Update) {
        document.getElementsByClassName("SMSync")[0].addEventListener("click", function() {
            setSync(CurrentDate, Update, Callback);
        });
    } else if (SyncFrequency && ((CurrentDate - GM_getValue("LastSync")) > (SyncFrequency * 86400000)) && (esgst.mainPath || esgst.accountPath)) {
        setSync(CurrentDate, Update, Callback);
    }
}

function setSync(CurrentDate, Update, Callback) {
    var Popup, Sync;
    Popup = createPopup();
    if (!Update) {
        var context = document.getElementsByClassName(`nav__left-container`)[0];
        var html = `
            <div class="nav__button-container">
                <div class="nav__button">
                    <div class="rhBusy"></div>
                    <i class="fa fa-refresh fa-spin"></i>
                    <span>Syncing...</span>
                </div>
            </div>
        `;
        context.insertAdjacentHTML(`beforeEnd`, html);
        var button = context.lastElementChild.firstElementChild;
        button.addEventListener(`click`, function() {
            Popup.popUp();
        });
    }
    Popup.Icon.classList.add("fa-refresh");
    Popup.Title.textContent = Update ? "Syncing..." : "ESGST is performing the automatic sync. Please do not reload / close the page until it has finished.";
    Sync = {};
    createButton(Popup.Button, "fa-times-circle", "Cancel", "", "", function() {
        Sync.Canceled = true;
        Popup.Close.click();
    }, null, true);
    Sync.Progress = Popup.Progress;
    Sync.OverallProgress = Popup.OverallProgress;
    if (Update) {
        Popup.popUp().reposition();
    }
    sync(Sync, function(CurrentDate) {
        Popup.Icon.classList.remove("fa-refresh");
        Popup.Icon.classList.add("fa-check");
        Popup.Title.textContent = Update ? "Synced!" : "ESGST has finished the automatic sync. You can now reload / close the page.";
        Popup.Button.innerHTML = "";
        Sync.Progress.innerHTML = Sync.OverallProgress.innerHTML = "";
        if (Update) {
            Popup.Close.click();
            Callback(CurrentDate);
        } else {
            button.classList.remove(`rhBusy`);
            button.innerHTML = `
                <i class="fa fa-check-circle"></i>
                <span>Synced!</span>
            `;
        }
        GM_setValue("LastSync", CurrentDate);
    });
}

function sync(Sync, Callback) {
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Syncing your username and avatar...</span>";
    if (esgst.sg) {
        GM_setValue("Username", document.getElementsByClassName("nav__avatar-outer-wrap")[0].href.match(/\/user\/(.+)/)[1]);
    }
    GM_setValue("Avatar", document.getElementsByClassName(esgst.sg ? "nav__avatar-inner-wrap" : "nav_avatar")[0].style.backgroundImage.match(/\("(.+)"\)/)[1]);
    if (!GM_getValue("SteamID64") && GM_getValue("Username")) {
        getSteamID64(Sync, function() {
            continueSync(Sync, Callback);
        });
    } else {
        continueSync(Sync, Callback);
    }
}

function continueSync(Sync, Callback) {
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Syncing your Steam groups...</span>";
    Sync.Groups = [];
    syncGroups(Sync, "/account/steam/groups/search?page=", 1, function() {
        GM_setValue("Groups", Sync.Groups);
        syncWhitelistBlacklist(Sync, function() {
            var games = GM_getValue(`Games`);
            for (var key in games) {
                delete games[key].wishlist;
                delete games[key].owned;
            }
            syncOwnedGames(Sync, games, function() {
                syncWishlist(Sync, games, function() {
                    var CurrentDate;
                    CurrentDate = new Date();
                    GM_setValue("LastSync", CurrentDate.getTime());
                    Callback(CurrentDate);
                });
            });
        });
    });
}

function getSteamID64(Sync, Callback) {
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Retrieving your SteamID64...</span>";
    makeRequest(null, "/user/" + GM_getValue("Username"), Sync.Progress, function(Response) {
        GM_setValue("SteamID64", parseHTML(Response.responseText).querySelector("a[href*='/profiles/']").getAttribute("href").match(/\d+/)[0]);
        Callback();
    });
}

function syncGroups(Sync, URL, NextPage, Callback) {
    if (!Sync.Canceled) {
        queueRequest(Sync, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches, I, N, Pagination;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__column__heading");
            for (I = 0, N = Matches.length; I < N; ++I) {
                Sync.Groups.push({
                    Code: Matches[I].getAttribute("href").match(/group\/(.+?)\//)[1],
                    Name: Matches[I].textContent
                });
            }
            Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                syncGroups(Sync, URL, ++NextPage, Callback);
            } else {
                Callback();
            }
        });
    }
}

function syncWhitelistBlacklist(Sync, Callback) {
    var SavedUsers;
    if (!Sync.Canceled) {
        Sync.Users = [];
        SavedUsers = GM_getValue("Users");
        clearWhitelistBlacklist(Sync, 0, SavedUsers.length, SavedUsers, function() {
            Sync.OverallProgress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Syncing your whitelist...</span>";
            getWhitelistBlacklist(Sync, "/account/manage/whitelist/search?page=", 1, "Whitelisted", function() {
                Sync.OverallProgress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Syncing your blacklist...</span>";
                getWhitelistBlacklist(Sync, "/account/manage/blacklist/search?page=", 1, "Blacklisted", function() {
                    queueSave(Sync, function() {
                        updateUsers(Sync.Users);
                        GM_setValue("LastSave", 0);
                        Callback();
                    });
                });
            });
        });
    }
}

function clearWhitelistBlacklist(Sync, I, N, SavedUsers, Callback) {
    if (!Sync.Canceled) {
        if (I < N) {
            Sync.Users.push({
                Username: SavedUsers[I].Username,
                ID: SavedUsers[I].ID,
                SteamID64: SavedUsers[I].SteamID64,
                Whitelisted: false,
                Blacklisted: false
            });
            setTimeout(clearWhitelistBlacklist, 0, Sync, ++I, N, SavedUsers, Callback);
        } else {
            Callback();
        }
    }
}

function getWhitelistBlacklist(Sync, URL, NextPage, Key, Callback) {
    if (!Sync.Canceled) {
        queueRequest(Sync, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__column__heading");
            getWhitelistBlacklistUsers(Sync, 0, Matches.length, Matches, Key, function() {
                var Pagination;
                Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    setTimeout(getWhitelistBlacklist, 0, Sync, URL, ++NextPage, Key, Callback);
                } else {
                    Callback();
                }
            });
        });
    }
}

function getWhitelistBlacklistUsers(Sync, I, N, Matches, Key, Callback) {
    var User, J;
    if (!Sync.Canceled) {
        if (I < N) {
            User = {
                Username: Matches[I].textContent
            };
            J = getUserIndex(User, Sync.Users);
            if (J >= 0) {
                Sync.Users[J][Key] = true;
                setTimeout(getWhitelistBlacklistUsers, 0, Sync, ++I, N, Matches, Key, Callback);
            } else {
                setUser(Sync, User, function() {
                    User[Key] = true;
                    Sync.Users.push(User);
                    setTimeout(getWhitelistBlacklistUsers, 0, Sync, ++I, N, Matches, Key, Callback);
                });
            }
        } else {
            Callback();
        }
    }
}

function syncWishlist(Sync, games, Callback) {
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Syncing your wishlist...</span>";
    makeRequest(null, `http://steamcommunity.com/profiles/${GM_getValue(`SteamID64`)}/wishlist`, Sync.Progress, function(Response) {
        var responseHtml = parseHTML(Response.responseText);
        var matches = responseHtml.querySelectorAll(`input[name="appid"]`);
        for (var i = 0, n = matches.length; i < n; ++i) {
            var id = matches[i].value;
            if (!games[id]) {
                games[id] = {};
            }
            games[id].wishlist = true;
        }
        queueSave(Sync.Progress, function() {
            updateGames(games);
            GM_setValue(`LastSave`, 0);
            Callback();
        });
    });
}

function syncOwnedGames(Sync, games, Callback) {
    var SteamAPIKey, URL;
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Syncing your owned games...</span>";
    SteamAPIKey = GM_getValue("SteamAPIKey");
    if (SteamAPIKey) {
        URL = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + SteamAPIKey + "&steamid=" + GM_getValue("SteamID64") + "&format=json";
        makeRequest(null, URL, Sync.Progress, function(Response) {
            var ResponseText, ResponseGames, N, OwnedGames, I;
            ResponseText = Response.responseText;
            if (!ResponseText.match(/<title>Forbidden<\/title>/)) {
                ResponseGames = parseJSON(ResponseText).response.games;
                N = ResponseGames.length;
                for (var i = 0; i < N; ++i) {
                    var id = ResponseGames[i].appid;
                    if (!games[id]) {
                        games[id] = {};
                    }
                    games[id].owned = true;
                }
                if (N != GM_getValue("OwnedGames").length) {
                    OwnedGames = [];
                    for (I = 0; I < N; ++I) {
                        OwnedGames.push(ResponseGames[I].appid);
                    }
                    GM_setValue("OwnedGames", OwnedGames);
                    Callback(1);
                } else {
                    Callback(2);
                }
            } else {
                Callback(3);
            }
        });
    } else {
        Callback(4);
    }
}

function parseJSON(String) {
    return JSON.parse(String);
}

function parseHTML(String) {
    return (new DOMParser()).parseFromString(String, "text/html");
}

function sortArray(Array) {
    return Array.sort(function (A, B) {
        return A.localeCompare(B, {
            sensitivity: "base"
        });
    });
}

function setSiblingsOpacity(Element, Opacity) {
    var Siblings, I, N;
    Siblings = Element.parentElement.children;
    for (I = 0, N = Siblings.length; I < N; ++I) {
        if (Siblings[I] != Element) {
            Siblings[I].style.opacity = Opacity;
        }
    }
}

function setHoverOpacity(Element, EnterOpacity, LeaveOpacity) {
    Element.addEventListener("mouseenter", function() {
        Element.style.opacity = EnterOpacity;
    });
    Element.addEventListener("mouseleave", function() {
        Element.style.opacity = LeaveOpacity;
    });
}

function createPopup(Temp) {
    var Popup;
    document.body.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"popup page__outer-wrap page_outer_wrap rhPopup\">" +
        "    <div class=\"popup_summary\">" +
        "        <div class=\"popup_icon\">" +
        "            <i class=\"fa popup__icon rhPopupIcon\"></i>" +
        "        </div>" +
        "        <div class=\"popup_heading popup__heading\">" +
        "            <div class=\"popup_heading_h2 rhPopupTitle\"></div>" +
        "        </div>" +
        "    </div>" +
        "    <div class=\"rhPopupDescription\">" +
        "        <textarea class=\"rhPopupTextArea rhHidden\"></textarea>" +
        "        <input class=\"rhPopupTextInput rhHidden\"/>" +
        "        <ul class=\"rhPopupOptions\"></ul>" +
        "        <div class=\"rhPopupButton\"></div>" +
        "        <div class=\"rhPopupStatus\">" +
        "            <div class=\"rhPopupProgress\"></div>" +
        "            <div class=\"rhPopupOverallProgress\"></div>" +
        "        </div>" +
        "        <ul class=\"rhPopupResults\"></ul>" +
        "    </div>" +
        "    <div class=\"popup__actions popup_actions\">" +
        "        <a href=\"https://www.steamgifts.com/account#ESGST\">Manage</a>" +
        "        <span class=\"b-close rhPopupClose\">Close</span>" +
        "    </div>" +
        "</div>"
    );
    Popup = {};
    Popup.Popup = document.body.lastElementChild;
    Popup.Icon = Popup.Popup.getElementsByClassName("rhPopupIcon")[0];
    Popup.Title = Popup.Popup.getElementsByClassName("rhPopupTitle")[0];
    Popup.Description = Popup.Popup.getElementsByClassName("rhPopupDescription")[0];
    Popup.TextArea = Popup.Popup.getElementsByClassName("rhPopupTextArea")[0];
    Popup.TextInput = Popup.Popup.getElementsByClassName("rhPopupTextInput")[0];
    Popup.Options = Popup.Popup.getElementsByClassName("rhPopupOptions")[0];
    Popup.Button = Popup.Popup.getElementsByClassName("rhPopupButton")[0];
    Popup.Status = Popup.Popup.getElementsByClassName("rhPopupStatus")[0];
    Popup.Progress = Popup.Popup.getElementsByClassName("rhPopupProgress")[0];
    Popup.OverallProgress = Popup.Popup.getElementsByClassName("rhPopupOverallProgress")[0];
    Popup.Results = Popup.Popup.getElementsByClassName("rhPopupResults")[0];
    Popup.Close = Popup.Popup.getElementsByClassName("rhPopupClose")[0];
    if (esgst.st) {
        Popup.Popup.classList.remove(`popup`);
        Popup.Popup.classList.add(`esgst-hidden`);
    }
    var popup;
    Popup.popUp = function(Callback) {
        if (esgst.st) {
            Popup.Popup.classList.add(`popup`);
            Popup.Popup.classList.remove(`esgst-hidden`);
        }
        popup = $(Popup.Popup).bPopup({
            amsl: [0],
            fadeSpeed: 200,
            followSpeed: 500,
            modalColor: "#3c424d",
            opacity: 0.85,
            onClose: function() {
                if (esgst.st) {
                    Popup.Popup.classList.remove(`popup`);
                    Popup.Popup.classList.add(`esgst-hidden`);
                }
                if (Temp) {
                    Popup.Popup.remove();
                }
            }
        }, Callback);
        return popup;
    };
    Popup.Popup.addEventListener(`click`, function() {
        if (popup) {
            popup.reposition();
        }
    });
    return Popup;
}

// Popout

function createPopout(Context) {
    var Popout;
    Context.insertAdjacentHTML("beforeEnd", "<div class=\"page__outer-wrap page_outer_wrap rhPopout rhHidden\"></div>");
    Popout = {
        Popout: Context.lastElementChild,
        customRule: function() {
            return true;
        },
        popOut: function(Context, Callback) {
            if (Callback) {
                Callback(Popout.Popout);
            }
            Popout.reposition(Context);
        },
        reposition: function(Context) {
            Popout.Popout.classList.remove("rhHidden");
            Popout.Popout.removeAttribute("style");
            repositionPopout(Popout.Popout, Context);
        }
    };
    document.addEventListener("click", function(Event) {
        if (!Popout.Popout.classList.contains("rhHidden") && document.body.contains(Event.target) && !Popout.Popout.contains(Event.target) && Popout.customRule(Event.target)) {
            Popout.Popout.classList.add("rhHidden");
        }
    });
    return Popout;
}

function repositionPopout(Popout, Context) {
    var PopoutRect, PopoutLeft, PopoutWidth, PopoutTop, PopoutHeight, ContextRect, ContextLeft, ContextWidth, ContextTop, ContextHeight;
    PopoutRect = Popout.getBoundingClientRect();
    PopoutLeft = PopoutRect.left;
    PopoutWidth = PopoutRect.width;
    PopoutTop = PopoutRect.top;
    PopoutHeight = PopoutRect.height;
    ContextRect = Context.getBoundingClientRect();
    ContextLeft = ContextRect.left;
    ContextWidth = ContextRect.width;
    ContextTop = ContextRect.top;
    ContextHeight = ContextRect.height;
    Popout.style.marginLeft = ((PopoutLeft + PopoutWidth) > document.documentElement.clientWidth) ?
        (-(PopoutWidth - ContextWidth - (ContextLeft - PopoutLeft)) + "px") : ((ContextLeft - PopoutLeft) + "px");
    if ((PopoutHeight + ContextTop + ContextHeight + 44) > document.documentElement.clientHeight) {
        Popout.style.marginTop = (PopoutTop > ContextTop) ? (-(PopoutHeight + (PopoutTop - ContextTop)) + "px") : (-(PopoutHeight - (ContextTop - PopoutTop)) + "px");
    } else {
        Popout.style.marginTop = (PopoutTop > ContextTop) ? (((ContextTop - PopoutTop) + ContextHeight) + "px") : (-((PopoutTop - ContextTop) - ContextHeight) + "px");
    }
}

function createButton(Context, DefaultIcon, DefaultName, OnClickIcon, OnClickName, DefaultCallback, OnClickCallback, White, Yellow) {
    var DefaultButton, OnClickButton;
    Context.innerHTML =
        "<div class=\"" + (White ? "form__saving-button white" : (Yellow ? "sidebar__entry-delete" : "form__submit-button green")) + " btn_action rhDefaultButton\">" +
        "    <i class=\"fa " + DefaultIcon + "\"></i>" +
        "    <span>" + DefaultName + "</span>" +
        "</div>" +
        "<div class=\"form__saving-button btn_action grey is-disabled is_disabled rhOnClickButton rhHidden\">" +
        "    <i class=\"fa " + OnClickIcon + "\"></i>" +
        "    <span>" + OnClickName + "</span>" +
        "</div>";
    DefaultButton = Context.firstElementChild;
    OnClickButton = Context.lastElementChild;
    DefaultButton.addEventListener("click", function() {
        DefaultButton.classList.add("rhHidden");
        OnClickButton.classList.remove("rhHidden");
        DefaultCallback(function() {
            OnClickButton.classList.add("rhHidden");
            DefaultButton.classList.remove("rhHidden");
        });
    });
    if (OnClickCallback) {
        OnClickButton.classList.remove("is-disabled", "is_disabled");
        OnClickButton.addEventListener("click", function() {
            OnClickButton.classList.add("rhHidden");
            DefaultButton.classList.remove("rhHidden");
            OnClickCallback();
        });
    }
}

function createCheckbox(Context, Default) {
    var Checkbox, Input, Disabled, Hover, Enabled;
    Context.innerHTML =
        "<span class=\"rhCheckbox\">" +
        "    <input class=\"rhHidden\" type=\"checkbox\">" +
        "    <i class=\"fa fa-circle-o\"></i>" +
        "    <i class=\"fa fa-circle rhHidden\"></i>" +
        "    <i class=\"fa fa-check-circle rhHidden\"></i>" +
        "</span>";
    Checkbox = Context.firstElementChild;
    Input = Checkbox.firstElementChild;
    Disabled = Input.nextElementSibling;
    Hover = Disabled.nextElementSibling;
    Enabled = Hover.nextElementSibling;
    Input.checked = Default;
    Checkbox.addEventListener("mouseenter", setCheckboxHover);
    Checkbox.addEventListener("mouseleave", setCheckboxDisabled);
    Checkbox.addEventListener("click", function() {
        Input.checked = Input.checked ? false : true;
        setCheckboxEnabled();
    });
    setCheckboxEnabled();

    function setCheckboxHover() {
        Disabled.classList.add("rhHidden");
        Enabled.classList.add("rhHidden");
        Hover.classList.remove("rhHidden");
    }

    function setCheckboxDisabled() {
        Hover.classList.add("rhHidden");
        Enabled.classList.add("rhHidden");
        Disabled.classList.remove("rhHidden");
    }

    function setCheckboxEnabled() {
        if (Input.checked) {
            Disabled.classList.add("rhHidden");
            Hover.classList.add("rhHidden");
            Enabled.classList.remove("rhHidden");
            Checkbox.removeEventListener("mouseenter", setCheckboxHover);
            Checkbox.removeEventListener("mouseleave", setCheckboxDisabled);
        } else {
            Enabled.classList.add("rhHidden");
            Disabled.classList.remove("rhHidden");
            Checkbox.addEventListener("mouseenter", setCheckboxHover);
            Checkbox.addEventListener("mouseleave", setCheckboxDisabled);
        }
    }

    return {
        Checkbox: Input,
        check: function() {
            Input.checked = true;
            setCheckboxEnabled();
        },
        uncheck: function() {
            Input.checked = false;
            setCheckboxEnabled();
        },
        toggle: function() {
            Input.checked = Input.checked ? false : true;
            setCheckboxEnabled();
        }
    };
}

function createCheckbox_v6(context, defaultValue, threeState) {
    var html = `
        <span class="esgst-checkbox">
            <input class="esgst-hidden" type="checkbox">
            <i class="fa fa-circle-o"></i>
            <i class="fa fa-circle"></i>
            <i class="fa fa-check-circle"></i>
        </span>
    `;
    context.insertAdjacentHTML(`afterBegin`, html);
    var checkbox = {
        value: defaultValue,
        threeState: threeState
    };
    checkbox.checkbox = context.firstElementChild;
    checkbox.input = checkbox.checkbox.firstElementChild;
    checkbox.disabled = checkbox.input.nextElementSibling;
    checkbox.none = checkbox.disabled.nextElementSibling;
    checkbox.enabled = checkbox.none.nextElementSibling;
    checkbox.showNone = showNoneCheckbox.bind(null, checkbox);
    checkbox.hideNone = hideNoneCheckbox.bind(null, checkbox);
    if (!checkbox.threeState) {
        if (checkbox.value) {
            checkbox.input.checked = true;
            checkbox.disabled.classList.add(`esgst-hidden`);
            checkbox.none.classList.add(`esgst-hidden`);
        } else {
            checkbox.input.checked = false;
            checkbox.none.classList.add(`esgst-hidden`);
            checkbox.disabled.classList.add(`esgst-hidden`);
            checkbox.checkbox.addEventListener(`mouseenter`, checkbox.showNone);
            checkbox.checkbox.addEventListener(`mouseleave`, checkbox.hideNone);
        }
        checkbox.checkbox.addEventListener(`click`, changeCheckboxState.bind(null, checkbox, true));
        changeCheckboxState(checkbox);
    } else {
        if (checkbox.value == `disabled`) {
            checkbox.none.classList.add(`esgst-hidden`);
            checkbox.enabled.classList.add(`esgst-hidden`);
        } else if (checkbox.value == `none`) {
            checkbox.disabled.classList.add(`esgst-hidden`);
            checkbox.enabled.classList.add(`esgst-hidden`);
        } else {
            checkbox.disabled.classList.add(`esgst-hidden`);
            checkbox.none.classList.add(`esgst-hidden`);
        }
        checkbox.checkbox.addEventListener(`click`, changeCheckboxState.bind(null, checkbox));
    }
    checkbox.check = checkCheckbox.bind(null, checkbox);
    checkbox.uncheck = uncheckCheckbox.bind(null, checkbox);
    checkbox.toggle = toggleCheckbox.bind(null, checkbox);
    return checkbox;
}

function showNoneCheckbox(checkbox) {
    checkbox.disabled.classList.add(`esgst-hidden`);
    checkbox.none.classList.remove(`esgst-hidden`);
}

function hideNoneCheckbox(checkbox) {
    checkbox.disabled.classList.remove(`esgst-hidden`);
    checkbox.none.classList.add(`esgst-hidden`);
}

function checkCheckbox(checkbox) {
    checkbox.input.checked = true;
    changeCheckboxState(checkbox);
}

function uncheckCheckbox(checkbox) {
    checkbox.input.checked = false;
    changeCheckboxState(checkbox);
}

function toggleCheckbox(checkbox) {
    if (checkbox.input.checked) {
        checkbox.input.checked = false;
    } else {
        checkbox.input.checked = true;
    }
    changeCheckboxState(checkbox);
}

function changeCheckboxState(checkbox, toggle) {
    if (!checkbox.threeState) {
        if (toggle) {
            if (checkbox.input.checked) {
                checkbox.input.checked = false;
            } else {
                checkbox.input.checked = true;
            }
        }
        if (checkbox.input.checked) {
            checkbox.value = true;
            checkbox.disabled.classList.add("esgst-hidden");
            checkbox.none.classList.add("esgst-hidden");
            checkbox.enabled.classList.remove("esgst-hidden");
            checkbox.checkbox.removeEventListener("mouseenter", checkbox.showNone);
            checkbox.checkbox.removeEventListener("mouseleave", checkbox.hideNone);
        } else {
            checkbox.value = false;
            checkbox.enabled.classList.add("esgst-hidden");
            checkbox.disabled.classList.remove("esgst-hidden");
            checkbox.checkbox.addEventListener("mouseenter", checkbox.showNone);
            checkbox.checkbox.addEventListener("mouseleave", checkbox.hideNone);
        }
    } else {
        if (checkbox.value == `disabled`) {
            checkbox.disabled.classList.add(`esgst-hidden`);
            checkbox.none.classList.remove(`esgst-hidden`);
            checkbox.value = `none`;
        } else if (checkbox.value == `none`) {
            checkbox.none.classList.add(`esgst-hidden`);
            checkbox.enabled.classList.remove(`esgst-hidden`);
            checkbox.value = `enabled`;
        } else {
            checkbox.enabled.classList.add(`esgst-hidden`);
            checkbox.disabled.classList.remove(`esgst-hidden`);
            checkbox.value = `disabled`;
        }
    }
}

function createOptions(Context, Element, Options) {
    var I, N;
    for (I = 0, N = Options.length; I < N; ++I) {
        createOption(Context, Options[I], Element);
    }
}

function createOption(Context, Option, Element) {
    var Name, Checkbox, Key, ID, Dependency;
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<li" + (Option.Check() ? "" : " class=\"rhHidden\"") + ">" +
        "    <span></span>" +
        "    <span>" + Option.Description + "</span>" +
        "    <i class=\"fa fa-question-circle\" title=\"" + Option.Title + "\"></i>" +
        "</li>"
    );
    Name = Option.Name;
    Element[Name] = Context.lastElementChild;
    Checkbox = Element[Name].firstElementChild;
    Key = Option.Key;
    ID = Option.ID;
    Element[Key] = createCheckbox(Checkbox, GM_getValue(ID)).Checkbox;
    Dependency = Option.Dependency;
    Checkbox.addEventListener("click", function() {
        GM_setValue(ID, Element[Key].checked);
        if (Dependency) {
            Element[Dependency].classList.toggle("rhHidden");
        }
    });
}

function createResults(Context, Element, Results) {
    var I, N, Key;
    for (I = 0, N = Results.length; I < N; ++I) {
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<li class=\"rhHidden\">" + Results[I].Icon +
            "    <span class=\"rhBold\">" + Results[I].Description + " (<span>0</span>):</span>" +
            "    <span class=\"popup__actions\"></span>" +
            "</li>"
        );
        Key = Results[I].Key;
        Element[Key] = Context.lastElementChild;
        Element[Key + "Count"] = Element[Key].firstElementChild.nextElementSibling.firstElementChild;
        Element[Key + "Users"] = Element[Key].lastElementChild;
    }
}

function createDescription(Description) {
    return (
        "<form>" +
        "    <div class=\"form__input-description rhDescription\">" +
        "        <div class=\"input_description\">" + Description + "</div>" +
        "    </div>" +
        "</form>"
    );
}

function createNavigationSection(Name, Items) {
    var Section, I, N;
    Section =
        "<h3 class=\"sidebar__heading\">" + Name + "</h3>" +
        "<ul class=\"sidebar__navigation\">";
    for (I = 0, N = Items.length; I < N; ++I) {
        Section += createNavigationItem(Items[I].Name, Items[I].URL, Items[I].Title);
    }
    Section += "</ul>";
    return Section;
}

function createNavigationItem(Name, URL, Title) {
    return (
        "<li class=\"sidebar__navigation__item" + (Name ? (" " + Name) : "") + "\">" +
        "    <a class=\"sidebar__navigation__item__link\" href=\"" + URL + "\">" +
        "        <div class=\"sidebar__navigation__item__name\">" + Title + "</div>" +
        "        <div class=\"sidebar__navigation__item__underline\"></div>" +
        "    </a>" +
        "</li>"
    );
}

function addStyles() {
    var Temp, Positive, Negative, Unknown;
    var categories = [
        {
            id: `gc_b`,
            key: `bundled`
        },
        {
            id: `gc_b_r`,
            key: `bundled`
        },
        {
            id: `gc_w`,
            key: `wishlist`
        },
        {
            id: `gc_o`,
            key: `owned`
        },
        {
            id: `gc_tc`,
            key: `tradingCards`
        },
        {
            id: `gc_a`,
            key: `achievements`
        },
        {
            id: `gc_mp`,
            key: `multiplayer`
        },
        {
            id: `gc_sc`,
            key: `steamCloud`
        },
        {
            id: `gc_l`,
            key: `linux`
        },
        {
            id: `gc_m`,
            key: `mac`
        },
        {
            id: `gc_dlc`,
            key: `dlc`
        },
        {
            id: `gc_g`,
            key: `genres`
        }
    ];
    for (var i = 0, n = categories.length; i < n; ++i) {
        var style = `
            .esgst-gc.${categories[i].key} {
                color: ${GM_getValue(`${categories[i].id}_color`)};
                background-color: ${GM_getValue(`${categories[i].id}_bgColor`)};
            }
        `;
        GM_addStyle(style);
    }
    document.body.insertAdjacentHTML(
        "beforeEnd",
        "<span class=\"dropdown_btn\">" +
        "    <i class=\"icon-green green\"></i>" +
        "    <i class=\"icon-red red\"></i>" +
        "    <i class=\"icon-grey grey\"></i>" +
        "</span>"
    );
    Temp = document.body.lastElementChild;
    Positive = Temp.firstElementChild;
    Negative = Positive.nextElementSibling;
    Unknown = Negative.nextElementSibling;
    Positive = window.getComputedStyle(Positive).color;
    Negative = window.getComputedStyle(Negative).color;
    Unknown = window.getComputedStyle(Unknown).color;
    Temp.remove();
    var style = `
.esgst-hidden {
  display: none !important;
}

.fa img {
    height: 14px;
    width: 14px;
    vertical-align: middle;
}
.nav__left-container .fa img {
    vertical-align: baseline;
}

.esgst-checkbox {
    cursor: pointer;
}

.esgst-adot, .esgst-rbot {
  margin-bottom: 25px;
}

.esgst-rbot .reply_form .btn_cancel {
  display: none;
}

.esgst-fh {
  height: auto !important;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999 !important;
}

.esgst-fs {
  position: fixed;
}

.esgst-fmph {
  position: fixed;
  z-index: 998;
}

.esgst-fmph-background {
  padding: 0;
  position: fixed;
  top: 0;
  z-index: 997;
}

.esgst-ff {
  background-color: inherit;
  bottom: 0;
  padding: 0;
  position: fixed;
  width: 100%;
  z-index: 999;
}

.esgst-ff >* {
  padding: 15px 25px;
}

.esgst-ags-panel {
    margin: 0 0 15px 0;
}

.esgst-ags-filter {
    display: flex;
}

.esgst-ags-filter >* {
    display: inline-flex;
    justify-content: space-between;
    margin: 5px;
    width: 150px;
}

.esgst-ags-panel input, .esgst-ags-panel select {
    padding: 0 5px;
    width: 50px;
}

.esgst-aas-button, .esgst-es-pause-button, .esgst-es-refresh-button {
    cursor: pointer;
    display: inline-block;
}

.esgst-es-page-heading {
    margin-top: 25px;
}

.esgst-gc {
    display: inline-block;
    margin: 0;
    margin-bottom: 5px;
    position: static;
    text-shadow: none;
}

.esgst-gf-container input {
    display: inline-block;
    height: 20px;
    padding: 0 5px;
    width: 100px;
}

.esgst-gf-filters >* {
    display: inline-block;
    margin: 5px;
    vertical-align: top;
}

.esgst-gf-range-filter {
    display: flex;
}

.esgst-gf-range-filter >* {
    display: inline-flex;
    width: 200px;
    margin: 5px;
    justify-content: space-between;
}

.esgst-gf-checkbox-filter, .esgst-gf-category-filter, .esgst-gf-exception-filter {
    margin: 5px;
}

.esgst-gf-button {
    border-top: 1px;
}

.esgst-sm-colors input {
    display: inline-block;
    padding: 0;
    width: 30px;
}

.esgst-eg {
    margin: 0 0 0 10px;
}

.PGBContainer, .esgst-gf-box {
    border-radius: 0 !important;
    margin: 0! important;
}

.ERButton {
    cursor: pointer;
    display: inline-block;
}
    `;
    GM_addStyle(style);
    GM_addStyle(
        ".markdown {" +
        "    word-break: break-word;" +
        "}" +
        ".rhHidden {" +
        "    display: none !important;" +
        "}" +
        ".rhBold {" +
        "    font-weight: bold;" +
        "}" +
        ".rhItalic {" +
        "    font-style: italic;" +
        "}" +
        ".rhBusy >*, .CFHALIPF {" +
        "    opacity: 0.2;" +
        "}" +
        ".esgst-faded .giveaway__summary >:not(.GPPanel):not(.giveaway__columns), .esgst-faded .giveaway__columns >:not(.GGPContainer), .esgst-faded .global__image-outer-wrap--game-medium {" +
        "    opacity: 0.5;" +
        "}" +
        ".rhPopup {" +
        "    max-height: 75%;" +
        "    overflow: auto;" +
        "    min-width: 300px;" +
        "   max-width: 75%;" +
        "}" +
        ".rhPopupLarge {" +
        "    width: 75%;" +
        "}" +
        ".rhPopupIcon {" +
        "    height: 48px;" +
        "    width: 48px;" +
        "}" +
        ".rhPopupTitle span {" +
        "    font-weight: bold;" +
        "}" +
        ".rhPopupTextArea {" +
        "    max-height: 200px !important;" +
        "    min-height: 200px !important;" +
        "}" +
        ".rhPopupOptions, .rhDescription, .SMFeatures {" +
        "    margin: 5px;" +
        "}" +
        ".rhPopupButton {" +
        "    display: flex;" +
        "    justify-content: center;" +
        "    margin: 15px 0 0;" +
        "}" +
        ".rhPopupButton div {" +
        "    justify-content: center;" +
        "    line-height: normal;" +
        "    margin: 0 !important;" +
        "    min-width: 200px;" +
        "    padding: 7px 15px;" +
        "}" +
        ".rhPopupButton div >* {" +
        "    flex: 0;" +
        "}" +
        ".rhPopupStatus {" +
        "    margin: 15px 0;" +
        "}" +
        ".rhPopupResults {" +
        "    margin: 0 0 15px;" +
        "}" +
        ".rhPopupResults >:not(:last-child) {" +
        "    margin: 0 0 15px;" +
        "}" +
        ".rhPopupResults .popup__actions, .comment__actions .RMLLink {" +
        "    margin: 0 0 0 10px;" +
        "}" +
        ".rhPopupResults .popup__actions >* {" +
        "    border: 0;" +
        "    cursor: initial;" +
        "    display: inline-block;" +
        "}" +
        ".rhPopupResults .popup__actions a {" +
        "    border-bottom: 1px dotted;" +
        "}" +
        ".rhPopupResults .table__row-outer-wrap {" +
        "    margin: 0;" +
        "    text-align: left;" +
        "}" +
        ".rhPopout {" +
        "    align-self: baseline;" +
        "    background-color: #fff;" +
        "    border: 1px solid #d2d6e0;" +
        "    border-radius: 5px;" +
        "    cursor: initial;" +
        "    font-size: 12px;" +
        "    height: auto;" +
        "    line-height: normal;" +
        "    max-height: 600px;" +
        "    padding: 5px !important;" +
        "    position: absolute;" +
        "    text-align: left;" +
        "    text-shadow: none;" +
        "    white-space: nowrap;" +
        "    z-index: 997;" +
        "}" +
        ".rhCheckbox, .APAvatar, .APLink, .APLink >* {" +
        "    cursor: pointer;" +
        "}" +
        ".rhWBIcon {" +
        "    display: inline-block;" +
        "    line-height: normal;" +
        "    margin: 0 5px 0 0;" +
        "}" +
        ".rhWBIcon i {" +
        "    border: 0;" +
        "    line-height: normal;" +
        "    margin: 0;" +
        "    text-shadow: none !important;" +
        "}" +
        ".SMMenu .form__submit-button {" +
        "    margin: 0 5px;" +
        "}" +
        ".SMTags >* {" +
        "    display: none;" +
        "}" +
        ".SMManageDataPopup, .SMImport, .SMExport, .SMDelete, .SMTag {" +
        "    display: block;" +
        "}" +
        ".nav__row.SMRecentUsernameChanges, .nav__row.SMCommentHistory {" +
        "    display: flex;" +
        "}" +
        ".SMRecentUsernameChangesPopup a, .SMComments a {" +
        "    border-bottom: 1px dotted;" +
        "}" +
        ".SMSyncFrequency {" +
        "    display: block;" +
        "    width: 200px;" +
        "}" +
        ".HMBox {" +
        "    position: relative;" +
        "}" +
        ".ESHeading {" +
        "    margin: 0 0 5px;" +
        "}" +
        ".ESRecentDiscussions {" +
        "    margin: 25px 0;" +
        "}" +
        ".ESCommentBox {" +
        "    margin: 5px 0 15px;" +
        "    padding: 0;" +
        "}" +
        ".ESPanel >*:not(:last-child), .APBox .featured__table__row__left:not(.UHTitle), .MRReply, .MREdit {" +
        "    margin: 0 10px 0 0;" +
        "}" +
        ".ESStatus {" +
        "    margin: 5px 0;" +
        "    text-align: center;" +
        "}" +
        ".GVView {" +
        "    text-align: center;" +
        "}" +
        ".pinned-giveaways__inner-wrap--minimized.GVView .giveaway__row-outer-wrap:nth-child(-n+8) {" +
        "    display: inline-block;" +
        "}"+
        ".GVContainer {" +
        "    border: 0 !important;" +
        "    box-shadow: none !important;" +
        "    display: inline-block;" +
        "    margin: 5px;" +
        "    padding: 0;" +
        "    vertical-align: top;" +
        "}" +
        ".GVContainer .giveaway__columns:not(.GPPanel) {" +
        "    display: block;" +
        "}" +
        ".GVContainer .giveaway__columns:not(.GPPanel) >:first-child {" +
        "    margin: 0;" +
        "}" +
        ".GVIcons {" +
        "    position: absolute;" +
        "    width: 25px;" +
        "}" +
        ".GVIcons >:not(.GGPContainer) {" +
        "    text-align: center;" +
        "}" +
        ".GVIcons >* {" +
        "    border-radius: 2px;" +
        "    display: block;" +
        "    line-height: normal;" +
        "    padding: 2px;" +
        "    margin: 0 !important;" +
        "}" +
        ".GVIcons .GGPButton {" +
        "    padding: 0;" +
        "}" +
        ".GVBox {" +
        "    display: block;" +
        "    margin: 0 0 0 25px;" +
        "}" +
        ".GVBox >:first-child {" +
        "    margin: 0 !important;" +
        "}" +
        ".GVInfo {" +
        "    align-items: center;" +
        "    display: flex;" +
        "    position: absolute;" +
        "    text-align: left;" +
        "    z-index: 1;" +
        "}" +
        ".GVInfo >:last-child {" +
        "    margin: -35px 0 0 5px;" +
        "}" +
        ".GVInfo .text-right {" +
        "    text-align: left;" +
        "}" +
        ".GVInfo .GPLinks, .GVInfo .GPPanel {" +
        "    float: none;" +
        "}" +
        ".SMManageData, .SMRecentUsernameChanges, .SMCommentHistory, .SMManageTags, .ESPanel .pagination__navigation >*, .ESPanel .pagination_navigation >*, .ESRefresh, .ESPause," +
        ".PUNButton, .MTButton, .MTAll, .MTNone, .MTInverse, .WBCButton, .NAMWCButton, .NRFButton, .UGDButton, .GTSView, .UGSButton, .GDCBPButton, .CTGoToUnread, .CTMarkRead," +
        ".CTMarkVisited, .MCBPButton, .MPPButton, .ASButton {" +
        "    cursor: pointer;" +
        "    display: inline-block;" +
        "}" +
        ".SGPBButton i, .SGPBButton img {" +
        "    height: 14px;" +
        "    width: 14px;" +
        "}" +
        ".SGCBox .table__row-inner-wrap, .GGPBox .table__row-inner-wrap {" +
        "    padding: 0 10px;" +
        "}" +
        ".PUTButton i, .MTUserCheckbox i, .MTGameCheckbox i, .CFHPanel span >:first-child >* {" +
        "    margin: 0 !important;" +
        "}" +
        ".PUTButton, .GTButton {" +
        "    border: 0! important;" +
        "    cursor: pointer;" +
        "    display: inline-block;" +
        "    line-height: normal;" +
        "    margin: 0 0 0 5px;" +
        "    text-decoration: none !important;" +
        "}" +
        ".author_name + .PUTButton {" +
        "    margin: 0 5px 0 0;" +
        "}" +
        ".PUTTags, .GTTags {" +
        "    font-size: 10px;" +
        "    font-weight: bold;" +
        "}" +
        ".PUTTags >*, .GTTags >* {" +
        "    display: inline-block !important;" +
        "    height: auto;" +
        "    margin: 0;" +
        "    padding: 1px 2px;" +
        "    width: auto;" +
        "}" +
        ".PUTTags >:not(:first-child), .CTPanel >:not(:first-child), .GTTags >:not(:first-child) {" +
        "    margin: 0 0 0 5px;" +
        "}" +
        ".MTTag {" +
        "    display: inline-block;" +
        "}" +
        ".MTUserCheckbox, .MTGameCheckbox {" +
        "    display: inline-block;" +
        "    margin: 0 5px 0 0;" +
        "}" +
        ".NAMWCPositive {" +
        "    color: " + Positive + " !important;" +
        "    font-weight: bold;" +
        "}" +
        ".NAMWCNegative {" +
        "    color: " + Negative + " !important;" +
        "    font-weight: bold;" +
        "}" +
        ".NAMWCUnknown {" +
        "    color: " + Unknown + " !important;" +
        "    font-weight: bold;" +
        "}" +
        ".UGDData {" +
        "    width: 100%;" +
        "}" +
        ".UGDData tr:hover {" +
        "    background-color: rgba(119, 137, 154, 0.2);" +
        "}" +
        ".UGDData th {" +
        "    border: 1px solid;" +
        "    font-weight: bold;" +
        "    padding: 5px;" +
        "}" +
        ".UGDData td {" +
        "    border: 1px solid;" +
        "    padding: 5px;" +
        "}" +
        ".UGDData td:first-child {" +
        "    font-weight: bold;" +
        "}" +
        ".IWHIcon {" +
        "    margin: 0 0 0 5px;" +
        "}" +
        ".APBox .featured__outer-wrap:not(.UHBox) {" +
        "    padding: 5px;" +
        "    width: auto;" +
        "    white-space: normal;" +
        "}" +
        ".APBox .featured__inner-wrap, .MPPPostDefault {" +
        "    padding: 0;" +
        "}" +
        ".APBox .global__image-outer-wrap--avatar-large {" +
        "    height: 64px;" +
        "    margin: 5px;" +
        "    width: 64px;" +
        "}" +
        ".APBox .featured__heading, .APBox .sidebar__shortcut-inner-wrap {" +
        "    margin: 0;" +
        "}" +
        ".APBox .featured__heading__medium {" +
        "    font-size: 18px;" +
        "}" +
        ".APBox .featured__table {" +
        "    display: inline-block;" +
        "    width: 100%;" +
        "}" +
        ".APBox .featured__table__row {" +
        "    padding: 2px;" +
        "}" +
        ".GTSApply, .GTSDelete, .CTButton {" +
        "    cursor: pointer;" +
        "}" +
        ".GTSSave {" +
        "    display: inline-block;" +
        "    margin: 0 0 0 5px;" +
        "}" +
        ".SGGSticky {" +
        "    cursor: pointer;" +
        "    margin: 0 5px 0 0;" +
        "    opacity: 0.5;" +
        "}" +
        ".SGGUnsticky {" +
        "    cursor: pointer;" +
        "    margin: 0 5px 0 0;" +
        "}" +
        ".AGSPanel {" +
        "    margin: 0 0 15px 0;" +
        "}" +
        ".AGSFilter {" +
        "    display: flex;" +
        "}" +
        ".AGSFilter >* {" +
        "    display: inline-flex;" +
        "    justify-content: space-between;" +
        "    margin: 5px;" +
        "    width: 150px;" +
        "}" +
        ".AGSPanel input, .AGSPanel select {" +
        "    padding: 0 5px;" +
        "    width: 50px;" +
        "}" +
        ".EGHIcon {" +
        "    cursor: pointer;" +
        "    margin: 0 5px 0 0;" +
        "}" +
        ".GGPContainer {" +
        "    padding: 0;" +
        "}" +
        ".GGPButton {" +
        "    cursor: pointer;" +
        "    padding: 0 8px;" +
        "}" +
        ".GPLinks {" +
        "    float: left;" +
        "    margin: 2px;" +
        "}" +
        ".GPPanel {" +
        "    float: right;" +
        "    margin: 2px;" +
        "}" +
        ".GPPanel >:first-child {" +
        "    margin: 0;" +
        "}" +
        ".GPPanel >*:not(:first-child) {" +
        "    margin: 0 0 0 5px;" +
        "}" +
        ".ELGBButton, .ELGBButton + div {" +
        "    background: none;" +
        "    border: 0;" +
        "    box-shadow: none;" +
        "    padding: 0;" +
        "}" +
        ".ELGBButton >*, .ELGBButton + div >* {" +
        "    line-height: inherit;" +
        "    margin: 0;" +
        "}" +
        ".DHHighlight, .GHHighlight {" +
        "    background-color: " + Positive.replace(/rgb/, "rgba").replace(/\)/, ", 0.2)") + ";" +
        "}" +
        ".DHIcon {" +
        "    cursor: pointer;" +
        "    margin: 0 5px 0 0;" +
        "}" +
        ".page__heading .DHIcon {" +
        "    margin: 0;" +
        "}" +
        ".comment__actions .CTButton {" +
        "    margin: 0 0 0 10px;" +
        "}" +
        ".comment__actions >:first-child + .CTButton {" +
        "    margin: 0;" +
        "}" +
        ".CFHPanel {" +
        "    margin: 0 0 2px;" +
        "    text-align: left;" +
        "}" +
        ".CFHPanel >* {" +
        "    display: inline-block;" +
        "    margin: 1px !important;" +
        "    padding: 0;" +
        "}" +
        ".CFHPanel span >:first-child {" +
        "    cursor: pointer;" +
        "    display: flex;" +
        "    padding: 0 5px;" +
        "}" +
        ".CFHPanel span >:not(:first-child), .DEDStatus {" +
        "    display: block;" +
        "}" +
        ".CFHPanel span i {" +
        "    line-height: 22px;" +
        "}" +
        ".CFHPanel .form__saving-button {" +
        "    display: inline-block;" +
        "    margin: 5px;" +
        "    min-width:0;" +
        "}" +
        ".CFHPanel table {" +
        "    display: block;" +
        "    max-height: 200px;" +
        "    max-width: 375px;" +
        "    overflow: auto;" +
        "}" +
        ".CFHPanel table td:first-child {" +
        "   min-width: 25px;" +
        "   text-align: center;" +
        "}" +
        ".CFHPanel table td:not(:first-child) {" +
        "   min-width: 75px;" +
        "   text-align: center;" +
        "}" +
        ".CFHEmojis {" +
        "    display: block !important;" +
        "    font-size: 18px;" +
        "    max-height: 200px;" +
        "    min-height: 30px;" +
        "    overflow: auto;" +
        "    text-align: center;" +
        "}" +
        ".CFHEmojis >* {" +
        "    cursor: pointer;" +
        "    display: inline-block;" +
        "    margin: 2px;" +
        "}" +
        ".CFHPanel ~ textarea {" +
        "    max-height: 475px;" +
        "}" +
        ".CFHPopout {" +
        "    white-space: normal;" +
        "    width: 300px;" +
        "}" +
        ".MPPPostOpen {" +
        "    display: none;" +
        "    max-height: 75%;" +
        "    overflow: auto;" +
        "    padding: 15px;" +
        "    position: absolute;" +
        "    width: 75%;" +
        "}"
    );
}

function goToComment(hash) {
    var ID, Element, Top, Heading, Permalink;
    if (!hash) {
        hash = window.location.hash;
    }
    ID = hash.replace(/#/, "");
    if (ID && !window.location.pathname.match(/^\/account/)) {
        Element = document.getElementById(ID);
        if (Element) {
            Top = Element.offsetTop;
            window.scrollTo(0, Top);
            window.scrollBy(0, -esgst.commentsTop);
            Permalink = document.getElementsByClassName(esgst.sg ? "comment__permalink" : "author_permalink")[0];
            if (Permalink) {
                Permalink.remove();
            }
            Element.getElementsByClassName(esgst.sg ? "comment__username" : "author_avatar")[0].insertAdjacentHTML(
                esgst.sg ? "beforeBegin" : "afterEnd",
                "<div class=\"comment__permalink\">" +
                "    <i class=\"fa fa-share author_permalink\"></i>" +
                "</div>"
            );
        }
    }
}

function updateGroups() {
    var Popup;
    if (!GM_getValue("GSync")) {
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-refresh", "fa-spin");
        Popup.Title.textContent = "ESGST is updating your groups. Please wait...";
        Popup.Groups = [];
        syncGroups(Popup, "/account/steam/groups/search?page=", 1, function(Groups) {
            GM_setValue("GSync", true);
            GM_setValue("Groups", Popup.Groups);
            Popup.Title.textContent = "Done. You can close this now.";
        });
        Popup.popUp();
    }
}

function syncBundleList() {
    var popup = createPopup();
    popup.Icon.classList.add("fa-refresh");
    popup.Title.textContent = "Syncing...";
    var sync = {};
    createButton(popup.Button, "fa-times-circle", "Cancel", "", "", function() {
        sync.Canceled = true;
        popup.Close.click();
    }, null, true);
    sync.Progress = popup.Progress;
    sync.OverallProgress = popup.OverallProgress;
    popup.popUp().reposition();
    sync.games = GM_getValue(`Games`);
    syncBundles(sync, `/bundle-games/search?page=`, 1, function() {
        queueSave(sync, function() {
            updateGames(sync.games);
            GM_setValue(`LastSave`, 0);
            popup.Icon.classList.remove("fa-refresh");
            popup.Icon.classList.add("fa-check");
            popup.Title.textContent = "Synced!";
            popup.Button.innerHTML = "";
            sync.Progress.innerHTML = sync.OverallProgress.innerHTML = "";
            popup.Close.click();
            GM_setValue("LastBundleSync", new Date().getTime());
        });
    });
}

function syncBundles(sync, url, nextPage, callback, context) {
    if (context) {
        var matches = context.getElementsByClassName(`table__column__secondary-link`);
        for (var i = 0, n = matches.length; i < n; ++i) {
            var id = matches[i].textContent.match(/\d+/)[0];
            if (sync.games[id]) {
                sync.games[id].bundled = true;
            } else {
                sync.games[id] = {
                    bundled: true
                };
            }
        }
        var paginationNavigation = context.getElementsByClassName(`pagination__navigation`)[0];
        if (paginationNavigation && !paginationNavigation.lastElementChild.classList.contains(`is-selected`)) {
            window.setTimeout(syncBundles, 0, sync, url, nextPage, callback);
        } else {
            callback();
        }
    } else {
        sync.Progress.innerHTML = `
            <i class="fa fa-circle-o-notch fa-spin"></i>
            <span>Syncing bundles (page ${nextPage})...</span>
        `;
        queueRequest(sync, null, `${url}${nextPage}`, function(response) {
            window.setTimeout(syncBundles, 0, sync, url, ++nextPage, callback, parseHTML(response.responseText));
        });
    }
}

function updateGames(games) {
    var saved = GM_getValue(`Games`);
    for (var key in games) {
        if (saved[key]) {
            for (var subKey in games[key]) {
                saved[key][subKey] = games[key][subKey];
            }
        } else {
            saved[key] = games[key];
        }
    }
    GM_setValue(`Games`, saved);
}

function formatDate(EntryDate) {
    var Months, Hours, Minutes, OutputDate, Suffix;
    Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    Hours = EntryDate.getHours();
    Minutes = EntryDate.getMinutes();
    Minutes = (Minutes > 9) ? Minutes : ("0" + Minutes);
    OutputDate = Months[EntryDate.getMonth()] + " " + EntryDate.getDate() + ", " + EntryDate.getFullYear() + " ";
    if (Hours >= 12) {
        if (Hours > 12) {
            Hours -= 12;
        }
        Suffix = "pm";
    } else {
        if (Hours === 0) {
            Hours = 12;
        }
        Suffix = "am";
    }
    OutputDate += Hours + ":" + Minutes + " " + Suffix;
    return OutputDate;
}

// Features

function loadFixedHeader() {
    esgst.header.classList.add(`esgst-fh`);
    var headerSibling;
    if (esgst.featuredContainer && ((esgst.hfc && !esgst.giveawaysPath) || !esgst.hfc)) {
        headerSibling = esgst.featuredContainer;
    } else {
        headerSibling = esgst.pageOuterWrap;
    }
    headerSibling.classList.add(`esgst-fh-sibling`);
    addHeaderStyle();
}

function addHeaderStyle() {
    var height = esgst.header.offsetHeight;
    var style = `
        .esgst-fh-sibling {
            margin-top: ${height}px;
        }
    `;
    GM_addStyle(style);
    esgst.pageTop += height;
    esgst.commentsTop += height;
}

function loadFixedSidebar() {
    esgst.fs = {};
    esgst.fs.sidebarAd = esgst.sidebar.getElementsByClassName(`sidebar__mpu`)[0];
    esgst.fs.sidebarSibling = esgst.sidebar.nextElementSibling;
    document.addEventListener(`scroll`, fixSidebar);
    addSidebarStyle();
    fixSidebar();
}

function fixSidebar() {
    esgst.sidebarTop = esgst.sidebar.offsetTop - esgst.pageTop;
    if (window.scrollY > esgst.sidebarTop) {
        document.removeEventListener(`scroll`, fixSidebar);
        toggleFixedSidebar();
        document.addEventListener(`scroll`, unfixSidebar);
    }
}

function unfixSidebar() {
    if (window.scrollY <= esgst.sidebarTop) {
        document.removeEventListener(`scroll`, unfixSidebar);
        toggleFixedSidebar();
        document.addEventListener(`scroll`, fixSidebar);
    }
}

function toggleFixedSidebar() {
    esgst.sidebar.classList.toggle(`esgst-fs`);
    if (esgst.fs.sidebarAd) {
        esgst.fs.sidebarAd.classList.toggle(`esgst-hidden`);
    }
    esgst.fs.sidebarSibling.classList.toggle(`esgst-fs-sibling`);
}

function addSidebarStyle() {
    var style= `
        .esgst-fs {
            top: ${esgst.pageTop}px;
        }
        .esgst-fs-sibling {
            margin-left: ${esgst.sidebar.offsetWidth + 25}px !important;
        }
    `;
    GM_addStyle(style);
}

function loadFixedMainPageHeading() {
    var html = `
        <div class="esgst-fmph-placeholder esgst-hidden"></div>
        <div class="${esgst.pageOuterWrapClass} esgst-fmph-background esgst-hidden"></div>
    `;
    esgst.mainPageHeading.insertAdjacentHTML(`afterEnd`, html);
    esgst.mainPageHeadingPlaceholder = esgst.mainPageHeading.nextElementSibling;
    esgst.mainPageHeadingBackground = esgst.mainPageHeadingPlaceholder.nextElementSibling;
    document.addEventListener(`scroll`, fixMainPageHeading);
    addMainPageHeadingStyle();
    fixMainPageHeading();
}

function fixMainPageHeading() {
    if (window.scrollY > (esgst.mainPageHeading.offsetTop - esgst.pageTop)) {
        document.removeEventListener(`scroll`, fixMainPageHeading);
        toggleFixedMainPageHeading();
        document.addEventListener(`scroll`, unfixMainPageHeading);
    }
}

function unfixMainPageHeading() {
    if (window.scrollY <= (esgst.mainPageHeadingPlaceholder.offsetTop - esgst.pageTop)) {
        document.removeEventListener(`scroll`, unfixMainPageHeading);
        toggleFixedMainPageHeading();
        document.addEventListener(`scroll`, fixMainPageHeading);
    }
}

function toggleFixedMainPageHeading() {
    esgst.mainPageHeading.classList.toggle(`esgst-fmph`);
    esgst.mainPageHeadingPlaceholder.classList.toggle(`esgst-hidden`);
    esgst.mainPageHeadingBackground.classList.toggle(`esgst-hidden`);
}

function addMainPageHeadingStyle() {
    var width = esgst.mainPageHeading.offsetWidth;
    var height = esgst.mainPageHeading.offsetHeight;
    var style = `
        .esgst-fmph {
            top: ${esgst.pageTop}px;
            width: ${width}px;
        }

        .esgst-fmph-placeholder {
            height: ${height}px;
        }

        .esgst-fmph-background {
            height: ${esgst.pageTop + height + 5}px;
            width: ${width}px;
        }
    `;
    GM_addStyle(style);
    esgst.commentsTop += height + 30;
}

function loadFixedFooter() {
    esgst.footer.classList.add(`esgst-ff`);
    esgst.pageOuterWrap.classList.add(`esgst-ff-sibling`);
    addFooterStyle();
}

function addFooterStyle() {
    var style = `
        .esgst-ff-sibling {
            margin-bottom: ${esgst.footer.offsetHeight}px;
        }
    `;
    GM_addStyle(style);
}

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
                    if (Count > 0) {
                        if (Count > 9) {
                            Count = 0;
                        }
                        document.querySelector("link[rel='shortcut icon']").href = GM_getResourceURL(`hir${HIR.Name}Icon${Count}`);
                    } else {
                        document.querySelector("link[rel='shortcut icon']").href = GM_getResourceURL(`${esgst.name}Icon`);                        
                    }
                }
            }
        } else if (document.hasFocus()) {
            HIR.LastCount = 0;
            document.querySelector("link[rel='shortcut icon']").href = GM_getResourceURL(`${esgst.name}Icon`);
        }
    };
    makeRequest(null, esgst.sg ? "/giveaways/won" : "/", null, Callback);
}

function loadHiddenBlacklistStats() {
    var Chart, Match, Points, N, Data, I, CountDate, Year, Month, Day, Count, Context;
    Chart = document.getElementsByClassName("chart")[4];
    Match = Chart.previousElementSibling.textContent.match(/"Whitelists", data: \[(.+)\]},/)[1];
    Points = Match.split(/\],\[/);
    N = Points.length - 1;
    Points[0] = Points[0].replace(/^\[/, "");
    Points[N] = Points[N].replace(/\/]$/, "");
    Data = [];
    for (I = 0; I <= N; ++I) {
        Match = Points[I].match(/(.+), (.+)/);
        CountDate = Match[1].match(/\((.+?),(.+?),(.+?)\)/);
        Year = parseInt(CountDate[1]);
        Month = parseInt(CountDate[2]);
        Day = parseInt(CountDate[3]);
        Count = parseInt(Match[2]);
        Data.push([Date.UTC(Year, Month, Day), Count]);
    }
    Context = Chart.firstElementChild;
    Context.lastElementChild.remove();
    Context.lastElementChild.remove();
    Context = Context.nextElementSibling;
    Context.textContent = Context.textContent.replace(/and blacklists\s/, "");
    Context = Context.nextElementSibling;
    $(function() {
        chart_options.graph = {
            colors: ["#6187d4", "#ec656c"],
            tooltip: {
                headerFormat: "<p class=\"chart__tooltip-header\">{point.key}</p>",
                pointFormat: "<p class=\"chart__tooltip-point\" style=\"color: {point.color};\">{point.y:,.0f} {series.name}</p>"
            },
            series: [{
                name: "Whitelists",
                data: Data
            }]
        };
        $(Context).highcharts(Highcharts.merge(chart_options.default, chart_options.areaspline, chart_options.datetime, chart_options.graph));
    });
}

function loadVisibleAttachedImages(context) {
    var images = context.getElementsByClassName(esgst.attachedImagesClass);
    for (var i = 0, n = images.length; i < n; ++i) {
        var image = images[i].nextElementSibling.firstElementChild;
        if (image) {
            if (image.getAttribute(`src`).match(/\.gifv/)) {
                image.setAttribute(`src`, image.getAttribute(`src`).replace(/\.gifv/, `.gif`));
            }
            image.classList.remove(esgst.hiddenClass);
        }
    }
}

function loadEmbeddedVideos() {
    esgst.ev = {
        videoTypes: [
            {
                url: `youtube.com`,
                getEmbedUrl: getYoutubeComEmbedUrl
            },
            {
                url: `youtu.be`,
                getEmbedUrl: getYoutuBeEmbedUrl
            },
            {
                url: `vimeo.com`,
                getEmbedUrl: getVimeoEmbedUrl
            }
        ]
    };
    getVideos(document);
    esgst.endlessFeatures.push(getVideos);
}

function getVideos(context) {
    for (var i = 0, numTypes = esgst.ev.videoTypes.length; i < numTypes; ++i) {
        var type = esgst.ev.videoTypes[i];
        var videos = context.querySelectorAll(`a[href*="${type.url}"]`);
        for (var j = 0, numVideos = videos.length; j < numVideos; ++j) {
            var video = videos[j];
            var url = video.getAttribute(`href`);
            var text = video.textContent;
            var next = video.nextSibling;
            var previous = video.previousSibling;
            if ((!previous || !previous.textContent.trim()) && (!next || !next.textContent.trim())) {
                video.outerHTML = `
                    <div>
                        ${(url != text) ? `<div>${text}</div>` : ``}
                        <iframe width="640" height="360" src="${type.getEmbedUrl(url)}" frameborder="0" allowfullscreen></iframe>
                    </div>
                `;
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

function loadPaginationNavigationOnTop() {
    esgst.paginationNavigation.classList.add(`page_heading_btn`);
    esgst.mainPageHeading.appendChild(esgst.paginationNavigation);
}

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
        document.addEventListener(`scroll`, loadNextPage);
        loadNextPage();
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
        loadEndlessFeatures(context);
        setESHide(context);
        setESRemoveEntry(context);
        if (esgst.es_rs && esgst.discussionPath) {
            reverseComments(context);
            --nextPage;
            if (nextPage > 0) {
                document.addEventListener(`scroll`, loadNextPage);
                loadNextPage();
            }
        } else {
            ++nextPage;
            if (!paginationNavigation.lastElementChild.classList.contains(esgst.selectedClass)) {
                document.addEventListener(`scroll`, loadNextPage);
                loadNextPage();
            }
        }
        paginationNavigation.remove();
        document.addEventListener(`scroll`, changePaginationNavigation);

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
            if (gf.filtered) {
                var hidden = element.nextElementSibling.getElementsByClassName(`giveaway__row-outer-wrap esgst-hidden`).length;
                gf.filtered.textContent = parseInt(gf.filtered.textContent) - hidden;
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

function loadDeliveredGiftsNotifier() {
    makeRequest(null, "/giveaways/won", null, function(Response) {
        notifyDGNGift(parseHTML(Response.responseText), document.getElementsByClassName("nav__button-container--notification")[1]);
    });
}

function notifyDGNGift(ResponseHTML, WonIcon) {
    var Matches, Delivered, I, N, Received, NotReceived;
    Matches = ResponseHTML.getElementsByClassName("table__row-inner-wrap");
    Delivered = 0;
    for (I = 0, N = Matches.length; I < N; ++I) {
        Received = Matches[I].getElementsByClassName("table__gift-feedback-received")[0];
        NotReceived = Matches[I].getElementsByClassName("table__gift-feedback-not-received")[0];
        if ((Received.classList.contains("is-hidden") && ((NotReceived && NotReceived.classList.contains("is-hidden")) || !NotReceived)) &&
            Matches[I].querySelector("[data-clipboard-text]")) {
            ++Delivered;
        }
    }
    if (Delivered) {
        GM_addStyle(
            ".DGNIcon i {" +
            "    color: #FECC66;" +
            "}"
        );
        WonIcon.classList.add("DGNIcon");
        WonIcon.firstElementChild.title = "Giveaways Won (" + Delivered + " Delivered)";
    }
}

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

function loadHiddenFeaturedContainer() {
    esgst.featuredContainer.classList.add(`esgst-hidden`);
}

function loadAdvancedGiveawaySearch() {
    var Context, Input, Match, AGSPanel, AGS, Level, I, RegionRestricted;
    Context = document.getElementsByClassName("sidebar__search-container")[0];
    Context.firstElementChild.remove();
    Context.insertAdjacentHTML("afterBegin", "<input class=\"sidebar__search-input\" placeholder=\"Search...\" type=\"text\"/>");
    Input = Context.firstElementChild;
    Match = window.location.href.match(/q=(.*?)(&.+?)?$/);
    if (Match) {
        Input.value = Match[1];
    }
    Context.insertAdjacentHTML("afterEnd", "<div class=\"AGSPanel\"></div>");
    AGSPanel = Context.nextElementSibling;
    AGS = {};
    Level = "<select>";
    for (I = 0; I <= 10; ++I) {
        Level += "<option>" + I + "</option>";
    }
    Level += "</select>";
    createAGSFilters(AGSPanel, AGS, [{
        Title: "Level",
        HTML: Level,
        Key: "level",
    }, {
        Title: "Entries",
        HTML: "<input type=\"text\"/>",
        Key: "entry",
    }, {
        Title: "Copies",
        HTML: "<input type=\"text\"/>",
        Key: "copy"
    }]);
    AGS.level_max.selectedIndex = 10;
    AGSPanel.insertAdjacentHTML(
        "beforeEnd",
        "<div>" +
        "    <span></span>" +
        "    <span>Region Restricted</span>" +
        "</div>" +
        "<div>" +
        "    <span></span>" +
        "    <span>DLC</span>" +
        "</div>"
    );
    var dlc = AGSPanel.lastElementChild;
    var regionRestricted = dlc.previousElementSibling;
    RegionRestricted = createCheckbox(regionRestricted.firstElementChild).Checkbox;
    var DLC = createCheckbox(dlc.firstElementChild).Checkbox;
    Context.addEventListener("keydown", function(Event) {
        var Type, URL, Key;
        if (Event.key == "Enter") {
            Event.preventDefault();
            Type = window.location.href.match(/(type=(.+?))(&.+?)?$/);
            URL = "https://www.steamgifts.com/giveaways/search?q=" + Input.value + (Type ? ("&" + Type[1]) : "");
            for (Key in AGS) {
                if (AGS[Key].value) {
                    URL += "&" + Key + "=" + AGS[Key].value;
                }
            }
            URL += RegionRestricted.checked ? "&region_restricted=true" : "";
            URL += DLC.checked ? "&dlc=true" : "";
            window.location.href = URL;
        }
    });
}

function createAGSFilters(AGSPanel, AGS, Filters) {
    var I, N, AGSFilter;
    for (I = 0, N = Filters.length; I < N; ++I) {
        AGSPanel.insertAdjacentHTML(
            "beforeEnd",
            "<div class=\"AGSFilter\">" +
            "    <span>Min " + Filters[I].Title + " " + Filters[I].HTML + "</span>" +
            "    <span>Max " + Filters[I].Title + " " + Filters[I].HTML + "</span>" +
            "</div>"
        );
        AGSFilter = AGSPanel.lastElementChild;
        AGS[Filters[I].Key + "_min"] = AGSFilter.firstElementChild.firstElementChild;
        AGS[Filters[I].Key + "_max"] = AGSFilter.lastElementChild.firstElementChild;
    }
}

function loadGridView(context) {
    var matches = context.getElementsByClassName(`giveaway__row-outer-wrap`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        setGVContainer(matches[i]);
    }
}

function setGVContainer(Context) {
    var GVBox, GVInfo, Columns, GVIcons, Element;
    Context.parentElement.classList.add("GVView");
    Context.classList.add("GVContainer");
    GVBox = Context.getElementsByClassName("giveaway__row-inner-wrap")[0];
    GVBox.classList.add("GVBox");
    GVBox.insertAdjacentHTML("afterBegin", "<div class=\"global__image-outer-wrap GVInfo rhHidden\"></div>");
    GVInfo = GVBox.firstElementChild;
    do {
        Element = GVInfo.nextElementSibling;
        if (Element) {
            GVInfo.appendChild(Element);
        }
    } while (Element);
    GVBox.insertBefore(Context.getElementsByClassName("global__image-outer-wrap--game-medium")[0], GVInfo);
    Columns = Context.getElementsByClassName("giveaway__columns")[0];
    Context.insertAdjacentHTML("afterBegin", "<div class=\"GVIcons giveaway__columns\"></div>");
    GVIcons = Context.firstElementChild;
    while (!Columns.lastElementChild.classList.contains("giveaway__column--width-fill")) {
        Element = Columns.lastElementChild;
        if (Element.textContent.match(/Level/)) {
            Element.textContent = Element.textContent.replace(/Level\s/, "");
        }
        GVIcons.appendChild(Element);
    }
    GVBox.addEventListener("mouseenter", function() {
        GVInfo.classList.remove("rhHidden");
        GVInfo.removeAttribute("style");
        repositionPopout(GVInfo, GVBox);
    });
    GVBox.addEventListener("mouseleave", function() {
        GVInfo.classList.add("rhHidden");
    });
}

function loadPinnedGiveawaysButton() {
    var PGBButton, PGBContainer, HTML, PGBIcon;
    PGBContainer = esgst.pinnedGiveawaysButton.previousElementSibling;
    PGBContainer.classList.add("PGBContainer");
    esgst.pinnedGiveawaysButton.remove();
    HTML = `
        <div class="PGBButton pinned-giveaways__button">
            <i class="PGBIcon fa fa-angle-down"></i>
        </div>
    `;
    PGBContainer.insertAdjacentHTML("afterEnd", HTML);
    esgst.pinnedGiveawaysButton = PGBContainer.nextElementSibling;
    PGBIcon = esgst.pinnedGiveawaysButton.firstElementChild;

    function togglePGBButton() {
        PGBContainer.classList.toggle("pinned-giveaways__inner-wrap--minimized");
        PGBIcon.classList.toggle("fa-angle-down");
        PGBIcon.classList.toggle("fa-angle-up");
    }

    esgst.pinnedGiveawaysButton.addEventListener("click", togglePGBButton);
}

function loadGiveawayFilters() {
    var type = window.location.search.match(/type=(wishlist|group)/);
    if (type) {
        type = type[1].replace(/^(.)/, function(m, p1) {
            return p1.toUpperCase();
        });
    } else {
        type = ``;
    }
    esgst.gf = {
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
                name: `Wishlist`,
                key: `exceptionWishlist`
            },
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
    esgst.gf.filtered = collapse.nextElementSibling;
    for (var i = 0, n = esgst.gf.rangeFilters.length; i < n; ++i) {
        var rangeFilter = esgst.gf.rangeFilters[i];
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
        var minSavedValue = GM_getValue(`gf_${minKey}${esgst.gf.type}`);
        var maxSavedValue = GM_getValue(`gf_${maxKey}${esgst.gf.type}`);
        esgst.gf[minKey] = minSavedValue;
        esgst.gf[maxKey] = maxSavedValue;
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
        minFilter.addEventListener(`change`, saveGfValue.bind(null, minKey, `gf_${minKey}${esgst.gf.type}`, null));
        maxFilter.addEventListener(`change`, saveGfValue.bind(null, maxKey, `gf_${maxKey}${esgst.gf.type}`, null));
    }
    for (var i = 0, n = esgst.gf.checkboxFilters.length; i < n; ++i) {
        var checkboxFilter = esgst.gf.checkboxFilters[i];
        var name = checkboxFilter.name;
        var key = checkboxFilter.key;
        html = `
            <div class="esgst-gf-checkbox-filter">
                <span>${name}</span>
            </div>
        `;
        checkboxFilters.insertAdjacentHTML(`beforeEnd`, html);
        var gfCheckboxFilter = checkboxFilters.lastElementChild;
        var value = GM_getValue(`gf_${key}${esgst.gf.type}`);
        esgst.gf[key] = value;
        var checkbox = createCheckbox_v6(gfCheckboxFilter, value, true);
        checkbox.checkbox.addEventListener(`click`, saveGfValue.bind(null, key, `gf_${key}${esgst.gf.type}`, checkbox));
    }
    if (esgst.gc) {
        for (var i = 0, n = esgst.gf.categoryFilters.length; i < n; ++i) {
            var categoryFilter = esgst.gf.categoryFilters[i];
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
                var value = GM_getValue(`gf_${key}${esgst.gf.type}`);
                esgst.gf[key] = value;
                var checkbox = createCheckbox_v6(gfCategoryFilter, value, true);
                checkbox.checkbox.addEventListener(`click`, saveGfValue.bind(null, key, `gf_${key}${esgst.gf.type}`, checkbox));
            }
        }
    }
    for (var i = 0, n = esgst.gf.exceptionFilters.length; i < n; ++i) {
        var exceptionFilter = esgst.gf.exceptionFilters[i];
        var name = exceptionFilter.name;
        var key = exceptionFilter.key;
        html = `
            <div class="esgst-gf-exception-filter">
                <span>${name} ${(key == `exceptionMultiple`) ? `<input type="number" min="1">` : ``}</span>
            </div>
        `;
        exceptionFilters.insertAdjacentHTML(`beforeEnd`, html);
        var gfExceptionFilter = exceptionFilters.lastElementChild;
        var value = GM_getValue(`gf_${key}${esgst.gf.type}`);
        esgst.gf[key] = value;
        var checkbox = createCheckbox_v6(gfExceptionFilter, value);
        checkbox.checkbox.addEventListener(`click`, saveGfValue.bind(null, key, `gf_${key}${esgst.gf.type}`, checkbox));
        if (key == `exceptionMultiple`) {
            var input = gfExceptionFilter.lastElementChild.lastElementChild;
            var value = GM_getValue(`gf_exceptionMultipleCopies${esgst.gf.type}`);
            input.value = value;
            esgst.gf.exceptionMultipleCopies = value;
            input.addEventListener(`change`, saveGfValue.bind(null, `exceptionMultipleCopies`, `gf_exceptionMultipleCopies${esgst.gf.type}`, null));
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
    esgst.gf[key] = value;
    GM_setValue(name, value);
    filterGfGiveaways();
}

function filterGfGiveaways() {
    var giveaways = getGfGiveaways();
    for (var i = 0, n = giveaways.length; i < n; ++i) {
        var giveaway = giveaways[i];
        var count = parseInt(esgst.gf.filtered.textContent);
        var filtered = false;
        if ((giveaway.wishlist && !esgst.gf.exceptionWishlist) ||
            (giveaway.pinned && !esgst.gf.exceptionPinned) ||
            (giveaway.group && !esgst.gf.exceptionGroup) ||
            (giveaway.whitelist && !esgst.gf.exceptionWhitelist) ||
            (giveaway.regionRestricted && !esgst.gf.exceptionRegionRestricted) ||
            ((giveaway.copies > esgst.gf.exceptionMultipleCopies) && !esgst.gf.exceptionMultiple) ||
            (!giveaway.wishlist && !giveaway.pinned && !giveaway.group && !giveaway.whitelist && !giveaway.regionRestricted && (giveaway.copies <= esgst.gf.exceptionMultipleCopies))
        ) {
            for (var j = 0, numRangeFilters = esgst.gf.rangeFilters.length; !filtered && (j < numRangeFilters); ++j) {
                var name = esgst.gf.rangeFilters[j].name;
                var minKey = `min${name}`;
                var maxKey = `max${name}`;
                var key = name.toLowerCase();
                if ((giveaway[key] < esgst.gf[minKey]) || (giveaway[key] > esgst.gf[maxKey])) {
                    filtered = true;
                }
            }
            if (esgst.gc) {
                for (var j = 0, numCategoryFilters = esgst.gf.categoryFilters.length; !filtered && (j < numCategoryFilters); ++j) {
                    var categoryFilter = esgst.gf.categoryFilters[j];
                    var key = categoryFilter.key;
                    if (((esgst.gf[key] == `disabled`) && giveaway[key]) || ((esgst.gf[key] == `none`) && !giveaway[key])) {
                        filtered = true;
                    }
                }
            }
        }
        for (var j = 0, numCheckboxFilters = esgst.gf.checkboxFilters.length; !filtered && (j < numCheckboxFilters); ++j) {
            var checkboxFilter = esgst.gf.checkboxFilters[j];
            var key = checkboxFilter.key;
            if (((esgst.gf[key] == `disabled`) && giveaway[key]) || ((esgst.gf[key] == `none`) && !giveaway[key])) {
                filtered = true;
            }
        }
        if (filtered) {
            if (!giveaway.giveaway.classList.contains(`esgst-hidden`)) {
                esgst.gf.filtered.textContent = count + 1;
                giveaway.giveaway.classList.add(`esgst-hidden`);
            }
        } else if (giveaway.giveaway.classList.contains(`esgst-hidden`)) {
            esgst.gf.filtered.textContent = count - 1;
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
    var games = GM_getValue(`Games`);
    var matches = document.getElementsByClassName(`giveaway__row-outer-wrap`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        var context = matches[i];
        var giveaway = {
            giveaway: context
        };
        var id = context.querySelector(`a[href*="store.steampowered.com/app/"]`);
        if (id) {
            id = parseInt(id.getAttribute(`href`).match(/\d+/));
            if (games[id] && games[id].wishlist) {
                giveaway.wishlist = true;
            }
        }
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

function loadGiveawayPanel(context) {
    if (context == document) {
        if (esgst.gpGwc && esgst.enteredPath) {
            addGWCHeading();
        }
        if (esgst.gpGwc && esgst.giveawayPath && !document.querySelector(".table.table--summary")) {
            addGWCChance();
        }
    }
    var className, callback;
    if (esgst.enteredPath && esgst.gpGwc) {
        className = `table__row-inner-wrap`;
        callback = addGWCChance;
    } else {
        className = `giveaway__row-inner-wrap`;
        callback = addGPPanel;
    }
    var matches = context.getElementsByClassName(className);
    for (var i = 0, n = matches.length; i < n; ++i) {
        callback(matches[i]);
    }
}

function addGPPanel(Context) {
    var Columns, Heading, GP, GPLinks, GPPanel, Matches, Match, I, EntryPoints;
    Columns = Context.getElementsByClassName("giveaway__columns")[0];
    if (Columns.innerHTML.match(/remaining/)) {
        Heading = Context.getElementsByClassName("giveaway__heading__name")[0];
        GP = {};
        GP.URL = Heading.getAttribute("href");
        if (GP.URL) {
            GP.Title = Heading.textContent;
            if (!GP.Title.match(/^Invite Only$/)) {
                GPLinks = Context.getElementsByClassName("giveaway__links")[0];
                GPLinks.classList.add("GPLinks");
                GPLinks.insertAdjacentHTML("afterEnd", "<div class=\"giveaway__columns GPPanel\"></div>");
                GP.Entries = GPLinks.firstElementChild.lastElementChild;
                GPPanel = GPLinks.nextElementSibling;
                while (!Columns.lastElementChild.classList.contains("giveaway__column--width-fill")) {
                    GPPanel.insertBefore(Columns.lastElementChild, GPPanel.firstElementChild);
                }
                GPPanel.insertAdjacentHTML(
                    "beforeEnd",
                    "<div " + (esgst.gpGwc ? "" : "class=\"rhHidden\" ") + "title=\"Giveaway Winning Chance\">" +
                    "    <i class=\"fa fa-line-chart\"></i>" +
                    "    <span class=\"GWCChance\"></span>" +
                    "</div>" +
                    "<a class=\"GDCBPButton" + (esgst.gpGdrbp ? "" : " rhHidden") + "\" title=\"Read giveaway description / add a comment to the giveaway.\">" +
                    "    <i class=\"fa fa-file-text\"></i>" +
                    "    <i class=\"fa fa-comment\"></i>" +
                    "</a>" +
                    "<div class=\"" + ((esgst.gpElgb && !window.location.pathname.match(new RegExp("^\/user\/" + GM_getValue("Username")))) ? "ELGBButton" : "rhHidden") + "\"></div>" +
                    "<div class=\"rhHidden\">" +
                    "    <div class=\"sidebar__error is-disabled\">" +
                    "        <i class=\"fa fa-exclamation-circle\"></i> " +
                    "        <span>Not Enough Points</span>" +
                    "    </div>" +
                    "</div>"
                );
                GP.ELGBButton = GPPanel.lastElementChild.previousElementSibling;
                GP.GDCBPButton = GP.ELGBButton.previousElementSibling;
                GP.GWCChance = GP.GDCBPButton.previousElementSibling.lastElementChild;
                GP.Code = GP.URL.match(/\/giveaway\/(.+?)\//)[1];
                Matches = Heading.parentElement.getElementsByClassName("giveaway__heading__thin");
                Match = Matches[0].textContent.match(/\((.+) Copies\)/);
                if (Match) {
                    GP.Copies = parseInt(Match[1].replace(/,/g, ""));
                    I = 1;
                } else {
                    GP.Copies = 1;
                    I = 0;
                }
                EntryPoints = parseInt(Matches[I].textContent.match(/\d+/)[0]);
                GP.ELGBButton.setAttribute("data-points", EntryPoints);
                GP.Username = window.location.pathname.match(/^\/user\//) ?
                    document.getElementsByClassName("featured__heading__medium")[0].textContent : Context.getElementsByClassName("giveaway__username")[0].textContent;
                GP.Points = document.getElementsByClassName("nav__points")[0];
                if (esgst.gpElgb && !window.location.pathname.match(new RegExp("^\/user\/" + GM_getValue("Username")))) {
                    if (Context.classList.contains("esgst-faded")) {
                        GP.ELGBButton.setAttribute("data-entered", true);
                        setELGBButton(GP, "fa-minus-circle", "Leave", "Leaving...", "entry_delete", Context, true);
                    } else {
                        if (EntryPoints > parseInt(GP.Points.textContent)) {
                            GP.ELGBButton.nextElementSibling.classList.remove("rhHidden");
                        }
                        setELGBButton(GP, "fa-plus-circle", "Enter", "Entering...", "entry_insert", Context);
                    }
                }
                setGWCChance(GP.GWCChance, GP.Entries, GP.Copies);
                GP.GDCBPButton.addEventListener("click", function() {
                    displayGDCBPPopup(GP);
                });
            }
        }
    }
}

function setELGBButton(GP, Icon, Name, Message, Type, Context, Yellow) {
    createButton(GP.ELGBButton, Icon, Name, "fa-circle-o-notch fa-spin", Message, function() {
        enterLeaveELGBGiveaway(GP, Icon, Name, Message, Type, Context, Yellow);
    }, null, false, Yellow);
}

function enterLeaveELGBGiveaway(GP, Icon, Name, Message, Type, Context, Yellow) {
    var Data, URL;
    Data = "xsrf_token=" + esgst.xsrfToken + "&do=" + Type + "&code=" + GP.Code;
    URL = "/ajax.php";
    makeRequest(Data, URL, null, function(Response) {
        var ResponseJSON;
        ResponseJSON = parseJSON(Response.responseText);
        if (ResponseJSON.type == "success") {
            Context.classList.toggle("esgst-faded");
            GP.Entries.textContent = ResponseJSON.entry_count + " entries";
            GP.Points.textContent = ResponseJSON.points;
            setGWCChance(GP.GWCChance, GP.Entries, GP.Copies);
            if (GP.ELGBButton.getAttribute("data-entered")) {
                GP.ELGBButton.removeAttribute("data-entered");
                setELGBButton(GP, "fa-plus-circle", "Enter", "Entering...", "entry_insert", Context);
            } else {
                if (esgst.gpGdrbp && esgst.gpGdrbp_eg) {
                    displayGDCBPPopup(GP, true);
                }
                if (esgst.gh) {
                    saveEGHGame(Context);
                }
                GP.ELGBButton.setAttribute("data-entered", true);
                GP.ELGBButton.nextElementSibling.classList.add("rhHidden");
                setELGBButton(GP, "fa-minus-circle", "Leave", "Leaving...", "entry_delete", Context, true);
            }
        } else if (parseInt(GP.ELGBButton.getAttribute("data-points")) <= ResponseJSON.points) {
            GP.Points.textContent = ResponseJSON.points;
            GP.ELGBButton.innerHTML =
                "<div class=\"sidebar__error is-disabled\">" +
                "    <i class=\"fa fa-exclamation-circle\"></i> " +
                "    <span>" + ResponseJSON.msg + "</span>" +
                "</div>";
        } else {
            setELGBButton(GP, "fa-plus-circle", "Enter", "Entering...", "entry_insert", Context);
        }
        updateELGBButtons(ResponseJSON.points);
    });
}

function updateELGBButtons(Points) {
    var Matches, I, N;
    Matches = document.getElementsByClassName("ELGBButton");
    for (I = 0, N = Matches.length; I < N; ++I) {
        if (!Matches[I].getAttribute("data-entered")) {
            if (parseInt(Matches[I].getAttribute("data-points")) <= Points) {
                Matches[I].nextElementSibling.classList.add("rhHidden");
            } else {
                Matches[I].nextElementSibling.classList.remove("rhHidden");
            }
        }
    }
}

GM_addStyle(".GDCBPDescription { text-align: left; }");

function displayGDCBPPopup(GP, Enter) {
    GP.GDCBPButton.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
    makeRequest(null, GP.URL, null, function(Response) {
        var Description, Popup;
        GP.GDCBPButton.innerHTML =
            "<i class=\"fa fa-file-text\"></i> " +
            "<i class=\"fa fa-comment\"></i>";
        Description = parseHTML(Response.responseText).getElementsByClassName("page__description")[0];
        if (Description || (!Description && ((Enter && !esgst.gpGdrbp_d) || !Enter))) {
            Popup = createPopup(true);
            Popup.Popup.classList.add("GDCBPPopup");
            Popup.Icon.classList.add("fa-file-text");
            Popup.Title.innerHTML = "<span><a href=\"" + GP.URL + "\">" + GP.Title + "</a></span> by <a href=\"/user/" + GP.Username + "\">" + GP.Username + "</a>";
            if (Description) {
                Description.classList.add("GDCBPDescription");
                Popup.Description.insertBefore(Description, Popup.Description.firstElementChild);
                loadEndlessFeatures(Description);
            }
            Popup.TextArea.classList.remove("rhHidden");
            if (GM_getValue("CFH")) {
                addCFHPanel(Popup.TextArea);
            }
            createButton(Popup.Button, "fa-send", "Submit Comment", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                saveComment("", "", Popup.TextArea.value, GP.URL, Popup.Progress, Callback, function() {
                    makeRequest(null, GP.URL, Popup.Progress, function(Response) {
                        GP.Entries.parentElement.nextElementSibling.lastElementChild.textContent =
                            parseHTML(Response.responseText).getElementsByClassName("sidebar__navigation__item__count")[0].textContent + " comments";
                        Callback();
                        Popup.Close.click();
                    });
                });
            });
            Popup.popUp(function() {
                Popup.TextArea.focus();
            });
        }
    });
}

function setGWCChance(GWCChance, Entries, Copies) {
    var Chance;
    Entries = parseInt(Entries.textContent.replace(/,/g, "").match(/\d+/)[0]);
    Chance = (Entries > 0) ? (Math.round(Copies / Entries * 10000) / 100) : 100;
    if (Chance > 100) {
        Chance = 100;
    }
    GWCChance.textContent = Chance + "% (" + Math.round(Entries / Copies) + ":1)";
}

function addGWCHeading() {
    document.getElementsByClassName("table__heading")[0].firstElementChild.nextElementSibling.insertAdjacentHTML(
        "afterEnd",
        "<div class=\"table__column--width-small text-center\">Chance</div>"
    );
}

function addGWCChance(Context) {
    var Entered, Entries, Copies;
    Entered = true;
    if (!Context) {
        Context = document;
        Entered = false;
    }
    Entries = Context.getElementsByClassName(Entered ? "table__column--width-small" : "live__entry-count")[0];
    Copies = Context.getElementsByClassName(Entered ? "table__column__heading" : "featured__heading")[0].textContent.match(/\((.+) Copies\)/);
    Copies = Copies ? parseInt(Copies[1].replace(/,/g, "")) : 1;
    Context = Entered ? Entries : Context.getElementsByClassName("featured__column")[0];
    Context.insertAdjacentHTML(
        "afterEnd",
        "<div class=\"" + (Entered ? "table__column--width-small text-center" : "featured__column") + " GWCChance\" title=\"Giveaway winning chance.\">" + (Entered ? "" : (
            "<i class=\"fa fa-line-chart\"></i>")) +
        "    <span></span>" +
        "</div>"
    );
    setGWCChance(Context.nextElementSibling.lastElementChild, Entries, Copies);
}

function loadGiveawayGroupsPopup(context) {
    var matches = context.getElementsByClassName(`giveaway__column--group`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        addGGPBox(matches[i]);
    }
}

function addGGPBox(Context) {
    var URL, GGPButton, Popup;
    URL = Context.getAttribute("href");
    GGPButton = Context;
    GGPButton.classList.add("GGPButton");
    GGPButton.removeAttribute("href");
    GGPButton.addEventListener("click", function() {
        var GGPPopup;
        if (Popup) {
            Popup.popUp();
        } else {
            Popup = createPopup();
            Popup.Icon.classList.add("fa-user");
            Popup.Title.innerHTML = "<a href=\"" + URL + "\">Giveaway Groups</a>";
            Popup.OverallProgress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Loading giveaway groups...</span>";
            GGPPopup = Popup.popUp();
            getGGPGroups(URL + "/search?page=", 1, Popup.Progress, [], function(Groups) {
                var I, N;
                Popup.OverallProgress.innerHTML = "";
                for (I = 0, N = Groups.length; I < N; ++I) {
                    Popup.Results.appendChild(Groups[I]);
                }
                loadEndlessFeatures(Popup.Results);
                GGPPopup.reposition();
            });
        }
    });
}

function getGGPGroups(URL, NextPage, Context, Groups, Callback) {
    makeRequest(null, URL + NextPage, Context, function(Response) {
        var ResponseHTML, Matches, I, N, Pagination;
        ResponseHTML = parseHTML(Response.responseText);
        Matches = ResponseHTML.getElementsByClassName("table__row-outer-wrap");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Groups.push(Matches[I]);
        }
        Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
        if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
            getGGPGroups(URL, ++NextPage, Context, Groups, Callback);
        } else {
            Callback(Groups);
        }
    });
}

function loadGiveawayTemplates() {
    var GTS;
    GTS = {
        Name: ""
    };
    addGTSView(GTS);
    addGTSSave(GTS);
}

function addGTSView(GTS) {
    var Context, GTSContainer, GTSView, Popout, Templates, N, I;
    Context = document.getElementsByClassName("page__heading")[0];
    Context.insertAdjacentHTML(
        "afterBegin",
        "<div>" +
        "    <a class=\"GTSView\" title=\"View saved templates.\">" +
        "        <i class=\"fa fa-file\"></i>" +
        "    </a>" +
        "</div>"
    );
    GTSContainer = Context.firstElementChild;
    GTSView = GTSContainer.firstElementChild;
    Popout = createPopout(GTSContainer);
    Popout.customRule = function(Target) {
        return !GTSContainer.contains(Target);
    };
    Templates = GM_getValue("Templates");
    N = Templates.length;
    if (N) {
        for (I = 0; I < N; ++I) {
            Popout.Popout.insertAdjacentHTML(
                "beforeEnd",
                "<div class=\"GTSTemplate\">" +
                "    <span class=\"popup__actions GTSApply\">" +
                "        <a>" + Templates[I].Name + "</a>" +
                "    </span>" +
                "    <i class=\"fa fa-trash GTSDelete\" title=\"Delete template.\"></i>" +
                "</div>");
            setGTSTemplate(Popout.Popout.lastElementChild, Templates[I], GTS);
        }
    } else {
        Popout.Popout.textContent = "No templates saved.";
    }
    GTSView.addEventListener("click", function() {
        if (Popout.Popout.classList.contains("rhHidden")) {
            Popout.popOut(GTSContainer);
        } else {
            Popout.Popout.classList.add("rhHidden");
        }
    });
}

function setGTSTemplate(GTSTemplate, Template, GTS) {
    GTSTemplate.firstElementChild.addEventListener("click", function() {
        var CurrentDate, Context, Groups, Matches, I, N, ID, Selected, J;
        CurrentDate = Date.now();
        document.querySelector("[name='start_time']").value = formatDate(new Date(CurrentDate + Template.Delay));
        document.querySelector("[name='end_time']").value = formatDate(new Date(CurrentDate + Template.Delay + Template.Duration));
        document.querySelector("[data-checkbox-value='" + Template.Region + "']").click();
        document.querySelector("[data-checkbox-value='" + Template.Type + "']").click();
        if (Template.Type == "groups") {
            if (Template.Whitelist == 1) {
                Context = document.getElementsByClassName("form__group--whitelist")[0];
                if (!Context.classList.contains("is-selected")) {
                    Context.click();
                }
            }
            if (Template.Groups) {
                Groups = Template.Groups.trim().split(/\s/);
                Matches = document.getElementsByClassName("form__group--steam");
                for (I = 0, N = Matches.length; I < N; ++I) {
                    Context = Matches[I];
                    ID = Context.getAttribute("data-group-id");
                    Selected = Context.classList.contains("is-selected");
                    J = Groups.indexOf(ID);
                    if ((Selected && (J < 0)) || (!Selected && (J >= 0))) {
                        Context.click();
                    }
                }
            }
        }
        if (Template.Level > 0) {
            document.getElementsByClassName("ui-slider-range")[0].style.width = "100%";
            document.getElementsByClassName("form__level")[0].textContent = "level " + Template.Level;
            document.getElementsByClassName("form__input-description--no-level")[0].classList.add("is-hidden");
            document.getElementsByClassName("form__input-description--level")[0].classList.remove("is-hidden");
        } else {
            document.getElementsByClassName("ui-slider-range")[0].style.width = "0%";
            document.getElementsByClassName("form__input-description--level")[0].classList.add("is-hidden");
            document.getElementsByClassName("form__input-description--no-level")[0].classList.remove("is-hidden");
        }
        document.getElementsByClassName("ui-slider-handle")[0].style.left = (Template.Level * 10) + "%";
        document.querySelector("[name='contributor_level']").value = Template.Level;
        document.querySelector("[name='description']").value = Template.Description;
        GTS.Name = Template.Name;
    });
    GTSTemplate.lastElementChild.addEventListener("click", function() {
        var Templates, I, N;
        if (window.confirm("Are you sure you want to delete this template?")) {
            Templates = GM_getValue("Templates");
            for (I = 0, N = Templates.length; (I < N) && (Templates[I].Name != Template.Name); ++I);
            Templates.splice(I, 1);
            GM_setValue("Templates", Templates);
            if (GTS.Name == Template.Name) {
                GTS.Name = "";
            }
            GTSTemplate.remove();
        }
    });
}

function addGTSSave(GTS) {
    var Context;
    Context = document.getElementsByClassName("form__submit-button")[0];
    Context.insertAdjacentHTML("afterEnd", "<div class=\"GTSSave\"></div>");
    createButton(Context.nextElementSibling, "fa-file", "Save Template", "", "", function(Callback) {
        var Popup;
        Callback();
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-file");
        Popup.Title.textContent = "Save template:";
        Popup.TextInput.classList.remove("rhHidden");
        Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Enter a name for this template."));
        Popup.TextInput.value = GTS.Name;
        createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
            var StartTime, Delay, Template, Templates, I, N;
            if (Popup.TextInput.value) {
                StartTime = new Date(document.querySelector("[name='start_time']").value).getTime();
                Delay = StartTime - (new Date().getTime());
                Template = {
                    Name: Popup.TextInput.value,
                    Delay: (Delay > 0) ? Delay : 0,
                    Duration: (new Date(document.querySelector("[name='end_time']").value).getTime()) - StartTime,
                    Region: document.querySelector("[name='region']").value,
                    Type: document.querySelector("[name='who_can_enter']").value,
                    Whitelist: document.querySelector("[name='whitelist']").value,
                    Groups: document.querySelector("[name='group_string']").value,
                    Level: document.querySelector("[name='contributor_level']").value,
                    Description: document.querySelector("[name='description']").value
                };
                Templates = GM_getValue("Templates");
                if (GTS.Name == Popup.TextInput.value) {
                    for (I = 0, N = Templates.length; (I < N) && (Templates[I].Name != GTS.Name); ++I);
                    if (I < N) {
                        Templates[I] = Template;
                    } else {
                        Templates.push(Template);
                    }
                } else {
                    Templates.push(Template);
                }
                GM_setValue("Templates", Templates);
                Callback();
                Popup.Close.click();
            } else {
                Popup.Progress.innerHTML =
                    "<i class=\"fa fa-times-circle\"></i> " +
                    "<span>You must enter a name.</span>";
                Callback();
            }
        });
        Popup.popUp(function() {
            Popup.TextInput.focus();
        });
    });
}

function loadStickiedGiveawayGroups(context) {
    if (!esgst.newGiveawayPath) {
        esgst.endlessFeatures.push(getSGGGroups);
    }
    getSGGGroups(context);
}

function getSGGGroups(context) {
    var matches = context.getElementsByClassName(`table__row-inner-wrap`);
    setSGGGroups(matches);
}

function setSGGGroups(Matches) {
    var StickiedGroups, SGG, Groups, I, NumMatches, Context, ID, Name, J, NumGroups;
    StickiedGroups = GM_getValue("StickiedGroups");
    if (esgst.newGiveawayPath) {
        SGG = {
            Container: document.getElementsByClassName("form__groups")[0]
        };
        SGG.Separator = SGG.Container.firstElementChild.nextElementSibling;
        Matches = SGG.Container.getElementsByClassName("form__group--steam");
        Groups = GM_getValue("Groups");
        for (I = 0, NumMatches = Matches.length; I < NumMatches; ++I) {
            Context = Matches[I];
            ID = Context.getAttribute("data-group-id");
            Name = Context.getElementsByClassName("form__group__name")[0].textContent.substr(0, 22);
            if (StickiedGroups.indexOf(ID) < 0) {
                setSGGButton(Context, true, ID, SGG);
            } else {
                if (Context == SGG.Separator) {
                    SGG.Separator = SGG.Separator.nextElementSibling;
                }
                SGG.Container.insertBefore(Context, SGG.Separator);
                setSGGButton(Context, false, ID, SGG);
            }
            for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Name.substr(0, 22) != Name); ++J);
            if ((J < NumGroups) && !Groups[J].ID) {
                Groups[J].ID = ID;
            }
        }
        GM_setValue("Groups", Groups);
    } else {
        Groups = GM_getValue("Groups");
        for (I = 0, NumMatches = Matches.length; I < NumMatches; ++I) {
            Context = Matches[I];
            Name = Context.getElementsByClassName("table__column__heading")[0].textContent;
            for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Name != Name); ++J);
            if (J < NumGroups) {
                ID = Groups[J].ID;
                if (ID) {
                    setSGGButton(Context, StickiedGroups.indexOf(ID) < 0, ID);
                }
            }
        }
    }
}

function setSGGButton(Context, Sticky, ID, SGG) {
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"" + (Sticky ? "SGGSticky" : "SGGUnsticky") + "\" title=\"" + (Sticky ? "Sticky" : "Unsticky") + " group.\">" +
        "    <i class=\"fa fa-thumb-tack\"></i>" +
        "</a>"
    );
    Context.firstElementChild.addEventListener("click", function(Event) {
        var StickiedGroups;
        Event.stopPropagation();
        StickiedGroups = GM_getValue("StickiedGroups");
        if (Sticky) {
            StickiedGroups.push(ID);
            if (SGG) {
                if (Context == SGG.Separator) {
                    SGG.Separator = SGG.Separator.nextElementSibling;
                }
                SGG.Container.insertBefore(Context, SGG.Separator);
            }
        } else {
            StickiedGroups.splice(StickiedGroups.indexOf(ID), 1);
            if (SGG) {
                SGG.Container.insertBefore(Context, SGG.Separator);
                SGG.Separator = SGG.Separator.previousElementSibling;
            }
        }
        GM_setValue("StickiedGroups", StickiedGroups);
        Event.currentTarget.remove();
        setSGGButton(Context, !Sticky, ID, SGG);
    });
}

function loadRealCvCalculator() {
    var table = document.getElementsByClassName(`table--summary`)[0];
    if (table) {
        var id = GM_getValue(`rcvcId`);
        if (id) {
            var headings = document.getElementsByClassName(`featured__heading__small`);
            var copiesHeading, pointsHeading;
            if (headings.length > 1) {
                copiesHeading = headings[0];
                pointsHeading = headings[1];
            } else {
                pointsHeading = headings[0];
            }
            var copies;
            if (copiesHeading) {
                copies = parseInt(copiesHeading.textContent.match(/\d+/)[0]);
            } else {
                copies = 1;
            }
            var value = parseInt(pointsHeading.textContent.match(/\d+/)[0]);
            var games = GM_getValue(`Games`);
            if (games[id] && games[id].bundled) {
                value *= 0.15;
            }
            var user = {
                Username: GM_getValue(`Username`),
                SteamID64: GM_getValue(`SteamID64`)
            };
            var savedUser = getUser(user);
            var sent = 0;
            if (savedUser && savedUser.UGD && savedUser.UGD.Sent && savedUser.UGD.Sent[id]) {
                var giveaways = savedUser.UGD.Sent[id];
                for (var i = 0, n = giveaways.length; i < n; ++i) {
                    var giveaway = giveaways[i];
                    if (((giveaways.Entries < 5) && !giveaway.Private && !giveaway.Group && !giveaway.Whitelist) ||
                        (giveaway.Entries >= 5)
                    ) {
                        if (giveaway.Entries >= giveaway.Copies) {
                            sent += giveaway.Copies;
                        } else {
                            sent += giveaway.Entries;
                        }
                    }
                }
                if (sent > 5) {
                    for (var i = 0, n = sent - 5; i < n; ++i) {
                        value *= 0.90;
                    }
                }
            }
            var cv;
            if (copies > 1) {
                var total = copies + sent;
                if (total > 5) {
                    n = total - 5;
                    cv = (copies - n) * value;
                    for (var i = 0; i < n; ++i) {
                        value *= 0.90;
                        cv += value;
                    }
                } else {
                    cv = value * copies;
                }
            } else if ((sent + 1) > 5) {
                cv = value * 0.90;
            } else {
                cv = value;
            }
            cv = Math.round(cv * 100) / 100;
            var html = `
                <div class="table__row-outer-wrap">
                    <div class="table__row-inner-wrap">
                        <div class="table__column--width-medium table__column--align-top">
                            <strong>Real CV</strong>
                        </div>
                    <div class="table__column--width-fill">You should get ~$${cv} real CV for this giveaway.</div>
            		</div>
            	</div>
            `;
            table.insertAdjacentHTML(`beforeEnd`, html);
            var button = document.getElementsByClassName(`js__submit-form`)[0];
            button.addEventListener(`click`, function() {
                GM_deleteValue(`rcvcId`);
            })
        }
    } else {
        var button = document.getElementsByClassName(`js__submit-form`)[0];
        var input = document.querySelector(`[name="game_id"]`);
        button.addEventListener(`click`, function() {
            var selectedId = input.value;
            var selected = document.querySelector(`[data-autocomplete-id="${selectedId}"]`);
            var id = parseInt(selected.getElementsByClassName(`table__column__secondary-link`)[0].textContent.match(/\d+/)[0]);
            GM_setValue(`rcvcId`, id);
        });
    }
}

function loadUnsentGiftsSender() {
    if (esgst.newTicketPath) {
        setUGSObserver();
    } else {
        addUGSButton(esgst.mainPageHeading);
    }
}

function setUGSObserver() {
    document.getElementsByClassName("form__submit-button")[0].addEventListener("click", function() {
        var Winner, Rerolls;
        if (document.querySelector("[name='category_id']").value == 1) {
            Winner = document.querySelector("[name='reroll_winner_id']").value;
            Rerolls = GM_getValue("Rerolls");
            if (Rerolls.indexOf(Winner) < 0) {
                Rerolls.push(Winner);
                GM_setValue("Rerolls", Rerolls);
            }
        }
    });
}

function addUGSButton(Context) {
    var Popup, UGS, UGSButton;
    Popup = createPopup();
    Popup.Icon.classList.add("fa-gift");
    Popup.Title.textContent = "Send unsent gifts:";
    UGS = {};
    createOptions(Popup.Options, UGS, [{
        Check: function() {
            return true;
        },
        Description: "Only send to users with 0 not activated / multiple wins.",
        Title: "This option will retrieve the results in real time, without using caches.",
        Name: "SendActivatedNotMultiple",
        Key: "SANM",
        ID: "UGS_SANM"
    }, {
        Check: function() {
            return true;
        },
        Description: "Only send to users who are whitelisted.",
        Title: "This option will use your whitelist cache.\nMake sure to sync it through the settings menu if you whitelisted a new user since the last sync.\n" + (
            "Whitelisted users get a pass for not activated / multiple wins."),
        Name: "SendWhitelist",
        Key: "SW",
        ID: "UGS_SW"
    }, {
        Check: function() {
            return true;
        },
        Description: "Only send to users who are still members of at least one of the groups for group giveaways.",
        Title: "This option will retrieve the results in real time.\n" + (
            "Group members get a pass for not activated / multiple wins and for not being whitelisted."),
        Name: "SendGroup",
        Key: "G",
        ID: "UGS_G"
    }]);
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"UGSButton\" title=\"Send unsent gifts.\">" +
        "    <i class=\"fa fa-gift\"></i>" +
        "    <i class=\"fa fa-send\"></i>" +
        "</a>"
    );
    UGSButton = Context.firstElementChild;
    createButton(Popup.Button, "fa-send", "Send", "fa-times-circle", "Cancel", function(Callback) {
        var Match;
        UGSButton.classList.add("rhBusy");
        UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
        UGS.Sent.classList.add("rhHidden");
        UGS.Unsent.classList.add("rhHidden");
        UGS.SentCount.textContent = UGS.UnsentCount.textContent = "0";
        UGS.SentUsers.innerHTML = UGS.UnsentUsers.innerHTML = "";
        UGS.Canceled = false;
        UGS.Giveaways = [];
        UGS.Checked = [];
        UGS.Winners = GM_getValue("Winners");
        Match = window.location.href.match(/page=(\d+)/);
        getUGSGiveaways(UGS, 1, Match ? parseInt(Match[1]) : 1, function() {
            var N;
            N = UGS.Giveaways.length;
            if (N > 0) {
                if (UGS.G.checked) {
                    getUgsGiveawayGroups(UGS, 0, N, function() {
                        getUGSWinners(UGS, 0, N, function() {
                            UGSButton.classList.remove("rhBusy");
                            UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
                            GM_setValue("Winners", UGS.Winners);
                            Callback();
                        });
                    });
                } else {
                    getUGSWinners(UGS, 0, N, function() {
                        UGSButton.classList.remove("rhBusy");
                        UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
                        GM_setValue("Winners", UGS.Winners);
                        Callback();
                    });
                }
            } else {
                UGSButton.classList.remove("rhBusy");
                UGS.Progress.innerHTML =
                    "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> " +
                    "<span>You have no unsent gifts.</span>";
                UGS.OverallProgress.innerHTML = "";
                Callback();
            }
        });
    }, function() {
        clearInterval(UGS.Request);
        clearInterval(UGS.Save);
        UGS.Canceled = true;
        setTimeout(function() {
            UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
        }, 500);
        UGSButton.classList.remove("rhBusy");
    });
    UGS.Progress = Popup.Progress;
    UGS.OverallProgress = Popup.OverallProgress;
    createResults(Popup.Results, UGS, [{
        Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
        Description: "Sent gifts to ",
        Key: "Sent"
    }, {
        Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
        Description: "Did not send gifts to ",
        Key: "Unsent"
    }]);
    UGSButton.addEventListener("click", function() {
        UGS.Popup = Popup.popUp();
    });
}

function getUgsGiveawayGroups(ugs, i, n, callback) {
    if (i < n) {
        ugs.Giveaways[i].Groups = [];
        getNextUgsGiveawayGroupsPage(ugs, i, `${ugs.Giveaways[i].URL.replace(/\/winners/, ``)}/groups/search?page=`, 1, function() {
            window.setTimeout(getUgsGiveawayGroups, 0, ugs, ++i, n, callback);
        });
    } else {
        callback();
    }
}

function getNextUgsGiveawayGroupsPage(ugs, I, url, nextPage, callback, context) {
    if (context) {
        var matches = context.getElementsByClassName(`table__column__heading`);
        for (var i = 0, n = matches.length; i < n; ++i) {
            var title = matches[i].getAttribute(`href`).match(/\/group\/.+\/(.+)/)[1];
            ugs.Giveaways[I].Groups.push(title);
        }
        var paginationNavigation = context.getElementsByClassName(`pagination__navigation`)[0];
        if (paginationNavigation && !paginationNavigation.lastElementChild.classList.contains(`is-selected`)) {
            window.setTimeout(getNextUgsGiveawayGroupsPage, 0, ugs, I, url, nextPage, callback);
        } else {
            callback();
        }
    } else {
        ugs.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Getting " + ugs.Giveaways[I].Name + "'s groups...</span>";
        queueRequest(ugs, null, `${url}${nextPage}`, function(response) {
            var context = parseHTML(response.responseText);
            window.setTimeout(getNextUgsGiveawayGroupsPage, 0, ugs, I, url, ++nextPage, callback, context);
        });
    }
}

function getUGSGiveaways(UGS, NextPage, CurrentPage, Callback, Context) {
    var Matches, N, I, Pagination;
    if (Context) {
        Matches = Context.getElementsByClassName("fa icon-red fa-warning");
        N = Matches.length;
        if (N > 0) {
            for (I = 0; I < N; ++I) {
                UGS.Giveaways.push({
                    Name: Matches[I].closest(".table__row-inner-wrap").getElementsByClassName("table__column__heading")[0].textContent.match(/(.+?)( \(.+ Copies\))?$/)[1],
                    URL: Matches[I].nextElementSibling.getAttribute("href"),
                    Context: Matches[I]
                });
            }
            Pagination = Context.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                window.setTimeout(getUGSGiveaways, 0, UGS, NextPage, CurrentPage, Callback);
            } else {
                Callback();
            }
        } else {
            Callback();
        }
    } else if (!UGS.Canceled) {
        UGS.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch\"></i> " +
            "<span>Retrieving unsent giveaways (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            if (!document.getElementById(`esgst-es-page-${NextPage}`)) {
                queueRequest(UGS, null, "/giveaways/created/search?page=" + NextPage, function(Response) {
                    window.setTimeout(getUGSGiveaways, 0, UGS, ++NextPage, CurrentPage, Callback, parseHTML(Response.responseText));
                });
            } else {
                window.setTimeout(getUGSGiveaways, 0, UGS, ++NextPage, CurrentPage, Callback);
            }
        } else {
            window.setTimeout(getUGSGiveaways, 0, UGS, ++NextPage, CurrentPage, Callback, document);
        }
    }
}

function checkUgsUserGroups(ugs, i, n, j, steamId64, callback) {
    if (i < n) {
        makeRequest(null, `http://steamcommunity.com/groups/${ugs.Giveaways[j].Groups[i]}/memberslistxml/?xml=1`, ugs, function(response) {
            var responseText = response.responseText;
            var reg = new RegExp(`<steamID64>${steamId64}</steamID64>`);
            if (reg.exec(responseText)) {
                callback(true);
            }  else {
                window.setTimeout(checkUgsUserGroups, 0, ugs, ++i, n, j, steamId64, callback);
            }
        });
    } else {
        callback(false);
    }
}

function getUGSWinners(UGS, I, N, Callback) {
    if (!UGS.Canceled) {
        UGS.OverallProgress.textContent = I + " of " + N + " giveaways retrieved...";
        if (I < N) {
            UGS.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Retrieving winners...</span>";
            queueRequest(UGS, null, UGS.Giveaways[I].URL, function(Response) {
                var ResponseHTML, Matches, Winners, J, NumMatches, WinnersKeys;
                ResponseHTML = parseHTML(Response.responseText);
                Matches = ResponseHTML.getElementsByClassName("table__row-inner-wrap");
                Winners = {};
                for (J = 0, NumMatches = Matches.length; J < NumMatches; ++J) {
                    Winners[Matches[J].getElementsByClassName("table__column__heading")[0].textContent] = Matches[J].querySelector("[name='winner_id']").value;
                }
                if (NumMatches < 25) {
                    WinnersKeys = sortArray(Object.keys(Winners));
                    sendUGSGifts(UGS, 0, WinnersKeys.length, I, WinnersKeys, Winners, function() {
                        window.setTimeout(getUGSWinners, 0, UGS, ++I, N, Callback);
                    });
                } else {
                    queueRequest(UGS, null, UGS.Giveaways[I].URL + "/search?page=2", function(Response) {
                        Matches = parseHTML(Response.responseText).getElementsByClassName("table__row-inner-wrap");
                        for (J = 0, NumMatches = Matches.length; J < NumMatches; ++J) {
                            Winners[Matches[J].getElementsByClassName("table__column__heading")[0].textContent] = Matches[J].querySelector("[name='winner_id']").value;
                        }
                        WinnersKeys = sortArray(Object.keys(Winners));
                        sendUGSGifts(UGS, 0, WinnersKeys.length, I, WinnersKeys, Winners, function() {
                            window.setTimeout(getUGSWinners, 0, UGS, ++I, N, Callback);
                        });
                    });
                }
            });
        } else {
            Callback();
        }
    }
}

function sendUGSGifts(UGS, I, N, J, Keys, Winners, Callback) {
    var Reroll, SANM, SW, User;
    if (!UGS.Canceled) {
        UGS.OverallProgress.innerHTML = I + " of " + N + " winners checked...";
        if (I < N) {
            UGS.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Sending " + UGS.Giveaways[J].Name + " to " + Keys[I] + "...</span>";
            Reroll = GM_getValue("Rerolls").indexOf(Winners[Keys[I]]) < 0;
            if (Reroll && (UGS.Checked.indexOf(Keys[I] + UGS.Giveaways[J].Name) < 0)) {
                SANM = UGS.SANM.checked;
                SW = UGS.SW.checked;
                G = UGS.G.checked;
                if (SANM || SW || G) {
                    User = {
                        Username: Keys[I]
                    };
                    queueSave(UGS, function() {
                        saveUser(User, UGS, function() {
                            var SavedUser;
                            GM_setValue("LastSave", 0);
                            SavedUser = getUser(User);
                            if (G && UGS.Giveaways[J].Groups.length) {
                                UGS.Progress.innerHTML =
                                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                                    "<span>Checking if user is a member of one of the " + UGS.Giveaways[J].Name + " groups...</span>";
                                checkUgsUserGroups(UGS, 0, UGS.Giveaways[J].Groups.length, J, SavedUser.SteamID64, function(member) {
                                    if (member) {
                                        sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                                    } else {
                                        UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                                        UGS.Unsent.classList.remove("rhHidden");
                                        UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                                        UGS.UnsentUsers.insertAdjacentHTML(
                                            "beforeEnd",
                                            "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name + "</a>)</span>"
                                        );
                                        sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
                                    }
                                });
                            } else if (SANM) {
                                if (SW && SavedUser.Whitelisted) {
                                    sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                                } else {
                                    User.NAMWC = SavedUser.NAMWC;
                                    updateNAMWCResults(User, UGS, function() {
                                        if (!User.NAMWC) {
                                            User.NAMWC = {
                                                Results: {}
                                            };
                                        }
                                        checkNAMWCNotActivated(UGS, User, function() {
                                            checkNAMWCMultiple(UGS, User, function() {
                                                queueSave(UGS, function() {
                                                    saveUser(User, UGS, function() {
                                                        GM_setValue("LastSave", 0);
                                                        if (User.NAMWC.Results.Activated && User.NAMWC.Results.NotMultiple) {
                                                            sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                                                        } else {
                                                            UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                                                            UGS.Unsent.classList.remove("rhHidden");
                                                            UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                                                            UGS.UnsentUsers.insertAdjacentHTML(
                                                                "beforeEnd",
                                                                "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" +
                                                                UGS.Giveaways[J].Name + "</a>)</span>"
                                                            );
                                                            sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                            } else if (SavedUser.Whitelisted) {
                                sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                            } else {
                                UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                                UGS.Unsent.classList.remove("rhHidden");
                                UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                                UGS.UnsentUsers.insertAdjacentHTML(
                                    "beforeEnd",
                                    "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name + "</a>)</span>"
                                );
                                sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
                            }
                        });
                    });
                } else {
                    sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                }
            } else {
                UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                UGS.Unsent.classList.remove("rhHidden");
                UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                UGS.UnsentUsers.insertAdjacentHTML(
                    "beforeEnd",
                    "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (" + (!Reroll ? ("Being rerolled for <a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name +
                                                                                                  "</a>.)") : ("Already won <a href=\"" + UGS.Giveaways[J].URL + "\">" +
                                                                                                               UGS.Giveaways[J].Name + "</a> from you.)")) + "</span>"
                );
                sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
            }
        } else {
            Callback();
        }
    }
}

function sendUGSGift(UGS, Winners, Keys, I, J, N, Callback) {
    if (!UGS.Canceled) {
        queueRequest(UGS, "xsrf_token=" + esgst.xsrfToken + "&do=sent_feedback&action=1&winner_id=" + Winners[Keys[I]], "/ajax.php", function(Response) {
            var Key;
            UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
            UGS.Sent.classList.remove("rhHidden");
            UGS.SentCount.textContent = parseInt(UGS.SentCount.textContent) + 1;
            UGS.SentUsers.insertAdjacentHTML(
                "beforeEnd",
                "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name + "</a>)</span>"
            );
            UGS.Giveaways[J].Context.className = "fa fa-check-circle icon-green";
            UGS.Giveaways[J].Context.nextElementSibling.textContent = "Sent";
            Key = UGS.Giveaways[J].URL.match(/\/giveaway\/(.+?)\//)[1];
            if (!UGS.Winners[Key]) {
                UGS.Winners[Key] = [];
            }
            if (UGS.Winners[Key].indexOf(Keys[I]) < 0) {
                UGS.Winners[Key].push(Keys[I]);
            }
            sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
        });
    }
}

function loadEntriesRemover() {
    if (esgst.enteredPath) {
        addERButton(esgst.mainPageHeading);
    } else {
        addERButton();
    }
}

function addERButton(Context) {
    var HTML, Button, Popup, URL, CurrentPage, NextPage, OwnedGames, RemovedEntries;
    if (Context) {
        HTML = `
            <div class="ERButton" title="Remove entries for owned games.">
                <i class="fa fa-tag"></i>
                <i class="fa fa-times-circle"></i>
            </div>
        `;
        Context.insertAdjacentHTML(`afterBegin`, HTML);
        Button = Context.firstElementChild;
    } else {
        Button = document.getElementsByClassName(`form__sync-default`)[0];
    }
    if (Button) {
        Popup = createPopup();
        Popup.Popup.classList.add(`rhPopupLarge`);
        Popup.Icon.classList.add(`fa-times`);
        Popup.Title.textContent = `Remove entries for owned games:`;
        URL = `/giveaways/entered/search?page=`;
        if (window.location.pathname.match(/^\/giveaways\/entered/)) {
            CurrentPage = esgst.currentPage;
        } else {
            CurrentPage = 0;
        }
        NextPage = 1;
        Button.addEventListener(`click`, openPopup);
    }

    function openPopup() {
        Button.classList.add(`rhBusy`);
        Popup.popUp(getResult);
    }

    function getResult() {
        var games = GM_getValue(`Games`);
        syncOwnedGames(Popup, games, checkResult);
    }

    function checkResult(Result) {
        Popup.OverallProgress.textContent = `Removing entries...`;
        switch (Result) {
            case 1:
                OwnedGames = GM_getValue(`OwnedGames`);
                RemovedEntries = {};
                checkNextPage();
                break;
            case 2:
                showResult(`<strong>0 new games found.</strong>`);
                break;
            case 3:
                showResult(`<strong>Invalid Steam API key. Please enter a valid key in the settings menu.</strong>`);
                break;
            case 4:
                showResult(`<strong>No Steam API Key found. Please enter a key in the settings menu.</strong>`);
                break;
        }
    }

    function showResult(Result) {
        Popup.Progress.innerHTML = Popup.OverallProgress.innerHTML = ``;
        Popup.Results.innerHTML = Result;
        Button.classList.remove(`rhBusy`);
    }

    function checkNextPage() {
        Popup.Progress.innerHTML = `
            <i class="fa fa-circle-o-notch fa-spin"></i>
            <span>Checking page ${NextPage}...</span>
        `;
        if (CurrentPage != NextPage) {
            queueRequest(Popup, null, `${URL}${NextPage}`, getNextPage);
        } else {
            goToNextPage(document);
        }
    }

    function getNextPage(Response) {
        goToNextPage(parseHTML(Response.responseText));
    }

    function goToNextPage(Context) {
        ++NextPage;
        setTimeout(getEntries, 0, Context);
    }

    function getEntries(Context) {
        var Entries, N;
        Entries = Context.getElementsByClassName(`table__remove-default`);
        N = Entries.length;
        if (N > 0) {
            checkEntries(0, N, Entries, Context);
        } else {
            checkRemovedEntries();
        }
    }

    function checkEntries(I, N, Entries, Context) {
        checkEntry();

        function checkEntry() {
            var Entry, Container, Image, Match, ID, Type, Title, Code, Data, Pagination;
            if (I < N) {
                Entry = Entries[I];
                Container = Entry.closest(`.table__row-inner-wrap`);
                Image = Container.getElementsByClassName(`global__image-inner-wrap`)[0];
                if (Image) {
                    Match = Image.getAttribute(`style`).match(/\/(apps|subs)\/(\d+)/);
                    ID = parseInt(Match[2]);
                    if (OwnedGames.indexOf(ID) >= 0) {
                        Type = Match[1].replace(/s$/, ``);
                        Title = Container.getElementsByClassName(`table__column__heading`)[0].textContent;
                        if (!RemovedEntries[ID]) {
                            RemovedEntries[ID] = {
                                Type: Type,
                                Title: Title,
                                Entries: 0
                            };
                        }
                        ++RemovedEntries[ID].Entries;
                        if (Context == document) {
                            Entry.click();
                            goToNextEntry();
                        } else {
                            Code = Container.querySelector(`[name="code"]`).value;
                            Data = `xsrf_token=${esgst.xsrfToken}&do=entry_delete&code=${Code}`;
                            queueRequest(Popup, Data, `/ajax.php`, goToNextEntry);
                        }
                    } else {
                        goToNextEntry();
                    }
                } else {
                    goToNextEntry();
                }
            } else {
                Pagination = Context.getElementsByClassName(`pagination__navigation`)[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains(`is-selected`)) {
                    checkNextPage();
                } else {
                    checkRemovedEntries();
                }
            }
        }

        function goToNextEntry() {
            ++I;
            setTimeout(checkEntry, 0);
        }
    }

    function checkRemovedEntries() {
        var Results, N, Key, Entry, Result;
        Results = [];
        N = 0;
        for (Key in RemovedEntries) {
            Entry = RemovedEntries[Key];
            Result = `
                <a href="https://store.steampowered.com/${Entry.Type}/${Key}" target="_blank">
                    ${Entry.Title} (${Entry.Entries})
                </a>
            `;
            Results.push(Result);
            N += Entry.Entries;
        }
        if (Results.length) {
            Result = `
                <strong>${N} entries removed:</strong>
                <span class="popup__actions">
                    ${Results.join(``)}
                </span>
            `;
            showResult(Result);
        } else {
            showResult(`<strong>0 entries removed.</strong>`);
        }
    }
}

function loadGiveawayWinnersLink(context) {
    var matches = context.getElementsByClassName(`giveaway__summary`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        addGWLLink(matches[i]);
    }
}

function addGWLLink(Context) {
    var Columns, Copies, Match, Entries, URL, Link;
    Columns = Context.getElementsByClassName("giveaway__columns")[0];
    if (parseInt(Columns.querySelector("[data-timestamp]").getAttribute("data-timestamp")) < ((new Date().getTime()) / 1000)) {
        Copies = Context.getElementsByClassName("giveaway__heading__thin")[0].textContent;
        Match = Copies.match(/\((.+) Copies\)/);
        Copies = Match ? Match[1] : (Columns.textContent.match("No winners") ? 0 : 1);
        Entries = Context.getElementsByClassName("giveaway__links")[0].firstElementChild;
        URL = Entries.getAttribute("href");
        Link = URL ? (" href=\"" + URL.match(/(.+)\/entries/)[1] + "/winners\"") : "";
        Entries.insertAdjacentHTML(
            "afterEnd",
            "<a class=\"GWLLink\"" + Link + ">" +
            "    <i class=\"fa fa-trophy\"></i>" +
            "    <span>" + Copies + " winners</span>" +
            "</a>"
        );
    }
}

function loadGiveawayErrorSearchLinks() {
    var Context, Term;
    if (document.querySelector(".table.table--summary")) {
        Context = document.getElementsByClassName("table__column__secondary-link")[0];
        Term = encodeURIComponent(Context.innerHTML);
        document.getElementsByClassName("table__row-outer-wrap")[0].insertAdjacentHTML(
            "afterEnd",
            `<div class="table__row-outer-wrap">
                <div class="table__row-inner-wrap">
                    <div class="table__column--width-small">
                        <strong>Search Links</strong>
                    </div>
                    <div class="table__column--width-fill">
                        <a href="https://www.steamgifts.com/giveaways/search?q=` + Term + `" target="_blank">
                            <i class="fa"><img src="https://cdn.steamgifts.com/img/favicon.ico"></i>
                        </a>&nbsp;
                        <a href="https://steamdb.info/search/?a=app&amp;q=` + Term + `" target="_blank">
                            <i class="fa"><img src="https://steamdb.info/static/logos/favicon-16x16.png"></i>
                        </a>&nbsp;
                        <a href="http://store.steampowered.com/search/?term=` + Term + `" target="_blank">
                            <i class="fa fa-steam"></i>
                        </a>
                    </div>
                </div>
            </div>`
        );
    }
}

function loadArchiveSearcher() {
    var Popup, Category, AS, ASButton;
    var Context = esgst.mainPageHeading;
    Popup = createPopup();
    Popup.Popup.style.width = "600px";
    Popup.Icon.classList.add("fa-folder");
    Category = window.location.pathname.match(/^\/archive\/(coming-soon|open|closed|deleted)/);
    Popup.Title.textContent = "Search archive" + (Category ? (" for " + Category[1] + " giveaways") : "") + ":";
    Popup.TextInput.classList.remove("rhHidden");
    AS = {};
    createOptions(Popup.Options, AS, [{
        Check: function() {
            return true;
        },
        Description: "Search by AppID.",
        Title: "If unchecked, a search by exact title will be performed.",
        Key: "AIS",
        Name: "AppIDSearch",
        ID: "AS_AIS"
    }]);
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"ASButton\" title=\"Search archive.\">" +
        "    <i class=\"fa fa-folder\"></i>" +
        "    <i class=\"fa fa-search\"></i>" +
        "</a>"
    );
    ASButton = Context.firstElementChild;
    createButton(Popup.Button, "fa-search", "Search", "fa-times-circle", "Cancel", function(Callback) {
        ASButton.classList.add("rhBusy");
        AS.Progress.innerHTML = AS.OverallProgress.innerHTML = AS.Results.innerHTML = "";
        AS.Popup.reposition();
        AS.Canceled = false;
        AS.Query = Popup.TextInput.value;
        if (AS.Query) {
            if (AS.AIS.checked) {
                AS.Progress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Retrieving game title...</span>";
                makeRequest(null, "https://steamcommunity.com/app/" + AS.Query, AS.Progress, function(Response) {
                    var Title;
                    Title = parseHTML(Response.responseText).getElementsByClassName("apphub_AppName")[0];
                    if (Title) {
                        AS.Query = Title.textContent;
                        setASSearch(AS, ASButton, Callback);
                    } else {
                        ASButton.classList.remove("rhBusy");
                        AS.Progress.innerHTML =
                            "<i class=\"fa fa-times-circle\"></i> " +
                            "<span>Game title not found. Make sure you are entering a valid AppID. For example, 229580 is the AppID for Dream (http://steamcommunity.com/app/229580).</span>";
                        Callback();
                    }
                });
            } else {
                setASSearch(AS, ASButton, Callback);
            }
        } else {
            ASButton.classList.remove("rhBusy");
            AS.Progress.innerHTML =
                "<i class=\"fa fa-times-circle\"></i> " +
                "<span>Please enter a title / AppID.</span>";
            Callback();
        }
    }, function() {
        clearInterval(AS.Request);
        AS.Canceled = true;
        setTimeout(function() {
            AS.Progress.innerHTML = "";
        }, 500);
        ASButton.classList.remove("rhBusy");
    });
    AS.Progress = Popup.Progress;
    AS.OverallProgress = Popup.OverallProgress;
    AS.Results = Popup.Results;
    ASButton.addEventListener("click", function() {
        AS.Popup = Popup.popUp(function() {
            Popup.TextInput.focus();
        });
    });
}

function setASSearch(AS, ASButton, Callback) {
    AS.Query = ((AS.Query.length >= 50) ? AS.Query.slice(0, 50) : AS.Query).toLowerCase();
    searchASGame(AS, window.location.href.match(/(.+?)(\/search.+?)?$/)[1] + "/search?q=" + encodeURIComponent(AS.Query) + "&page=", 1, function() {
        ASButton.classList.remove("rhBusy");
        AS.Progress.innerHTML = "";
        Callback();
    });
}

function searchASGame(AS, URL, NextPage, Callback) {
    if (!AS.Canceled) {
        AS.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Loading page " + NextPage + "...</span>";
        queueRequest(AS, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches, I, N, Title, Pagination;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__row-outer-wrap");
            for (I = 0, N = Matches.length; I < N; ++I) {
                Title = Matches[I].getElementsByClassName("table__column__heading")[0].textContent.match(/(.+?)( \(.+ Copies\))?$/)[1];
                if (Title.toLowerCase() == AS.Query) {
                    AS.Results.appendChild(Matches[I].cloneNode(true));
                    loadEndlessFeatures(AS.Results.lastElementChild);
                    AS.Popup.reposition();
                }
            }
            AS.OverallProgress.textContent = AS.Results.children.length + " giveaways found...";
            Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                searchASGame(AS, URL, ++NextPage, Callback);
            } else {
                Callback();
            }
        });
    }
}

function loadActiveDiscussionsOnTop() {
    esgst.activeDiscussions.classList.remove(`widget-container--margin-top`);
    esgst.activeDiscussions.classList.add(`esgst-adot`);
    var parent = esgst.activeDiscussions.parentElement;
    parent.insertBefore(esgst.activeDiscussions, parent.firstElementChild);
}

function loadDiscussionsHighlighter() {
    if (esgst.discussionPath) {
        highlightDHDiscussion();
    } else {
        getDHDiscussions(document);
        esgst.endlessFeatures.push(getDHDiscussions);
    }
}

function getDHDiscussions(context) {
    var matches = context.getElementsByClassName(`table__row-outer-wrap`);
    highlightDHDiscussions(matches);
}

function highlightDHDiscussions(Matches) {
    var Comments, I, N, Match, Key, Container;
    Comments = GM_getValue("Comments");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Match = Matches[I].getElementsByClassName("table__column__heading")[0].getAttribute("href").match(/\/discussion\/(.+?)\//);
        if (Match) {
            Key = Match[1];
            if (!Comments[Key]) {
                Comments[Key] = {
                    Highlighted: false
                };
            }
            Container = Matches[I].getElementsByClassName("table__column--width-fill")[0].firstElementChild;
            if (Comments[Key].Highlighted) {
                Matches[I].classList.add("DHHighlight");
                Container.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star DHIcon\" title=\"Unhighlight discussion.\"></i>");
            } else {
                Container.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star-o DHIcon\" title=\"Highlight discussion.\"></i>");
            }
            setDHIcon(Container.firstElementChild, Matches[I], Key);
        }
    }
    GM_setValue("Comments", Comments);
}

function highlightDHDiscussion() {
    var Comments, Key, Context, Container;
    Comments = GM_getValue("Comments");
    Key = window.location.pathname.match(/\/discussion\/(.+?)\//)[1];
    if (!Comments[Key]) {
        Comments[Key] = {
            Highlighted: false
        };
    }
    Context = document.getElementsByClassName("page__heading")[0];
    Container = Context.firstElementChild;
    if (Comments[Key].Highlighted) {
        Container.classList.add("DHHighlight");
        Context.insertAdjacentHTML(
            "afterBegin",
            "<div>" +
            "    <i class=\"fa fa-star DHIcon\" title=\"Unhighlight discussion.\"></i>" +
            "</div>"
        );
    } else {
        Context.insertAdjacentHTML(
            "afterBegin",
            "<div>" +
            "    <i class=\"fa fa-star-o DHIcon\" title=\"Highlight discussion.\"></i>" +
            "</div>"
        );
    }
    setDHIcon(Context.firstElementChild.firstElementChild, Container, Key);
    GM_setValue("Comments", Comments);
}

function setDHIcon(DHIcon, Context, Key) {
    DHIcon.addEventListener("click", function() {
        var Comments;
        DHIcon.classList.toggle("fa-star");
        DHIcon.classList.toggle("fa-star-o");
        DHIcon.title = DHIcon.classList.contains("fa-star") ? "Unhighlight discussion." : "Highlight discussion.";
        if (Context) {
            Context.classList.toggle("DHHighlight");
        }
        Comments = GM_getValue("Comments");
        Comments[Key].Highlighted = Comments[Key].Highlighted ? false : true;
        GM_setValue("Comments", Comments);
    });
}

function loadMainPostPopup() {
    var MPPPost, Sibling, Visited, Timestamp, Hidden;
    var Context = esgst.mainPageHeading;
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"MPPButton\" title=\"Open the main post.\">" +
        "    <i class=\"fa fa-home\"></i>" +
        "</a>"
    );
    MPPPost = document.createElement("div");
    MPPPost.className = "page__outer-wrap";
    do {
        Sibling = Context.previousElementSibling;
        if (Sibling) {
            MPPPost.insertBefore(Sibling, MPPPost.firstElementChild);
        }
    } while (Sibling);
    Context.parentElement.insertBefore(MPPPost, Context);
    if (GM_getValue("CT")) {
        Visited = GM_getValue("Comments" + (esgst.sg ? "" : "_ST"))[window.location.pathname.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3]];
        Timestamp = MPPPost.querySelectorAll("[data-timestamp]");
        Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
        Hidden = Visited ? (((Visited[""] == Timestamp) || (GM_getValue("MPP_FV") && Visited.Visited)) ? true : false) : false;
    } else {
        Hidden = true;
    }
    MPPPost.classList.add(Hidden ? "MPPPostOpen" : "MPPPostDefault");
    Context.firstElementChild.addEventListener("click", function() {
        if (!Hidden) {
            MPPPost.classList.remove("MPPPostDefault");
            MPPPost.classList.add("MPPPostOpen");
        }
        $(MPPPost).bPopup({
            amsl: [0],
            fadeSpeed: 200,
            followSpeed: 500,
            modalColor: "#3c424d",
            opacity: 0.85,
            onClose: function() {
                if (!Hidden) {
                    MPPPost.classList.remove("MPPPostOpen");
                    MPPPost.classList.add("MPPPostDefault");
                    MPPPost.removeAttribute("style");
                    Context.parentElement.insertBefore(MPPPost, Context);
                }
            }
        });
    });
}

function loadDiscussionEditDetector() {
    addDEDButton(esgst.replyBox);
}

function addDEDButton(Context, CommentURL, DEDCallback) {
    var TradeCode, ParentID, Description, URL, DEDButton, DEDStatus, ResponseHTML;
    TradeCode = Context.querySelector("[name='trade_code']");
    TradeCode = TradeCode ? TradeCode.value : "";
    ParentID = Context.querySelector("[name='parent_id']");
    Description = Context.querySelector("[name='description']");
    URL = esgst.sg ? window.location.href.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php";
    Context = Context.getElementsByClassName(esgst.sg ? "align-button-container" : "btn_actions")[0];
    Context.firstElementChild.remove();
    Context.insertAdjacentHTML("afterBegin", "<div class=\"DEDButton\"></div>");
    Context.insertAdjacentHTML("beforeEnd", "<div class=\"comment__actions action_list DEDStatus\"></div>");
    DEDButton = Context.firstElementChild;
    DEDStatus = Context.lastElementChild;
    createButton(DEDButton, "fa-send", "Submit", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
        DEDStatus.innerHTML = "";
        if (CommentURL) {
            makeRequest(null, CommentURL, DEDStatus, function(Response) {
                ResponseHTML = parseHTML(Response.responseText);
                TradeCode = esgst.sg ? "" : Response.finalUrl.match(/\/trade\/(.+?)\//)[1];
                ParentID = ResponseHTML.getElementById(CommentURL.match(/\/comment\/(.+)/)[1]);
                ParentID = esgst.sg ? ParentID.closest(".comment").getAttribute("data-comment-id") : ParentID.getAttribute("data-id");
                URL = esgst.sg ? Response.finalUrl.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php";
                saveComment(TradeCode, ParentID, Description.value, URL, DEDStatus, Callback, DEDCallback);
            });
        } else {
            saveComment(TradeCode, ParentID.value, Description.value, URL, DEDStatus, Callback, DEDCallback);
        }
    }, null, true);
}

function saveCHComment(Context, URL, Title, ID) {
    var Username;
    Username = Context ? Context.previousElementSibling.getElementsByClassName("comment__username")[0].textContent : null;
    GM_setValue(
        "CommentHistory",
        "<div>" +
        "    You " + (Username ? ("replied to <a class=\"rhBold\" href=\"/user/" + Username + "\">" + Username + "</a> on") : "added a comment to") +
        "    <a class=\"rhBold\" href=\"" + URL + "\">" + Title + "</a> at" +
        "    <a class=\"rhBold\" data-timestamp=\"" + Math.floor((new Date().getTime()) / 1000) + "\" href=\"/go/comment/" + ID + "\"></a>." +
        "</div>" +
        GM_getValue("CommentHistory")
    );
}

function loadCommentTracker() {
    if (esgst.commentsPath) {
        addCTPanel(esgst.mainPageHeading);
        esgst.endlessFeatures.push(getCTComments);
        getCTComments(document);
    }
    esgst.endlessFeatures.push(loadCTVisited);
    loadCTVisited(document);
}

function loadCTVisited(context) {
    var matches = context.querySelectorAll(`.table__column__heading, .giveaway__heading__name, .column_flex h3 a`);
    checkCTVisited(matches);
}

function getCTComments(context) {
    var matches = context.querySelectorAll(`.comment__summary, .comment_inner`);
    setCTComment(matches);
}

function checkCTVisited(Matches) {
    var ID, Comments, I, N, Link, Match, Type, Key, Element, CommentsCount, Count, Read, LastUnread, CTPanel;
    ID = "Comments" + (esgst.sg ? "" : "_ST");
    Comments = GM_getValue(ID);
    for (I = 0, N = Matches.length; I < N; ++I) {
        Link = Matches[I].getAttribute("href");
        if (Link) {
            Match = Link.match(/\/(giveaway|discussion|support\/ticket|trade)\/(.+?)\//);
            if (Match) {
                Type = Match[1];
                Key = Match[2];
                if (Match && (((Type == "giveaway") && esgst.ct_g) || (Type != "giveaway")) && Comments[Key] && Comments[Key].Visited) {
                    Element = Matches[I].closest("div");
                    Element.style.opacity = "0.5";
                    setHoverOpacity(Element, "1", "0.5");
                }
                if (Type == "discussion") {
                    Element = Matches[I].closest(".table__column--width-fill");
                    CommentsCount = Element.nextElementSibling.firstElementChild;
                    Count = parseInt(CommentsCount.textContent.replace(/,/g, ""));
                    if (!Comments[Key]) {
                        Comments[Key] = {};
                    }
                    delete Comments[Key].Count;
                    Read = Object.keys(Comments[Key]).length - 3;
                    if (Read < 0) {
                        Read = 0;
                    }
                    if (Read <= Count) {
                        LastUnread = esgst.ct_lu;
                        CommentsCount.insertAdjacentHTML(
                            "afterEnd",
                            " <span class=\"CTPanel\">" + ((Read < Count) ? (
                                "<a class=\"CTGoToUnread\" title=\"Go to the " + (LastUnread ? "last" : "first") + " unread comment.\">" +
                                "    <i class=\"fa fa-comments-o\"></i>" +
                                "</a>" +
                                "<a class=\"CTMarkRead\" title=\"Mark all comments as read.\">" +
                                "    <i class=\"fa fa-eye\"></i>" +
                                "</a>") : "") +
                            "</span>"
                        );
                        CTPanel = CommentsCount.nextElementSibling;
                        if (Read < Count) {
                            CommentsCount.insertAdjacentText("beforeEnd", " (+" + (Count - Read) + ")");
                            setCTPanel(CTPanel, CommentsCount.href, Key, LastUnread, Element);
                        }
                        if (!Comments[Key].Visited) {
                            CTPanel.insertAdjacentHTML(
                                "beforeEnd",
                                "<a class=\"CTMarkVisited\" title=\"Mark discussion as visited.\">" +
                                "    <i class=\"fa fa-check\"></i>" +
                                "</a>"
                            );
                            setCTVisited(CTPanel, Key, Element);
                        }
                    }
                }
            }
        }
    }
}

function setCTPanel(CTPanel, URL, Key, LastUnread, Element) {
    var CTGoToUnread, CTMarkRead;
    CTGoToUnread = CTPanel.firstElementChild;
    CTMarkRead = CTGoToUnread.nextElementSibling;
    CTGoToUnread.addEventListener("click", function() {
        CTPanel.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
        markCTDiscussionRead({
            Progress: CTPanel
        }, URL + "/search?page=", 1, Key, true, LastUnread, LastUnread, function(ID) {
            window.location.href = ID ? "/go/comment/" + ID : URL;
        });
    });
    CTMarkRead.addEventListener("click", function() {
        Element.style.opacity = "0.5";
        setHoverOpacity(Element, "1", "0.5");
        CTPanel.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
        markCTDiscussionRead({
            Progress: CTPanel
        }, URL + "/search?page=", 1, Key, false, false, false, function() {
            CTPanel.remove();
        });
    });
}

function markCTDiscussionRead(CT, URL, NextPage, Key, Unread, LastUnread, LastUnreadFirst, Callback) {
    queueRequest(CT, null, URL + NextPage, function(Response) {
        var ResponseHTML, Matches, I, N, Comments, ID, Timestamp, Found, Pagination;
        ResponseHTML = parseHTML(Response.responseText);
        Matches = ResponseHTML.getElementsByClassName("comment__summary");
        for (I = 0, N = Matches.length; I < N; ++I) {
            if (!Matches[I].closest(".comment--submit")) {
                Comments = GM_getValue("Comments");
                if (!Comments[Key]) {
                    Comments[Key] = {
                        Visited: true
                    };
                } else if (!Comments[Key].Visited) {
                    Comments[Key].Visited = true;
                }
                ID = Matches[I].id;
                if (!Comments[Key][ID]) {
                    Comments[Key][ID] = 0;
                }
                Timestamp = Matches[I].getElementsByClassName("comment__actions")[0].firstElementChild.querySelectorAll("[data-timestamp]");
                Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
                if (Comments[Key][ID] < Timestamp) {
                    if (Unread) {
                        Found = true;
                        break;
                    } else {
                        Comments[Key][ID] = Timestamp;
                        GM_setValue("Comments", Comments);
                    }
                }
            }
        }
        Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
        if (Matches.length && !Found && ((LastUnread && (NextPage >= 1)) || (!LastUnread && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")))) {
            if (LastUnreadFirst) {
                if (Pagination) {
                    NextPage = parseInt(Pagination.lastElementChild.getAttribute("data-page-number")) + 1;
                } else {
                    Callback(ID);
                }
            } else if (LastUnread && (NextPage == 1)) {
                Callback(ID);
            }
            setTimeout(markCTDiscussionRead, 0, CT, URL, LastUnread ? --NextPage : ++NextPage, Key, Unread, LastUnread, false, Callback);
        } else {
            Callback(ID);
        }
    });
}

function setCTVisited(CTPanel, Key, Element) {
    var CTMarkVisited;
    CTMarkVisited = CTPanel.lastElementChild;
    CTMarkVisited.addEventListener("click", function() {
        var Comments;
        Comments = GM_getValue("Comments");
        if (!Comments[Key]) {
            Comments[Key] = {};
        }
        Comments[Key].Visited = true;
        GM_setValue("Comments", Comments);
        Element.style.opacity = "0.5";
        setHoverOpacity(Element, "1", "0.5");
        CTMarkVisited.remove();
    });
}

function addCTPanel(Context) {
    var CTGoToUnread;
    Context.insertAdjacentHTML(
        "afterBegin",
        "<div class=\"page_heading_btn CTPanel\">" +
        "    <a class=\"CTGoToUnread\" title=\"Go to the first unread comment.\">" +
        "        <i class=\"fa fa-comments-o\"></i>" +
        "    </a>" +
        "    <a class=\"CTMarkRead\" title=\"Mark all comments as read.\">" +
        "        <i class=\"fa fa-eye\"></i>" +
        "    </a>" +
        "</span>"
    );
    CTGoToUnread = Context.firstElementChild.firstElementChild;
    CTGoToUnread.addEventListener("click", function() {
        var Unread, ID;
        Unread = document.getElementsByClassName("CTButton")[0];
        if (Unread) {
            ID = esgst.sg ? Unread.closest(".comment__summary").id : Unread.closest(".comment_inner").parentElement.id;
            if (ID) {
                window.location.hash = "";
                window.location.hash = ID;
            } else {
                window.scrollTo(0, 0);
            }
        }
    });
    CTGoToUnread.nextElementSibling.addEventListener("click", function() {
        var Matches, ID, Key, I, N;
        Matches = document.getElementsByClassName("CTButton");
        ID = "Comments" + (esgst.sg ? "" : "_ST");
        Key = window.location.pathname.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3];
        for (I = 0, N = Matches.length; I < N; ++I) {
            Matches[0].closest(".comment__summary, .comment_inner").style.opacity = "0.5";
            markCTRead(Matches[0], ID, Key);
        }
    });
}

function setCTComment(Matches) {
    var ID, Comments, Key, I, N, Comment, CommentID, Timestamp, Context;
    ID = "Comments" + (esgst.sg ? "" : "_ST");
    Comments = GM_getValue(ID);
    Key = window.location.pathname.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3];
    if (!Comments[Key]) {
        Comments[Key] = {
            Visited: true
        };
        GM_setValue(ID, Comments);
    } else if (!Comments[Key].Visited) {
        Comments[Key].Visited = true;
        GM_setValue(ID, Comments);
    }
    for (I = 0, N = Matches.length; I < N; ++I) {
        Comment = Matches[I];
        if (!Comment.closest(".comment--submit")) {
            CommentID = esgst.sg ? Comment.id : Comment.parentElement.id;
            Timestamp = Comment.querySelectorAll("[data-timestamp]");
            Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
            if (Timestamp == Comments[Key][CommentID]) {
                Comment.style.opacity = "0.5";
                setHoverOpacity(Comment, "1", "0.5");
            } else {
                delete Comments[Key][CommentID];
                Context = Matches[I].getElementsByClassName(esgst.sg ? "comment__actions" : "action_list")[0];
                Context.insertAdjacentHTML(
                    "beforeEnd",
                    "<a class=\"CTButton\" title=\"Mark comment as read.\">" +
                    "    <i class=\"fa fa-eye\"></i>" +
                    "</a>"
                );
                Context.lastElementChild.addEventListener("click", function(Event) {
                    markCTRead(Event.currentTarget, ID, Key);
                });
            }
        }
    }
    GM_setValue(ID, Comments);
}

function markCTRead(CTButton, ID, Key) {
    var Timestamp, Comments, CommentID, Comment;
    Timestamp = CTButton.parentElement.firstElementChild.querySelectorAll("[data-timestamp]");
    Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
    Comments = GM_getValue(ID);
    Comment = CTButton.closest(".comment__summary, .comment_inner");
    CommentID = esgst.sg ? Comment.id : Comment.parentElement.id;
    Comments[Key][CommentID] = Timestamp;
    GM_setValue(ID, Comments);
    CTButton.remove();
    setHoverOpacity(Comment, "1", "0.5");
}

function loadCommentFormattingHelper(context) {
    var textAreas = context.querySelectorAll(`textarea[name='description']`);
    for (var i = 0, n = textAreas.length; i < n; ++i) {
        addCFHPanel(textAreas[i]);
    }
}

function addCFHPanel(Context) {
    var CFH, I, N;
    Context.insertAdjacentHTML("beforeBegin", "<div class=\"page__heading page_heading CFHPanel\"></div>");
    CFH = {
        Items: [{
            ID: "cfh_i",
            Name: "Italic",
            Icon: "fa-italic",
            Prefix: "*",
            Suffix: "*"
        }, {
            ID: "cfh_b",
            Name: "Bold",
            Icon: "fa-bold",
            Prefix: "**",
            Suffix: "**"
        }, {
            ID: "cfh_s",
            Name: "Spoiler",
            Icon: "fa-eye-slash",
            Prefix: "~",
            Suffix: "~"
        }, {
            ID: "cfh_st",
            Name: "Strikethrough",
            Icon: "fa-strikethrough",
            Prefix: "~~",
            Suffix: "~~"
        }, {
            ID: "cfh_h1",
            Name: "Heading 1",
            Icon: "fa-header",
            Text: "1",
            Prefix: "# "
        }, {
            ID: "cfh_h2",
            Name: "Heading 2",
            Icon: "fa-header",
            Text: "2",
            Prefix: "## "
        }, {
            ID: "cfh_h3",
            Name: "Heading 3",
            Icon: "fa-header",
            Text: "3",
            Prefix: "### "
        }, {
            ID: "cfh_bq",
            Name: "Blockquote",
            Icon: "fa-quote-left",
            Prefix: "> "
        }, {
            ID: "cfh_lb",
            Name: "Line Break",
            Icon: "fa-minus",
            Prefix: "\n---\n\n"
        }, {
            ID: "cfh_ol",
            Name: "Ordered List",
            Icon: "fa-list-ol",
            OrderedList: true
        }, {
            ID: "cfh_ul",
            Name: "Unordered List",
            Icon: "fa-list-ul",
            UnorderedList: true
        }, {
            ID: "cfh_ic",
            Name: "Inline Code",
            Icon: "fa-code",
            Prefix: "`",
            Suffix: "`"
        }, {
            ID: "cfh_lc",
            Name: "Line Code",
            Icon: "fa-code",
            SecondaryIcon: "fa-indent",
            Prefix: "    "
        }, {
            ID: "cfh_pc",
            Name: "Paragraph Code",
            Icon: "fa-code",
            SecondaryIcon: "fa-paragraph",
            Prefix: "```\n",
            Suffix: "\n```"
        }, {
            ID: "cfh_l",
            Name: "Link",
            Icon: "fa-globe",
            setPopout: function(Popout) {
                var URL, Title;
                Popout.innerHTML =
                    "URL: <input placeholder=\"http://www.example.com\" type=\"text\"/>" +
                    "Title: <input placeholder=\"Cat\" type=\"text\"/>" +
                    "<div class=\"form__saving-button btn_action white\">Add</div>";
                URL = Popout.firstElementChild;
                Title = URL.nextElementSibling;
                Title.nextElementSibling.addEventListener("click", function() {
                    wrapCFHLinkImage(CFH, Title.value, URL.value);
                    URL.value = ``;
                    Title.value = ``;
                    URL.focus();
                });
            },
            Callback: function(Popout) {
                var Value = CFH.TextArea.value;
                var Start = CFH.TextArea.selectionStart;
                var End = CFH.TextArea.selectionEnd;
                Popout.firstElementChild.nextElementSibling.value = Value.slice(Start, End);
                window.setTimeout(function() {
                    Popout.firstElementChild.focus();
                }, 0);
            }
        }, {
            ID: "cfh_img",
            Name: "Image",
            Icon: "fa-image",
            setPopout: function(Popout) {
                var URL, Title;
                Popout.innerHTML =
                    "URL: <input placeholder=\"http://www.example.com/image.jpg\" type=\"text\"/>" +
                    "Title: <input placeholder=\"Cats\" type=\"text\"/>" +
                    "<div class=\"form__saving-button btn_action white\">Add</div>";
                URL = Popout.firstElementChild;
                Title = URL.nextElementSibling;
                Title.nextElementSibling.addEventListener("click", function() {
                    wrapCFHLinkImage(CFH, Title.value, URL.value, true);
                    URL.value = ``;
                    Title.value = ``;
                    URL.focus();
                });
            },
            Callback: function(Popout) {
                var Value = CFH.TextArea.value;
                var Start = CFH.TextArea.selectionStart;
                var End = CFH.TextArea.selectionEnd;
                Popout.firstElementChild.nextElementSibling.value = Value.slice(Start, End);
                window.setTimeout(function() {
                    Popout.firstElementChild.focus();
                }, 0);
            }
        }, {
            ID: "cfh_t",
            Name: "Table",
            Icon: "fa-table",
            setPopup: function(Popup) {
                var Table, InsertRow, InsertColumn;
                Popout = Popup.Description;
                Popout.innerHTML =
                    "<table></table>" +
                    "<div class=\"form__saving-button btn_action white\">Insert Row</div>" +
                    "<div class=\"form__saving-button btn_action white\">Insert Column</div>" +
                    "<div class=\"form__saving-button btn_action white\">Add</div>";
                Table = Popout.firstElementChild;
                InsertRow = Table.nextElementSibling;
                InsertColumn = InsertRow.nextElementSibling;
                insertCFHTableRows(4, Table);
                insertCFHTableColumns(2, Table);
                InsertRow.addEventListener("click", function() {
                    insertCFHTableRows(1, Table);
                });
                InsertColumn.addEventListener("click", function() {
                    insertCFHTableColumns(1, Table);
                });
                InsertColumn.nextElementSibling.addEventListener("click", function() {
                    var Rows, I, NumRows, J, NumColumns, Value, Start, End;
                    Rows = Table.rows;
                    for (I = 1, NumRows = Rows.length; I < NumRows; ++I) {
                        for (J = 1, NumColumns = Rows[0].cells.length; J < NumColumns; ++J) {
                            if (!Rows[I].cells[J].firstElementChild.value) {
                                I = NumRows + 1;
                                J = NumColumns + 1;
                            }
                        }
                    }
                    if ((I <= NumRows) || ((I > NumRows) && window.confirm("Some cells are empty. This might lead to unexpected results. Are you sure you want to continue?"))) {
                        Value = "";
                        for (I = 1; I < NumRows; ++I) {
                            Value += "\n";
                            for (J = 1; J < NumColumns; ++J) {
                                Value += Rows[I].cells[J].firstElementChild.value + ((J < (NumColumns - 1)) ? " | " : "");
                            }
                        }
                        Value += "\n\n";
                        Start = CFH.TextArea.selectionStart;
                        End = CFH.TextArea.selectionEnd;
                        CFH.TextArea.value = CFH.TextArea.value.slice(0, Start) + Value + CFH.TextArea.value.slice(End);
                        CFH.TextArea.setSelectionRange(End + Value.length, End + Value.length);
                        CFH.TextArea.focus();
                        Popup.Close.click();
                    }
                });
            }
        }, {
            ID: "cfh_e",
            Name: "Emojis",
            Icon: "fa-smile-o",
            setPopout: function(Popout) {
                var Emojis;
                Popout.innerHTML =
                    "<div class=\"CFHEmojis\">" + GM_getValue("Emojis") + "</div>" +
                    "<div class=\"form__saving-button btn_action white\">Select Emojis</div>";
                Emojis = Popout.firstElementChild;
                setCFHEmojis(Emojis, CFH);

                Emojis.nextElementSibling.addEventListener("click", function() {
                    var Popup, I, N, Emoji, SavedEmojis;
                    Popup = createPopup(true);
                    Popup.Icon.classList.add("fa-smile-o");
                    Popup.Title.textContent = "Select emojis:";
                    Popup.Description.insertAdjacentHTML(
                        "afterBegin",
                        "<div class=\"CFHEmojis\"></div>" +
                        createDescription("Drag the emojis you want to use and drop them in the box below. Click on an emoji to remove it.") +
                        "<div class=\"global__image-outer-wrap page_heading_btn CFHEmojis\">" + GM_getValue("Emojis") + "</div>"
                    );
                    Emojis = Popup.Description.firstElementChild;
                    for (I = 0, N = CFH.Emojis.length; I < N; ++I) {
                        Emoji = CFH.Emojis[I].Emoji;
                        Emojis.insertAdjacentHTML("beforeEnd", "<span data-id=\"" + Emoji + "\" draggable=\"true\" title=\"" + CFH.Emojis[I].Title + "\">" + Emoji + "</span>");
                        Emojis.lastElementChild.addEventListener("dragstart", function(Event) {
                            Event.dataTransfer.setData("text", Event.currentTarget.getAttribute("data-id"));
                        });
                    }
                    SavedEmojis = Emojis.nextElementSibling.nextElementSibling;
                    for (I = 0, N = SavedEmojis.children.length; I < N; ++I) {
                        SavedEmojis.children[I].addEventListener("click", function(Event) {
                            Event.currentTarget.remove();
                            GM_setValue("Emojis", SavedEmojis.innerHTML);
                            Popup.reposition();
                        });
                    }
                    SavedEmojis.addEventListener("dragover", function(Event) {
                        Event.preventDefault();
                    });
                    SavedEmojis.addEventListener("drop", function(Event) {
                        var ID;
                        Event.preventDefault();
                        ID = Event.dataTransfer.getData("text").replace(/\\/g, "\\\\");
                        if (!SavedEmojis.querySelector("[data-id='" + ID + "']")) {
                            SavedEmojis.appendChild(document.querySelector("[data-id='" + ID + "']").cloneNode(true));
                            GM_setValue("Emojis", SavedEmojis.innerHTML);
                            Popup.reposition();
                            SavedEmojis.lastElementChild.addEventListener("click", function(Event) {
                                Event.currentTarget.remove();
                                GM_setValue("Emojis", SavedEmojis.innerHTML);
                                Popup.reposition();
                            });
                        }
                    });
                    Popup = Popup.popUp(function() {
                        Popout.classList.add("rhHidden");
                    });
                });
            },
            Callback: function(Popout) {
                var Emojis;
                Emojis = Popout.firstElementChild;
                Emojis.innerHTML = GM_getValue("Emojis");
                setCFHEmojis(Emojis, CFH);
            }
        }, {
            Name: "Automatic Links / Images Paste Formatting",
            Icon: "fa-paste",
            Callback: function(Context) {
                CFH.ALIPF = Context.firstElementChild;
                setCFHALIPF(CFH, GM_getValue("CFH_ALIPF"));
            },
            OnClick: function() {
                setCFHALIPF(CFH);
            }
        }, {
            ID: "cfh_eg",
            Name: "Exclusive Giveaway",
            Icon: "fa-star",
            setPopout: function(Popout) {
                var Code;
                Popout.innerHTML =
                    "Giveaway Code: <input placeholder=\"XXXXX\" type=\"text\"/>" +
                    "<div class=\"form__saving-button btn_action white\">Add</div>";
                Code = Popout.firstElementChild;
                Code.nextElementSibling.addEventListener("click", function() {
                    var encodedCode = encodeGiveawayCode(Code.value);
                    wrapCFHLinkImage(CFH, ``, `ESGST-${encodedCode}`);
                    Code.value = ``;
                    Code.focus();
                });
            },
            Callback: function(Popout) {
                var Value = CFH.TextArea.value;
                var Start = CFH.TextArea.selectionStart;
                var End = CFH.TextArea.selectionEnd;
                Popout.firstElementChild.nextElementSibling.value = Value.slice(Start, End);
                window.setTimeout(function() {
                    Popout.firstElementChild.focus();
                }, 0);
            }
        }],
        Panel: Context.previousElementSibling,
        TextArea: Context,
        Emojis: [ //Top emojis credit to https://greasyfork.org/scripts/21607-steamgifts-comment-formatting
            {
                Emoji: "&#xAF;&#92;&#92;&#95;&#40;&#x30C4;&#41;&#95;&#47;&#xAF;",
                Title: ""
            }, {
                Emoji: "&#40; &#x361;&#xB0; &#x35C;&#x296; &#x361;&#xB0;&#41;",
                Title: ""
            }, {
                Emoji: "&#40; &#x361;&#x2299; &#x35C;&#x296; &#x361;&#x2299;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x30CE;&#xCA0;&#x76CA;&#xCA0;&#41;&#x30CE;",
                Title: ""
            }, {
                Emoji: "&#40;&#x256F;&#xB0;&#x25A1;&#xB0;&#xFF09;&#x256F;&#xFE35; &#x253B;&#x2501;&#x253B;",
                Title: ""
            }, {
                Emoji: "&#x252C;&#x2500;&#x252C;&#x30CE;&#40; &#xBA; &#95; &#xBA;&#x30CE;&#41;",
                Title: ""
            }, {
                Emoji: "&#x10DA;&#40;&#xCA0;&#x76CA;&#xCA0;&#x10DA;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x25D5;&#x203F;-&#41;&#x270C;",
                Title: ""
            }, {
                Emoji: "&#40;&#xFF61;&#x25D5;&#x203F;&#x25D5;&#xFF61;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x25D1;&#x203F;&#x25D0;&#41;",
                Title: ""
            }, {
                Emoji: "&#x25D4;&#95;&#x25D4;",
                Title: ""
            }, {
                Emoji: "&#40;&#x2022;&#x203F;&#x2022;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#xCA0;&#95;&#xCA0;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#xAC;&#xFF64;&#xAC;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x2500;&#x203F;&#x203F;&#x2500;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#xCA5;&#xFE4F;&#xCA5;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#xCA5;&#x2038;&#xCA5;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x2310;&#x25A0;&#95;&#x25A0;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x25B0;&#x2D8;&#x25E1;&#x2D8;&#x25B0;&#41;",
                Title: ""
            }, {
                Emoji: "&#x4E41;&#40; &#x25D4; &#xC6A;&#x25D4;&#41;&#x310F;",
                Title: ""
            }, {
                Emoji: "&#40;&#xE07; &#x360;&#xB0; &#x35F;&#x296; &#x361;&#xB0;&#41;&#xE07;",
                Title: ""
            }, {
                Emoji: "&#x3B6;&#xF3C;&#x19F;&#x346;&#x644;&#x35C;&#x19F;&#x346;&#xF3D;&#x1D98;",
                Title: ""
            }, {
                Emoji: "&#x295;&#x2022;&#x1D25;&#x2022;&#x294;",
                Title: ""
            }, {
                Emoji: "&#40; &#x35D;&#xB0; &#x35C;&#x296;&#x361;&#xB0;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#47;&#xFF9F;&#x414;&#xFF9F;&#41;&#47;",
                Title: ""
            }, {
                Emoji: "&#xB67;&#xF3C;&#xCA0;&#x76CA;&#xCA0;&#xF3D;&#xB68;",
                Title: ""
            }, {
                Emoji: "&#40;&#xE07; &#x2022;&#x300;&#95;&#x2022;&#x301;&#41;&#xE07;",
                Title: ""
            }, {
                Emoji: "&#x1F600",
                Title: "Grinning Face"
            }, {
                Emoji: "&#x1F601",
                Title: "Grinning Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F602",
                Title: "Face With Tears Of Joy"
            }, {
                Emoji: "&#x1F923",
                Title: "Rolling On The Floor Laughing"
            }, {
                Emoji: "&#x1F603",
                Title: "Smiling Face With Open Mouth"
            }, {
                Emoji: "&#x1F604",
                Title: "Smiling Face With Open Mouth & Smiling Eyes"
            }, {
                Emoji: "&#x1F605",
                Title: "Smiling Face With Open Mouth & Cold Sweat"
            }, {
                Emoji: "&#x1F606",
                Title: "Smiling Face With Open Mouth & Closed Eyes"
            }, {
                Emoji: "&#x1F609",
                Title: "Winking Face"
            }, {
                Emoji: "&#x1F60A",
                Title: "Smiling Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F60B",
                Title: "Face Savouring Delicious Food"
            }, {
                Emoji: "&#x1F60E",
                Title: "Smiling Face With Sunglasses"
            }, {
                Emoji: "&#x1F60D",
                Title: "Smiling Face With Heart-Eyes"
            }, {
                Emoji: "&#x1F618",
                Title: "Face Blowing A Kiss"
            }, {
                Emoji: "&#x1F617",
                Title: "Kissing Face"
            }, {
                Emoji: "&#x1F619",
                Title: "Kissing Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F61A",
                Title: "Kissing Face With Closed Eyes"
            }, {
                Emoji: "&#x263A",
                Title: "Smiling Face"
            }, {
                Emoji: "&#x1F642",
                Title: "Slightly Smiling Face"
            }, {
                Emoji: "&#x1F917",
                Title: "Hugging Face"
            }, {
                Emoji: "&#x1F914",
                Title: "Thinking Face"
            }, {
                Emoji: "&#x1F610",
                Title: "Neutral Face"
            }, {
                Emoji: "&#x1F611",
                Title: "Expressionless Face"
            }, {
                Emoji: "&#x1F636",
                Title: "Face Without Mouth"
            }, {
                Emoji: "&#x1F644",
                Title: "Face With Rolling Eyes"
            }, {
                Emoji: "&#x1F60F",
                Title: "Smirking Face"
            }, {
                Emoji: "&#x1F623",
                Title: "Persevering Face"
            }, {
                Emoji: "&#x1F625",
                Title: "Disappointed But Relieved Face"
            }, {
                Emoji: "&#x1F62E",
                Title: "Face With Open Mouth"
            }, {
                Emoji: "&#x1F910",
                Title: "Zipper-Mouth Face"
            }, {
                Emoji: "&#x1F62F",
                Title: "Hushed Face"
            }, {
                Emoji: "&#x1F62A",
                Title: "Sleepy Face"
            }, {
                Emoji: "&#x1F62B",
                Title: "Tired Face"
            }, {
                Emoji: "&#x1F634",
                Title: "Sleeping Face"
            }, {
                Emoji: "&#x1F60C",
                Title: "Relieved Face"
            }, {
                Emoji: "&#x1F913",
                Title: "Nerd Face"
            }, {
                Emoji: "&#x1F61B",
                Title: "Face With Stuck-Out Tongue"
            }, {
                Emoji: "&#x1F61C",
                Title: "Face With Stuck-Out Tongue & Winking Eye"
            }, {
                Emoji: "&#x1F61D",
                Title: "Face With Stuck-Out Tongue & Closed Eyes"
            }, {
                Emoji: "&#x1F924",
                Title: "Drooling Face"
            }, {
                Emoji: "&#x1F612",
                Title: "Unamused Face"
            }, {
                Emoji: "&#x1F613",
                Title: "Face With Cold Sweat"
            }, {
                Emoji: "&#x1F614",
                Title: "Pensive Face"
            }, {
                Emoji: "&#x1F615",
                Title: "Confused Face"
            }, {
                Emoji: "&#x1F643",
                Title: "Upside-Down Face"
            }, {
                Emoji: "&#x1F911",
                Title: "Money-Mouth Face"
            }, {
                Emoji: "&#x1F632",
                Title: "Astonished Face"
            }, {
                Emoji: "&#x2639",
                Title: "Frowning Face"
            }, {
                Emoji: "&#x1F641",
                Title: "Slightly Frowning Face"
            }, {
                Emoji: "&#x1F616",
                Title: "Confounded Face"
            }, {
                Emoji: "&#x1F61E",
                Title: "Disappointed Face"
            }, {
                Emoji: "&#x1F61F",
                Title: "Worried Face"
            }, {
                Emoji: "&#x1F624",
                Title: "Face With Steam From Nose"
            }, {
                Emoji: "&#x1F622",
                Title: "Crying Face"
            }, {
                Emoji: "&#x1F62D",
                Title: "Loudly Crying Face"
            }, {
                Emoji: "&#x1F626",
                Title: "Frowning Face With Open Mouth"
            }, {
                Emoji: "&#x1F627",
                Title: "Anguished Face"
            }, {
                Emoji: "&#x1F628",
                Title: "Fearful Face"
            }, {
                Emoji: "&#x1F629",
                Title: "Weary Face"
            }, {
                Emoji: "&#x1F62C",
                Title: "Grimacing Face"
            }, {
                Emoji: "&#x1F630",
                Title: "Face With Open Mouth & Cold Sweat"
            }, {
                Emoji: "&#x1F631",
                Title: "Face Screaming In Fear"
            }, {
                Emoji: "&#x1F633",
                Title: "Flushed Face"
            }, {
                Emoji: "&#x1F635",
                Title: "Dizzy Face"
            }, {
                Emoji: "&#x1F621",
                Title: "Pouting Face"
            }, {
                Emoji: "&#x1F620",
                Title: "Angry Face"
            }, {
                Emoji: "&#x1F607",
                Title: "Smiling Face With Halo"
            }, {
                Emoji: "&#x1F920",
                Title: "Cowboy Hat Face"
            }, {
                Emoji: "&#x1F921",
                Title: "Clown Face"
            }, {
                Emoji: "&#x1F925",
                Title: "Lying Face"
            }, {
                Emoji: "&#x1F637",
                Title: "Face With Medical Mask"
            }, {
                Emoji: "&#x1F912",
                Title: "Face With Thermometer"
            }, {
                Emoji: "&#x1F915",
                Title: "Face With Head-Bandage"
            }, {
                Emoji: "&#x1F922",
                Title: "Nauseated Face"
            }, {
                Emoji: "&#x1F927",
                Title: "Sneezing Face"
            }, {
                Emoji: "&#x1F608",
                Title: "Smiling Face With Horns"
            }, {
                Emoji: "&#x1F47F",
                Title: "Angry Face With Horns"
            }, {
                Emoji: "&#x1F479",
                Title: "Ogre"
            }, {
                Emoji: "&#x1F47A",
                Title: "Goblin"
            }, {
                Emoji: "&#x1F480",
                Title: "Skull"
            }, {
                Emoji: "&#x2620",
                Title: "Skull And Crossbones"
            }, {
                Emoji: "&#x1F47B",
                Title: "Ghost"
            }, {
                Emoji: "&#x1F47D",
                Title: "Alien"
            }, {
                Emoji: "&#x1F47E",
                Title: "Alien Monster"
            }, {
                Emoji: "&#x1F916",
                Title: "Robot Face"
            }, {
                Emoji: "&#x1F4A9",
                Title: "Pile Of Poo"
            }, {
                Emoji: "&#x1F63A",
                Title: "Smiling Cat Face With Open Mouth"
            }, {
                Emoji: "&#x1F638",
                Title: "Grinning Cat Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F639",
                Title: "Cat Face With Tears Of Joy"
            }, {
                Emoji: "&#x1F63B",
                Title: "Smiling Cat Face With Heart-Eyes"
            }, {
                Emoji: "&#x1F63C",
                Title: "Cat Face With Wry Smile"
            }, {
                Emoji: "&#x1F63D",
                Title: "Kissing Cat Face With Closed Eyes"
            }, {
                Emoji: "&#x1F640",
                Title: "Weary Cat Face"
            }, {
                Emoji: "&#x1F63F",
                Title: "Crying Cat Face"
            }, {
                Emoji: "&#x1F63E",
                Title: "Pouting Cat Face"
            }, {
                Emoji: "&#x1F648",
                Title: "See-No-Evil Monkey"
            }, {
                Emoji: "&#x1F649",
                Title: "Hear-No-Evil Monkey"
            }, {
                Emoji: "&#x1F64A",
                Title: "Speak-No-Evil Monkey"
            }, {
                Emoji: "&#x1F466",
                Title: "Boy"
            }, {
                Emoji: "&#x1F466&#x1F3FB",
                Title: "Boy: Light Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FC",
                Title: "Boy: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FD",
                Title: "Boy: Medium Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FE",
                Title: "Boy: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FF",
                Title: "Boy: Dark Skin Tone"
            }, {
                Emoji: "&#x1F467",
                Title: "Girl"
            }, {
                Emoji: "&#x1F467&#x1F3FB",
                Title: "Girl: Light Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FC",
                Title: "Girl: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FD",
                Title: "Girl: Medium Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FE",
                Title: "Girl: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FF",
                Title: "Girl: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468",
                Title: "Man"
            }, {
                Emoji: "&#x1F468&#x1F3FB",
                Title: "Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC",
                Title: "Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD",
                Title: "Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE",
                Title: "Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF",
                Title: "Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469",
                Title: "Woman"
            }, {
                Emoji: "&#x1F469&#x1F3FB",
                Title: "Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC",
                Title: "Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD",
                Title: "Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE",
                Title: "Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF",
                Title: "Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F474",
                Title: "Old Man"
            }, {
                Emoji: "&#x1F474&#x1F3FB",
                Title: "Old Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FC",
                Title: "Old Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FD",
                Title: "Old Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FE",
                Title: "Old Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FF",
                Title: "Old Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F475",
                Title: "Old Woman"
            }, {
                Emoji: "&#x1F475&#x1F3FB",
                Title: "Old Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FC",
                Title: "Old Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FD",
                Title: "Old Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FE",
                Title: "Old Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FF",
                Title: "Old Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F476",
                Title: "Baby"
            }, {
                Emoji: "&#x1F476&#x1F3FB",
                Title: "Baby: Light Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FC",
                Title: "Baby: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FD",
                Title: "Baby: Medium Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FE",
                Title: "Baby: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FF",
                Title: "Baby: Dark Skin Tone"
            }, {
                Emoji: "&#x1F47C",
                Title: "Baby Angel"
            }, {
                Emoji: "&#x1F47C&#x1F3FB",
                Title: "Baby Angel: Light Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FC",
                Title: "Baby Angel: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FD",
                Title: "Baby Angel: Medium Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FE",
                Title: "Baby Angel: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FF",
                Title: "Baby Angel: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F393",
                Title: "Man Student"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F393",
                Title: "Man Student: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F393",
                Title: "Man Student: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F393",
                Title: "Man Student: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F393",
                Title: "Man Student: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F393",
                Title: "Man Student: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F393",
                Title: "Woman Student"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F393",
                Title: "Woman Student: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F393",
                Title: "Woman Student: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F393",
                Title: "Woman Student: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F393",
                Title: "Woman Student: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F393",
                Title: "Woman Student: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3EB",
                Title: "Man Teacher"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3EB",
                Title: "Man Teacher: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3EB",
                Title: "Man Teacher: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3EB",
                Title: "Woman Teacher"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3EB",
                Title: "Woman Teacher: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3EB",
                Title: "Woman Teacher: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2696&#xFE0F",
                Title: "Man Judge"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F33E",
                Title: "Man Farmer"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F33E",
                Title: "Man Farmer: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F33E",
                Title: "Man Farmer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F33E",
                Title: "Man Farmer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F33E",
                Title: "Man Farmer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F33E",
                Title: "Man Farmer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F33E",
                Title: "Woman Farmer"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F33E",
                Title: "Woman Farmer: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F33E",
                Title: "Woman Farmer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F373",
                Title: "Man Cook"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F373",
                Title: "Man Cook: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F373",
                Title: "Man Cook: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F373",
                Title: "Man Cook: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F373",
                Title: "Man Cook: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F373",
                Title: "Man Cook: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F373",
                Title: "Woman Cook"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F373",
                Title: "Woman Cook: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F373",
                Title: "Woman Cook: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F373",
                Title: "Woman Cook: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F373",
                Title: "Woman Cook: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F373",
                Title: "Woman Cook: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F527",
                Title: "Man Mechanic"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F527",
                Title: "Man Mechanic: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F527",
                Title: "Man Mechanic: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F527",
                Title: "Man Mechanic: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F527",
                Title: "Man Mechanic: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F527",
                Title: "Man Mechanic: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F527",
                Title: "Woman Mechanic"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F527",
                Title: "Woman Mechanic: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F527",
                Title: "Woman Mechanic: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3ED",
                Title: "Man Factory Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3ED",
                Title: "Woman Factory Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F4BC",
                Title: "Man Office Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F4BC",
                Title: "Man Office Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F4BC",
                Title: "Man Office Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F4BC",
                Title: "Woman Office Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F52C",
                Title: "Man Scientist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F52C",
                Title: "Man Scientist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F52C",
                Title: "Man Scientist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F52C",
                Title: "Man Scientist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F52C",
                Title: "Man Scientist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F52C",
                Title: "Man Scientist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F52C",
                Title: "Woman Scientist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F52C",
                Title: "Woman Scientist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F52C",
                Title: "Woman Scientist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F4BB",
                Title: "Man Technologist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F4BB",
                Title: "Man Technologist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F4BB",
                Title: "Man Technologist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F4BB",
                Title: "Woman Technologist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F4BB",
                Title: "Woman Technologist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F4BB",
                Title: "Woman Technologist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3A4",
                Title: "Man Singer"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3A4",
                Title: "Man Singer: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3A4",
                Title: "Man Singer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3A4",
                Title: "Man Singer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3A4",
                Title: "Man Singer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3A4",
                Title: "Man Singer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3A4",
                Title: "Woman Singer"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3A4",
                Title: "Woman Singer: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3A4",
                Title: "Woman Singer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3A8",
                Title: "Man Artist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3A8",
                Title: "Man Artist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3A8",
                Title: "Man Artist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3A8",
                Title: "Man Artist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3A8",
                Title: "Man Artist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3A8",
                Title: "Man Artist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3A8",
                Title: "Woman Artist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3A8",
                Title: "Woman Artist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3A8",
                Title: "Woman Artist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F680",
                Title: "Man Astronaut"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F680",
                Title: "Man Astronaut: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F680",
                Title: "Man Astronaut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F680",
                Title: "Man Astronaut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F680",
                Title: "Man Astronaut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F680",
                Title: "Man Astronaut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F680",
                Title: "Woman Astronaut"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F680",
                Title: "Woman Astronaut: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F680",
                Title: "Woman Astronaut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F692",
                Title: "Man Firefighter"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F692",
                Title: "Man Firefighter: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F692",
                Title: "Man Firefighter: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F692",
                Title: "Man Firefighter: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F692",
                Title: "Man Firefighter: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F692",
                Title: "Man Firefighter: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F692",
                Title: "Woman Firefighter"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F692",
                Title: "Woman Firefighter: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F692",
                Title: "Woman Firefighter: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E",
                Title: "Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB",
                Title: "Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC",
                Title: "Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD",
                Title: "Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE",
                Title: "Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF",
                Title: "Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575",
                Title: "Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB",
                Title: "Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC",
                Title: "Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD",
                Title: "Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE",
                Title: "Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF",
                Title: "Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482",
                Title: "Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB",
                Title: "Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC",
                Title: "Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD",
                Title: "Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE",
                Title: "Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF",
                Title: "Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x200D&#x2642&#xFE0F",
                Title: "Man Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477",
                Title: "Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB",
                Title: "Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC",
                Title: "Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD",
                Title: "Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE",
                Title: "Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF",
                Title: "Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473",
                Title: "Person Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB",
                Title: "Person Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC",
                Title: "Person Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD",
                Title: "Person Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE",
                Title: "Person Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF",
                Title: "Person Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471",
                Title: "Blond-Haired Person"
            }, {
                Emoji: "&#x1F471&#x1F3FB",
                Title: "Blond-Haired Person: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC",
                Title: "Blond-Haired Person: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD",
                Title: "Blond-Haired Person: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE",
                Title: "Blond-Haired Person: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF",
                Title: "Blond-Haired Person: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man"
            }, {
                Emoji: "&#x1F471&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman"
            }, {
                Emoji: "&#x1F471&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F385",
                Title: "Santa Claus"
            }, {
                Emoji: "&#x1F385&#x1F3FB",
                Title: "Santa Claus: Light Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FC",
                Title: "Santa Claus: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FD",
                Title: "Santa Claus: Medium Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FE",
                Title: "Santa Claus: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FF",
                Title: "Santa Claus: Dark Skin Tone"
            }, {
                Emoji: "&#x1F936",
                Title: "Mrs. Claus"
            }, {
                Emoji: "&#x1F936&#x1F3FB",
                Title: "Mrs. Claus: Light Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FC",
                Title: "Mrs. Claus: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FD",
                Title: "Mrs. Claus: Medium Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FE",
                Title: "Mrs. Claus: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FF",
                Title: "Mrs. Claus: Dark Skin Tone"
            }, {
                Emoji: "&#x1F478",
                Title: "Princess"
            }, {
                Emoji: "&#x1F478&#x1F3FB",
                Title: "Princess: Light Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FC",
                Title: "Princess: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FD",
                Title: "Princess: Medium Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FE",
                Title: "Princess: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FF",
                Title: "Princess: Dark Skin Tone"
            }, {
                Emoji: "&#x1F934",
                Title: "Prince"
            }, {
                Emoji: "&#x1F934&#x1F3FB",
                Title: "Prince: Light Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FC",
                Title: "Prince: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FD",
                Title: "Prince: Medium Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FE",
                Title: "Prince: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FF",
                Title: "Prince: Dark Skin Tone"
            }, {
                Emoji: "&#x1F470",
                Title: "Bride With Veil"
            }, {
                Emoji: "&#x1F470&#x1F3FB",
                Title: "Bride With Veil: Light Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FC",
                Title: "Bride With Veil: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FD",
                Title: "Bride With Veil: Medium Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FE",
                Title: "Bride With Veil: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FF",
                Title: "Bride With Veil: Dark Skin Tone"
            }, {
                Emoji: "&#x1F935",
                Title: "Man In Tuxedo"
            }, {
                Emoji: "&#x1F935&#x1F3FB",
                Title: "Man In Tuxedo: Light Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FC",
                Title: "Man In Tuxedo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FD",
                Title: "Man In Tuxedo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FE",
                Title: "Man In Tuxedo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FF",
                Title: "Man In Tuxedo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F930",
                Title: "Pregnant Woman"
            }, {
                Emoji: "&#x1F930&#x1F3FB",
                Title: "Pregnant Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FC",
                Title: "Pregnant Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FD",
                Title: "Pregnant Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FE",
                Title: "Pregnant Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FF",
                Title: "Pregnant Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F472",
                Title: "Man With Chinese Cap"
            }, {
                Emoji: "&#x1F472&#x1F3FB",
                Title: "Man With Chinese Cap: Light Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FC",
                Title: "Man With Chinese Cap: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FD",
                Title: "Man With Chinese Cap: Medium Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FE",
                Title: "Man With Chinese Cap: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FF",
                Title: "Man With Chinese Cap: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D",
                Title: "Person Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB",
                Title: "Person Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC",
                Title: "Person Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD",
                Title: "Person Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE",
                Title: "Person Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF",
                Title: "Person Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E",
                Title: "Person Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB",
                Title: "Person Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC",
                Title: "Person Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD",
                Title: "Person Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE",
                Title: "Person Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF",
                Title: "Person Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645",
                Title: "Person Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB",
                Title: "Person Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC",
                Title: "Person Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD",
                Title: "Person Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE",
                Title: "Person Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF",
                Title: "Person Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646",
                Title: "Person Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB",
                Title: "Person Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC",
                Title: "Person Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD",
                Title: "Person Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE",
                Title: "Person Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF",
                Title: "Person Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481",
                Title: "Person Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB",
                Title: "Person Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC",
                Title: "Person Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD",
                Title: "Person Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE",
                Title: "Person Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF",
                Title: "Person Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B",
                Title: "Person Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB",
                Title: "Person Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC",
                Title: "Person Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD",
                Title: "Person Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE",
                Title: "Person Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF",
                Title: "Person Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647",
                Title: "Person Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB",
                Title: "Person Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC",
                Title: "Person Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD",
                Title: "Person Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE",
                Title: "Person Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF",
                Title: "Person Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926",
                Title: "Person Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB",
                Title: "Person Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC",
                Title: "Person Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD",
                Title: "Person Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE",
                Title: "Person Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF",
                Title: "Person Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937",
                Title: "Person Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB",
                Title: "Person Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC",
                Title: "Person Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD",
                Title: "Person Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE",
                Title: "Person Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF",
                Title: "Person Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486",
                Title: "Person Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB",
                Title: "Person Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC",
                Title: "Person Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD",
                Title: "Person Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE",
                Title: "Person Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF",
                Title: "Person Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487",
                Title: "Person Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB",
                Title: "Person Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC",
                Title: "Person Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD",
                Title: "Person Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE",
                Title: "Person Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF",
                Title: "Person Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6",
                Title: "Person Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB",
                Title: "Person Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC",
                Title: "Person Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD",
                Title: "Person Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE",
                Title: "Person Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF",
                Title: "Person Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x200D&#x2642&#xFE0F",
                Title: "Man Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3",
                Title: "Person Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB",
                Title: "Person Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC",
                Title: "Person Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD",
                Title: "Person Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE",
                Title: "Person Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF",
                Title: "Person Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x200D&#x2642&#xFE0F",
                Title: "Man Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x200D&#x2640&#xFE0F",
                Title: "Woman Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F483",
                Title: "Woman Dancing"
            }, {
                Emoji: "&#x1F483&#x1F3FB",
                Title: "Woman Dancing: Light Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FC",
                Title: "Woman Dancing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FD",
                Title: "Woman Dancing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FE",
                Title: "Woman Dancing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FF",
                Title: "Woman Dancing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F57A",
                Title: "Man Dancing"
            }, {
                Emoji: "&#x1F57A&#x1F3FB",
                Title: "Man Dancing: Light Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FC",
                Title: "Man Dancing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FD",
                Title: "Man Dancing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FE",
                Title: "Man Dancing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FF",
                Title: "Man Dancing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46F",
                Title: "People With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F46F&#x200D&#x2642&#xFE0F",
                Title: "Men With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F46F&#x200D&#x2640&#xFE0F",
                Title: "Women With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F574",
                Title: "Man In Business Suit Levitating"
            }, {
                Emoji: "&#x1F574&#x1F3FB",
                Title: "Man In Business Suit Levitating: Light Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FC",
                Title: "Man In Business Suit Levitating: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FD",
                Title: "Man In Business Suit Levitating: Medium Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FE",
                Title: "Man In Business Suit Levitating: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FF",
                Title: "Man In Business Suit Levitating: Dark Skin Tone"
            }, {
                Emoji: "&#x1F5E3",
                Title: "Speaking Head"
            }, {
                Emoji: "&#x1F464",
                Title: "Bust In Silhouette"
            }, {
                Emoji: "&#x1F465",
                Title: "Busts In Silhouette"
            }, {
                Emoji: "&#x1F93A",
                Title: "Person Fencing"
            }, {
                Emoji: "&#x1F3C7",
                Title: "Horse Racing"
            }, {
                Emoji: "&#x1F3C7&#x1F3FB",
                Title: "Horse Racing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FC",
                Title: "Horse Racing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FD",
                Title: "Horse Racing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FE",
                Title: "Horse Racing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FF",
                Title: "Horse Racing: Dark Skin Tone"
            }, {
                Emoji: "&#x26F7",
                Title: "Skier"
            }, {
                Emoji: "&#x1F3C2",
                Title: "Snowboarder"
            }, {
                Emoji: "&#x1F3C2&#x1F3FB",
                Title: "Snowboarder: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FC",
                Title: "Snowboarder: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FD",
                Title: "Snowboarder: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FE",
                Title: "Snowboarder: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FF",
                Title: "Snowboarder: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC",
                Title: "Person Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB",
                Title: "Person Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC",
                Title: "Person Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD",
                Title: "Person Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE",
                Title: "Person Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF",
                Title: "Person Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4",
                Title: "Person Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB",
                Title: "Person Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC",
                Title: "Person Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD",
                Title: "Person Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE",
                Title: "Person Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF",
                Title: "Person Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3",
                Title: "Person Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB",
                Title: "Person Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC",
                Title: "Person Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD",
                Title: "Person Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE",
                Title: "Person Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF",
                Title: "Person Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA",
                Title: "Person Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB",
                Title: "Person Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC",
                Title: "Person Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD",
                Title: "Person Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE",
                Title: "Person Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF",
                Title: "Person Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9",
                Title: "Person Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB",
                Title: "Person Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC",
                Title: "Person Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD",
                Title: "Person Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE",
                Title: "Person Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF",
                Title: "Person Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB",
                Title: "Person Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB",
                Title: "Person Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC",
                Title: "Person Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD",
                Title: "Person Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE",
                Title: "Person Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF",
                Title: "Person Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4",
                Title: "Person Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB",
                Title: "Person Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC",
                Title: "Person Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD",
                Title: "Person Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE",
                Title: "Person Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF",
                Title: "Person Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x200D&#x2642&#xFE0F",
                Title: "Man Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5",
                Title: "Person Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB",
                Title: "Person Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC",
                Title: "Person Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD",
                Title: "Person Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE",
                Title: "Person Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF",
                Title: "Person Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CE",
                Title: "Racing Car"
            }, {
                Emoji: "&#x1F3CD",
                Title: "Motorcycle"
            }, {
                Emoji: "&#x1F938",
                Title: "Person Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB",
                Title: "Person Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC",
                Title: "Person Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD",
                Title: "Person Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE",
                Title: "Person Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF",
                Title: "Person Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93C",
                Title: "People Wrestling"
            }, {
                Emoji: "&#x1F93C&#x200D&#x2642&#xFE0F",
                Title: "Men Wrestling"
            }, {
                Emoji: "&#x1F93C&#x200D&#x2640&#xFE0F",
                Title: "Women Wrestling"
            }, {
                Emoji: "&#x1F93D",
                Title: "Person Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB",
                Title: "Person Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC",
                Title: "Person Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD",
                Title: "Person Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE",
                Title: "Person Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF",
                Title: "Person Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E",
                Title: "Person Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB",
                Title: "Person Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC",
                Title: "Person Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD",
                Title: "Person Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE",
                Title: "Person Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF",
                Title: "Person Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939",
                Title: "Person Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB",
                Title: "Person Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC",
                Title: "Person Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD",
                Title: "Person Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE",
                Title: "Person Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF",
                Title: "Person Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46B",
                Title: "Man And Woman Holding Hands"
            }, {
                Emoji: "&#x1F46C",
                Title: "Two Men Holding Hands"
            }, {
                Emoji: "&#x1F46D",
                Title: "Two Women Holding Hands"
            }, {
                Emoji: "&#x1F48F",
                Title: "Kiss"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468",
                Title: "Kiss: Woman, Man"
            }, {
                Emoji: "&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468",
                Title: "Kiss: Man, Man"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F469",
                Title: "Kiss: Woman, Woman"
            }, {
                Emoji: "&#x1F491",
                Title: "Couple With Heart"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F468",
                Title: "Couple With Heart: Woman, Man"
            }, {
                Emoji: "&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F468",
                Title: "Couple With Heart: Man, Man"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F469",
                Title: "Couple With Heart: Woman, Woman"
            }, {
                Emoji: "&#x1F46A",
                Title: "Family"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F466",
                Title: "Family: Man, Woman, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467",
                Title: "Family: Man, Woman, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F466",
                Title: "Family: Man, Man, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467",
                Title: "Family: Man, Man, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Man, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Man, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Man, Girl, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467",
                Title: "Family: Woman, Woman, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Woman, Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F466",
                Title: "Family: Man, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467",
                Title: "Family: Man, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Girl, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F466",
                Title: "Family: Woman, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467",
                Title: "Family: Woman, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F3FB",
                Title: "Light Skin Tone"
            }, {
                Emoji: "&#x1F3FC",
                Title: "Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3FD",
                Title: "Medium Skin Tone"
            }, {
                Emoji: "&#x1F3FE",
                Title: "Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3FF",
                Title: "Dark Skin Tone"
            }, {
                Emoji: "&#x1F4AA",
                Title: "Flexed Biceps"
            }, {
                Emoji: "&#x1F4AA&#x1F3FB",
                Title: "Flexed Biceps: Light Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FC",
                Title: "Flexed Biceps: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FD",
                Title: "Flexed Biceps: Medium Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FE",
                Title: "Flexed Biceps: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FF",
                Title: "Flexed Biceps: Dark Skin Tone"
            }, {
                Emoji: "&#x1F933",
                Title: "Selfie"
            }, {
                Emoji: "&#x1F933&#x1F3FB",
                Title: "Selfie: Light Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FC",
                Title: "Selfie: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FD",
                Title: "Selfie: Medium Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FE",
                Title: "Selfie: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FF",
                Title: "Selfie: Dark Skin Tone"
            }, {
                Emoji: "&#x1F448",
                Title: "Backhand Index Pointing Left"
            }, {
                Emoji: "&#x1F448&#x1F3FB",
                Title: "Backhand Index Pointing Left: Light Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FC",
                Title: "Backhand Index Pointing Left: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FD",
                Title: "Backhand Index Pointing Left: Medium Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FE",
                Title: "Backhand Index Pointing Left: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FF",
                Title: "Backhand Index Pointing Left: Dark Skin Tone"
            }, {
                Emoji: "&#x1F449",
                Title: "Backhand Index Pointing Right"
            }, {
                Emoji: "&#x1F449&#x1F3FB",
                Title: "Backhand Index Pointing Right: Light Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FC",
                Title: "Backhand Index Pointing Right: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FD",
                Title: "Backhand Index Pointing Right: Medium Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FE",
                Title: "Backhand Index Pointing Right: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FF",
                Title: "Backhand Index Pointing Right: Dark Skin Tone"
            }, {
                Emoji: "&#x261D",
                Title: "Index Pointing Up"
            }, {
                Emoji: "&#x261D&#x1F3FB",
                Title: "Index Pointing Up: Light Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FC",
                Title: "Index Pointing Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FD",
                Title: "Index Pointing Up: Medium Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FE",
                Title: "Index Pointing Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FF",
                Title: "Index Pointing Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F446",
                Title: "Backhand Index Pointing Up"
            }, {
                Emoji: "&#x1F446&#x1F3FB",
                Title: "Backhand Index Pointing Up: Light Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FC",
                Title: "Backhand Index Pointing Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FD",
                Title: "Backhand Index Pointing Up: Medium Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FE",
                Title: "Backhand Index Pointing Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FF",
                Title: "Backhand Index Pointing Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F595",
                Title: "Middle Finger"
            }, {
                Emoji: "&#x1F595&#x1F3FB",
                Title: "Middle Finger: Light Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FC",
                Title: "Middle Finger: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FD",
                Title: "Middle Finger: Medium Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FE",
                Title: "Middle Finger: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FF",
                Title: "Middle Finger: Dark Skin Tone"
            }, {
                Emoji: "&#x1F447",
                Title: "Backhand Index Pointing Down"
            }, {
                Emoji: "&#x1F447&#x1F3FB",
                Title: "Backhand Index Pointing Down: Light Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FC",
                Title: "Backhand Index Pointing Down: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FD",
                Title: "Backhand Index Pointing Down: Medium Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FE",
                Title: "Backhand Index Pointing Down: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FF",
                Title: "Backhand Index Pointing Down: Dark Skin Tone"
            }, {
                Emoji: "&#x270C",
                Title: "Victory Hand"
            }, {
                Emoji: "&#x270C&#x1F3FB",
                Title: "Victory Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FC",
                Title: "Victory Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FD",
                Title: "Victory Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FE",
                Title: "Victory Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FF",
                Title: "Victory Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91E",
                Title: "Crossed Fingers"
            }, {
                Emoji: "&#x1F91E&#x1F3FB",
                Title: "Crossed Fingers: Light Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FC",
                Title: "Crossed Fingers: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FD",
                Title: "Crossed Fingers: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FE",
                Title: "Crossed Fingers: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FF",
                Title: "Crossed Fingers: Dark Skin Tone"
            }, {
                Emoji: "&#x1F596",
                Title: "Vulcan Salute"
            }, {
                Emoji: "&#x1F596&#x1F3FB",
                Title: "Vulcan Salute: Light Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FC",
                Title: "Vulcan Salute: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FD",
                Title: "Vulcan Salute: Medium Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FE",
                Title: "Vulcan Salute: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FF",
                Title: "Vulcan Salute: Dark Skin Tone"
            }, {
                Emoji: "&#x1F918",
                Title: "Sign Of The Horns"
            }, {
                Emoji: "&#x1F918&#x1F3FB",
                Title: "Sign Of The Horns: Light Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FC",
                Title: "Sign Of The Horns: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FD",
                Title: "Sign Of The Horns: Medium Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FE",
                Title: "Sign Of The Horns: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FF",
                Title: "Sign Of The Horns: Dark Skin Tone"
            }, {
                Emoji: "&#x1F919",
                Title: "Call Me Hand"
            }, {
                Emoji: "&#x1F919&#x1F3FB",
                Title: "Call Me Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FC",
                Title: "Call Me Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FD",
                Title: "Call Me Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FE",
                Title: "Call Me Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FF",
                Title: "Call Me Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F590",
                Title: "Raised Hand With Fingers Splayed"
            }, {
                Emoji: "&#x1F590&#x1F3FB",
                Title: "Raised Hand With Fingers Splayed: Light Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FC",
                Title: "Raised Hand With Fingers Splayed: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FD",
                Title: "Raised Hand With Fingers Splayed: Medium Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FE",
                Title: "Raised Hand With Fingers Splayed: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FF",
                Title: "Raised Hand With Fingers Splayed: Dark Skin Tone"
            }, {
                Emoji: "&#x270B",
                Title: "Raised Hand"
            }, {
                Emoji: "&#x270B&#x1F3FB",
                Title: "Raised Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FC",
                Title: "Raised Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FD",
                Title: "Raised Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FE",
                Title: "Raised Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FF",
                Title: "Raised Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44C",
                Title: "OK Hand"
            }, {
                Emoji: "&#x1F44C&#x1F3FB",
                Title: "OK Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FC",
                Title: "OK Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FD",
                Title: "OK Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FE",
                Title: "OK Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FF",
                Title: "OK Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44D",
                Title: "Thumbs Up"
            }, {
                Emoji: "&#x1F44D&#x1F3FB",
                Title: "Thumbs Up: Light Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FC",
                Title: "Thumbs Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FD",
                Title: "Thumbs Up: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FE",
                Title: "Thumbs Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FF",
                Title: "Thumbs Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44E",
                Title: "Thumbs Down"
            }, {
                Emoji: "&#x1F44E&#x1F3FB",
                Title: "Thumbs Down: Light Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FC",
                Title: "Thumbs Down: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FD",
                Title: "Thumbs Down: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FE",
                Title: "Thumbs Down: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FF",
                Title: "Thumbs Down: Dark Skin Tone"
            }, {
                Emoji: "&#x270A",
                Title: "Raised Fist"
            }, {
                Emoji: "&#x270A&#x1F3FB",
                Title: "Raised Fist: Light Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FC",
                Title: "Raised Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FD",
                Title: "Raised Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FE",
                Title: "Raised Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FF",
                Title: "Raised Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44A",
                Title: "Oncoming Fist"
            }, {
                Emoji: "&#x1F44A&#x1F3FB",
                Title: "Oncoming Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FC",
                Title: "Oncoming Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FD",
                Title: "Oncoming Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FE",
                Title: "Oncoming Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FF",
                Title: "Oncoming Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91B",
                Title: "Left-Facing Fist"
            }, {
                Emoji: "&#x1F91B&#x1F3FB",
                Title: "Left-Facing Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FC",
                Title: "Left-Facing Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FD",
                Title: "Left-Facing Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FE",
                Title: "Left-Facing Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FF",
                Title: "Left-Facing Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91C",
                Title: "Right-Facing Fist"
            }, {
                Emoji: "&#x1F91C&#x1F3FB",
                Title: "Right-Facing Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FC",
                Title: "Right-Facing Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FD",
                Title: "Right-Facing Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FE",
                Title: "Right-Facing Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FF",
                Title: "Right-Facing Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91A",
                Title: "Raised Back Of Hand"
            }, {
                Emoji: "&#x1F91A&#x1F3FB",
                Title: "Raised Back Of Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FC",
                Title: "Raised Back Of Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FD",
                Title: "Raised Back Of Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FE",
                Title: "Raised Back Of Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FF",
                Title: "Raised Back Of Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44B",
                Title: "Waving Hand"
            }, {
                Emoji: "&#x1F44B&#x1F3FB",
                Title: "Waving Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FC",
                Title: "Waving Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FD",
                Title: "Waving Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FE",
                Title: "Waving Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FF",
                Title: "Waving Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44F",
                Title: "Clapping Hands"
            }, {
                Emoji: "&#x1F44F&#x1F3FB",
                Title: "Clapping Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FC",
                Title: "Clapping Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FD",
                Title: "Clapping Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FE",
                Title: "Clapping Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FF",
                Title: "Clapping Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x270D",
                Title: "Writing Hand"
            }, {
                Emoji: "&#x270D&#x1F3FB",
                Title: "Writing Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FC",
                Title: "Writing Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FD",
                Title: "Writing Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FE",
                Title: "Writing Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FF",
                Title: "Writing Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F450",
                Title: "Open Hands"
            }, {
                Emoji: "&#x1F450&#x1F3FB",
                Title: "Open Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FC",
                Title: "Open Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FD",
                Title: "Open Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FE",
                Title: "Open Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FF",
                Title: "Open Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64C",
                Title: "Raising Hands"
            }, {
                Emoji: "&#x1F64C&#x1F3FB",
                Title: "Raising Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FC",
                Title: "Raising Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FD",
                Title: "Raising Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FE",
                Title: "Raising Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FF",
                Title: "Raising Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64F",
                Title: "Folded Hands"
            }, {
                Emoji: "&#x1F64F&#x1F3FB",
                Title: "Folded Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FC",
                Title: "Folded Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FD",
                Title: "Folded Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FE",
                Title: "Folded Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FF",
                Title: "Folded Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91D",
                Title: "Handshake"
            }, {
                Emoji: "&#x1F485",
                Title: "Nail Polish"
            }, {
                Emoji: "&#x1F485&#x1F3FB",
                Title: "Nail Polish: Light Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FC",
                Title: "Nail Polish: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FD",
                Title: "Nail Polish: Medium Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FE",
                Title: "Nail Polish: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FF",
                Title: "Nail Polish: Dark Skin Tone"
            }, {
                Emoji: "&#x1F442",
                Title: "Ear"
            }, {
                Emoji: "&#x1F442&#x1F3FB",
                Title: "Ear: Light Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FC",
                Title: "Ear: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FD",
                Title: "Ear: Medium Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FE",
                Title: "Ear: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FF",
                Title: "Ear: Dark Skin Tone"
            }, {
                Emoji: "&#x1F443",
                Title: "Nose"
            }, {
                Emoji: "&#x1F443&#x1F3FB",
                Title: "Nose: Light Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FC",
                Title: "Nose: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FD",
                Title: "Nose: Medium Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FE",
                Title: "Nose: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FF",
                Title: "Nose: Dark Skin Tone"
            }, {
                Emoji: "&#x1F463",
                Title: "Footprints"
            }, {
                Emoji: "&#x1F440",
                Title: "Eyes"
            }, {
                Emoji: "&#x1F441",
                Title: "Eye"
            }, {
                Emoji: "&#x1F441&#xFE0F&#x200D&#x1F5E8&#xFE0F",
                Title: "Eye In Speech Bubble"
            }, {
                Emoji: "&#x1F445",
                Title: "Tongue"
            }, {
                Emoji: "&#x1F444",
                Title: "Mouth"
            }, {
                Emoji: "&#x1F48B",
                Title: "Kiss Mark"
            }, {
                Emoji: "&#x1F498",
                Title: "Heart With Arrow"
            }, {
                Emoji: "&#x2764",
                Title: "Red Heart"
            }, {
                Emoji: "&#x1F493",
                Title: "Beating Heart"
            }, {
                Emoji: "&#x1F494",
                Title: "Broken Heart"
            }, {
                Emoji: "&#x1F495",
                Title: "Two Hearts"
            }, {
                Emoji: "&#x1F496",
                Title: "Sparkling Heart"
            }, {
                Emoji: "&#x1F497",
                Title: "Growing Heart"
            }, {
                Emoji: "&#x1F499",
                Title: "Blue Heart"
            }, {
                Emoji: "&#x1F49A",
                Title: "Green Heart"
            }, {
                Emoji: "&#x1F49B",
                Title: "Yellow Heart"
            }, {
                Emoji: "&#x1F49C",
                Title: "Purple Heart"
            }, {
                Emoji: "&#x1F5A4",
                Title: "Black Heart"
            }, {
                Emoji: "&#x1F49D",
                Title: "Heart With Ribbon"
            }, {
                Emoji: "&#x1F49E",
                Title: "Revolving Hearts"
            }, {
                Emoji: "&#x1F49F",
                Title: "Heart Decoration"
            }, {
                Emoji: "&#x2763",
                Title: "Heavy Heart Exclamation"
            }, {
                Emoji: "&#x1F48C",
                Title: "Love Letter"
            }, {
                Emoji: "&#x1F4A4",
                Title: "Zzz"
            }, {
                Emoji: "&#x1F4A2",
                Title: "Anger Symbol"
            }, {
                Emoji: "&#x1F4A3",
                Title: "Bomb"
            }, {
                Emoji: "&#x1F4A5",
                Title: "Collision"
            }, {
                Emoji: "&#x1F4A6",
                Title: "Sweat Droplets"
            }, {
                Emoji: "&#x1F4A8",
                Title: "Dashing Away"
            }, {
                Emoji: "&#x1F4AB",
                Title: "Dizzy"
            }, {
                Emoji: "&#x1F4AC",
                Title: "Speech Balloon"
            }, {
                Emoji: "&#x1F5E8",
                Title: "Left Speech Bubble"
            }, {
                Emoji: "&#x1F5EF",
                Title: "Right Anger Bubble"
            }, {
                Emoji: "&#x1F4AD",
                Title: "Thought Balloon"
            }, {
                Emoji: "&#x1F573",
                Title: "Hole"
            }, {
                Emoji: "&#x1F453",
                Title: "Glasses"
            }, {
                Emoji: "&#x1F576",
                Title: "Sunglasses"
            }, {
                Emoji: "&#x1F454",
                Title: "Necktie"
            }, {
                Emoji: "&#x1F455",
                Title: "T-Shirt"
            }, {
                Emoji: "&#x1F456",
                Title: "Jeans"
            }, {
                Emoji: "&#x1F457",
                Title: "Dress"
            }, {
                Emoji: "&#x1F458",
                Title: "Kimono"
            }, {
                Emoji: "&#x1F459",
                Title: "Bikini"
            }, {
                Emoji: "&#x1F45A",
                Title: "Woman’s Clothes"
            }, {
                Emoji: "&#x1F45B",
                Title: "Purse"
            }, {
                Emoji: "&#x1F45C",
                Title: "Handbag"
            }, {
                Emoji: "&#x1F45D",
                Title: "Clutch Bag"
            }, {
                Emoji: "&#x1F6CD",
                Title: "Shopping Bags"
            }, {
                Emoji: "&#x1F392",
                Title: "School Backpack"
            }, {
                Emoji: "&#x1F45E",
                Title: "Man’s Shoe"
            }, {
                Emoji: "&#x1F45F",
                Title: "Running Shoe"
            }, {
                Emoji: "&#x1F460",
                Title: "High-Heeled Shoe"
            }, {
                Emoji: "&#x1F461",
                Title: "Woman’s Sandal"
            }, {
                Emoji: "&#x1F462",
                Title: "Woman’s Boot"
            }, {
                Emoji: "&#x1F451",
                Title: "Crown"
            }, {
                Emoji: "&#x1F452",
                Title: "Woman’s Hat"
            }, {
                Emoji: "&#x1F3A9",
                Title: "Top Hat"
            }, {
                Emoji: "&#x1F393",
                Title: "Graduation Cap"
            }, {
                Emoji: "&#x26D1",
                Title: "Rescue Worker’s Helmet"
            }, {
                Emoji: "&#x1F4FF",
                Title: "Prayer Beads"
            }, {
                Emoji: "&#x1F484",
                Title: "Lipstick"
            }, {
                Emoji: "&#x1F48D",
                Title: "Ring"
            }, {
                Emoji: "&#x1F48E",
                Title: "Gem Stone"
            }, {
                Emoji: "&#x1F435",
                Title: "Monkey Face"
            }, {
                Emoji: "&#x1F412",
                Title: "Monkey"
            }, {
                Emoji: "&#x1F98D",
                Title: "Gorilla"
            }, {
                Emoji: "&#x1F436",
                Title: "Dog Face"
            }, {
                Emoji: "&#x1F415",
                Title: "Dog"
            }, {
                Emoji: "&#x1F429",
                Title: "Poodle"
            }, {
                Emoji: "&#x1F43A",
                Title: "Wolf Face"
            }, {
                Emoji: "&#x1F98A",
                Title: "Fox Face"
            }, {
                Emoji: "&#x1F431",
                Title: "Cat Face"
            }, {
                Emoji: "&#x1F408",
                Title: "Cat"
            }, {
                Emoji: "&#x1F981",
                Title: "Lion Face"
            }, {
                Emoji: "&#x1F42F",
                Title: "Tiger Face"
            }, {
                Emoji: "&#x1F405",
                Title: "Tiger"
            }, {
                Emoji: "&#x1F406",
                Title: "Leopard"
            }, {
                Emoji: "&#x1F434",
                Title: "Horse Face"
            }, {
                Emoji: "&#x1F40E",
                Title: "Horse"
            }, {
                Emoji: "&#x1F98C",
                Title: "Deer"
            }, {
                Emoji: "&#x1F984",
                Title: "Unicorn Face"
            }, {
                Emoji: "&#x1F42E",
                Title: "Cow Face"
            }, {
                Emoji: "&#x1F402",
                Title: "Ox"
            }, {
                Emoji: "&#x1F403",
                Title: "Water Buffalo"
            }, {
                Emoji: "&#x1F404",
                Title: "Cow"
            }, {
                Emoji: "&#x1F437",
                Title: "Pig Face"
            }, {
                Emoji: "&#x1F416",
                Title: "Pig"
            }, {
                Emoji: "&#x1F417",
                Title: "Boar"
            }, {
                Emoji: "&#x1F43D",
                Title: "Pig Nose"
            }, {
                Emoji: "&#x1F40F",
                Title: "Ram"
            }, {
                Emoji: "&#x1F411",
                Title: "Sheep"
            }, {
                Emoji: "&#x1F410",
                Title: "Goat"
            }, {
                Emoji: "&#x1F42A",
                Title: "Camel"
            }, {
                Emoji: "&#x1F42B",
                Title: "Two-Hump Camel"
            }, {
                Emoji: "&#x1F418",
                Title: "Elephant"
            }, {
                Emoji: "&#x1F98F",
                Title: "Rhinoceros"
            }, {
                Emoji: "&#x1F42D",
                Title: "Mouse Face"
            }, {
                Emoji: "&#x1F401",
                Title: "Mouse"
            }, {
                Emoji: "&#x1F400",
                Title: "Rat"
            }, {
                Emoji: "&#x1F439",
                Title: "Hamster Face"
            }, {
                Emoji: "&#x1F430",
                Title: "Rabbit Face"
            }, {
                Emoji: "&#x1F407",
                Title: "Rabbit"
            }, {
                Emoji: "&#x1F43F",
                Title: "Chipmunk"
            }, {
                Emoji: "&#x1F987",
                Title: "Bat"
            }, {
                Emoji: "&#x1F43B",
                Title: "Bear Face"
            }, {
                Emoji: "&#x1F428",
                Title: "Koala"
            }, {
                Emoji: "&#x1F43C",
                Title: "Panda Face"
            }, {
                Emoji: "&#x1F43E",
                Title: "Paw Prints"
            }, {
                Emoji: "&#x1F983",
                Title: "Turkey"
            }, {
                Emoji: "&#x1F414",
                Title: "Chicken"
            }, {
                Emoji: "&#x1F413",
                Title: "Rooster"
            }, {
                Emoji: "&#x1F423",
                Title: "Hatching Chick"
            }, {
                Emoji: "&#x1F424",
                Title: "Baby Chick"
            }, {
                Emoji: "&#x1F425",
                Title: "Front-Facing Baby Chick"
            }, {
                Emoji: "&#x1F426",
                Title: "Bird"
            }, {
                Emoji: "&#x1F427",
                Title: "Penguin"
            }, {
                Emoji: "&#x1F54A",
                Title: "Dove"
            }, {
                Emoji: "&#x1F985",
                Title: "Eagle"
            }, {
                Emoji: "&#x1F986",
                Title: "Duck"
            }, {
                Emoji: "&#x1F989",
                Title: "Owl"
            }, {
                Emoji: "&#x1F438",
                Title: "Frog Face"
            }, {
                Emoji: "&#x1F40A",
                Title: "Crocodile"
            }, {
                Emoji: "&#x1F422",
                Title: "Turtle"
            }, {
                Emoji: "&#x1F98E",
                Title: "Lizard"
            }, {
                Emoji: "&#x1F40D",
                Title: "Snake"
            }, {
                Emoji: "&#x1F432",
                Title: "Dragon Face"
            }, {
                Emoji: "&#x1F409",
                Title: "Dragon"
            }, {
                Emoji: "&#x1F433",
                Title: "Spouting Whale"
            }, {
                Emoji: "&#x1F40B",
                Title: "Whale"
            }, {
                Emoji: "&#x1F42C",
                Title: "Dolphin"
            }, {
                Emoji: "&#x1F41F",
                Title: "Fish"
            }, {
                Emoji: "&#x1F420",
                Title: "Tropical Fish"
            }, {
                Emoji: "&#x1F421",
                Title: "Blowfish"
            }, {
                Emoji: "&#x1F988",
                Title: "Shark"
            }, {
                Emoji: "&#x1F419",
                Title: "Octopus"
            }, {
                Emoji: "&#x1F41A",
                Title: "Spiral Shell"
            }, {
                Emoji: "&#x1F980",
                Title: "Crab"
            }, {
                Emoji: "&#x1F990",
                Title: "Shrimp"
            }, {
                Emoji: "&#x1F991",
                Title: "Squid"
            }, {
                Emoji: "&#x1F98B",
                Title: "Butterfly"
            }, {
                Emoji: "&#x1F40C",
                Title: "Snail"
            }, {
                Emoji: "&#x1F41B",
                Title: "Bug"
            }, {
                Emoji: "&#x1F41C",
                Title: "Ant"
            }, {
                Emoji: "&#x1F41D",
                Title: "Honeybee"
            }, {
                Emoji: "&#x1F41E",
                Title: "Lady Beetle"
            }, {
                Emoji: "&#x1F577",
                Title: "Spider"
            }, {
                Emoji: "&#x1F578",
                Title: "Spider Web"
            }, {
                Emoji: "&#x1F982",
                Title: "Scorpion"
            }, {
                Emoji: "&#x1F490",
                Title: "Bouquet"
            }, {
                Emoji: "&#x1F338",
                Title: "Cherry Blossom"
            }, {
                Emoji: "&#x1F4AE",
                Title: "White Flower"
            }, {
                Emoji: "&#x1F3F5",
                Title: "Rosette"
            }, {
                Emoji: "&#x1F339",
                Title: "Rose"
            }, {
                Emoji: "&#x1F940",
                Title: "Wilted Flower"
            }, {
                Emoji: "&#x1F33A",
                Title: "Hibiscus"
            }, {
                Emoji: "&#x1F33B",
                Title: "Sunflower"
            }, {
                Emoji: "&#x1F33C",
                Title: "Blossom"
            }, {
                Emoji: "&#x1F337",
                Title: "Tulip"
            }, {
                Emoji: "&#x1F331",
                Title: "Seedling"
            }, {
                Emoji: "&#x1F332",
                Title: "Evergreen Tree"
            }, {
                Emoji: "&#x1F333",
                Title: "Deciduous Tree"
            }, {
                Emoji: "&#x1F334",
                Title: "Palm Tree"
            }, {
                Emoji: "&#x1F335",
                Title: "Cactus"
            }, {
                Emoji: "&#x1F33E",
                Title: "Sheaf Of Rice"
            }, {
                Emoji: "&#x1F33F",
                Title: "Herb"
            }, {
                Emoji: "&#x2618",
                Title: "Shamrock"
            }, {
                Emoji: "&#x1F340",
                Title: "Four Leaf Clover"
            }, {
                Emoji: "&#x1F341",
                Title: "Maple Leaf"
            }, {
                Emoji: "&#x1F342",
                Title: "Fallen Leaf"
            }, {
                Emoji: "&#x1F343",
                Title: "Leaf Fluttering In Wind"
            }, {
                Emoji: "&#x1F347",
                Title: "Grapes"
            }, {
                Emoji: "&#x1F348",
                Title: "Melon"
            }, {
                Emoji: "&#x1F349",
                Title: "Watermelon"
            }, {
                Emoji: "&#x1F34A",
                Title: "Tangerine"
            }, {
                Emoji: "&#x1F34B",
                Title: "Lemon"
            }, {
                Emoji: "&#x1F34C",
                Title: "Banana"
            }, {
                Emoji: "&#x1F34D",
                Title: "Pineapple"
            }, {
                Emoji: "&#x1F34E",
                Title: "Red Apple"
            }, {
                Emoji: "&#x1F34F",
                Title: "Green Apple"
            }, {
                Emoji: "&#x1F350",
                Title: "Pear"
            }, {
                Emoji: "&#x1F351",
                Title: "Peach"
            }, {
                Emoji: "&#x1F352",
                Title: "Cherries"
            }, {
                Emoji: "&#x1F353",
                Title: "Strawberry"
            }, {
                Emoji: "&#x1F95D",
                Title: "Kiwi Fruit"
            }, {
                Emoji: "&#x1F345",
                Title: "Tomato"
            }, {
                Emoji: "&#x1F951",
                Title: "Avocado"
            }, {
                Emoji: "&#x1F346",
                Title: "Eggplant"
            }, {
                Emoji: "&#x1F954",
                Title: "Potato"
            }, {
                Emoji: "&#x1F955",
                Title: "Carrot"
            }, {
                Emoji: "&#x1F33D",
                Title: "Ear Of Corn"
            }, {
                Emoji: "&#x1F336",
                Title: "Hot Pepper"
            }, {
                Emoji: "&#x1F952",
                Title: "Cucumber"
            }, {
                Emoji: "&#x1F344",
                Title: "Mushroom"
            }, {
                Emoji: "&#x1F95C",
                Title: "Peanuts"
            }, {
                Emoji: "&#x1F330",
                Title: "Chestnut"
            }, {
                Emoji: "&#x1F35E",
                Title: "Bread"
            }, {
                Emoji: "&#x1F950",
                Title: "Croissant"
            }, {
                Emoji: "&#x1F956",
                Title: "Baguette Bread"
            }, {
                Emoji: "&#x1F95E",
                Title: "Pancakes"
            }, {
                Emoji: "&#x1F9C0",
                Title: "Cheese Wedge"
            }, {
                Emoji: "&#x1F356",
                Title: "Meat On Bone"
            }, {
                Emoji: "&#x1F357",
                Title: "Poultry Leg"
            }, {
                Emoji: "&#x1F953",
                Title: "Bacon"
            }, {
                Emoji: "&#x1F354",
                Title: "Hamburger"
            }, {
                Emoji: "&#x1F35F",
                Title: "French Fries"
            }, {
                Emoji: "&#x1F355",
                Title: "Pizza"
            }, {
                Emoji: "&#x1F32D",
                Title: "Hot Dog"
            }, {
                Emoji: "&#x1F32E",
                Title: "Taco"
            }, {
                Emoji: "&#x1F32F",
                Title: "Burrito"
            }, {
                Emoji: "&#x1F959",
                Title: "Stuffed Flatbread"
            }, {
                Emoji: "&#x1F95A",
                Title: "Egg"
            }, {
                Emoji: "&#x1F373",
                Title: "Cooking"
            }, {
                Emoji: "&#x1F958",
                Title: "Shallow Pan Of Food"
            }, {
                Emoji: "&#x1F372",
                Title: "Pot Of Food"
            }, {
                Emoji: "&#x1F957",
                Title: "Green Salad"
            }, {
                Emoji: "&#x1F37F",
                Title: "Popcorn"
            }, {
                Emoji: "&#x1F371",
                Title: "Bento Box"
            }, {
                Emoji: "&#x1F358",
                Title: "Rice Cracker"
            }, {
                Emoji: "&#x1F359",
                Title: "Rice Ball"
            }, {
                Emoji: "&#x1F35A",
                Title: "Cooked Rice"
            }, {
                Emoji: "&#x1F35B",
                Title: "Curry Rice"
            }, {
                Emoji: "&#x1F35C",
                Title: "Steaming Bowl"
            }, {
                Emoji: "&#x1F35D",
                Title: "Spaghetti"
            }, {
                Emoji: "&#x1F360",
                Title: "Roasted Sweet Potato"
            }, {
                Emoji: "&#x1F362",
                Title: "Oden"
            }, {
                Emoji: "&#x1F363",
                Title: "Sushi"
            }, {
                Emoji: "&#x1F364",
                Title: "Fried Shrimp"
            }, {
                Emoji: "&#x1F365",
                Title: "Fish Cake With Swirl"
            }, {
                Emoji: "&#x1F361",
                Title: "Dango"
            }, {
                Emoji: "&#x1F366",
                Title: "Soft Ice Cream"
            }, {
                Emoji: "&#x1F367",
                Title: "Shaved Ice"
            }, {
                Emoji: "&#x1F368",
                Title: "Ice Cream"
            }, {
                Emoji: "&#x1F369",
                Title: "Doughnut"
            }, {
                Emoji: "&#x1F36A",
                Title: "Cookie"
            }, {
                Emoji: "&#x1F382",
                Title: "Birthday Cake"
            }, {
                Emoji: "&#x1F370",
                Title: "Shortcake"
            }, {
                Emoji: "&#x1F36B",
                Title: "Chocolate Bar"
            }, {
                Emoji: "&#x1F36C",
                Title: "Candy"
            }, {
                Emoji: "&#x1F36D",
                Title: "Lollipop"
            }, {
                Emoji: "&#x1F36E",
                Title: "Custard"
            }, {
                Emoji: "&#x1F36F",
                Title: "Honey Pot"
            }, {
                Emoji: "&#x1F37C",
                Title: "Baby Bottle"
            }, {
                Emoji: "&#x1F95B",
                Title: "Glass Of Milk"
            }, {
                Emoji: "&#x2615",
                Title: "Hot Beverage"
            }, {
                Emoji: "&#x1F375",
                Title: "Teacup Without Handle"
            }, {
                Emoji: "&#x1F376",
                Title: "Sake"
            }, {
                Emoji: "&#x1F37E",
                Title: "Bottle With Popping Cork"
            }, {
                Emoji: "&#x1F377",
                Title: "Wine Glass"
            }, {
                Emoji: "&#x1F378",
                Title: "Cocktail Glass"
            }, {
                Emoji: "&#x1F379",
                Title: "Tropical Drink"
            }, {
                Emoji: "&#x1F37A",
                Title: "Beer Mug"
            }, {
                Emoji: "&#x1F37B",
                Title: "Clinking Beer Mugs"
            }, {
                Emoji: "&#x1F942",
                Title: "Clinking Glasses"
            }, {
                Emoji: "&#x1F943",
                Title: "Tumbler Glass"
            }, {
                Emoji: "&#x1F37D",
                Title: "Fork And Knife With Plate"
            }, {
                Emoji: "&#x1F374",
                Title: "Fork And Knife"
            }, {
                Emoji: "&#x1F944",
                Title: "Spoon"
            }, {
                Emoji: "&#x1F52A",
                Title: "Kitchen Knife"
            }, {
                Emoji: "&#x1F3FA",
                Title: "Amphora"
            }, {
                Emoji: "&#x1F30D",
                Title: "Globe Showing Europe-Africa"
            }, {
                Emoji: "&#x1F30E",
                Title: "Globe Showing Americas"
            }, {
                Emoji: "&#x1F30F",
                Title: "Globe Showing Asia-Australia"
            }, {
                Emoji: "&#x1F310",
                Title: "Globe With Meridians"
            }, {
                Emoji: "&#x1F5FA",
                Title: "World Map"
            }, {
                Emoji: "&#x1F5FE",
                Title: "Map Of Japan"
            }, {
                Emoji: "&#x1F3D4",
                Title: "Snow-Capped Mountain"
            }, {
                Emoji: "&#x26F0",
                Title: "Mountain"
            }, {
                Emoji: "&#x1F30B",
                Title: "Volcano"
            }, {
                Emoji: "&#x1F5FB",
                Title: "Mount Fuji"
            }, {
                Emoji: "&#x1F3D5",
                Title: "Camping"
            }, {
                Emoji: "&#x1F3D6",
                Title: "Beach With Umbrella"
            }, {
                Emoji: "&#x1F3DC",
                Title: "Desert"
            }, {
                Emoji: "&#x1F3DD",
                Title: "Desert Island"
            }, {
                Emoji: "&#x1F3DE",
                Title: "National Park"
            }, {
                Emoji: "&#x1F3DF",
                Title: "Stadium"
            }, {
                Emoji: "&#x1F3DB",
                Title: "Classical Building"
            }, {
                Emoji: "&#x1F3D7",
                Title: "Building Construction"
            }, {
                Emoji: "&#x1F3D8",
                Title: "House"
            }, {
                Emoji: "&#x1F3D9",
                Title: "Cityscape"
            }, {
                Emoji: "&#x1F3DA",
                Title: "Derelict House"
            }, {
                Emoji: "&#x1F3E0",
                Title: "House"
            }, {
                Emoji: "&#x1F3E1",
                Title: "House With Garden"
            }, {
                Emoji: "&#x1F3E2",
                Title: "Office Building"
            }, {
                Emoji: "&#x1F3E3",
                Title: "Japanese Post Office"
            }, {
                Emoji: "&#x1F3E4",
                Title: "Post Office"
            }, {
                Emoji: "&#x1F3E5",
                Title: "Hospital"
            }, {
                Emoji: "&#x1F3E6",
                Title: "Bank"
            }, {
                Emoji: "&#x1F3E8",
                Title: "Hotel"
            }, {
                Emoji: "&#x1F3E9",
                Title: "Love Hotel"
            }, {
                Emoji: "&#x1F3EA",
                Title: "Convenience Store"
            }, {
                Emoji: "&#x1F3EB",
                Title: "School"
            }, {
                Emoji: "&#x1F3EC",
                Title: "Department Store"
            }, {
                Emoji: "&#x1F3ED",
                Title: "Factory"
            }, {
                Emoji: "&#x1F3EF",
                Title: "Japanese Castle"
            }, {
                Emoji: "&#x1F3F0",
                Title: "Castle"
            }, {
                Emoji: "&#x1F492",
                Title: "Wedding"
            }, {
                Emoji: "&#x1F5FC",
                Title: "Tokyo Tower"
            }, {
                Emoji: "&#x1F5FD",
                Title: "Statue Of Liberty"
            }, {
                Emoji: "&#x26EA",
                Title: "Church"
            }, {
                Emoji: "&#x1F54C",
                Title: "Mosque"
            }, {
                Emoji: "&#x1F54D",
                Title: "Synagogue"
            }, {
                Emoji: "&#x26E9",
                Title: "Shinto Shrine"
            }, {
                Emoji: "&#x1F54B",
                Title: "Kaaba"
            }, {
                Emoji: "&#x26F2",
                Title: "Fountain"
            }, {
                Emoji: "&#x26FA",
                Title: "Tent"
            }, {
                Emoji: "&#x1F301",
                Title: "Foggy"
            }, {
                Emoji: "&#x1F303",
                Title: "Night With Stars"
            }, {
                Emoji: "&#x1F304",
                Title: "Sunrise Over Mountains"
            }, {
                Emoji: "&#x1F305",
                Title: "Sunrise"
            }, {
                Emoji: "&#x1F306",
                Title: "Cityscape At Dusk"
            }, {
                Emoji: "&#x1F307",
                Title: "Sunset"
            }, {
                Emoji: "&#x1F309",
                Title: "Bridge At Night"
            }, {
                Emoji: "&#x2668",
                Title: "Hot Springs"
            }, {
                Emoji: "&#x1F30C",
                Title: "Milky Way"
            }, {
                Emoji: "&#x1F3A0",
                Title: "Carousel Horse"
            }, {
                Emoji: "&#x1F3A1",
                Title: "Ferris Wheel"
            }, {
                Emoji: "&#x1F3A2",
                Title: "Roller Coaster"
            }, {
                Emoji: "&#x1F488",
                Title: "Barber Pole"
            }, {
                Emoji: "&#x1F3AA",
                Title: "Circus Tent"
            }, {
                Emoji: "&#x1F3AD",
                Title: "Performing Arts"
            }, {
                Emoji: "&#x1F5BC",
                Title: "Framed Picture"
            }, {
                Emoji: "&#x1F3A8",
                Title: "Artist Palette"
            }, {
                Emoji: "&#x1F3B0",
                Title: "Slot Machine"
            }, {
                Emoji: "&#x1F682",
                Title: "Locomotive"
            }, {
                Emoji: "&#x1F683",
                Title: "Railway Car"
            }, {
                Emoji: "&#x1F684",
                Title: "High-Speed Train"
            }, {
                Emoji: "&#x1F685",
                Title: "High-Speed Train With Bullet Nose"
            }, {
                Emoji: "&#x1F686",
                Title: "Train"
            }, {
                Emoji: "&#x1F687",
                Title: "Metro"
            }, {
                Emoji: "&#x1F688",
                Title: "Light Rail"
            }, {
                Emoji: "&#x1F689",
                Title: "Station"
            }, {
                Emoji: "&#x1F68A",
                Title: "Tram"
            }, {
                Emoji: "&#x1F69D",
                Title: "Monorail"
            }, {
                Emoji: "&#x1F69E",
                Title: "Mountain Railway"
            }, {
                Emoji: "&#x1F68B",
                Title: "Tram Car"
            }, {
                Emoji: "&#x1F68C",
                Title: "Bus"
            }, {
                Emoji: "&#x1F68D",
                Title: "Oncoming Bus"
            }, {
                Emoji: "&#x1F68E",
                Title: "Trolleybus"
            }, {
                Emoji: "&#x1F690",
                Title: "Minibus"
            }, {
                Emoji: "&#x1F691",
                Title: "Ambulance"
            }, {
                Emoji: "&#x1F692",
                Title: "Fire Engine"
            }, {
                Emoji: "&#x1F693",
                Title: "Police Car"
            }, {
                Emoji: "&#x1F694",
                Title: "Oncoming Police Car"
            }, {
                Emoji: "&#x1F695",
                Title: "Taxi"
            }, {
                Emoji: "&#x1F696",
                Title: "Oncoming Taxi"
            }, {
                Emoji: "&#x1F697",
                Title: "Automobile"
            }, {
                Emoji: "&#x1F698",
                Title: "Oncoming Automobile"
            }, {
                Emoji: "&#x1F699",
                Title: "Sport Utility Vehicle"
            }, {
                Emoji: "&#x1F69A",
                Title: "Delivery Truck"
            }, {
                Emoji: "&#x1F69B",
                Title: "Articulated Lorry"
            }, {
                Emoji: "&#x1F69C",
                Title: "Tractor"
            }, {
                Emoji: "&#x1F6B2",
                Title: "Bicycle"
            }, {
                Emoji: "&#x1F6F4",
                Title: "Kick Scooter"
            }, {
                Emoji: "&#x1F6F5",
                Title: "Motor Scooter"
            }, {
                Emoji: "&#x1F68F",
                Title: "Bus Stop"
            }, {
                Emoji: "&#x1F6E3",
                Title: "Motorway"
            }, {
                Emoji: "&#x1F6E4",
                Title: "Railway Track"
            }, {
                Emoji: "&#x26FD",
                Title: "Fuel Pump"
            }, {
                Emoji: "&#x1F6A8",
                Title: "Police Car Light"
            }, {
                Emoji: "&#x1F6A5",
                Title: "Horizontal Traffic Light"
            }, {
                Emoji: "&#x1F6A6",
                Title: "Vertical Traffic Light"
            }, {
                Emoji: "&#x1F6A7",
                Title: "Construction"
            }, {
                Emoji: "&#x1F6D1",
                Title: "Stop Sign"
            }, {
                Emoji: "&#x2693",
                Title: "Anchor"
            }, {
                Emoji: "&#x26F5",
                Title: "Sailboat"
            }, {
                Emoji: "&#x1F6F6",
                Title: "Canoe"
            }, {
                Emoji: "&#x1F6A4",
                Title: "Speedboat"
            }, {
                Emoji: "&#x1F6F3",
                Title: "Passenger Ship"
            }, {
                Emoji: "&#x26F4",
                Title: "Ferry"
            }, {
                Emoji: "&#x1F6E5",
                Title: "Motor Boat"
            }, {
                Emoji: "&#x1F6A2",
                Title: "Ship"
            }, {
                Emoji: "&#x2708",
                Title: "Airplane"
            }, {
                Emoji: "&#x1F6E9",
                Title: "Small Airplane"
            }, {
                Emoji: "&#x1F6EB",
                Title: "Airplane Departure"
            }, {
                Emoji: "&#x1F6EC",
                Title: "Airplane Arrival"
            }, {
                Emoji: "&#x1F4BA",
                Title: "Seat"
            }, {
                Emoji: "&#x1F681",
                Title: "Helicopter"
            }, {
                Emoji: "&#x1F69F",
                Title: "Suspension Railway"
            }, {
                Emoji: "&#x1F6A0",
                Title: "Mountain Cableway"
            }, {
                Emoji: "&#x1F6A1",
                Title: "Aerial Tramway"
            }, {
                Emoji: "&#x1F680",
                Title: "Rocket"
            }, {
                Emoji: "&#x1F6F0",
                Title: "Satellite"
            }, {
                Emoji: "&#x1F6CE",
                Title: "Bellhop Bell"
            }, {
                Emoji: "&#x1F6AA",
                Title: "Door"
            }, {
                Emoji: "&#x1F6CC",
                Title: "Person In Bed"
            }, {
                Emoji: "&#x1F6CC&#x1F3FB",
                Title: "Person In Bed: Light Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FC",
                Title: "Person In Bed: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FD",
                Title: "Person In Bed: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FE",
                Title: "Person In Bed: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FF",
                Title: "Person In Bed: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6CF",
                Title: "Bed"
            }, {
                Emoji: "&#x1F6CB",
                Title: "Couch And Lamp"
            }, {
                Emoji: "&#x1F6BD",
                Title: "Toilet"
            }, {
                Emoji: "&#x1F6BF",
                Title: "Shower"
            }, {
                Emoji: "&#x1F6C0",
                Title: "Person Taking Bath"
            }, {
                Emoji: "&#x1F6C0&#x1F3FB",
                Title: "Person Taking Bath: Light Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FC",
                Title: "Person Taking Bath: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FD",
                Title: "Person Taking Bath: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FE",
                Title: "Person Taking Bath: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FF",
                Title: "Person Taking Bath: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6C1",
                Title: "Bathtub"
            }, {
                Emoji: "&#x231B",
                Title: "Hourglass"
            }, {
                Emoji: "&#x23F3",
                Title: "Hourglass With Flowing Sand"
            }, {
                Emoji: "&#x231A",
                Title: "Watch"
            }, {
                Emoji: "&#x23F0",
                Title: "Alarm Clock"
            }, {
                Emoji: "&#x23F1",
                Title: "Stopwatch"
            }, {
                Emoji: "&#x23F2",
                Title: "Timer Clock"
            }, {
                Emoji: "&#x1F570",
                Title: "Mantelpiece Clock"
            }, {
                Emoji: "&#x1F55B",
                Title: "Twelve O’clock"
            }, {
                Emoji: "&#x1F567",
                Title: "Twelve-Thirty"
            }, {
                Emoji: "&#x1F550",
                Title: "One O’clock"
            }, {
                Emoji: "&#x1F55C",
                Title: "One-Thirty"
            }, {
                Emoji: "&#x1F551",
                Title: "Two O’clock"
            }, {
                Emoji: "&#x1F55D",
                Title: "Two-Thirty"
            }, {
                Emoji: "&#x1F552",
                Title: "Three O’clock"
            }, {
                Emoji: "&#x1F55E",
                Title: "Three-Thirty"
            }, {
                Emoji: "&#x1F553",
                Title: "Four O’clock"
            }, {
                Emoji: "&#x1F55F",
                Title: "Four-Thirty"
            }, {
                Emoji: "&#x1F554",
                Title: "Five O’clock"
            }, {
                Emoji: "&#x1F560",
                Title: "Five-Thirty"
            }, {
                Emoji: "&#x1F555",
                Title: "Six O’clock"
            }, {
                Emoji: "&#x1F561",
                Title: "Six-Thirty"
            }, {
                Emoji: "&#x1F556",
                Title: "Seven O’clock"
            }, {
                Emoji: "&#x1F562",
                Title: "Seven-Thirty"
            }, {
                Emoji: "&#x1F557",
                Title: "Eight O’clock"
            }, {
                Emoji: "&#x1F563",
                Title: "Eight-Thirty"
            }, {
                Emoji: "&#x1F558",
                Title: "Nine O’clock"
            }, {
                Emoji: "&#x1F564",
                Title: "Nine-Thirty"
            }, {
                Emoji: "&#x1F559",
                Title: "Ten O’clock"
            }, {
                Emoji: "&#x1F565",
                Title: "Ten-Thirty"
            }, {
                Emoji: "&#x1F55A",
                Title: "Eleven O’clock"
            }, {
                Emoji: "&#x1F566",
                Title: "Eleven-Thirty"
            }, {
                Emoji: "&#x1F311",
                Title: "New Moon"
            }, {
                Emoji: "&#x1F312",
                Title: "Waxing Crescent Moon"
            }, {
                Emoji: "&#x1F313",
                Title: "First Quarter Moon"
            }, {
                Emoji: "&#x1F314",
                Title: "Waxing Gibbous Moon"
            }, {
                Emoji: "&#x1F315",
                Title: "Full Moon"
            }, {
                Emoji: "&#x1F316",
                Title: "Waning Gibbous Moon"
            }, {
                Emoji: "&#x1F317",
                Title: "Last Quarter Moon"
            }, {
                Emoji: "&#x1F318",
                Title: "Waning Crescent Moon"
            }, {
                Emoji: "&#x1F319",
                Title: "Crescent Moon"
            }, {
                Emoji: "&#x1F31A",
                Title: "New Moon Face"
            }, {
                Emoji: "&#x1F31B",
                Title: "First Quarter Moon With Face"
            }, {
                Emoji: "&#x1F31C",
                Title: "Last Quarter Moon With Face"
            }, {
                Emoji: "&#x1F321",
                Title: "Thermometer"
            }, {
                Emoji: "&#x2600",
                Title: "Sun"
            }, {
                Emoji: "&#x1F31D",
                Title: "Full Moon With Face"
            }, {
                Emoji: "&#x1F31E",
                Title: "Sun With Face"
            }, {
                Emoji: "&#x2B50",
                Title: "White Medium Star"
            }, {
                Emoji: "&#x1F31F",
                Title: "Glowing Star"
            }, {
                Emoji: "&#x1F320",
                Title: "Shooting Star"
            }, {
                Emoji: "&#x2601",
                Title: "Cloud"
            }, {
                Emoji: "&#x26C5",
                Title: "Sun Behind Cloud"
            }, {
                Emoji: "&#x26C8",
                Title: "Cloud With Lightning And Rain"
            }, {
                Emoji: "&#x1F324",
                Title: "Sun Behind Small Cloud"
            }, {
                Emoji: "&#x1F325",
                Title: "Sun Behind Large Cloud"
            }, {
                Emoji: "&#x1F326",
                Title: "Sun Behind Rain Cloud"
            }, {
                Emoji: "&#x1F327",
                Title: "Cloud With Rain"
            }, {
                Emoji: "&#x1F328",
                Title: "Cloud With Snow"
            }, {
                Emoji: "&#x1F329",
                Title: "Cloud With Lightning"
            }, {
                Emoji: "&#x1F32A",
                Title: "Tornado"
            }, {
                Emoji: "&#x1F32B",
                Title: "Fog"
            }, {
                Emoji: "&#x1F32C",
                Title: "Wind Face"
            }, {
                Emoji: "&#x1F300",
                Title: "Cyclone"
            }, {
                Emoji: "&#x1F308",
                Title: "Rainbow"
            }, {
                Emoji: "&#x1F302",
                Title: "Closed Umbrella"
            }, {
                Emoji: "&#x2602",
                Title: "Umbrella"
            }, {
                Emoji: "&#x2614",
                Title: "Umbrella With Rain Drops"
            }, {
                Emoji: "&#x26F1",
                Title: "Umbrella On Ground"
            }, {
                Emoji: "&#x26A1",
                Title: "High Voltage"
            }, {
                Emoji: "&#x2744",
                Title: "Snowflake"
            }, {
                Emoji: "&#x2603",
                Title: "Snowman"
            }, {
                Emoji: "&#x26C4",
                Title: "Snowman Without Snow"
            }, {
                Emoji: "&#x2604",
                Title: "Comet"
            }, {
                Emoji: "&#x1F525",
                Title: "Fire"
            }, {
                Emoji: "&#x1F4A7",
                Title: "Droplet"
            }, {
                Emoji: "&#x1F30A",
                Title: "Water Wave"
            }, {
                Emoji: "&#x1F383",
                Title: "Jack-O-Lantern"
            }, {
                Emoji: "&#x1F384",
                Title: "Christmas Tree"
            }, {
                Emoji: "&#x1F386",
                Title: "Fireworks"
            }, {
                Emoji: "&#x1F387",
                Title: "Sparkler"
            }, {
                Emoji: "&#x2728",
                Title: "Sparkles"
            }, {
                Emoji: "&#x1F388",
                Title: "Balloon"
            }, {
                Emoji: "&#x1F389",
                Title: "Party Popper"
            }, {
                Emoji: "&#x1F38A",
                Title: "Confetti Ball"
            }, {
                Emoji: "&#x1F38B",
                Title: "Tanabata Tree"
            }, {
                Emoji: "&#x1F38D",
                Title: "Pine Decoration"
            }, {
                Emoji: "&#x1F38E",
                Title: "Japanese Dolls"
            }, {
                Emoji: "&#x1F38F",
                Title: "Carp Streamer"
            }, {
                Emoji: "&#x1F390",
                Title: "Wind Chime"
            }, {
                Emoji: "&#x1F391",
                Title: "Moon Viewing Ceremony"
            }, {
                Emoji: "&#x1F380",
                Title: "Ribbon"
            }, {
                Emoji: "&#x1F381",
                Title: "Wrapped Gift"
            }, {
                Emoji: "&#x1F397",
                Title: "Reminder Ribbon"
            }, {
                Emoji: "&#x1F39F",
                Title: "Admission Tickets"
            }, {
                Emoji: "&#x1F3AB",
                Title: "Ticket"
            }, {
                Emoji: "&#x1F396",
                Title: "Military Medal"
            }, {
                Emoji: "&#x1F3C6",
                Title: "Trophy"
            }, {
                Emoji: "&#x1F3C5",
                Title: "Sports Medal"
            }, {
                Emoji: "&#x1F947",
                Title: "1st Place Medal"
            }, {
                Emoji: "&#x1F948",
                Title: "2nd Place Medal"
            }, {
                Emoji: "&#x1F949",
                Title: "3rd Place Medal"
            }, {
                Emoji: "&#x26BD",
                Title: "Soccer Ball"
            }, {
                Emoji: "&#x26BE",
                Title: "Baseball"
            }, {
                Emoji: "&#x1F3C0",
                Title: "Basketball"
            }, {
                Emoji: "&#x1F3D0",
                Title: "Volleyball"
            }, {
                Emoji: "&#x1F3C8",
                Title: "American Football"
            }, {
                Emoji: "&#x1F3C9",
                Title: "Rugby Football"
            }, {
                Emoji: "&#x1F3BE",
                Title: "Tennis"
            }, {
                Emoji: "&#x1F3B1",
                Title: "Pool 8 Ball"
            }, {
                Emoji: "&#x1F3B3",
                Title: "Bowling"
            }, {
                Emoji: "&#x1F3CF",
                Title: "Cricket"
            }, {
                Emoji: "&#x1F3D1",
                Title: "Field Hockey"
            }, {
                Emoji: "&#x1F3D2",
                Title: "Ice Hockey"
            }, {
                Emoji: "&#x1F3D3",
                Title: "Ping Pong"
            }, {
                Emoji: "&#x1F3F8",
                Title: "Badminton"
            }, {
                Emoji: "&#x1F94A",
                Title: "Boxing Glove"
            }, {
                Emoji: "&#x1F94B",
                Title: "Martial Arts Uniform"
            }, {
                Emoji: "&#x1F945",
                Title: "Goal Net"
            }, {
                Emoji: "&#x1F3AF",
                Title: "Direct Hit"
            }, {
                Emoji: "&#x26F3",
                Title: "Flag In Hole"
            }, {
                Emoji: "&#x26F8",
                Title: "Ice Skate"
            }, {
                Emoji: "&#x1F3A3",
                Title: "Fishing Pole"
            }, {
                Emoji: "&#x1F3BD",
                Title: "Running Shirt"
            }, {
                Emoji: "&#x1F3BF",
                Title: "Skis"
            }, {
                Emoji: "&#x1F3AE",
                Title: "Video Game"
            }, {
                Emoji: "&#x1F579",
                Title: "Joystick"
            }, {
                Emoji: "&#x1F3B2",
                Title: "Game Die"
            }, {
                Emoji: "&#x2660",
                Title: "Spade Suit"
            }, {
                Emoji: "&#x2665",
                Title: "Heart Suit"
            }, {
                Emoji: "&#x2666",
                Title: "Diamond Suit"
            }, {
                Emoji: "&#x2663",
                Title: "Club Suit"
            }, {
                Emoji: "&#x1F0CF",
                Title: "Joker"
            }, {
                Emoji: "&#x1F004",
                Title: "Mahjong Red Dragon"
            }, {
                Emoji: "&#x1F3B4",
                Title: "Flower Playing Cards"
            }, {
                Emoji: "&#x1F507",
                Title: "Muted Speaker"
            }, {
                Emoji: "&#x1F508",
                Title: "Speaker Low Volume"
            }, {
                Emoji: "&#x1F509",
                Title: "Speaker Medium Volume"
            }, {
                Emoji: "&#x1F50A",
                Title: "Speaker High Volume"
            }, {
                Emoji: "&#x1F4E2",
                Title: "Loudspeaker"
            }, {
                Emoji: "&#x1F4E3",
                Title: "Megaphone"
            }, {
                Emoji: "&#x1F4EF",
                Title: "Postal Horn"
            }, {
                Emoji: "&#x1F514",
                Title: "Bell"
            }, {
                Emoji: "&#x1F515",
                Title: "Bell With Slash"
            }, {
                Emoji: "&#x1F3BC",
                Title: "Musical Score"
            }, {
                Emoji: "&#x1F3B5",
                Title: "Musical Note"
            }, {
                Emoji: "&#x1F3B6",
                Title: "Musical Notes"
            }, {
                Emoji: "&#x1F399",
                Title: "Studio Microphone"
            }, {
                Emoji: "&#x1F39A",
                Title: "Level Slider"
            }, {
                Emoji: "&#x1F39B",
                Title: "Control Knobs"
            }, {
                Emoji: "&#x1F3A4",
                Title: "Microphone"
            }, {
                Emoji: "&#x1F3A7",
                Title: "Headphone"
            }, {
                Emoji: "&#x1F4FB",
                Title: "Radio"
            }, {
                Emoji: "&#x1F3B7",
                Title: "Saxophone"
            }, {
                Emoji: "&#x1F3B8",
                Title: "Guitar"
            }, {
                Emoji: "&#x1F3B9",
                Title: "Musical Keyboard"
            }, {
                Emoji: "&#x1F3BA",
                Title: "Trumpet"
            }, {
                Emoji: "&#x1F3BB",
                Title: "Violin"
            }, {
                Emoji: "&#x1F941",
                Title: "Drum"
            }, {
                Emoji: "&#x1F4F1",
                Title: "Mobile Phone"
            }, {
                Emoji: "&#x1F4F2",
                Title: "Mobile Phone With Arrow"
            }, {
                Emoji: "&#x260E",
                Title: "Telephone"
            }, {
                Emoji: "&#x1F4DE",
                Title: "Telephone Receiver"
            }, {
                Emoji: "&#x1F4DF",
                Title: "Pager"
            }, {
                Emoji: "&#x1F4E0",
                Title: "Fax Machine"
            }, {
                Emoji: "&#x1F50B",
                Title: "Battery"
            }, {
                Emoji: "&#x1F50C",
                Title: "Electric Plug"
            }, {
                Emoji: "&#x1F4BB",
                Title: "Laptop Computer"
            }, {
                Emoji: "&#x1F5A5",
                Title: "Desktop Computer"
            }, {
                Emoji: "&#x1F5A8",
                Title: "Printer"
            }, {
                Emoji: "&#x2328",
                Title: "Keyboard"
            }, {
                Emoji: "&#x1F5B1",
                Title: "Computer Mouse"
            }, {
                Emoji: "&#x1F5B2",
                Title: "Trackball"
            }, {
                Emoji: "&#x1F4BD",
                Title: "Computer Disk"
            }, {
                Emoji: "&#x1F4BE",
                Title: "Floppy Disk"
            }, {
                Emoji: "&#x1F4BF",
                Title: "Optical Disk"
            }, {
                Emoji: "&#x1F4C0",
                Title: "Dvd"
            }, {
                Emoji: "&#x1F3A5",
                Title: "Movie Camera"
            }, {
                Emoji: "&#x1F39E",
                Title: "Film Frames"
            }, {
                Emoji: "&#x1F4FD",
                Title: "Film Projector"
            }, {
                Emoji: "&#x1F3AC",
                Title: "Clapper Board"
            }, {
                Emoji: "&#x1F4FA",
                Title: "Television"
            }, {
                Emoji: "&#x1F4F7",
                Title: "Camera"
            }, {
                Emoji: "&#x1F4F8",
                Title: "Camera With Flash"
            }, {
                Emoji: "&#x1F4F9",
                Title: "Video Camera"
            }, {
                Emoji: "&#x1F4FC",
                Title: "Videocassette"
            }, {
                Emoji: "&#x1F50D",
                Title: "Left-Pointing Magnifying Glass"
            }, {
                Emoji: "&#x1F50E",
                Title: "Right-Pointing Magnifying Glass"
            }, {
                Emoji: "&#x1F52C",
                Title: "Microscope"
            }, {
                Emoji: "&#x1F52D",
                Title: "Telescope"
            }, {
                Emoji: "&#x1F4E1",
                Title: "Satellite Antenna"
            }, {
                Emoji: "&#x1F56F",
                Title: "Candle"
            }, {
                Emoji: "&#x1F4A1",
                Title: "Light Bulb"
            }, {
                Emoji: "&#x1F526",
                Title: "Flashlight"
            }, {
                Emoji: "&#x1F3EE",
                Title: "Red Paper Lantern"
            }, {
                Emoji: "&#x1F4D4",
                Title: "Notebook With Decorative Cover"
            }, {
                Emoji: "&#x1F4D5",
                Title: "Closed Book"
            }, {
                Emoji: "&#x1F4D6",
                Title: "Open Book"
            }, {
                Emoji: "&#x1F4D7",
                Title: "Green Book"
            }, {
                Emoji: "&#x1F4D8",
                Title: "Blue Book"
            }, {
                Emoji: "&#x1F4D9",
                Title: "Orange Book"
            }, {
                Emoji: "&#x1F4DA",
                Title: "Books"
            }, {
                Emoji: "&#x1F4D3",
                Title: "Notebook"
            }, {
                Emoji: "&#x1F4D2",
                Title: "Ledger"
            }, {
                Emoji: "&#x1F4C3",
                Title: "Page With Curl"
            }, {
                Emoji: "&#x1F4DC",
                Title: "Scroll"
            }, {
                Emoji: "&#x1F4C4",
                Title: "Page Facing Up"
            }, {
                Emoji: "&#x1F4F0",
                Title: "Newspaper"
            }, {
                Emoji: "&#x1F5DE",
                Title: "Rolled-Up Newspaper"
            }, {
                Emoji: "&#x1F4D1",
                Title: "Bookmark Tabs"
            }, {
                Emoji: "&#x1F516",
                Title: "Bookmark"
            }, {
                Emoji: "&#x1F3F7",
                Title: "Label"
            }, {
                Emoji: "&#x1F4B0",
                Title: "Money Bag"
            }, {
                Emoji: "&#x1F4B4",
                Title: "Yen Banknote"
            }, {
                Emoji: "&#x1F4B5",
                Title: "Dollar Banknote"
            }, {
                Emoji: "&#x1F4B6",
                Title: "Euro Banknote"
            }, {
                Emoji: "&#x1F4B7",
                Title: "Pound Banknote"
            }, {
                Emoji: "&#x1F4B8",
                Title: "Money With Wings"
            }, {
                Emoji: "&#x1F4B3",
                Title: "Credit Card"
            }, {
                Emoji: "&#x1F4B9",
                Title: "Chart Increasing With Yen"
            }, {
                Emoji: "&#x1F4B1",
                Title: "Currency Exchange"
            }, {
                Emoji: "&#x1F4B2",
                Title: "Heavy Dollar Sign"
            }, {
                Emoji: "&#x2709",
                Title: "Envelope"
            }, {
                Emoji: "&#x1F4E7",
                Title: "E-Mail"
            }, {
                Emoji: "&#x1F4E8",
                Title: "Incoming Envelope"
            }, {
                Emoji: "&#x1F4E9",
                Title: "Envelope With Arrow"
            }, {
                Emoji: "&#x1F4E4",
                Title: "Outbox Tray"
            }, {
                Emoji: "&#x1F4E5",
                Title: "Inbox Tray"
            }, {
                Emoji: "&#x1F4E6",
                Title: "Package"
            }, {
                Emoji: "&#x1F4EB",
                Title: "Closed Mailbox With Raised Flag"
            }, {
                Emoji: "&#x1F4EA",
                Title: "Closed Mailbox With Lowered Flag"
            }, {
                Emoji: "&#x1F4EC",
                Title: "Open Mailbox With Raised Flag"
            }, {
                Emoji: "&#x1F4ED",
                Title: "Open Mailbox With Lowered Flag"
            }, {
                Emoji: "&#x1F4EE",
                Title: "Postbox"
            }, {
                Emoji: "&#x1F5F3",
                Title: "Ballot Box With Ballot"
            }, {
                Emoji: "&#x270F",
                Title: "Pencil"
            }, {
                Emoji: "&#x2712",
                Title: "Black Nib"
            }, {
                Emoji: "&#x1F58B",
                Title: "Fountain Pen"
            }, {
                Emoji: "&#x1F58A",
                Title: "Pen"
            }, {
                Emoji: "&#x1F58C",
                Title: "Paintbrush"
            }, {
                Emoji: "&#x1F58D",
                Title: "Crayon"
            }, {
                Emoji: "&#x1F4DD",
                Title: "Memo"
            }, {
                Emoji: "&#x1F4BC",
                Title: "Briefcase"
            }, {
                Emoji: "&#x1F4C1",
                Title: "File Folder"
            }, {
                Emoji: "&#x1F4C2",
                Title: "Open File Folder"
            }, {
                Emoji: "&#x1F5C2",
                Title: "Card Index Dividers"
            }, {
                Emoji: "&#x1F4C5",
                Title: "Calendar"
            }, {
                Emoji: "&#x1F4C6",
                Title: "Tear-Off Calendar"
            }, {
                Emoji: "&#x1F5D2",
                Title: "Spiral Notepad"
            }, {
                Emoji: "&#x1F5D3",
                Title: "Spiral Calendar"
            }, {
                Emoji: "&#x1F4C7",
                Title: "Card Index"
            }, {
                Emoji: "&#x1F4C8",
                Title: "Chart Increasing"
            }, {
                Emoji: "&#x1F4C9",
                Title: "Chart Decreasing"
            }, {
                Emoji: "&#x1F4CA",
                Title: "Bar Chart"
            }, {
                Emoji: "&#x1F4CB",
                Title: "Clipboard"
            }, {
                Emoji: "&#x1F4CC",
                Title: "Pushpin"
            }, {
                Emoji: "&#x1F4CD",
                Title: "Round Pushpin"
            }, {
                Emoji: "&#x1F4CE",
                Title: "Paperclip"
            }, {
                Emoji: "&#x1F587",
                Title: "Linked Paperclips"
            }, {
                Emoji: "&#x1F4CF",
                Title: "Straight Ruler"
            }, {
                Emoji: "&#x1F4D0",
                Title: "Triangular Ruler"
            }, {
                Emoji: "&#x2702",
                Title: "Scissors"
            }, {
                Emoji: "&#x1F5C3",
                Title: "Card File Box"
            }, {
                Emoji: "&#x1F5C4",
                Title: "File Cabinet"
            }, {
                Emoji: "&#x1F5D1",
                Title: "Wastebasket"
            }, {
                Emoji: "&#x1F512",
                Title: "Locked"
            }, {
                Emoji: "&#x1F513",
                Title: "Unlocked"
            }, {
                Emoji: "&#x1F50F",
                Title: "Locked With Pen"
            }, {
                Emoji: "&#x1F510",
                Title: "Locked With Key"
            }, {
                Emoji: "&#x1F511",
                Title: "Key"
            }, {
                Emoji: "&#x1F5DD",
                Title: "Old Key"
            }, {
                Emoji: "&#x1F528",
                Title: "Hammer"
            }, {
                Emoji: "&#x26CF",
                Title: "Pick"
            }, {
                Emoji: "&#x2692",
                Title: "Hammer And Pick"
            }, {
                Emoji: "&#x1F6E0",
                Title: "Hammer And Wrench"
            }, {
                Emoji: "&#x1F5E1",
                Title: "Dagger"
            }, {
                Emoji: "&#x2694",
                Title: "Crossed Swords"
            }, {
                Emoji: "&#x1F52B",
                Title: "Pistol"
            }, {
                Emoji: "&#x1F3F9",
                Title: "Bow And Arrow"
            }, {
                Emoji: "&#x1F6E1",
                Title: "Shield"
            }, {
                Emoji: "&#x1F527",
                Title: "Wrench"
            }, {
                Emoji: "&#x1F529",
                Title: "Nut And Bolt"
            }, {
                Emoji: "&#x2699",
                Title: "Gear"
            }, {
                Emoji: "&#x1F5DC",
                Title: "Clamp"
            }, {
                Emoji: "&#x2697",
                Title: "Alembic"
            }, {
                Emoji: "&#x2696",
                Title: "Balance Scale"
            }, {
                Emoji: "&#x1F517",
                Title: "Link"
            }, {
                Emoji: "&#x26D3",
                Title: "Chains"
            }, {
                Emoji: "&#x1F489",
                Title: "Syringe"
            }, {
                Emoji: "&#x1F48A",
                Title: "Pill"
            }, {
                Emoji: "&#x1F6AC",
                Title: "Cigarette"
            }, {
                Emoji: "&#x26B0",
                Title: "Coffin"
            }, {
                Emoji: "&#x26B1",
                Title: "Funeral Urn"
            }, {
                Emoji: "&#x1F5FF",
                Title: "Moai"
            }, {
                Emoji: "&#x1F6E2",
                Title: "Oil Drum"
            }, {
                Emoji: "&#x1F52E",
                Title: "Crystal Ball"
            }, {
                Emoji: "&#x1F6D2",
                Title: "Shopping Cart"
            }, {
                Emoji: "&#x1F3E7",
                Title: "ATM Sign"
            }, {
                Emoji: "&#x1F6AE",
                Title: "Litter In Bin Sign"
            }, {
                Emoji: "&#x1F6B0",
                Title: "Potable Water"
            }, {
                Emoji: "&#x267F",
                Title: "Wheelchair Symbol"
            }, {
                Emoji: "&#x1F6B9",
                Title: "Men’s Room"
            }, {
                Emoji: "&#x1F6BA",
                Title: "Women’s Room"
            }, {
                Emoji: "&#x1F6BB",
                Title: "Restroom"
            }, {
                Emoji: "&#x1F6BC",
                Title: "Baby Symbol"
            }, {
                Emoji: "&#x1F6BE",
                Title: "Water Closet"
            }, {
                Emoji: "&#x1F6C2",
                Title: "Passport Control"
            }, {
                Emoji: "&#x1F6C3",
                Title: "Customs"
            }, {
                Emoji: "&#x1F6C4",
                Title: "Baggage Claim"
            }, {
                Emoji: "&#x1F6C5",
                Title: "Left Luggage"
            }, {
                Emoji: "&#x26A0",
                Title: "Warning"
            }, {
                Emoji: "&#x1F6B8",
                Title: "Children Crossing"
            }, {
                Emoji: "&#x26D4",
                Title: "No Entry"
            }, {
                Emoji: "&#x1F6AB",
                Title: "Prohibited"
            }, {
                Emoji: "&#x1F6B3",
                Title: "No Bicycles"
            }, {
                Emoji: "&#x1F6AD",
                Title: "No Smoking"
            }, {
                Emoji: "&#x1F6AF",
                Title: "No Littering"
            }, {
                Emoji: "&#x1F6B1",
                Title: "Non-Potable Water"
            }, {
                Emoji: "&#x1F6B7",
                Title: "No Pedestrians"
            }, {
                Emoji: "&#x1F4F5",
                Title: "No Mobile Phones"
            }, {
                Emoji: "&#x1F51E",
                Title: "No One Under Eighteen"
            }, {
                Emoji: "&#x2622",
                Title: "Radioactive"
            }, {
                Emoji: "&#x2623",
                Title: "Biohazard"
            }, {
                Emoji: "&#x2B06",
                Title: "Up Arrow"
            }, {
                Emoji: "&#x2197",
                Title: "Up-Right Arrow"
            }, {
                Emoji: "&#x27A1",
                Title: "Right Arrow"
            }, {
                Emoji: "&#x2198",
                Title: "Down-Right Arrow"
            }, {
                Emoji: "&#x2B07",
                Title: "Down Arrow"
            }, {
                Emoji: "&#x2199",
                Title: "Down-Left Arrow"
            }, {
                Emoji: "&#x2B05",
                Title: "Left Arrow"
            }, {
                Emoji: "&#x2196",
                Title: "Up-Left Arrow"
            }, {
                Emoji: "&#x2195",
                Title: "Up-Down Arrow"
            }, {
                Emoji: "&#x2194",
                Title: "Left-Right Arrow"
            }, {
                Emoji: "&#x21A9",
                Title: "Right Arrow Curving Left"
            }, {
                Emoji: "&#x21AA",
                Title: "Left Arrow Curving Right"
            }, {
                Emoji: "&#x2934",
                Title: "Right Arrow Curving Up"
            }, {
                Emoji: "&#x2935",
                Title: "Right Arrow Curving Down"
            }, {
                Emoji: "&#x1F503",
                Title: "Clockwise Vertical Arrows"
            }, {
                Emoji: "&#x1F504",
                Title: "Anticlockwise Arrows Button"
            }, {
                Emoji: "&#x1F519",
                Title: "BACK Arrow"
            }, {
                Emoji: "&#x1F51A",
                Title: "END Arrow"
            }, {
                Emoji: "&#x1F51B",
                Title: "ON! Arrow"
            }, {
                Emoji: "&#x1F51C",
                Title: "SOON Arrow"
            }, {
                Emoji: "&#x1F51D",
                Title: "TOP Arrow"
            }, {
                Emoji: "&#x1F6D0",
                Title: "Place Of Worship"
            }, {
                Emoji: "&#x269B",
                Title: "Atom Symbol"
            }, {
                Emoji: "&#x1F549",
                Title: "Om"
            }, {
                Emoji: "&#x2721",
                Title: "Star Of David"
            }, {
                Emoji: "&#x2638",
                Title: "Wheel Of Dharma"
            }, {
                Emoji: "&#x262F",
                Title: "Yin Yang"
            }, {
                Emoji: "&#x271D",
                Title: "Latin Cross"
            }, {
                Emoji: "&#x2626",
                Title: "Orthodox Cross"
            }, {
                Emoji: "&#x262A",
                Title: "Star And Crescent"
            }, {
                Emoji: "&#x262E",
                Title: "Peace Symbol"
            }, {
                Emoji: "&#x1F54E",
                Title: "Menorah"
            }, {
                Emoji: "&#x1F52F",
                Title: "Dotted Six-Pointed Star"
            }, {
                Emoji: "&#x2648",
                Title: "Aries"
            }, {
                Emoji: "&#x2649",
                Title: "Taurus"
            }, {
                Emoji: "&#x264A",
                Title: "Gemini"
            }, {
                Emoji: "&#x264B",
                Title: "Cancer"
            }, {
                Emoji: "&#x264C",
                Title: "Leo"
            }, {
                Emoji: "&#x264D",
                Title: "Virgo"
            }, {
                Emoji: "&#x264E",
                Title: "Libra"
            }, {
                Emoji: "&#x264F",
                Title: "Scorpius"
            }, {
                Emoji: "&#x2650",
                Title: "Sagittarius"
            }, {
                Emoji: "&#x2651",
                Title: "Capricorn"
            }, {
                Emoji: "&#x2652",
                Title: "Aquarius"
            }, {
                Emoji: "&#x2653",
                Title: "Pisces"
            }, {
                Emoji: "&#x26CE",
                Title: "Ophiuchus"
            }, {
                Emoji: "&#x1F500",
                Title: "Shuffle Tracks Button"
            }, {
                Emoji: "&#x1F501",
                Title: "Repeat Button"
            }, {
                Emoji: "&#x1F502",
                Title: "Repeat Single Button"
            }, {
                Emoji: "&#x25B6",
                Title: "Play Button"
            }, {
                Emoji: "&#x23E9",
                Title: "Fast-Forward Button"
            }, {
                Emoji: "&#x23ED",
                Title: "Next Track Button"
            }, {
                Emoji: "&#x23EF",
                Title: "Play Or Pause Button"
            }, {
                Emoji: "&#x25C0",
                Title: "Reverse Button"
            }, {
                Emoji: "&#x23EA",
                Title: "Fast Reverse Button"
            }, {
                Emoji: "&#x23EE",
                Title: "Last Track Button"
            }, {
                Emoji: "&#x1F53C",
                Title: "Up Button"
            }, {
                Emoji: "&#x23EB",
                Title: "Fast Up Button"
            }, {
                Emoji: "&#x1F53D",
                Title: "Down Button"
            }, {
                Emoji: "&#x23EC",
                Title: "Fast Down Button"
            }, {
                Emoji: "&#x23F8",
                Title: "Pause Button"
            }, {
                Emoji: "&#x23F9",
                Title: "Stop Button"
            }, {
                Emoji: "&#x23FA",
                Title: "Record Button"
            }, {
                Emoji: "&#x23CF",
                Title: "Eject Button"
            }, {
                Emoji: "&#x1F3A6",
                Title: "Cinema"
            }, {
                Emoji: "&#x1F505",
                Title: "Dim Button"
            }, {
                Emoji: "&#x1F506",
                Title: "Bright Button"
            }, {
                Emoji: "&#x1F4F6",
                Title: "Antenna Bars"
            }, {
                Emoji: "&#x1F4F3",
                Title: "Vibration Mode"
            }, {
                Emoji: "&#x1F4F4",
                Title: "Mobile Phone Off"
            }, {
                Emoji: "&#x267B",
                Title: "Recycling Symbol"
            }, {
                Emoji: "&#x1F4DB",
                Title: "Name Badge"
            }, {
                Emoji: "&#x269C",
                Title: "Fleur-De-Lis"
            }, {
                Emoji: "&#x1F530",
                Title: "Japanese Symbol For Beginner"
            }, {
                Emoji: "&#x1F531",
                Title: "Trident Emblem"
            }, {
                Emoji: "&#x2B55",
                Title: "Heavy Large Circle"
            }, {
                Emoji: "&#x2705",
                Title: "White Heavy Check Mark"
            }, {
                Emoji: "&#x2611",
                Title: "Ballot Box With Check"
            }, {
                Emoji: "&#x2714",
                Title: "Heavy Check Mark"
            }, {
                Emoji: "&#x2716",
                Title: "Heavy Multiplication X"
            }, {
                Emoji: "&#x274C",
                Title: "Cross Mark"
            }, {
                Emoji: "&#x274E",
                Title: "Cross Mark Button"
            }, {
                Emoji: "&#x2795",
                Title: "Heavy Plus Sign"
            }, {
                Emoji: "&#x2640",
                Title: "Female Sign"
            }, {
                Emoji: "&#x2642",
                Title: "Male Sign"
            }, {
                Emoji: "&#x2695",
                Title: "Medical Symbol"
            }, {
                Emoji: "&#x2796",
                Title: "Heavy Minus Sign"
            }, {
                Emoji: "&#x2797",
                Title: "Heavy Division Sign"
            }, {
                Emoji: "&#x27B0",
                Title: "Curly Loop"
            }, {
                Emoji: "&#x27BF",
                Title: "Double Curly Loop"
            }, {
                Emoji: "&#x303D",
                Title: "Part Alternation Mark"
            }, {
                Emoji: "&#x2733",
                Title: "Eight-Spoked Asterisk"
            }, {
                Emoji: "&#x2734",
                Title: "Eight-Pointed Star"
            }, {
                Emoji: "&#x2747",
                Title: "Sparkle"
            }, {
                Emoji: "&#x203C",
                Title: "Double Exclamation Mark"
            }, {
                Emoji: "&#x2049",
                Title: "Exclamation Question Mark"
            }, {
                Emoji: "&#x2753",
                Title: "Question Mark"
            }, {
                Emoji: "&#x2754",
                Title: "White Question Mark"
            }, {
                Emoji: "&#x2755",
                Title: "White Exclamation Mark"
            }, {
                Emoji: "&#x2757",
                Title: "Exclamation Mark"
            }, {
                Emoji: "&#x3030",
                Title: "Wavy Dash"
            }, {
                Emoji: "&#x00A9",
                Title: "Copyright"
            }, {
                Emoji: "&#x00AE",
                Title: "Registered"
            }, {
                Emoji: "&#x2122",
                Title: "Trade Mark"
            }, {
                Emoji: "&#x0023&#xFE0F&#x20E3",
                Title: "Keycap: #"
            }, {
                Emoji: "&#x002A&#xFE0F&#x20E3",
                Title: "Keycap: *"
            }, {
                Emoji: "&#x0030&#xFE0F&#x20E3",
                Title: "Keycap: 0"
            }, {
                Emoji: "&#x0031&#xFE0F&#x20E3",
                Title: "Keycap: 1"
            }, {
                Emoji: "&#x0032&#xFE0F&#x20E3",
                Title: "Keycap: 2"
            }, {
                Emoji: "&#x0033&#xFE0F&#x20E3",
                Title: "Keycap: 3"
            }, {
                Emoji: "&#x0034&#xFE0F&#x20E3",
                Title: "Keycap: 4"
            }, {
                Emoji: "&#x0035&#xFE0F&#x20E3",
                Title: "Keycap: 5"
            }, {
                Emoji: "&#x0036&#xFE0F&#x20E3",
                Title: "Keycap: 6"
            }, {
                Emoji: "&#x0037&#xFE0F&#x20E3",
                Title: "Keycap: 7"
            }, {
                Emoji: "&#x0038&#xFE0F&#x20E3",
                Title: "Keycap: 8"
            }, {
                Emoji: "&#x0039&#xFE0F&#x20E3",
                Title: "Keycap: 9"
            }, {
                Emoji: "&#x1F51F",
                Title: "Keycap 10"
            }, {
                Emoji: "&#x1F4AF",
                Title: "Hundred Points"
            }, {
                Emoji: "&#x1F520",
                Title: "Input Latin Uppercase"
            }, {
                Emoji: "&#x1F521",
                Title: "Input Latin Lowercase"
            }, {
                Emoji: "&#x1F522",
                Title: "Input Numbers"
            }, {
                Emoji: "&#x1F523",
                Title: "Input Symbols"
            }, {
                Emoji: "&#x1F524",
                Title: "Input Latin Letters"
            }, {
                Emoji: "&#x1F170",
                Title: "A Button (blood Type)"
            }, {
                Emoji: "&#x1F18E",
                Title: "AB Button (blood Type)"
            }, {
                Emoji: "&#x1F171",
                Title: "B Button (blood Type)"
            }, {
                Emoji: "&#x1F191",
                Title: "CL Button"
            }, {
                Emoji: "&#x1F192",
                Title: "COOL Button"
            }, {
                Emoji: "&#x1F193",
                Title: "FREE Button"
            }, {
                Emoji: "&#x2139",
                Title: "Information"
            }, {
                Emoji: "&#x1F194",
                Title: "ID Button"
            }, {
                Emoji: "&#x24C2",
                Title: "Circled M"
            }, {
                Emoji: "&#x1F195",
                Title: "NEW Button"
            }, {
                Emoji: "&#x1F196",
                Title: "NG Button"
            }, {
                Emoji: "&#x1F17E",
                Title: "O Button (blood Type)"
            }, {
                Emoji: "&#x1F197",
                Title: "OK Button"
            }, {
                Emoji: "&#x1F17F",
                Title: "P Button"
            }, {
                Emoji: "&#x1F198",
                Title: "SOS Button"
            }, {
                Emoji: "&#x1F199",
                Title: "UP! Button"
            }, {
                Emoji: "&#x1F19A",
                Title: "VS Button"
            }, {
                Emoji: "&#x1F201",
                Title: "Japanese “here” Button"
            }, {
                Emoji: "&#x1F202",
                Title: "Japanese “service Charge” Button"
            }, {
                Emoji: "&#x1F237",
                Title: "Japanese “monthly Amount” Button"
            }, {
                Emoji: "&#x1F236",
                Title: "Japanese “not Free Of Charge” Button"
            }, {
                Emoji: "&#x1F22F",
                Title: "Japanese “reserved” Button"
            }, {
                Emoji: "&#x1F250",
                Title: "Japanese “bargain” Button"
            }, {
                Emoji: "&#x1F239",
                Title: "Japanese “discount” Button"
            }, {
                Emoji: "&#x1F21A",
                Title: "Japanese “free Of Charge” Button"
            }, {
                Emoji: "&#x1F232",
                Title: "Japanese “prohibited” Button"
            }, {
                Emoji: "&#x1F251",
                Title: "Japanese “acceptable” Button"
            }, {
                Emoji: "&#x1F238",
                Title: "Japanese “application” Button"
            }, {
                Emoji: "&#x1F234",
                Title: "Japanese “passing Grade” Button"
            }, {
                Emoji: "&#x1F233",
                Title: "Japanese “vacancy” Button"
            }, {
                Emoji: "&#x3297",
                Title: "Japanese “congratulations” Button"
            }, {
                Emoji: "&#x3299",
                Title: "Japanese “secret” Button"
            }, {
                Emoji: "&#x1F23A",
                Title: "Japanese “open For Business” Button"
            }, {
                Emoji: "&#x1F235",
                Title: "Japanese “no Vacancy” Button"
            }, {
                Emoji: "&#x25AA",
                Title: "Black Small Square"
            }, {
                Emoji: "&#x25AB",
                Title: "White Small Square"
            }, {
                Emoji: "&#x25FB",
                Title: "White Medium Square"
            }, {
                Emoji: "&#x25FC",
                Title: "Black Medium Square"
            }, {
                Emoji: "&#x25FD",
                Title: "White Medium-Small Square"
            }, {
                Emoji: "&#x25FE",
                Title: "Black Medium-Small Square"
            }, {
                Emoji: "&#x2B1B",
                Title: "Black Large Square"
            }, {
                Emoji: "&#x2B1C",
                Title: "White Large Square"
            }, {
                Emoji: "&#x1F536",
                Title: "Large Orange Diamond"
            }, {
                Emoji: "&#x1F537",
                Title: "Large Blue Diamond"
            }, {
                Emoji: "&#x1F538",
                Title: "Small Orange Diamond"
            }, {
                Emoji: "&#x1F539",
                Title: "Small Blue Diamond"
            }, {
                Emoji: "&#x1F53A",
                Title: "Red Triangle Pointed Up"
            }, {
                Emoji: "&#x1F53B",
                Title: "Red Triangle Pointed Down"
            }, {
                Emoji: "&#x1F4A0",
                Title: "Diamond With A Dot"
            }, {
                Emoji: "&#x1F518",
                Title: "Radio Button"
            }, {
                Emoji: "&#x1F532",
                Title: "Black Square Button"
            }, {
                Emoji: "&#x1F533",
                Title: "White Square Button"
            }, {
                Emoji: "&#x26AA",
                Title: "White Circle"
            }, {
                Emoji: "&#x26AB",
                Title: "Black Circle"
            }, {
                Emoji: "&#x1F534",
                Title: "Red Circle"
            }, {
                Emoji: "&#x1F535",
                Title: "Blue Circle"
            }, {
                Emoji: "&#x1F3C1",
                Title: "Chequered Flag"
            }, {
                Emoji: "&#x1F6A9",
                Title: "Triangular Flag"
            }, {
                Emoji: "&#x1F38C",
                Title: "Crossed Flags"
            }, {
                Emoji: "&#x1F3F4",
                Title: "Black Flag"
            }, {
                Emoji: "&#x1F3F3",
                Title: "White Flag"
            }, {
                Emoji: "&#x1F3F3&#xFE0F&#x200D&#x1F308",
                Title: "Rainbow Flag"
            }, {
                Emoji: "&#x1F1E6&#x1F1E8",
                Title: "Ascension Island"
            }, {
                Emoji: "&#x1F1E6&#x1F1E9",
                Title: "Andorra"
            }, {
                Emoji: "&#x1F1E6&#x1F1EA",
                Title: "United Arab Emirates"
            }, {
                Emoji: "&#x1F1E6&#x1F1EB",
                Title: "Afghanistan"
            }, {
                Emoji: "&#x1F1E6&#x1F1EC",
                Title: "Antigua & Barbuda"
            }, {
                Emoji: "&#x1F1E6&#x1F1EE",
                Title: "Anguilla"
            }, {
                Emoji: "&#x1F1E6&#x1F1F1",
                Title: "Albania"
            }, {
                Emoji: "&#x1F1E6&#x1F1F2",
                Title: "Armenia"
            }, {
                Emoji: "&#x1F1E6&#x1F1F4",
                Title: "Angola"
            }, {
                Emoji: "&#x1F1E6&#x1F1F6",
                Title: "Antarctica"
            }, {
                Emoji: "&#x1F1E6&#x1F1F7",
                Title: "Argentina"
            }, {
                Emoji: "&#x1F1E6&#x1F1F8",
                Title: "American Samoa"
            }, {
                Emoji: "&#x1F1E6&#x1F1F9",
                Title: "Austria"
            }, {
                Emoji: "&#x1F1E6&#x1F1FA",
                Title: "Australia"
            }, {
                Emoji: "&#x1F1E6&#x1F1FC",
                Title: "Aruba"
            }, {
                Emoji: "&#x1F1E6&#x1F1FD",
                Title: "Åland Islands"
            }, {
                Emoji: "&#x1F1E6&#x1F1FF",
                Title: "Azerbaijan"
            }, {
                Emoji: "&#x1F1E7&#x1F1E6",
                Title: "Bosnia & Herzegovina"
            }, {
                Emoji: "&#x1F1E7&#x1F1E7",
                Title: "Barbados"
            }, {
                Emoji: "&#x1F1E7&#x1F1E9",
                Title: "Bangladesh"
            }, {
                Emoji: "&#x1F1E7&#x1F1EA",
                Title: "Belgium"
            }, {
                Emoji: "&#x1F1E7&#x1F1EB",
                Title: "Burkina Faso"
            }, {
                Emoji: "&#x1F1E7&#x1F1EC",
                Title: "Bulgaria"
            }, {
                Emoji: "&#x1F1E7&#x1F1ED",
                Title: "Bahrain"
            }, {
                Emoji: "&#x1F1E7&#x1F1EE",
                Title: "Burundi"
            }, {
                Emoji: "&#x1F1E7&#x1F1EF",
                Title: "Benin"
            }, {
                Emoji: "&#x1F1E7&#x1F1F1",
                Title: "St. Barthélemy"
            }, {
                Emoji: "&#x1F1E7&#x1F1F2",
                Title: "Bermuda"
            }, {
                Emoji: "&#x1F1E7&#x1F1F3",
                Title: "Brunei"
            }, {
                Emoji: "&#x1F1E7&#x1F1F4",
                Title: "Bolivia"
            }, {
                Emoji: "&#x1F1E7&#x1F1F6",
                Title: "Caribbean Netherlands"
            }, {
                Emoji: "&#x1F1E7&#x1F1F7",
                Title: "Brazil"
            }, {
                Emoji: "&#x1F1E7&#x1F1F8",
                Title: "Bahamas"
            }, {
                Emoji: "&#x1F1E7&#x1F1F9",
                Title: "Bhutan"
            }, {
                Emoji: "&#x1F1E7&#x1F1FB",
                Title: "Bouvet Island"
            }, {
                Emoji: "&#x1F1E7&#x1F1FC",
                Title: "Botswana"
            }, {
                Emoji: "&#x1F1E7&#x1F1FE",
                Title: "Belarus"
            }, {
                Emoji: "&#x1F1E7&#x1F1FF",
                Title: "Belize"
            }, {
                Emoji: "&#x1F1E8&#x1F1E6",
                Title: "Canada"
            }, {
                Emoji: "&#x1F1E8&#x1F1E8",
                Title: "Cocos (Keeling) Islands"
            }, {
                Emoji: "&#x1F1E8&#x1F1E9",
                Title: "Congo - Kinshasa"
            }, {
                Emoji: "&#x1F1E8&#x1F1EB",
                Title: "Central African Republic"
            }, {
                Emoji: "&#x1F1E8&#x1F1EC",
                Title: "Congo - Brazzaville"
            }, {
                Emoji: "&#x1F1E8&#x1F1ED",
                Title: "Switzerland"
            }, {
                Emoji: "&#x1F1E8&#x1F1EE",
                Title: "Côte D’Ivoire"
            }, {
                Emoji: "&#x1F1E8&#x1F1F0",
                Title: "Cook Islands"
            }, {
                Emoji: "&#x1F1E8&#x1F1F1",
                Title: "Chile"
            }, {
                Emoji: "&#x1F1E8&#x1F1F2",
                Title: "Cameroon"
            }, {
                Emoji: "&#x1F1E8&#x1F1F3",
                Title: "China"
            }, {
                Emoji: "&#x1F1E8&#x1F1F4",
                Title: "Colombia"
            }, {
                Emoji: "&#x1F1E8&#x1F1F5",
                Title: "Clipperton Island"
            }, {
                Emoji: "&#x1F1E8&#x1F1F7",
                Title: "Costa Rica"
            }, {
                Emoji: "&#x1F1E8&#x1F1FA",
                Title: "Cuba"
            }, {
                Emoji: "&#x1F1E8&#x1F1FB",
                Title: "Cape Verde"
            }, {
                Emoji: "&#x1F1E8&#x1F1FC",
                Title: "Curaçao"
            }, {
                Emoji: "&#x1F1E8&#x1F1FD",
                Title: "Christmas Island"
            }, {
                Emoji: "&#x1F1E8&#x1F1FE",
                Title: "Cyprus"
            }, {
                Emoji: "&#x1F1E8&#x1F1FF",
                Title: "Czech Republic"
            }, {
                Emoji: "&#x1F1E9&#x1F1EA",
                Title: "Germany"
            }, {
                Emoji: "&#x1F1E9&#x1F1EC",
                Title: "Diego Garcia"
            }, {
                Emoji: "&#x1F1E9&#x1F1EF",
                Title: "Djibouti"
            }, {
                Emoji: "&#x1F1E9&#x1F1F0",
                Title: "Denmark"
            }, {
                Emoji: "&#x1F1E9&#x1F1F2",
                Title: "Dominica"
            }, {
                Emoji: "&#x1F1E9&#x1F1F4",
                Title: "Dominican Republic"
            }, {
                Emoji: "&#x1F1E9&#x1F1FF",
                Title: "Algeria"
            }, {
                Emoji: "&#x1F1EA&#x1F1E6",
                Title: "Ceuta & Melilla"
            }, {
                Emoji: "&#x1F1EA&#x1F1E8",
                Title: "Ecuador"
            }, {
                Emoji: "&#x1F1EA&#x1F1EA",
                Title: "Estonia"
            }, {
                Emoji: "&#x1F1EA&#x1F1EC",
                Title: "Egypt"
            }, {
                Emoji: "&#x1F1EA&#x1F1ED",
                Title: "Western Sahara"
            }, {
                Emoji: "&#x1F1EA&#x1F1F7",
                Title: "Eritrea"
            }, {
                Emoji: "&#x1F1EA&#x1F1F8",
                Title: "Spain"
            }, {
                Emoji: "&#x1F1EA&#x1F1F9",
                Title: "Ethiopia"
            }, {
                Emoji: "&#x1F1EA&#x1F1FA",
                Title: "European Union"
            }, {
                Emoji: "&#x1F1EB&#x1F1EE",
                Title: "Finland"
            }, {
                Emoji: "&#x1F1EB&#x1F1EF",
                Title: "Fiji"
            }, {
                Emoji: "&#x1F1EB&#x1F1F0",
                Title: "Falkland Islands"
            }, {
                Emoji: "&#x1F1EB&#x1F1F2",
                Title: "Micronesia"
            }, {
                Emoji: "&#x1F1EB&#x1F1F4",
                Title: "Faroe Islands"
            }, {
                Emoji: "&#x1F1EB&#x1F1F7",
                Title: "France"
            }, {
                Emoji: "&#x1F1EC&#x1F1E6",
                Title: "Gabon"
            }, {
                Emoji: "&#x1F1EC&#x1F1E7",
                Title: "United Kingdom"
            }, {
                Emoji: "&#x1F1EC&#x1F1E9",
                Title: "Grenada"
            }, {
                Emoji: "&#x1F1EC&#x1F1EA",
                Title: "Georgia"
            }, {
                Emoji: "&#x1F1EC&#x1F1EB",
                Title: "French Guiana"
            }, {
                Emoji: "&#x1F1EC&#x1F1EC",
                Title: "Guernsey"
            }, {
                Emoji: "&#x1F1EC&#x1F1ED",
                Title: "Ghana"
            }, {
                Emoji: "&#x1F1EC&#x1F1EE",
                Title: "Gibraltar"
            }, {
                Emoji: "&#x1F1EC&#x1F1F1",
                Title: "Greenland"
            }, {
                Emoji: "&#x1F1EC&#x1F1F2",
                Title: "Gambia"
            }, {
                Emoji: "&#x1F1EC&#x1F1F3",
                Title: "Guinea"
            }, {
                Emoji: "&#x1F1EC&#x1F1F5",
                Title: "Guadeloupe"
            }, {
                Emoji: "&#x1F1EC&#x1F1F6",
                Title: "Equatorial Guinea"
            }, {
                Emoji: "&#x1F1EC&#x1F1F7",
                Title: "Greece"
            }, {
                Emoji: "&#x1F1EC&#x1F1F8",
                Title: "South Georgia & South Sandwich Islands"
            }, {
                Emoji: "&#x1F1EC&#x1F1F9",
                Title: "Guatemala"
            }, {
                Emoji: "&#x1F1EC&#x1F1FA",
                Title: "Guam"
            }, {
                Emoji: "&#x1F1EC&#x1F1FC",
                Title: "Guinea-Bissau"
            }, {
                Emoji: "&#x1F1EC&#x1F1FE",
                Title: "Guyana"
            }, {
                Emoji: "&#x1F1ED&#x1F1F0",
                Title: "Hong Kong SAR China"
            }, {
                Emoji: "&#x1F1ED&#x1F1F2",
                Title: "Heard & McDonald Islands"
            }, {
                Emoji: "&#x1F1ED&#x1F1F3",
                Title: "Honduras"
            }, {
                Emoji: "&#x1F1ED&#x1F1F7",
                Title: "Croatia"
            }, {
                Emoji: "&#x1F1ED&#x1F1F9",
                Title: "Haiti"
            }, {
                Emoji: "&#x1F1ED&#x1F1FA",
                Title: "Hungary"
            }, {
                Emoji: "&#x1F1EE&#x1F1E8",
                Title: "Canary Islands"
            }, {
                Emoji: "&#x1F1EE&#x1F1E9",
                Title: "Indonesia"
            }, {
                Emoji: "&#x1F1EE&#x1F1EA",
                Title: "Ireland"
            }, {
                Emoji: "&#x1F1EE&#x1F1F1",
                Title: "Israel"
            }, {
                Emoji: "&#x1F1EE&#x1F1F2",
                Title: "Isle Of Man"
            }, {
                Emoji: "&#x1F1EE&#x1F1F3",
                Title: "India"
            }, {
                Emoji: "&#x1F1EE&#x1F1F4",
                Title: "British Indian Ocean Territory"
            }, {
                Emoji: "&#x1F1EE&#x1F1F6",
                Title: "Iraq"
            }, {
                Emoji: "&#x1F1EE&#x1F1F7",
                Title: "Iran"
            }, {
                Emoji: "&#x1F1EE&#x1F1F8",
                Title: "Iceland"
            }, {
                Emoji: "&#x1F1EE&#x1F1F9",
                Title: "Italy"
            }, {
                Emoji: "&#x1F1EF&#x1F1EA",
                Title: "Jersey"
            }, {
                Emoji: "&#x1F1EF&#x1F1F2",
                Title: "Jamaica"
            }, {
                Emoji: "&#x1F1EF&#x1F1F4",
                Title: "Jordan"
            }, {
                Emoji: "&#x1F1EF&#x1F1F5",
                Title: "Japan"
            }, {
                Emoji: "&#x1F1F0&#x1F1EA",
                Title: "Kenya"
            }, {
                Emoji: "&#x1F1F0&#x1F1EC",
                Title: "Kyrgyzstan"
            }, {
                Emoji: "&#x1F1F0&#x1F1ED",
                Title: "Cambodia"
            }, {
                Emoji: "&#x1F1F0&#x1F1EE",
                Title: "Kiribati"
            }, {
                Emoji: "&#x1F1F0&#x1F1F2",
                Title: "Comoros"
            }, {
                Emoji: "&#x1F1F0&#x1F1F3",
                Title: "St. Kitts & Nevis"
            }, {
                Emoji: "&#x1F1F0&#x1F1F5",
                Title: "North Korea"
            }, {
                Emoji: "&#x1F1F0&#x1F1F7",
                Title: "South Korea"
            }, {
                Emoji: "&#x1F1F0&#x1F1FC",
                Title: "Kuwait"
            }, {
                Emoji: "&#x1F1F0&#x1F1FE",
                Title: "Cayman Islands"
            }, {
                Emoji: "&#x1F1F0&#x1F1FF",
                Title: "Kazakhstan"
            }, {
                Emoji: "&#x1F1F1&#x1F1E6",
                Title: "Laos"
            }, {
                Emoji: "&#x1F1F1&#x1F1E7",
                Title: "Lebanon"
            }, {
                Emoji: "&#x1F1F1&#x1F1E8",
                Title: "St. Lucia"
            }, {
                Emoji: "&#x1F1F1&#x1F1EE",
                Title: "Liechtenstein"
            }, {
                Emoji: "&#x1F1F1&#x1F1F0",
                Title: "Sri Lanka"
            }, {
                Emoji: "&#x1F1F1&#x1F1F7",
                Title: "Liberia"
            }, {
                Emoji: "&#x1F1F1&#x1F1F8",
                Title: "Lesotho"
            }, {
                Emoji: "&#x1F1F1&#x1F1F9",
                Title: "Lithuania"
            }, {
                Emoji: "&#x1F1F1&#x1F1FA",
                Title: "Luxembourg"
            }, {
                Emoji: "&#x1F1F1&#x1F1FB",
                Title: "Latvia"
            }, {
                Emoji: "&#x1F1F1&#x1F1FE",
                Title: "Libya"
            }, {
                Emoji: "&#x1F1F2&#x1F1E6",
                Title: "Morocco"
            }, {
                Emoji: "&#x1F1F2&#x1F1E8",
                Title: "Monaco"
            }, {
                Emoji: "&#x1F1F2&#x1F1E9",
                Title: "Moldova"
            }, {
                Emoji: "&#x1F1F2&#x1F1EA",
                Title: "Montenegro"
            }, {
                Emoji: "&#x1F1F2&#x1F1EB",
                Title: "St. Martin"
            }, {
                Emoji: "&#x1F1F2&#x1F1EC",
                Title: "Madagascar"
            }, {
                Emoji: "&#x1F1F2&#x1F1ED",
                Title: "Marshall Islands"
            }, {
                Emoji: "&#x1F1F2&#x1F1F0",
                Title: "Macedonia"
            }, {
                Emoji: "&#x1F1F2&#x1F1F1",
                Title: "Mali"
            }, {
                Emoji: "&#x1F1F2&#x1F1F2",
                Title: "Myanmar (Burma)"
            }, {
                Emoji: "&#x1F1F2&#x1F1F3",
                Title: "Mongolia"
            }, {
                Emoji: "&#x1F1F2&#x1F1F4",
                Title: "Macau SAR China"
            }, {
                Emoji: "&#x1F1F2&#x1F1F5",
                Title: "Northern Mariana Islands"
            }, {
                Emoji: "&#x1F1F2&#x1F1F6",
                Title: "Martinique"
            }, {
                Emoji: "&#x1F1F2&#x1F1F7",
                Title: "Mauritania"
            }, {
                Emoji: "&#x1F1F2&#x1F1F8",
                Title: "Montserrat"
            }, {
                Emoji: "&#x1F1F2&#x1F1F9",
                Title: "Malta"
            }, {
                Emoji: "&#x1F1F2&#x1F1FA",
                Title: "Mauritius"
            }, {
                Emoji: "&#x1F1F2&#x1F1FB",
                Title: "Maldives"
            }, {
                Emoji: "&#x1F1F2&#x1F1FC",
                Title: "Malawi"
            }, {
                Emoji: "&#x1F1F2&#x1F1FD",
                Title: "Mexico"
            }, {
                Emoji: "&#x1F1F2&#x1F1FE",
                Title: "Malaysia"
            }, {
                Emoji: "&#x1F1F2&#x1F1FF",
                Title: "Mozambique"
            }, {
                Emoji: "&#x1F1F3&#x1F1E6",
                Title: "Namibia"
            }, {
                Emoji: "&#x1F1F3&#x1F1E8",
                Title: "New Caledonia"
            }, {
                Emoji: "&#x1F1F3&#x1F1EA",
                Title: "Niger"
            }, {
                Emoji: "&#x1F1F3&#x1F1EB",
                Title: "Norfolk Island"
            }, {
                Emoji: "&#x1F1F3&#x1F1EC",
                Title: "Nigeria"
            }, {
                Emoji: "&#x1F1F3&#x1F1EE",
                Title: "Nicaragua"
            }, {
                Emoji: "&#x1F1F3&#x1F1F1",
                Title: "Netherlands"
            }, {
                Emoji: "&#x1F1F3&#x1F1F4",
                Title: "Norway"
            }, {
                Emoji: "&#x1F1F3&#x1F1F5",
                Title: "Nepal"
            }, {
                Emoji: "&#x1F1F3&#x1F1F7",
                Title: "Nauru"
            }, {
                Emoji: "&#x1F1F3&#x1F1FA",
                Title: "Niue"
            }, {
                Emoji: "&#x1F1F3&#x1F1FF",
                Title: "New Zealand"
            }, {
                Emoji: "&#x1F1F4&#x1F1F2",
                Title: "Oman"
            }, {
                Emoji: "&#x1F1F5&#x1F1E6",
                Title: "Panama"
            }, {
                Emoji: "&#x1F1F5&#x1F1EA",
                Title: "Peru"
            }, {
                Emoji: "&#x1F1F5&#x1F1EB",
                Title: "French Polynesia"
            }, {
                Emoji: "&#x1F1F5&#x1F1EC",
                Title: "Papua New Guinea"
            }, {
                Emoji: "&#x1F1F5&#x1F1ED",
                Title: "Philippines"
            }, {
                Emoji: "&#x1F1F5&#x1F1F0",
                Title: "Pakistan"
            }, {
                Emoji: "&#x1F1F5&#x1F1F1",
                Title: "Poland"
            }, {
                Emoji: "&#x1F1F5&#x1F1F2",
                Title: "St. Pierre & Miquelon"
            }, {
                Emoji: "&#x1F1F5&#x1F1F3",
                Title: "Pitcairn Islands"
            }, {
                Emoji: "&#x1F1F5&#x1F1F7",
                Title: "Puerto Rico"
            }, {
                Emoji: "&#x1F1F5&#x1F1F8",
                Title: "Palestinian Territories"
            }, {
                Emoji: "&#x1F1F5&#x1F1F9",
                Title: "Portugal"
            }, {
                Emoji: "&#x1F1F5&#x1F1FC",
                Title: "Palau"
            }, {
                Emoji: "&#x1F1F5&#x1F1FE",
                Title: "Paraguay"
            }, {
                Emoji: "&#x1F1F6&#x1F1E6",
                Title: "Qatar"
            }, {
                Emoji: "&#x1F1F7&#x1F1EA",
                Title: "Réunion"
            }, {
                Emoji: "&#x1F1F7&#x1F1F4",
                Title: "Romania"
            }, {
                Emoji: "&#x1F1F7&#x1F1F8",
                Title: "Serbia"
            }, {
                Emoji: "&#x1F1F7&#x1F1FA",
                Title: "Russia"
            }, {
                Emoji: "&#x1F1F7&#x1F1FC",
                Title: "Rwanda"
            }, {
                Emoji: "&#x1F1F8&#x1F1E6",
                Title: "Saudi Arabia"
            }, {
                Emoji: "&#x1F1F8&#x1F1E7",
                Title: "Solomon Islands"
            }, {
                Emoji: "&#x1F1F8&#x1F1E8",
                Title: "Seychelles"
            }, {
                Emoji: "&#x1F1F8&#x1F1E9",
                Title: "Sudan"
            }, {
                Emoji: "&#x1F1F8&#x1F1EA",
                Title: "Sweden"
            }, {
                Emoji: "&#x1F1F8&#x1F1EC",
                Title: "Singapore"
            }, {
                Emoji: "&#x1F1F8&#x1F1ED",
                Title: "St. Helena"
            }, {
                Emoji: "&#x1F1F8&#x1F1EE",
                Title: "Slovenia"
            }, {
                Emoji: "&#x1F1F8&#x1F1EF",
                Title: "Svalbard & Jan Mayen"
            }, {
                Emoji: "&#x1F1F8&#x1F1F0",
                Title: "Slovakia"
            }, {
                Emoji: "&#x1F1F8&#x1F1F1",
                Title: "Sierra Leone"
            }, {
                Emoji: "&#x1F1F8&#x1F1F2",
                Title: "San Marino"
            }, {
                Emoji: "&#x1F1F8&#x1F1F3",
                Title: "Senegal"
            }, {
                Emoji: "&#x1F1F8&#x1F1F4",
                Title: "Somalia"
            }, {
                Emoji: "&#x1F1F8&#x1F1F7",
                Title: "Suriname"
            }, {
                Emoji: "&#x1F1F8&#x1F1F8",
                Title: "South Sudan"
            }, {
                Emoji: "&#x1F1F8&#x1F1F9",
                Title: "São Tomé & Príncipe"
            }, {
                Emoji: "&#x1F1F8&#x1F1FB",
                Title: "El Salvador"
            }, {
                Emoji: "&#x1F1F8&#x1F1FD",
                Title: "Sint Maarten"
            }, {
                Emoji: "&#x1F1F8&#x1F1FE",
                Title: "Syria"
            }, {
                Emoji: "&#x1F1F8&#x1F1FF",
                Title: "Swaziland"
            }, {
                Emoji: "&#x1F1F9&#x1F1E6",
                Title: "Tristan Da Cunha"
            }, {
                Emoji: "&#x1F1F9&#x1F1E8",
                Title: "Turks & Caicos Islands"
            }, {
                Emoji: "&#x1F1F9&#x1F1E9",
                Title: "Chad"
            }, {
                Emoji: "&#x1F1F9&#x1F1EB",
                Title: "French Southern Territories"
            }, {
                Emoji: "&#x1F1F9&#x1F1EC",
                Title: "Togo"
            }, {
                Emoji: "&#x1F1F9&#x1F1ED",
                Title: "Thailand"
            }, {
                Emoji: "&#x1F1F9&#x1F1EF",
                Title: "Tajikistan"
            }, {
                Emoji: "&#x1F1F9&#x1F1F0",
                Title: "Tokelau"
            }, {
                Emoji: "&#x1F1F9&#x1F1F1",
                Title: "Timor-Leste"
            }, {
                Emoji: "&#x1F1F9&#x1F1F2",
                Title: "Turkmenistan"
            }, {
                Emoji: "&#x1F1F9&#x1F1F3",
                Title: "Tunisia"
            }, {
                Emoji: "&#x1F1F9&#x1F1F4",
                Title: "Tonga"
            }, {
                Emoji: "&#x1F1F9&#x1F1F7",
                Title: "Turkey"
            }, {
                Emoji: "&#x1F1F9&#x1F1F9",
                Title: "Trinidad & Tobago"
            }, {
                Emoji: "&#x1F1F9&#x1F1FB",
                Title: "Tuvalu"
            }, {
                Emoji: "&#x1F1F9&#x1F1FC",
                Title: "Taiwan"
            }, {
                Emoji: "&#x1F1F9&#x1F1FF",
                Title: "Tanzania"
            }, {
                Emoji: "&#x1F1FA&#x1F1E6",
                Title: "Ukraine"
            }, {
                Emoji: "&#x1F1FA&#x1F1EC",
                Title: "Uganda"
            }, {
                Emoji: "&#x1F1FA&#x1F1F2",
                Title: "U.S. Outlying Islands"
            }, {
                Emoji: "&#x1F1FA&#x1F1F3",
                Title: "United Nations"
            }, {
                Emoji: "&#x1F1FA&#x1F1F8",
                Title: "United States"
            }, {
                Emoji: "&#x1F1FA&#x1F1FE",
                Title: "Uruguay"
            }, {
                Emoji: "&#x1F1FA&#x1F1FF",
                Title: "Uzbekistan"
            }, {
                Emoji: "&#x1F1FB&#x1F1E6",
                Title: "Vatican City"
            }, {
                Emoji: "&#x1F1FB&#x1F1E8",
                Title: "St. Vincent & Grenadines"
            }, {
                Emoji: "&#x1F1FB&#x1F1EA",
                Title: "Venezuela"
            }, {
                Emoji: "&#x1F1FB&#x1F1EC",
                Title: "British Virgin Islands"
            }, {
                Emoji: "&#x1F1FB&#x1F1EE",
                Title: "U.S. Virgin Islands"
            }, {
                Emoji: "&#x1F1FB&#x1F1F3",
                Title: "Vietnam"
            }, {
                Emoji: "&#x1F1FB&#x1F1FA",
                Title: "Vanuatu"
            }, {
                Emoji: "&#x1F1FC&#x1F1EB",
                Title: "Wallis & Futuna"
            }, {
                Emoji: "&#x1F1FC&#x1F1F8",
                Title: "Samoa"
            }, {
                Emoji: "&#x1F1FD&#x1F1F0",
                Title: "Kosovo"
            }, {
                Emoji: "&#x1F1FE&#x1F1EA",
                Title: "Yemen"
            }, {
                Emoji: "&#x1F1FE&#x1F1F9",
                Title: "Mayotte"
            }, {
                Emoji: "&#x1F1FF&#x1F1E6",
                Title: "South Africa"
            }, {
                Emoji: "&#x1F1FF&#x1F1F2",
                Title: "Zambia"
            }]
    };
    for (I = 0, N = CFH.Items.length; I < N; ++I) {
        addCFHItem(CFH.Items[I], CFH);
    }
    CFH.TextArea.addEventListener("paste", function(Event) {
        var Value;
        if (GM_getValue("CFH_ALIPF")) {
            Value = Event.clipboardData.getData("text/plain");
            if (Value.match(/^https?:/)) {
                Event.preventDefault();
                wrapCFHLinkImage(CFH, "", Value, Value.match(/\.(jpg|jpeg|gif|bmp|png)/) ? true : false);
            }
        }
    });
}

function wrapCFHLinkImage(CFH, Title, URL, Image) {
    var Start, End, Value;
    Start = CFH.TextArea.selectionStart;
    End = CFH.TextArea.selectionEnd;
    Value = (Image ? "!" : "") + "[" + Title + "](" + URL + ")";
    CFH.TextArea.value = CFH.TextArea.value.slice(0, Start) + Value + CFH.TextArea.value.slice(End);
    CFH.TextArea.setSelectionRange(End + Value.length, End + Value.length);
    CFH.TextArea.focus();
}

function insertCFHTableRows(N, Table) {
    while (N > 0) {
        insertCFHTableRow(Table);
        --N;
    }
}

function insertCFHTableRow(Table) {
    var N, Row, I, J, Delete;
    N = Table.rows.length;
    Row = Table.insertRow(N);
    for (I = 0, J = Table.rows[0].cells.length - 1; I < J; ++I) {
        Row.insertCell(0).innerHTML = "<input placeholder=\"Value\" type=\"text\"/>";
    }
    Delete = Row.insertCell(0);
    if (N > 2) {
        Delete.innerHTML =
            "<a>" +
            "    <i class=\"fa fa-times-circle\" title=\"Delete row.\"></i>" +
            "</a>";
        Delete.firstElementChild.addEventListener("click", function() {
            if (Table.rows.length > 4) {
                Row.remove();
            } else {
                window.alert("A table must have a least one row and two columns.");
            }
        });
    }
}

function insertCFHTableColumns(N, Table) {
    while (N > 0) {
        insertCFHTableColumn(Table);
        --N;
    }
}

function insertCFHTableColumn(Table) {
    var Rows, N, I, J, Delete, Column;
    Rows = Table.rows;
    N = Rows[0].cells.length;
    for (I = 3, J = Rows.length; I < J; ++I) {
        Rows[I].insertCell(N).innerHTML = "<input placeholder=\"Value\" type=\"text\"/>";
    }
    Rows[2].insertCell(N).innerHTML =
        "<select>" +
        "    <option value=\":-\">Left</option>" +
        "    <option value=\":-:\">Center</option>" +
        "    <option value=\"-:\">Right</option>" +
        "</select>";
    Delete = Rows[0].insertCell(N);
    Delete.innerHTML =
        "<a>" +
        "    <i class=\"fa fa-times-circle\" title=\"Delete column.\"></i>" +
        "</a>";
    Column = Rows[1].insertCell(N);
    Column.innerHTML = "<input placeholder=\"Header\" type=\"text\"/>";
    Delete.firstElementChild.addEventListener("click", function() {
        Rows = Table.rows;
        N = Rows[1].cells.length;
        if (N > 3) {
            do {
                --N;
            } while (Rows[1].cells[N] != Column);
            for (I = 0, J = Rows.length; I < J; ++I) {
                Rows[I].deleteCell(N);
            }
        } else {
            window.alert("A table must have at least one row and two columns.");
        }
    });
}

function setCFHEmojis(Emojis, CFH) {
    var I, N;
    for (I = 0, N = Emojis.children.length; I < N; ++I) {
        Emojis.children[I].addEventListener("click", function(Event) {
            wrapCFHFormat(CFH, Event.currentTarget.textContent);
        });
    }
}

function addCFHItem(Item, CFH) {
    var Context, Button, Popout;
    if ((Item.ID && GM_getValue(Item.ID)) || !Item.ID) {
        CFH.Panel.insertAdjacentHTML(
            "beforeEnd",
            "<span>" +
            "    <a class=\"page_heading_btn\" title=\"" + Item.Name + "\">" +
            "        <i class=\"fa " + Item.Icon + "\"></i>" + (Item.SecondaryIcon ? (
                "    <i class=\"fa " + Item.SecondaryIcon + "\"></i>") : "") + (Item.Text ? (
                "    <span>" + Item.Text + "</span") : "") +
            "    </a>" +
            "</span>"
        );
        Context = CFH.Panel.lastElementChild;
        Button = Context.firstElementChild;
        if (Item.setPopout) {
            Popout = createPopout(Context);
            Popout.Popout.classList.add("CFHPopout");
            Popout.customRule = function(Target) {
                return !Button.contains(Target);
            };
            Item.setPopout(Popout.Popout);
            Button.addEventListener("click", function() {
                if (Popout.Popout.classList.contains("rhHidden")) {
                    Popout.popOut(Button, Item.Callback);
                } else {
                    Popout.Popout.classList.add("rhHidden");
                }
            });
        } else if (Item.setPopup) {
            var popup = createPopup();
            popup.Icon.classList.add(`fa-table`);
            popup.Title.textContent = `Add a table:`;
            Item.setPopup(popup);
            Button.addEventListener("click", function() {
                popup.popUp();
            });
        } else {
            if (Item.Callback) {
                Item.Callback(Context);
            }
            Context.addEventListener("click", function() {
                if (Item.OnClick) {
                    Item.OnClick();
                } else {
                    wrapCFHFormat(CFH, Item.Prefix, Item.Suffix, Item.OrderedList, Item.UnorderedList);
                }
            });
        }
    }
}

function wrapCFHFormat(CFH, Prefix, Suffix, OrderedList, UnorderedList) {
    var Value, Start, End, N;
    Value = CFH.TextArea.value;
    Start = CFH.TextArea.selectionStart;
    End = CFH.TextArea.selectionEnd;
    if (OrderedList || UnorderedList) {
        if (OrderedList) {
            N = 1;
            Prefix = N + ". " + Value.slice(Start, End).replace(/\n/g, function() {
                return ("\n" + (++N) + ". ");
            });
        } else {
            Prefix = "* " + Value.slice(Start, End).replace(/\n/g, "\n* ");
        }
    }
    CFH.TextArea.value = Value.slice(0, Start) + Prefix + ((OrderedList || UnorderedList) ? "" : (Value.slice(Start, End) + (Suffix ? Suffix : ""))) + Value.slice(End);
    CFH.TextArea.setSelectionRange(End + Prefix.length, End + Prefix.length);
    CFH.TextArea.focus();
}

function setCFHALIPF(CFH, Value) {
    if (typeof Value == "undefined") {
        Value = GM_getValue("CFH_ALIPF") ? false : true;
        GM_setValue("CFH_ALIPF", Value);
    }
    if (Value) {
        CFH.ALIPF.title = "Automatic Links / Images Paste Formatting: On";
        CFH.ALIPF.classList.remove("CFHALIPF");
    } else {
        CFH.ALIPF.title = "Automatic Links / Images Paste Formatting: Off";
        CFH.ALIPF.classList.add("CFHALIPF");
    }
}

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
    if (button) {
        button.addEventListener(`click`, waitToRestoreReplyBox);
    }

    function waitToRestoreReplyBox() {
      window.setTimeout(restoreReplyBox, 0);
    }

    function restoreReplyBox() {
      box.appendChild(esgst.replyBox);
    }
}

function loadReplyBoxPopup() {
    var CommentBox, Popup, ESCommentBox;
    var Context = esgst.mainPageHeading;
    Popup = createPopup();
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add("fa-comment");
    Popup.Title.textContent = "Add a comment:";
    Popup.TextArea.classList.remove("rhHidden");
    if (esgst.cfh) {
        addCFHPanel(Popup.TextArea);
    }
    createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
        Popup.Progress.innerHTML = "";
        saveComment(esgst.sg ? "" : document.querySelector("[name='trade_code']").value, "", Popup.TextArea.value, esgst.sg ? window.location.href.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php", Popup.Progress,
                    Callback);
    });
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"page_heading_btn MCBPButton\" title=\"Add a comment.\">" +
        "    <i class=\"fa fa-comment\"></i>" +
        "</a>"
    );
    Context.firstElementChild.addEventListener("click", function() {
        Popup.popUp(function() {
            Popup.TextArea.focus();
        });
    });
}

function loadMultiReply(context) {
    var matches = context.getElementsByClassName(esgst.sg ? `comment__actions` : `action_list`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        addMRButton(matches[i]);
    }
}

function addMRButton(Context) {
    var MR, Parent, ReplyButton, Permalink;
    MR = {
        Context: Context,
        Comment: Context.closest(esgst.sg ? ".comment" : ".comment_outer")
    };
    if (MR.Comment) {
        Parent = MR.Comment.closest(esgst.sg ? ".comment" : ".comment_outer");
        MR.Container = MR.Comment.getElementsByClassName(esgst.sg ? "comment__summary" : "comment_inner")[0];
        MR.Timestamp = MR.Context.firstElementChild;
        ReplyButton = MR.Context.getElementsByClassName(esgst.sg ? "js__comment-reply" : "js_comment_reply")[0];
        Permalink = MR.Context.lastElementChild;
        if (ReplyButton || window.location.pathname.match(/^\/messages/)) {
            if (ReplyButton) {
                ReplyButton.remove();
                MR.ParentID = Parent.getAttribute(esgst.sg ? "data-comment-id" : "data-id");
                if (window.location.pathname.match(/^\/messages/)) {
                    MR.URL = Permalink.getAttribute("href");
                }
            } else {
                MR.URL = Permalink.getAttribute("href");
                MR.Comment.insertAdjacentHTML("beforeEnd", "<div class=\"comment__children comment_children\"></div>");
            }
            if (esgst.sg) {
                MR.TradeCode = "";
            } else {
                if (!window.location.pathname.match(/^\/messages/)) {
                    MR.TradeCode = window.location.pathname.match(/^\/trade\/(.+?)\//)[1];
                }
                MR.Username = MR.Comment.getElementsByClassName("author_name")[0].textContent;
            }
            MR.Timestamp.insertAdjacentHTML("afterEnd", "<a class=\"comment__actions__button MRReply\">Reply</a>");
            MR.Timestamp.nextElementSibling.addEventListener("click", function() {
                if (!MR.Box) {
                    addMRBox(MR);
                } else {
                    MR.Description.focus();
                }
            });
        }
        MR.Children = MR.Comment.getElementsByClassName(esgst.sg ? "comment__children" : "comment_children")[0];
        setMREdit(MR);
    }
}

function addMRBox(MR) {
    var Username;
    Username = GM_getValue("Username");
    MR.Children.insertAdjacentHTML(
        "afterBegin",
        "<div class=\"comment reply_form MRBox\">" + (esgst.sg ? (
            "<div class=\"comment__child\">" +
            "    <a href=\"/user/" + Username + "\" class=\"global__image-outer-wrap global__image-outer-wrap--avatar-small\">" +
            "        <div class=\"global__image-inner-wrap\" style=\"background-image: url(" + GM_getValue("Avatar") + ");\"></div>" +
            "    </a>" +
            "    <div class=\"comment__summary\">" +
            "        <div class=\"comment__author\">" +
            "            <div class=\"comment__username\">" +
            "                <a href=\"/user/" + Username + "\">" + Username + "</a>" +
            "            </div>" +
            "        </div>" +
            "        <div class=\"comment__display-state\">" +
            "            <div class=\"comment__description\">") : "") +
        "                    <input name=\"trade_code\" type=\"hidden\" value=\"" + MR.TradeCode + "\">" +
        "                    <input name=\"parent_id\" type=\"hidden\" value=\"" + MR.ParentID + "\">" +
        "                    <textarea class=\"MRDescription\" name=\"description\"" + (esgst.sg ? "" : " placeholder=\"Write a reply to " + MR.Username + "...\"") + "></textarea>" +
        "                    <div class=\"align-button-container btn_actions\">" +
        "                        <div></div>" +
        "                        <div class=\"comment__cancel-button btn_cancel MRCancel\">" +
        "                            <span>Cancel</span>" +
        "                        </div>" +
        "                    </div>" + (esgst.sg ? (
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "</div>") : "") +
        "</div>"
    );
    MR.Box = MR.Children.firstElementChild;
    MR.Description = MR.Box.getElementsByClassName("MRDescription")[0];
    MR.Cancel = MR.Box.getElementsByClassName("MRCancel")[0];
    if (esgst.cfh) {
        addCFHPanel(MR.Description);
    }
    MR.Description.focus();
    addDEDButton(MR.Box, MR.URL, function(Response, DEDStatus) {
        var ReplyID, Reply, ResponseJSON;
        if (esgst.sg) {
            ReplyID = Response.finalUrl.match(/#(.+)/);
            if (ReplyID) {
                MR.Box.remove();
                Reply = parseHTML(Response.responseText).getElementById(ReplyID[1]).closest(".comment");
                addRMLLink(MR.Container, [Reply]);
                loadEndlessFeatures(Reply);
                MR.Children.appendChild(Reply);
                window.location.hash = ReplyID[1];
            } else {
                DEDStatus.innerHTML =
                    "<i class=\"fa fa-times\"></i> " +
                    "<span>Failed!</span>";
            }
        } else {
            ResponseJSON = parseJSON(Response.responseText);
            if (ResponseJSON.success) {
                MR.Box.remove();
                Reply = parseHTML(ResponseJSON.html).getElementsByClassName("comment_outer")[0];
                addRMLLink(MR.Container, [Reply]);
                loadEndlessFeatures(Reply);
                MR.Children.appendChild(Reply);
                window.location.hash = Reply.id;
            } else {
                DEDStatus.innerHTML =
                    "<i class=\"fa fa-times\"></i> " +
                    "<span>Failed!</span>";
            }
        }
    });
    MR.Cancel.addEventListener("click", function() {
        MR.Box.remove();
        MR.Box = null;
    });
}

function setMREdit(MR) {
    var DisplayState, EditState, EditSave, ID, AllowReplies, Description;
    MR.Edit = MR.Context.getElementsByClassName(esgst.sg ? "js__comment-edit" : "js_comment_edit")[0];
    if (MR.Edit) {
        MR.Edit.insertAdjacentHTML("afterEnd", "<a class=\"comment__actions__button MREdit\">Edit</a>");
        MR.Edit = MR.Edit.nextElementSibling;
        MR.Edit.previousElementSibling.remove();
        DisplayState = MR.Comment.getElementsByClassName(esgst.sg ? "comment__display-state" : "comment_body_default")[0];
        EditState = MR.Comment.getElementsByClassName(esgst.sg ? "comment__edit-state" : "edit_form")[0];
        EditSave = EditState.getElementsByClassName(esgst.sg ? "js__comment-edit-save" : "js_submit")[0];
        EditSave.insertAdjacentHTML(
            "afterEnd",
            "<a class=\"comment__submit-button btn_action white EditSave\">" +
            "    <i class=\"fa fa-edit\"></i>" +
            "    <span>Edit</span>" +
            "</a>"
        );
        EditSave = EditSave.nextElementSibling;
        EditSave.previousElementSibling.remove();
        ID = EditState.querySelector("[name='comment_id']").value;
        AllowReplies = esgst.sg ? EditState.querySelector("[name='allow_replies']").value : "";
        Description = EditState.querySelector("[name='description']");
        MR.Edit.addEventListener("click", function() {
            var Temp;
            if (esgst.sg) {
                DisplayState.classList.add("is-hidden");
                MR.Context.classList.add("is-hidden");
            } else {
                MR.Container.classList.add("is_hidden");
            }
            EditState.classList.remove(esgst.sg ? "is-hidden" : "is_hidden");
            Temp = Description.value;
            Description.focus();
            Description.value = "";
            Description.value = Temp;
        });
        EditSave.addEventListener("click", function() {
            makeRequest("xsrf_token=" + esgst.xsrfToken + "&do=comment_edit&comment_id=" + ID + "&allow_replies=" + AllowReplies + "&description=" + encodeURIComponent(Description.value),
                        "/ajax.php", null, function(Response) {
                var ResponseJSON, ResponseHTML;
                ResponseJSON = parseJSON(Response.responseText);
                if (ResponseJSON.type == "success" || ResponseJSON.success) {
                    ResponseHTML = parseHTML(ResponseJSON[esgst.sg ? "comment" : "html"]);
                    DisplayState.innerHTML = ResponseHTML.getElementsByClassName(esgst.sg ? "comment__display-state" : "comment_body_default")[0].innerHTML;
                    EditState.classList.add(esgst.sg ? "is-hidden" : "is_hidden");
                    MR.Timestamp.innerHTML = ResponseHTML.getElementsByClassName(esgst.sg ? "comment__actions" : "action_list")[0].firstElementChild.innerHTML;
                    loadAccurateTimestamps(MR.Timestamp);
                    if (esgst.sg) {
                        DisplayState.classList.remove("is-hidden");
                        MR.Context.classList.remove("is-hidden");
                    } else {
                        MR.Container.classList.remove("is_hidden");
                    }
                }
            });
        });
    }
}

function loadReplyMentionLink(context) {
    var matches = context.getElementsByClassName(esgst.sg ? "comment__children" : "comment_children");
    for (var i = 0, n = matches.length; i < n; ++i) {
        var Matches = matches[i].children;
        if (Matches.length) {
            addRMLLink(esgst.sg ? matches[i].parentElement.getElementsByClassName("comment__summary")[0] : matches[i].parentElement, Matches);
        }
    }
}

function addRMLLink(Context, Matches) {
    var Username, ID, I, N, RMLLink;
    Username = Context.getElementsByClassName(esgst.sg ? "comment__username" : "author_name")[0].textContent.trim();
    ID = Context.id;
    for (I = 0, N = Matches.length; I < N; ++I) {
        Context = Matches[I].getElementsByClassName(esgst.sg ? "comment__actions" : "action_list")[0];
        RMLLink = Context.getElementsByClassName("RMLLink")[0];
        if (RMLLink) {
            RMLLink.textContent = "@" + Username;
        } else {
            Context.insertAdjacentHTML("beforeEnd", "<a class=\"comment__actions__button RMLLink\" href=\"#" + ID + "\">@" + Username + "</a>");
        }
    }
}

function loadAvatarPopout(context) {
    var matches = context.getElementsByClassName(`global__image-outer-wrap--avatar-small`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        addAPContainer(matches[i]);
    }
}

function addAPContainer(APAvatar) {
    var URL, Match, Key, ID, APContainer, Context;
    URL = APAvatar.getAttribute("href");
    Match = URL ? URL.match(/\/(user|group)\/(.+)/) : null;
    if (Match) {
        Key = Match[1];
        ID = Match[2];
        APAvatar.classList.add("APAvatar");
        APAvatar.removeAttribute("href");
        APAvatar.insertAdjacentHTML("afterEnd", "<span class=\"APContainer\"></span>");
        APContainer = APAvatar.nextElementSibling;
        APContainer.appendChild(APAvatar);
        Context = APContainer.closest(".SGCBox") || APContainer.closest(".GGPBox");
        if (Context) {
            Context.insertAdjacentHTML("afterEnd", "<div></div>");
            Context = Context.nextElementSibling;
        } else {
            Context = APContainer;
        }
        APAvatar.addEventListener("click", function() {
            var APBox;
            APBox = esgst.APBoxes[ID];
            if (APBox) {
                if (APBox.Popout.classList.contains("rhHidden")) {
                    Context.appendChild(APBox.Popout);
                    APBox.customRule = function(Target) {
                        return (!APContainer.contains(Target) && !Context.contains(Target));
                    };
                    APBox.popOut(APAvatar);
                } else {
                    APBox.Popout.classList.add("rhHidden");
                }
            } else {
                esgst.APBoxes[ID] = APBox = createPopout(Context);
                APBox.Popout.classList.add("APBox");
                APBox.Popout.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Loading " + Key + "...</span>";
                APBox.customRule = function(Target) {
                    return (!APContainer.contains(Target) && !Context.contains(Target));
                };
                APBox.popOut(APAvatar);
                makeRequest(null, URL, APBox.Popout, function(Response) {
                    var ResponseHTML, Avatar, Columns, ReportButton, APLink, I, N;
                    ResponseHTML = parseHTML(Response.responseText);
                    APBox.Popout.innerHTML =
                        ResponseHTML.getElementsByClassName("featured__outer-wrap")[0].outerHTML +
                        "<div class=\"sidebar__shortcut-outer-wrap\">" + ResponseHTML.getElementsByClassName("sidebar__shortcut-inner-wrap")[0].outerHTML + "</div>";
                    Avatar = APBox.Popout.getElementsByClassName("global__image-outer-wrap--avatar-large")[0];
                    Columns = APBox.Popout.getElementsByClassName("featured__table__column");
                    ReportButton = APBox.Popout.getElementsByClassName("js__submit-form-inner")[0];
                    Avatar.insertAdjacentHTML("afterEnd", "<a class=\"APLink\"></a>");
                    APLink = Avatar.nextElementSibling;
                    APLink.appendChild(Avatar);
                    APLink.setAttribute("href", URL);
                    for (I = 0, N = Columns[1].children.length; I < N; ++I) {
                        Columns[0].appendChild(Columns[1].firstElementChild);
                    }
                    if (ReportButton) {
                        ReportButton.addEventListener("click", function() {
                            return ReportButton.getElementsByTagName("form")[0].submit();
                        });
                    }
                    if (Key == "user") {
                        loadProfileFeatures(APBox.Popout);
                    }
                    APBox.reposition(APAvatar);
                });
            }
        });
    }
}

function loadProfileFeatures(Context) {
    var Heading, SteamButton, User;
    Heading = Context.getElementsByClassName(esgst.sg ? "featured__heading" : "page_heading")[0];
    SteamButton = Context.querySelector("a[href*='/profiles/']");
    User = {};
    User.ID = Context.querySelector("[name='child_user_id']");
    User.ID = User.ID ? User.ID.value : "";
    User.SteamID64 = SteamButton.getAttribute("href").match(/\d+/)[0];
    User.Username = esgst.sg ? Heading.textContent : "";
    var pf = {
        context: Context,
        heading: Heading,
        steamButton: SteamButton
    };
    var Matches = Context.getElementsByClassName("featured__table__row__left");
    for (var I = 0, N = Matches.length; I < N; ++I) {
        var Match = Matches[I].textContent.match(/(Gifts (Won|Sent)|Contributor Level)/);
        if (Match) {
            var Key = Match[2];
            if (Key) {
                if (Key == "Won") {
                    pf.wonRow = Matches[I];
                } else {
                    pf.sentRow = Matches[I];
                }
            } else {
                pf.contributorLevelRow = Matches[I];
            }
        }
    }
    for (var i = 0, n = esgst.profileFeatures.length; i < n; ++i) {
        esgst.profileFeatures[i](pf, User);
    }
}

GM_addStyle(
    ".UHBox {" +
    "   background-position: center;" +
    "   margin: 5px 0 0;" +
    "   padding: 15px;" +
    "   position: absolute;" +
    "   text-align: center;" +
    "   width: auto;" +
    "}" +
    ".UHTitle {" +
    "   margin: 0 0 15px;" +
    "}"
);

function loadUsernameHistory(Context, User) {
    var UHContainer, UHButton, UHBox, UHList;
    if (!Context.context) {
        Context = esgst.featuredHeading;
        User = esgst.user;
    }
    if (Context) {
        if (Context.heading) {
            Context = Context.heading;
        }
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<div class=\"UHContainer\">" +
            "   <a class=\"UHButton\">" +
            "       <i class=\"fa fa-caret-down\"></i>" +
            "   </a>" +
            "   <div class=\"UHBox featured__outer-wrap is-hidden\">" +
            "       <div class=\"UHTitle featured__table__row__left\">" +
            "           <span>Username History</span>" +
            "           <a href=\"https://goo.gl/C2wjUh\" target=\"_blank\" title=\"Expand the database.\">" +
            "               <i class=\"fa fa-expand\"></i>" +
            "           </a>" +
            "       </div>" +
            "       <ul class=\"UHList featured__table__row__right\"></ul>" +
            "   </div>" +
            "</div>"
        );

        UHContainer = Context.lastElementChild;
        UHButton = UHContainer.firstElementChild;
        UHBox = UHButton.nextElementSibling;
        UHList = UHBox.lastElementChild;

        function setUHList(Response) {
            UHList.innerHTML = "<li>" + parseJSON(Response.responseText).Usernames.join("</li><li>") + "</li>";
        }

        function getUHList() {
            var URL;
            UHList.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Getting list...</span>";
            URL = "https://script.google.com/macros/s/AKfycbzvOuHG913mRIXOsqHIeAuQUkLYyxTHOZim5n8iP-k80iza6g0/exec" +
                "?Action=1&SteamID64=" + User.SteamID64 + "&Username=" + User.Username;
            makeRequest(null, URL, UHList, setUHList);
        }

        function toggleUHBox() {
            UHBox.classList.toggle("is-hidden");
            if (!UHList.innerHTML) {
                getUHList();
            }
        }

        function closeUHBox(Event) {
            if (!UHBox.classList.contains("is-hidden") && !UHContainer.contains(Event.target)) {
                UHBox.classList.add("is-hidden");
            }
        }

        UHButton.addEventListener("click", toggleUHBox);
        document.addEventListener("click", closeUHBox);
    }
}

function loadUserNotes(Context, User) {
    var PUNButton, UserID, PUNIcon, SavedUser;
    if (!Context.context) {
        Context = esgst.featuredHeading;
        User = esgst.user;
    }
    if (Context) {
        if (Context.heading) {
            Context = Context.heading;
        }
        Context.insertAdjacentHTML(
            esgst.sg ? "beforeEnd" : "afterBegin",
            "<a class=\"page_heading_btn PUNButton\">" +
            "    <i class=\"fa PUNIcon\"></i>" +
            "</a>"
        );
        PUNButton = Context[esgst.sg ? "lastElementChild" : "firstElementChild"];
        UserID = esgst.sg ? User.Username : User.SteamID64;
        PUNIcon = PUNButton.firstElementChild;
        SavedUser = getUser(User);
        PUNIcon.classList.add((SavedUser && SavedUser.Notes) ? "fa-sticky-note" : "fa-sticky-note-o");
        PUNButton.addEventListener("click", function() {
            var Popup;
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-sticky-note");
            Popup.Title.innerHTML = "Edit user notes for <span>" + UserID + "</span>:";
            Popup.TextArea.classList.remove("rhHidden");
            createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                User.Notes = Popup.TextArea.value.trim();
                queueSave(Popup, function() {
                    saveUser(User, Popup, function() {
                        GM_setValue("LastSave", 0);
                        if (User.Notes) {
                            PUNIcon.classList.remove("fa-sticky-note-o");
                            PUNIcon.classList.add("fa-sticky-note");
                        } else {
                            PUNIcon.classList.remove("fa-sticky-note");
                            PUNIcon.classList.add("fa-sticky-note-o");
                        }
                        Callback();
                        Popup.Close.click();
                    });
                });
            });
            Popup.popUp(function() {
                Popup.TextArea.focus();
                SavedUser = getUser(User);
                if (SavedUser && SavedUser.Notes) {
                    Popup.TextArea.value = SavedUser.Notes;
                }
            });
        });
    }
}

function loadUserTags() {
    for (var key in esgst.currentUsers) {
        for (var i = 0, n = esgst.currentUsers[key].length; i < n; ++i) {
            addPUTButton(esgst.currentUsers[key][i], key);
        }
    }
    if (Object.keys(esgst.currentUsers).length) {
        var SavedUsers = GM_getValue("Users");
        for (var I = 0, N = SavedUsers.length; I < N; ++I) {
            var UserID = esgst.sg ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (esgst.currentUsers[UserID] && SavedUsers[I].Tags) {
                addPUTTags(UserID, SavedUsers[I].Tags);
            }
        }
    }
}

function addPUTButton(Context, UserID) {
    var Container, User;
    Container = Context.parentElement;
    if (Container.classList.contains("comment__username")) {
        Context = Container;
    }
    Context.insertAdjacentHTML(
        "afterEnd",
        "<a class=\"PUTButton\">" +
        "    <i class=\"fa fa-tag\"></i>" +
        "    <span class=\"PUTTags\"></span>" +
        "</a>"
    );
    User = {};
    User[esgst.sg ? "Username" : "SteamID64"] = UserID;
    Context.nextElementSibling.addEventListener("click", function() {
        var Popup;
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-tag");
        Popup.Title.innerHTML = "Edit user tags for <span>" + UserID + "</span>:";
        Popup.TextInput.classList.remove("rhHidden");
        Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Use commas to separate tags, for example: Tag1, Tag2, ..."));
        createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
            User.Tags = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
                return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
            });
            queueSave(Popup, function() {
                saveUser(User, Popup, function() {
                    GM_setValue("LastSave", 0);
                    addPUTTags(UserID, getUser(User).Tags);
                    Callback();
                    Popup.Close.click();
                });
            });
        });
        Popup.popUp(function() {
            var SavedUser;
            Popup.TextInput.focus();
            SavedUser = getUser(User);
            if (SavedUser && SavedUser.Tags) {
                Popup.TextInput.value = SavedUser.Tags;
            }
        });
    });
}

function addPUTTags(UserID, Tags) {
    var Matches, Prefix, Suffix, HTML, I, N, Context, Container;
    Matches = esgst.users[UserID];
    Prefix = "<span class=\"global__image-outer-wrap author_avatar is_icon\">";
    Suffix = "</span>";
    HTML = Tags ? Tags.replace(/^|,\s|$/g, function(Match, Offset, String) {
        return ((Offset === 0) ? Prefix : ((Offset == (String.length - Match.length)) ? Suffix : (Suffix + Prefix)));
    }) : "";
    for (I = 0, N = Matches.length; I < N; ++I) {
        Context = Matches[I];
        Container = Context.parentElement;
        if (Container) {
            if (Container.classList.contains("comment__username")) {
                Context = Container;
            }
            Context.parentElement.getElementsByClassName("PUTTags")[0].innerHTML = HTML;
        }
    }
}

function loadRealWonSentCVLinks(context, user) {
    var wonRow, sentRow;
    if (context.context) {
        wonRow = context.wonRow;
        sentRow = context.sentRow;
    } else {
        wonRow = esgst.wonRow;
        sentRow = esgst.sentRow;
        user = esgst.user;
    }
    if (wonRow && sentRow) {
        addRWSCVLLink(wonRow, `Won`, user);
        addRWSCVLLink(sentRow, `Sent`, user);
    }
}

function addRWSCVLLink(Context, Key, User) {
    var URL, RWSCVL;
    URL = "http://www.sgtools.info/" + Key.toLowerCase() + "/" + User.Username;
    Context.innerHTML = "<a class=\"RWSCVLLink\" href=\"" + URL + (esgst.rwscvl_ro ? "/newestfirst" : "") +
        "\" target=\"_blank\">Gifts " + Key + "</a>";
    if (esgst.rwscvl_al) {
        Context = (Key == "Won") ? Context.nextElementSibling : Context.nextElementSibling.firstElementChild;
        Context.insertAdjacentHTML(
            "beforeEnd",
            " <span>" +
            "    <i class=\"fa fa-circle-o-notch fa-spin\"></i>" +
            "</span>"
        );
        RWSCVL = {
            Progress: Context.lastElementChild
        };
        queueSave(RWSCVL, function() {
            saveUser(User, RWSCVL, function() {
                GM_setValue("LastSave", 0);
                User.RWSCVL = getUser(User).RWSCVL;
                if (!User.RWSCVL) {
                    User.RWSCVL = {
                        WonCV: 0,
                        SentCV: 0,
                        LastWonCheck: 0,
                        LastSentCheck: 0
                    };
                }
                if ((new Date().getTime()) - User.RWSCVL["Last" + Key + "Check"] > 604800000) {
                    queueRequest(RWSCVL, null, URL, function(Response) {
                        var Value;
                        RWSCVL.Progress.remove();
                        Value = parseHTML(Response.responseText).getElementById("data").textContent.replace(/\s\$/, "");
                        User.RWSCVL[Key + "CV"] = Value;
                        User.RWSCVL["Last" + Key + "Check"] = new Date().getTime();
                        queueSave(RWSCVL, function() {
                            saveUser(User, RWSCVL, function() {
                                GM_setValue("LastSave", 0);
                                Context.insertAdjacentText("beforeEnd", " ($" + Value + " Real CV)");
                            });
                        });
                    });
                } else {
                    RWSCVL.Progress.remove();
                    Context.insertAdjacentText("beforeEnd", " ($" + User.RWSCVL[Key + "CV"] + " Real CV)");
                }
            });
        });
    }
}

function loadUserGiveawaysData(context, user) {
    var wonRow, sentRow;
    if (context.context) {
        wonRow = context.wonRow;
        sentRow = context.sentRow;
    } else {
        wonRow = esgst.wonRow;
        sentRow = esgst.sentRow;
        user = esgst.user;
    }
    if (wonRow && sentRow) {
        addUGDButton(wonRow, `Won`, user);
        addUGDButton(sentRow, `Sent`, user);
    }
}

function addUGDButton(Context, Key, User) {
    var UGD, UGDButton, Popup;
    UGD = {
        Key: Key
    };
    Context.insertAdjacentHTML(
        "beforeEnd",
        " <span class=\"UGDButton\" title=\"Get " + UGD.Key.toLowerCase() + " giveaways data.\">" +
        "    <i class=\"fa fa-bar-chart\"></i>" +
        "</span>"
    );
    UGDButton = Context.lastElementChild;
    Popup = createPopup();
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add("fa-bar-chart");
    Popup.Title.textContent = "Get " + User.Username + "'s " + UGD.Key.toLowerCase() + " giveaways data:";
    createOptions(Popup.Options, UGD, [{
        Check: function() {
            return true;
        },
        Description: "Clear cache.",
        Title: "If enabled, the cache will be cleared and all giveaways will be retrieved again (slower).",
        Name: "ClearCache",
        Key: "CC",
        ID: "UGD_CC"
    }]);
    createButton(Popup.Button, "fa-bar-chart", "Get Data", "fa-times-circle", "Cancel", function(Callback) {
        UGD.Canceled = false;
        UGDButton.classList.add("rhBusy");
        queueSave(UGD, function() {
            saveUser(User, UGD, function() {
                var Match, CurrentPage;
                GM_setValue("LastSave", 0);
                User.UGD = getUser(User).UGD;
                if (UGD.CC.checked) {
                    delete User.UGD;
                }
                if (!User.UGD) {
                    User.UGD = {
                        Sent: {},
                        Won: {},
                        SentTimestamp: 0,
                        WonTimestamp: 0
                    };
                } else if (!User.UGD.SentTimestamp) {
                    User.UGD.Sent = {};
                    User.UGD.SentTimestamp = 0;
                } else if (!User.UGD.WonTimestamp) {
                    User.UGD.Won = {};
                    User.UGD.WonTimestamp = 0;
                }
                Match = window.location.pathname.match(new RegExp("^\/user\/" + User.Username + ((UGD.Key == "Won") ? "/giveaways/won" : "")));
                CurrentPage = window.location.href.match(/page=(\d+)/);
                CurrentPage = Match ? (CurrentPage ? parseInt(CurrentPage[1]) : 1) : 0;
                getUGDGiveaways(UGD, User, 1, CurrentPage, Match, "/user/" + User.Username + ((UGD.Key == "Won") ? "/giveaways/won" : "") + "/search?page=", function() {
                    queueSave(UGD, function() {
                        saveUser(User, UGD, function() {
                            var Giveaways, Types, TypesTotal, LevelsTotal, Total, Frequencies, Key, I, N, Giveaway, Private, Group, Whitelist, Region, Level, Copies, Value, HTML, Type,
                                Ordered;
                            GM_setValue("LastSave", 0);
                            UGDButton.classList.remove("rhBusy");
                            Giveaways = User.UGD[UGD.Key];
                            Types = {
                                Public: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Private: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Group: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Whitelist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Group_Whitelist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region_Private: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region_Group: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region_Whitelist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region_Group_Whitelist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            };
                            TypesTotal = {
                                Public: 0,
                                Private: 0,
                                Group: 0,
                                Whitelist: 0,
                                Group_Whitelist: 0,
                                Region: 0,
                                Region_Private: 0,
                                Region_Group: 0,
                                Region_Whitelist: 0,
                                Region_Group_Whitelist: 0
                            };
                            LevelsTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            Total = 0;
                            Frequencies = {};
                            for (Key in Giveaways) {
                                for (I = 0, N = Giveaways[Key].length; I < N; ++I) {
                                    Giveaway = Giveaways[Key][I];
                                    if (Giveaway.Entries > 0) {
                                        Private = Giveaway.Private;
                                        Group = Giveaway.Group;
                                        Whitelist = Giveaway.Whitelist;
                                        Region = Giveaway.Region;
                                        Level = Giveaway.Level;
                                        Copies = (UGD.Key == "Sent") ? Giveaway.Copies : 1;
                                        if (Private) {
                                            if (Region) {
                                                Types.Region_Private[Level] += Copies;
                                                TypesTotal.Region_Private += Copies;
                                            } else {
                                                Types.Private[Level] += Copies;
                                                TypesTotal.Private += Copies;
                                            }
                                        } else if (Group) {
                                            if (Region) {
                                                Types.Region_Group[Level] += Copies;
                                                TypesTotal.Region_Group += Copies;
                                            } else if (Whitelist) {
                                                if (Region) {
                                                    Types.Region_Group_Whitelist[Level] += Copies;
                                                    TypesTotal.Region_Group_Whitelist += Copies;
                                                } else {
                                                    Types.Group_Whitelist[Level] += Copies;
                                                    TypesTotal.Group_Whitelist += Copies;
                                                }
                                            } else {
                                                Types.Group[Level] += Copies;
                                                TypesTotal.Group += Copies;
                                            }
                                        } else if (Whitelist) {
                                            if (Region) {
                                                Types.Region_Whitelist[Level] += Copies;
                                                TypesTotal.Region_Whitelist += Copies;
                                            } else {
                                                Types.Whitelist[Level] += Copies;
                                                TypesTotal.Whitelist += Copies;
                                            }
                                        } else if (Region) {
                                            Types.Region[Level] += Copies;
                                            TypesTotal.Region += Copies;
                                        } else {
                                            Types.Public[Level] += Copies;
                                            TypesTotal.Public += Copies;
                                        }
                                        LevelsTotal[Level] += Copies;
                                        Total += Copies;
                                        if (UGD.Key == "Sent") {
                                            if (!Frequencies[Giveaway.ID]) {
                                                Frequencies[Giveaway.ID] = {
                                                    Name: Giveaway.Name,
                                                    Frequency: 0
                                                };
                                            }
                                            Frequencies[Giveaway.ID].Frequency += Copies;
                                        } else {
                                            if (!Frequencies[Giveaway.Creator]) {
                                                Frequencies[Giveaway.Creator] = {
                                                    Name: Giveaway.Creator,
                                                    Frequency: 0
                                                };
                                            }
                                            ++Frequencies[Giveaway.Creator].Frequency;
                                        }
                                    }
                                }
                            }
                            HTML =
                                "<table class=\"UGDData\">" +
                                "    <tr>" +
                                "        <th>Type</th>" +
                                "        <th>Level 0</th>" +
                                "        <th>Level 1</th>" +
                                "        <th>Level 2</th>" +
                                "        <th>Level 3</th>" +
                                "        <th>Level 4</th>" +
                                "        <th>Level 5</th>" +
                                "        <th>Level 6</th>" +
                                "        <th>Level 7</th>" +
                                "        <th>Level 8</th>" +
                                "        <th>Level 9</th>" +
                                "        <th>Level 10</th>" +
                                "        <th>Total</th>" +
                                "    </tr>";
                            for (Type in Types) {
                                HTML +=
                                    "<tr>" +
                                    "    <td>" + Type.replace(/_/g, " + ") + "</td>";
                                for (I = 0; I <= 10; ++I) {
                                    Value = Types[Type][I];
                                    HTML +=
                                        "<td" + (Value ? "" : " class=\"is-faded\"") + ">" + Value + "</td>";
                                }
                                Value = Math.round(TypesTotal[Type] / Total * 10000) / 100;
                                HTML +=
                                    "    <td" + (Value ? "" : " class=\"is-faded\"") + ">" + TypesTotal[Type] + " (" + Value + "%)</td>" +
                                    "</tr>";
                            }
                            HTML +=
                                "    <tr>" +
                                "        <td>Total</td>";
                            for (I = 0; I <= 10; ++I) {
                                Value = Math.round(LevelsTotal[I] / Total * 10000) / 100;
                                HTML +=
                                    "    <td" + (Value ? "" : " class=\"is-faded\"") + ">" + LevelsTotal[I] + " (" + Value +  "%)</td>";
                            }
                            HTML +=
                                "        <td" + (Total ? "" : " class=\"is-faded\"") + ">" + Total + "</td>" +
                                "    </tr>" +
                                "</table>";
                            Ordered = [];
                            for (Key in Frequencies) {
                                for (I = 0, N = Ordered.length; (I < N) && (Frequencies[Key].Frequency <= Ordered[I].Frequency); ++I);
                                Ordered.splice(I, 0, Frequencies[Key]);
                            }
                            HTML +=
                                "<div class=\"rhBold\">" + ((UGD.Key == "Sent") ? "Most given away:" : "Most won from:") + "</div>" +
                                "<ul>";
                            for (Key in Ordered) {
                                HTML +=
                                    "<li>" + Ordered[Key].Name + " - <span class=\"rhBold\">" + Ordered[Key].Frequency + "</span></li>";
                            }
                            HTML +=
                                "</ul>";
                            Popup.Results.innerHTML = HTML;
                            UGD.Popup.reposition();
                            Callback();
                        });
                    });
                });
            });
        });
    }, function() {
        clearInterval(UGD.Request);
        clearInterval(UGD.Save);
        UGD.Canceled = true;
        setTimeout(function() {
            UGD.Progress.innerHTML = UGD.OverallProgress = "";
        }, 500);
        UGDButton.classList.remove("rhBusy");
    });
    UGD.Progress = Popup.Progress;
    UGD.OverallProgress = Popup.OverallProgress;
    UGDButton.addEventListener("click", function() {
        UGD.Popup = Popup.popUp();
    });
}

function getUGDGiveaways(UGD, User, NextPage, CurrentPage, CurrentContext, URL, Callback, Context) {
    var Giveaways, I, NumGiveaways, Giveaway, Timestamp, Received, Data, Heading, SteamButton, Match, Matches, Links, J, NumLinks, Text, Found, Pagination;
    if (Context) {
        Giveaways = Context.getElementsByClassName("giveaway__summary");
        for (I = 0, NumGiveaways = Giveaways.length; I < NumGiveaways; ++I) {
            Giveaway = Giveaways[I];
            Timestamp = parseInt(Giveaway.getElementsByClassName("giveaway__columns")[0].querySelector("[data-timestamp]").getAttribute("data-timestamp")) * 1000;
            if (Timestamp < (new Date().getTime())) {
                if (!UGD.Timestamp) {
                    UGD.Timestamp = Timestamp;
                }
                if (Timestamp > User.UGD[UGD.Key + "Timestamp"]) {
                    Data = {};
                    Heading = Giveaway.getElementsByClassName("giveaway__heading")[0];
                    SteamButton = Heading.querySelector("[href*='store.steampowered.com']");
                    if (SteamButton) {
                        Match = Heading.getElementsByClassName("giveaway__heading__name")[0];
                        Data.Code = Match.getAttribute("href");
                        Data.Code = Data.Code ? Data.Code.match(/\/giveaway\/(.+?)\//)[1] : "";
                        Data.Name = Match.textContent;
                        Matches = Heading.getElementsByClassName("giveaway__heading__thin");
                        if (Matches.length > 1) {
                            Data.Copies = parseInt(Matches[0].textContent.replace(/,/, "").match(/\d+/)[0]);
                            Data.Points = parseInt(Matches[1].textContent.replace(/,/, "").match(/\d+/)[0]);
                        } else {
                            Data.Copies = 1;
                            Data.Points = parseInt(Matches[0].textContent.replace(/,/, "").match(/\d+/)[0]);
                        }
                        Data.ID = parseInt(SteamButton.getAttribute("href").match(/\d+/)[0]);
                        if (UGD.Key == "Won") {
                            Data.Creator = Giveaway.getElementsByClassName("giveaway__username")[0].textContent;
                        }
                        Data.Level = Giveaway.getElementsByClassName("giveaway__column--contributor-level")[0];
                        Data.Level = Data.Level ? parseInt(Data.Level.textContent.match(/\d+/)[0]) : 0;
                        Data.Private = Giveaway.getElementsByClassName("giveaway__column--invite-only")[0];
                        Data.Private = Data.Private ? true : false;
                        Data.Group = Giveaway.getElementsByClassName("giveaway__column--group")[0];
                        Data.Group = Data.Group ? true : false;
                        Data.Whitelist = Giveaway.getElementsByClassName("giveaway__column--whitelist")[0];
                        Data.Whitelist = Data.Whitelist ? true : false;
                        Data.Region = Giveaway.getElementsByClassName("giveaway__column--region-restricted")[0];
                        Data.Region = Data.Region ? true : false;
                        Links = Giveaway.getElementsByClassName("giveaway__links")[0].children;
                        for (J = 0, NumLinks = Links.length; J < NumLinks; ++J) {
                            Text = Links[J].textContent;
                            if (Text.match(/(entry|entries)/)) {
                                Data.Entries = parseInt(Text.replace(/,/g, "").match(/\d+/)[0]);
                            } else if (Text.match(/comment/)) {
                                Data.Comments = parseInt(Text.replace(/,/g, "").match(/\d+/)[0]);
                            }
                        }
                        if (!User.UGD[UGD.Key][Data.ID]) {
                            User.UGD[UGD.Key][Data.ID] = [];
                        }
                        User.UGD[UGD.Key][Data.ID].push(Data);
                    }
                } else {
                    Found = true;
                    break;
                }
            }
        }
        Pagination = Context.getElementsByClassName("pagination__navigation")[0];
        if (!Found && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
            getUGDGiveaways(UGD, User, NextPage, CurrentPage, CurrentContext, URL, Callback);
        } else {
            User.UGD[UGD.Key + "Timestamp"] = UGD.Timestamp;
            Callback();
        }
    } else if (!UGD.Canceled) {
        UGD.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving giveaways (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            if (CurrentContext && document.getElementById("esgst-es-page-" + NextPage)) {
                getUGDGiveaways(UGD, User, ++NextPage, CurrentPage, CurrentContext, URL, Callback);
            } else {
                queueRequest(UGD, null, URL + NextPage, function(Response) {
                    getUGDGiveaways(UGD, User, ++NextPage, CurrentPage, CurrentContext, URL, Callback, parseHTML(Response.responseText));
                });
            }
        } else {
            getUGDGiveaways(UGD, User, ++NextPage, CurrentPage, CurrentContext, URL, Callback, document);
        }
    }
}

function loadNotActivatedMultipleWinsChecker() {
    if (esgst.user) {
        addNAMWCProfileButton(esgst.wonRow, esgst.user);
    } else if (esgst.winnersPath) {
        addNAMWCButton(esgst.mainPageHeading);
    } else if (esgst.esgstHash){
        addNAMWCButton();
    }
    if (esgst.ap) {
        esgst.profileFeatures.push(addNAMWCProfileButton);
    }
    if (esgst.namwc_h) {
        highlightNamwcUsers();
        esgst.endlessFeatures.push(highlightNamwcUsers);
    }
}

function addNAMWCProfileButton(Context, User) {
    if (Context.wonRow) {
        Context = Context.wonRow;
    }
    Context.insertAdjacentHTML(
        "beforeEnd",
        " <span class=\"NAMWCButton\">" +
        "    <i class=\"fa fa-question-circle\" title=\"Check for not activated / multiple wins.\"></i>" +
        "</span>"
    );
    setNAMWCPopup(Context, User);
}

function addNAMWCButton(Context) {
    if (Context) {
        Context.insertAdjacentHTML(
            "afterBegin",
            "<a class=\"NAMWCButton\" title=\"Check for not activated / multiple wins.\">" +
            "    <i class=\"fa fa-trophy\"></i>" +
            "    <i class=\"fa fa-question-circle\"></i>" +
            "</a>"
        );
    }
    setNAMWCPopup(Context);
}

function setNAMWCPopup(Context, User) {
    var Popup, NAMWC, NAMWCButton;
    Popup = createPopup();
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add(Context ? "fa-question" : "fa-cog");
    NAMWC = {
        User: (User ? User : null)
    };
    Popup.Title.textContent = (Context ? "Check for " + (NAMWC.User ? (NAMWC.User.Username + "'s ") : "") + "not activated / multiple wins" :
                               "Manage Not Activated / Multiple Wins Checker caches") + ":";
    NAMWCButton = (Context ? Context : document).getElementsByClassName("NAMWCButton")[0];
    if (Context) {
        createOptions(Popup.Options, NAMWC, [{
            Check: function() {
                return true;
            },
            Description: "Only check for not activated wins.",
            Title: "If enabled, multiple wins will not be checked (faster).",
            Name: "NotActivatedCheck",
            Key: "NAC",
            ID: "NAMWC_NAC",
            Dependency: "MultipleCheck"
        }, {
            Check: function() {
                return true;
            },
            Description: "Only check for multiple wins.",
            Title: "If enabled, not activated wins will not be checked (faster).",
            Name: "MultipleCheck",
            Key: "MC",
            ID: "NAMWC_MC",
            Dependency: "NotActivatedCheck"
        }]);
        Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If an user is highlighted, that means they have been either checked for the first time or updated."));
        createButton(Popup.Button, "fa-question-circle", "Check", "fa-times-circle", "Cancel", function(Callback) {
            NAMWC.ShowResults = false;
            NAMWCButton.classList.add("rhBusy");
            setNAMWCCheck(NAMWC, function() {
                NAMWCButton.classList.remove("rhBusy");
                Callback();
            });
        }, function() {
            clearInterval(NAMWC.Request);
            clearInterval(NAMWC.Save);
            NAMWC.Canceled = true;
            setTimeout(function() {
                NAMWC.Progress.innerHTML = "";
            }, 500);
            NAMWCButton.classList.remove("rhBusy");
        });
    }
    NAMWC.Progress = Popup.Progress;
    NAMWC.OverallProgress = Popup.OverallProgress;
    createResults(Popup.Results, NAMWC, [{
        Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
        Description: "Users with 0 not activated wins",
        Key: "Activated"
    }, {
        Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
        Description: "Users with 0 multiple wins",
        Key: "NotMultiple"
    }, {
        Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
        Description: "Users with not activated wins",
        Key: "NotActivated"
    }, {
        Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
        Description: "Users with multiple wins",
        Key: "Multiple"
    }, {
        Icon: "<i class=\"fa fa-question-circle\"></i> ",
        Description: "Users who cannot be checked for not activated wins either because they have a private profile or SteamCommunity is down",
        Key: "Unknown"
    }]);
    NAMWCButton.addEventListener("click", function() {
        NAMWC.Popup = Popup.popUp(function() {
            if (!Context) {
                NAMWC.ShowResults = true;
                setNAMWCCheck(NAMWC);
            }
        });
    });
}

function setNAMWCCheck(NAMWC, Callback) {
    var SavedUsers, I, N, Username;
    NAMWC.Progress.innerHTML = NAMWC.OverallProgress.innerHTML = "";
    NAMWC.Activated.classList.add("rhHidden");
    NAMWC.NotMultiple.classList.add("rhHidden");
    NAMWC.NotActivated.classList.add("rhHidden");
    NAMWC.Multiple.classList.add("rhHidden");
    NAMWC.Unknown.classList.add("rhHidden");
    NAMWC.ActivatedCount.textContent = NAMWC.NotMultipleCount.textContent = NAMWC.NotActivatedCount.textContent = NAMWC.MultipleCount.textContent = NAMWC.UnknownCount.textContent = "0";
    NAMWC.ActivatedUsers.innerHTML = NAMWC.NotMultipleUsers.textContent = NAMWC.NotActivatedUsers.innerHTML = NAMWC.MultipleUsers.innerHTML = NAMWC.UnknownUsers.innerHTML = "";
    NAMWC.Popup.reposition();
    NAMWC.Users = [];
    NAMWC.Canceled = false;
    if (NAMWC.ShowResults) {
        SavedUsers = GM_getValue("Users");
        for (I = 0, N = SavedUsers.length; I < N; ++I) {
            if (SavedUsers[I].NAMWC && SavedUsers[I].NAMWC.Results) {
                NAMWC.Users.push(SavedUsers[I].Username);
            }
        }
        NAMWC.Users = sortArray(NAMWC.Users);
        for (I = 0, N = NAMWC.Users.length; I < N; ++I) {
            setNAMWCResult(NAMWC, SavedUsers[getUserIndex({
                Username: NAMWC.Users[I]
            }, SavedUsers)], false);
        }
    } else if (NAMWC.User) {
        NAMWC.Users.push(NAMWC.User.Username);
        checkNAMWCUsers(NAMWC, 0, 1, Callback);
    } else {
        for (Username in esgst.users) {
            if (Username != GM_getValue("Username")) {
                if (NAMWC.Users.length < 26) {
                    NAMWC.Users.push(Username);
                } else {
                    break;
                }
            }
        }
        NAMWC.Users = sortArray(NAMWC.Users);
        checkNAMWCUsers(NAMWC, 0, NAMWC.Users.length, Callback);
    }
}

function checkNAMWCUsers(NAMWC, I, N, Callback) {
    var User, Results, Key, New;
    if (!NAMWC.Canceled) {
        NAMWC.Progress.innerHTML = "";
        NAMWC.OverallProgress.textContent = I + " of " + N + " users checked...";
        if (I < N) {
            User = NAMWC.User ? NAMWC.User : {
                Username: NAMWC.Users[I]
            };
            queueSave(NAMWC, function() {
                saveUser(User, NAMWC, function() {
                    GM_setValue("LastSave", 0);
                    User.NAMWC = getUser(User).NAMWC;
                    updateNAMWCResults(User, NAMWC, function() {
                        if (User.NAMWC && User.NAMWC.Results) {
                            Results = User.NAMWC.Results;
                        }
                        checkNAMWCUser(NAMWC, User, function() {
                            if (Results) {
                                for (Key in Results) {
                                    if (Results[Key] != User.NAMWC.Results[Key]) {
                                        New = true;
                                        break;
                                    }
                                }
                            } else {
                                New = true;
                            }
                            setTimeout(setNAMWCResult, 0, NAMWC, User, New, I, N, Callback);
                        });
                    });
                });
            });
        } else if (Callback) {
            Callback();
        }
    }
}

function updateNAMWCResults(User, NAMWC, Callback) {
    var Results;
    if (User.NAMWC && User.NAMWC.Results && (typeof User.NAMWC.Results.None != "undefined")) {
        Results = User.NAMWC.Results;
        User.NAMWC.Results = {
            Activated: Results.None,
            NotMultiple: Results.None,
            NotActivated: Results.NotActivated,
            Multiple: Results.Multiple,
            Unknown: Results.PrivateDown
        };
        queueSave(NAMWC, function() {
            saveUser(User, NAMWC, function() {
                GM_setValue("LastSave", 0);
                Callback();
            });
        });
    } else {
        Callback();
    }
}

function setNAMWCResult(NAMWC, User, New, I, N, Callback) {
    var Key;
    if (!NAMWC.Canceled) {
        for (Key in User.NAMWC.Results) {
            if (User.NAMWC.Results[Key]) {
                NAMWC[Key].classList.remove("rhHidden");
                NAMWC[Key + "Count"].textContent = parseInt(NAMWC[Key + "Count"].textContent) + 1;
                NAMWC[Key + "Users"].insertAdjacentHTML(
                    "beforeEnd",
                    "<a " + (New ? "class=\"rhBold rhItalic\" " : "") + "href=\"http://www.sgtools.info/" + (Key.match(/Multiple/) ? "multiple" : "nonactivated") + "/" + User.Username +
                    "\" target=\"_blank\">" + User.Username + (Key.match(/^(NotActivated|Multiple)$/) ? (" (" + User.NAMWC.Results[Key] + ")") : "") + "</a>"
                );
            }
        }
        if (!NAMWC.ShowResults) {
            NAMWC.Popup.reposition();
            queueSave(NAMWC, function() {
                saveUser(User, NAMWC, function() {
                    GM_setValue("LastSave", 0);
                    setTimeout(checkNAMWCUsers, 0, NAMWC, ++I, N, Callback);
                });
            });
        }
    }
}

function checkNAMWCUser(NAMWC, User, Callback) {
    if (!NAMWC.Canceled) {
        if (!User.NAMWC) {
            User.NAMWC = {
                LastSearch: 0,
                Results: {}
            };
        }
        if (((new Date().getTime()) - User.NAMWC.LastSearch) > 604800000) {
            if (NAMWC.NAC.checked) {
                checkNAMWCNotActivated(NAMWC, User, Callback);
            } else if (NAMWC.MC.checked) {
                checkNAMWCMultiple(NAMWC, User, Callback);
            } else {
                checkNAMWCNotActivated(NAMWC, User, function() {
                    checkNAMWCMultiple(NAMWC, User, Callback);
                });
            }
        } else {
            Callback();
        }
    }
}

function checkNAMWCNotActivated(NAMWC, User, Callback) {
    var N, ResponseText;
    if (!NAMWC.Canceled) {
        NAMWC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving " + User.Username + "'s not activated wins...</span>";
        queueRequest(NAMWC, null, "http://www.sgtools.info/nonactivated/" + User.Username, function(Response) {
            ResponseText = Response.responseText;
            if (ResponseText.match(/has a private profile/)) {
                User.NAMWC.Results.Activated = false;
                User.NAMWC.Results.NotActivated = 0;
                User.NAMWC.Results.Unknown = true;
            } else {
                N = parseHTML(ResponseText).getElementsByClassName("notActivatedGame").length;
                User.NAMWC.Results.Activated = (N === 0) ? true : false;
                User.NAMWC.Results.NotActivated = N;
                User.NAMWC.Results.Unknown = false;
            }
            User.NAMWC.LastSearch = new Date().getTime();
            Callback();
        });
    }
}

function checkNAMWCMultiple(NAMWC, User, Callback) {
    var N;
    if (!NAMWC.Canceled) {
        NAMWC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving " + User.Username + "'s multiple wins...</span>";
        queueRequest(NAMWC, null, "http://www.sgtools.info/multiple/" + User.Username, function(Response) {
            N = parseHTML(Response.responseText).getElementsByClassName("multiplewins").length;
            User.NAMWC.Results.NotMultiple = (N === 0) ? true : false;
            User.NAMWC.Results.Multiple = N;
            User.NAMWC.LastSearch = new Date().getTime();
            Callback();
        });
    }
}

function highlightNamwcUsers() {
    if (Object.keys(esgst.currentUsers).length) {
        var SavedUsers = GM_getValue("Users");
        for (var I = 0, N = SavedUsers.length; I < N; ++I) {
            var UserID = esgst.sg ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (esgst.currentUsers[UserID]) {
                highlightNAMWCUser(SavedUsers[I], esgst.currentUsers[UserID]);
            }
        }
    }
}

function highlightNAMWCUser(User, Matches) {
    var Name, Title, I, N;
    if (User.NAMWC && User.NAMWC.Results) {
        if (User.NAMWC.Results.None || (User.NAMWC.Results.Activated && User.NAMWC.Results.NotMultiple)) {
            Name = "NAMWCPositive";
        } else if (User.NAMWC.Results.Unknown) {
            Name = "NAMWCUnknown";
        } else {
            Name = "NAMWCNegative";
        }
        Title = User.Username + " has " + (User.NAMWC.Results.Unknown ? "?" : User.NAMWC.Results.NotActivated) + " not activated wins and " + User.NAMWC.Results.Multiple + " multiple wins.";
        for (I = 0, N = Matches.length; I < N; ++I) {
            Matches[I].classList.add(Name);
            Matches[I].title = Title;
        }
    }
}

function loadNotReceivedFinder(Context, User) {
    if (Context.context) {
        Context = Context.sentRow;
        addNRFButton(Context, User);
    } else {
        Context = esgst.sentRow;
        User = esgst.user;
        if (Context) {
            addNRFButton(Context, User);
        }
    }
}

function addNRFButton(Context, User) {
    var NRF;
    NRF = {
        N: parseInt(Context.nextElementSibling.firstElementChild.getAttribute("title").match(/, (.+) Not Received/)[1])
    };
    if (NRF.N > 0) {
        NRF.I = 0;
        NRF.Multiple = [];
        Context.insertAdjacentHTML(
            "beforeEnd",
            " <span class=\"NRFButton\">" +
            "    <i class=\"fa fa-times-circle\" title=\"Find not received giveaways.\"></i>" +
            "</span>"
        );
        setNRFPopup(NRF, Context.lastElementChild, User);
    }
}
function setNRFPopup(NRF, NRFButton, User) {
    var Popup;
    Popup = createPopup();
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add("fa-times");
    Popup.Title.textContent = "Find " + User.Username + "'s not received giveaways:";
    createOptions(Popup.Options, NRF, [{
        Check: function() {
            return true;
        },
        Description: "Also search inside giveaways with multiple copies.",
        Title: "If disabled, only giveaways with visible not received copies will be found (faster).",
        Name: "FullSearch",
        Key: "FS",
        ID: "NRF_FS"
    }]);
    Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If you're blacklisted / not whitelisted / not a member of the same Steam groups, not all giveaways will be found."));
    createButton(Popup.Button, "fa-search", "Find", "fa-times-circle", "Cancel", function(Callback) {
        NRFButton.classList.add("rhBusy");
        setNRFSearch(NRF, User, function() {
            NRF.Progress.innerHTML = "";
            NRFButton.classList.remove("rhBusy");
            Callback();
        });
    }, function() {
        clearInterval(NRF.Request);
        clearInterval(NRF.Save);
        NRF.Canceled = true;
        setTimeout(function() {
            NRF.Progress.innerHTML = "";
        }, 500);
        NRFButton.classList.remove("rhBusy");
    });
    NRF.Progress = Popup.Progress;
    NRF.OverallProgress = Popup.OverallProgress;
    NRF.Results = Popup.Results;
    NRFButton.addEventListener("click", function() {
        NRF.Popup = Popup.popUp();
    });
}

function setNRFSearch(NRF, User, Callback) {
    NRF.Progress.innerHTML = NRF.OverallProgress.innerHTML = NRF.Results.innerHTML = "";
    NRF.Popup.reposition();
    NRF.Canceled = false;
    queueSave(NRF, function() {
        saveUser(User, NRF, function() {
            var Match;
            GM_setValue("LastSave", 0);
            User.NRF = getUser(User).NRF;
            if (!User.NRF) {
                User.NRF = {
                    LastSearch: 0,
                    OverallProgress: "",
                    Results: ""
                };
            }
            if (((new Date().getTime()) - User.NRF.LastSearch) > 604800000) {
                Match = window.location.href.match(new RegExp("\/user\/" + User.Username + "(\/search\?page=(\d+))?"));
                searchNRFUser(NRF, User, 1, Match ? (Match[2] ? parseInt(Match[2]) : 1) : 0, "/user/" + User.Username + "/search?page=", function() {
                    User.NRF.LastSearch = new Date().getTime();
                    User.NRF.OverallProgress = NRF.OverallProgress.innerHTML;
                    User.NRF.Results = NRF.Results.innerHTML;
                    loadEndlessFeatures(NRF.Results);
                    queueSave(NRF, function() {
                        saveUser(User, NRF, function() {
                            GM_setValue("LastSave", 0);
                            Callback();
                        });
                    });
                });
            } else {
                NRF.OverallProgress.innerHTML = User.NRF.OverallProgress;
                NRF.Results.innerHTML = User.NRF.Results;
                NRF.Popup.reposition();
                loadEndlessFeatures(NRF.Results);
                Callback();
            }
        });
    });
}

function searchNRFUser(NRF, User, NextPage, CurrentPage, URL, Callback, Context) {
    var Matches, I, N, Match, Pagination;
    if (Context) {
        Matches = Context.querySelectorAll("div.giveaway__column--negative");
        for (I = 0, N = Matches.length; I < N; ++I) {
            NRF.I += Matches[I].querySelectorAll("a[href*='/user/']").length;
            NRF.Results.appendChild(Matches[I].closest(".giveaway__summary").cloneNode(true));
            NRF.Popup.reposition();
        }
        NRF.OverallProgress.innerHTML = NRF.I + " of " + NRF.N + " not received giveaways found...";
        if (NRF.I < NRF.N) {
            if (NRF.FS.checked) {
                Matches = Context.getElementsByClassName("giveaway__heading__thin");
                for (I = 0, N = Matches.length; I < N; ++I) {
                    Match = Matches[I].textContent.match(/\((.+) Copies\)/);
                    if (Match && (parseInt(Match[1]) > 3)) {
                        NRF.Multiple.push(Matches[I].closest(".giveaway__summary").cloneNode(true));
                    }
                }
            }
            Pagination = Context.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                searchNRFUser(NRF, User, NextPage, CurrentPage, URL, Callback);
            } else if (NRF.FS.checked && NRF.Multiple.length) {
                searchNRFMultiple(NRF, 0, NRF.Multiple.length, Callback);
            } else {
                Callback();
            }
        } else {
            Callback();
        }
    } else if (!NRF.Canceled) {
        NRF.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Searching " + User.Username + "'s giveaways (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            queueRequest(NRF, null, URL + NextPage, function(Response) {
                searchNRFUser(NRF, User, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
            });
        } else {
            searchNRFUser(NRF, User, ++NextPage, CurrentPage, URL, Callback, document);
        }
    }
}

function searchNRFMultiple(NRF, I, N, Callback) {
    if (!NRF.Canceled) {
        NRF.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Searching inside giveaways with multiple copies (" + I + " of " + N + ")...</span>";
        if (I < N) {
            searchNRFGiveaway(NRF, NRF.Multiple[I].getElementsByClassName("giveaway__heading__name")[0].getAttribute("href") + "/winners/search?page=", 1, function(Found) {
                if (Found) {
                    NRF.Results.appendChild(NRF.Multiple[I].cloneNode(true));
                }
                if (NRF.I < NRF.N) {
                    searchNRFMultiple(NRF, ++I, N, Callback);
                } else {
                    Callback();
                }
            });
        } else {
            Callback();
        }
    }
}

function searchNRFGiveaway(NRF, URL, NextPage, Callback) {
    if (!NRF.Canceled) {
        queueRequest(NRF, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches, I, N, Found, Pagination;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__column--width-small");
            for (I = 0, N = Matches.length; I < N; ++I) {
                if (Matches[I].textContent.match(/Not Received/)) {
                    Found = true;
                    ++NRF.I;
                    NRF.OverallProgress.innerHTML = NRF.I + " of " + NRF.N + " not received giveaways found...";
                    if (NRF.I >= NRF.N) {
                        break;
                    }
                }
            }
            Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
            if ((NRF.I < NRF.N) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                searchNRFGiveaway(NRF, URL, ++NextPage, Callback);
            } else {
                Callback(Found);
            }
        });
    }
}

function loadSentWonRatio(context, user) {
    var wonRow, sentRow;
    if (context.context) {
        wonRow = context.wonRow;
        sentRow = context.sentRow;
    } else {
        wonRow = esgst.wonRow;
        sentRow = esgst.sentRow;
        user = esgst.user;
    }
    if (wonRow && sentRow) {
        addSWRRatio(wonRow, sentRow, user);
    }

}

function addSWRRatio(Won, Sent, User) {
    var WonCount, SentCount, Ratio;
    WonCount = parseInt(Won.nextElementSibling.firstElementChild.textContent.replace(/,/, ""));
    SentCount = parseInt(Sent.nextElementSibling.firstElementChild.firstElementChild.textContent.replace(/,/, ""));
    Ratio = (WonCount > 0) ? (Math.round(SentCount / WonCount * 100) / 100) : 0;
    Sent.parentElement.insertAdjacentHTML(
        "afterEnd",
        "<div class=\"featured__table__row SWRRatio\">" +
        "    <div class=\"featured__table__row__left\">Ratio</div>" +
        "    <div class=\"featured__table__row__right\" title=\"" + User.Username + " has sent " + Ratio + " gifts for every gift won.\">" + Ratio + "</div>" +
        "</div>"
    );
}

function loadLevelUpCalculator(context) {
    if (context.context) {
        calculateLUCValue(context.contributorLevelRow);
    } else {
        context = esgst.contributorLevelRow;
        if (context) {
            calculateLUCValue(context);
        }
    }
}

function calculateLUCValue(Context) {
    var Level, Base, Values, Lower, Upper, Value;
    Context = Context.nextElementSibling;
    Level = parseFloat(Context.firstElementChild.getAttribute("title"));
    Base = parseInt(Level);
    if (Base < 10) {
        Values = [0, 0.01, 25.01, 50.01, 100.01, 250.01, 500.01, 1000.01, 2000.01, 3000.01, 5000.01];
        Lower = Values[Base];
        Upper = Values[Base + 1];
        Value = Math.round((Upper - (Lower + ((Upper - Lower) * (Level - Base)))) * 100) / 100;
        Context.insertAdjacentHTML("beforeEnd", " <span>(~ $" + Value + " real CV to level " + (Base + 1) + ".)");
    }

}

function loadSteamGiftsProfileButton() {
    var Context;
    var User = esgst.user;
    var SteamButton = esgst.steamButton;
    Context = document.getElementsByClassName("profile_links")[0];
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"profile_reputation\">" +
        "    <a class=\"btn_action white SGPBButton\" href=\"https://www.steamgifts.com/go/user/" + User.SteamID64 + "\" rel=\"nofollow\" target=\"_blank\">" +
        "        <i class=\"fa\">" +
        "            <img src=\"https://cdn.steamgifts.com/img/favicon.ico\"/>" +
        "        </i>" +
        "        <span>Visit SteamGifts Profile</span>" +
        "    </a>" +
        "</div>"
    );
    Context = Context.lastElementChild;
    Context.insertBefore(SteamButton, Context.firstElementChild);
}

function loadSteamTradesProfileButton(Context, User) {
    var STPBButton;
    if (Context.context || esgst.userPath) {        
        if (Context.context) {
            Context = Context.context;
        } else {
            User = esgst.user;
        }
        Context = Context.getElementsByClassName("sidebar__shortcut-inner-wrap")[0];
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<a class=\"STPBButton\" href=\"https://www.steamtrades.com/user/" + User.SteamID64 + "\" rel=\"nofollow\" target=\"_blank\">" +
            "    <i class=\"fa fa-fw\">" +
            "        <img src=\"https://cdn.steamtrades.com/img/favicon.ico\"/>" +
            "    </i>" +
            "</a>"
        );
        STPBButton = Context.lastElementChild;
        Context = Context.parentElement.getElementsByClassName("js-tooltip")[0];
        if (Context) {
            STPBButton.addEventListener("mouseenter", function() {
                Context.textContent = "Visit SteamTrades Profile";
                setSiblingsOpacity(STPBButton, "0.2");
            });
            STPBButton.addEventListener("mouseleave", function() {
                setSiblingsOpacity(STPBButton, "1");
            });
        }
    }
}

function loadSharedGroupsChecker(Context, User) {
    var SGCButton, Popup;
    if (!Context.context && esgst.userPath) {
        Context = document;
        User = esgst.user;
    }
    if (Context && User && (User.Username != GM_getValue(`Username`))) {
        if (Context.context) {
            Context = Context.context;
        }
        Context = Context.getElementsByClassName("sidebar__shortcut-inner-wrap")[0];
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<div class=\"SGCButton\">" +
            "    <i class=\"fa fa-fw fa-users\"></i>" +
            "</div>"
        );
        SGCButton = Context.lastElementChild;
        Context = document.getElementsByClassName("js-tooltip")[0];
        if (Context) {
            SGCButton.addEventListener("mouseenter", function() {
                Context.textContent = "Check Shared Groups";
                setSiblingsOpacity(SGCButton, "0.5");
            });
            SGCButton.addEventListener("mouseleave", function() {
                setSiblingsOpacity(SGCButton, "1");
            });
        }
        SGCButton.addEventListener("click", function() {
            var SGCPopup;
            if (Popup) {
                Popup.popUp();
            } else {
                Popup = createPopup();
                Popup.Icon.classList.add("fa-users");
                Popup.Title.textContent = "Shared Groups";
                Popup.OverallProgress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Checking shared groups...</span>";
                SGCPopup = Popup.popUp();
                makeRequest(null, "http://www.steamcommunity.com/profiles/" + User.SteamID64 + "/groups", Popup.Progress, function(Response) {
                    var ResponseHTML, Matches, Groups, I, NumMatches, Name, J, NumGroups, Avatar;
                    Popup.OverallProgress.innerHTML = "";
                    ResponseHTML = parseHTML(Response.responseText);
                    Matches = ResponseHTML.getElementsByClassName("linkTitle");
                    Groups = GM_getValue("Groups");
                    for (I = 0, NumMatches = Matches.length; I < NumMatches; ++I) {
                        Name = Matches[I].textContent;
                        for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Name != Name); ++J);
                        if (J < NumGroups) {
                            Avatar = Matches[I].parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.getAttribute("src");
                            Popup.Results.insertAdjacentHTML(
                                "beforeEnd",
                                "<li class=\"table__row-outer-wrap\">" +
                                "    <div class=\"table__row-inner-wrap\">" +
                                "        <div>" +
                                "            <span>" +
                                "                <a class=\"global__image-outer-wrap global__image-outer-wrap--avatar-small\" href=\"/group/" + Groups[J].Code + "/\">" +
                                "                    <div class=\"global__image-inner-wrap\" style=\"background-image:url(" + Avatar + ");\"></div>" +
                                "                </a>" +
                                "            </span>" +
                                "        </div>" +
                                "        <div class=\"table__column--width-fill\">" +
                                "            <a class=\"table__column__heading\" href=\"/group/" + Groups[J].Code + "/\">" + Groups[J].Name + "</a>" +
                                "        </div>" +
                                "    </div>" +
                                "</li>"
                            );
                        }
                    }
                    if (!Popup.Results.innerHTML) {
                        Popup.Results.innerHTML = "<div>No shared groups found.</div>";
                    }
                    loadEndlessFeatures(Popup.Results);
                    SGCPopup.reposition();
                });
            }
        });
    }
}

function loadWhitelistBlacklistChecker() {
    if (esgst.esgstHash){
        addWBCButton();
    } else {
        addWBCButton(esgst.mainPageHeading);
    }
    if (esgst.wbc_h) {
        addWbcIcons();
        esgst.endlessFeatures.push(addWbcIcons);
    }
}

function addWBCButton(Context) {
    var Popup, WBC, WBCButton;
    Popup = createPopup();
    WBC = {
        Update: (Context ? false : true),
        B: esgst.wbc_b,
        Username: GM_getValue("Username")
    };
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add(WBC.Update ? "fa-cog" : "fa-question");
    Popup.Title.textContent = (WBC.Update ? "Manage Whitelist / Blacklist Checker caches" : ("Check for whitelists" + (WBC.B ? " / blacklists" : ""))) + ":";
    if (window.location.pathname.match(new RegExp("^\/user\/(?!" + WBC.Username + ")"))) {
        WBC.User = {
            Username: document.getElementsByClassName("featured__heading__medium")[0].textContent,
            ID: document.querySelector("[name='child_user_id']").value,
            SteamID64: document.querySelector("a[href*='/profiles/']").href.match(/\d+/)[0],
        };
    }
    createOptions(Popup.Options, WBC, [{
        Check: function() {
            return WBC.User;
        },
        Description: "Only check " + (WBC.User ? WBC.User.Username : "current user") + ".",
        Title: "If disabled, all users in the current page will be checked.",
        Name: "SingleCheck",
        Key: "SC",
        ID: "WBC_SC",
        Dependency: "FullListCheck"
    }, {
        Check: function() {
            return WBC.B;
        },
        Description: "Also check whitelist.",
        Title: "If disabled, a blacklist-only check will be performed (faster).",
        Name: "FullCheck",
        Key: "FC",
        ID: "WBC_FC"
    }, {
        Check: function() {
            return ((((WBC.User && !WBC.SC.checked) || !WBC.User) && !WBC.Update && !window.location.pathname.match(/^\/($|giveaways|discussions|users|archive)/)) ? true : false);
        },
        Description: "Check all pages.",
        Title: "If disabled, only the current page will be checked.",
        Name: "FullListCheck",
        Key: "FLC",
        ID: "WBC_FLC"
    }, {
        Check: function() {
            return true;
        },
        Description: "Return whitelists.",
        Title: "If enabled, everyone who has whitelisted you will be whitelisted back.",
        Name: "ReturnWhitelists",
        Key: "RW",
        ID: "WBC_RW"
    }, {
        Check: function() {
            return WBC.B;
        },
        Description: "Return blacklists.",
        Title: "If enabled, everyone who has blacklisted you will be blacklisted back.",
        Name: "ReturnBlacklists",
        Key: "RB",
        ID: "WBC_RB"
    }, {
        Check: function() {
            return WBC.Update;
        },
        Description: "Only update whitelists / blacklists.",
        Title: "If enabled, only users who have whitelisted / blacklisted you will be updated (faster).",
        Name: "SimpleUpdate",
        Key: "SU",
        ID: "WBC_SU"
    }, {
        Check: function() {
            return true;
        },
        Description: "Clear caches.",
        Title: "If enabled, the caches of all checked users will be cleared (slower).",
        Name: "ClearCaches",
        Key: "CC",
        ID: "WBC_CC"
    }]);
    Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If an user is highlighted, that means they have been either checked for the first time or updated."));
    if (Context) {
        Context.insertAdjacentHTML(
            "afterBegin",
            "<a class=\"WBCButton\" title=\"Check for whitelists" + (WBC.B ? " / blacklists" : "") + ".\">" +
            "    <i class=\"fa fa-heart\"></i> " + (WBC.B ? (
                "<i class=\"fa fa-ban\"></i>") : "") +
            "    <i class=\"fa fa-question-circle\"></i>" +
            "</a>"
        );
    }
    WBCButton = document.getElementsByClassName("WBCButton")[0];
    createButton(Popup.Button, WBC.Update ? "fa-refresh" : "fa-question-circle", WBC.Update ? "Update" : "Check", "fa-times-circle", "Cancel", function(Callback) {
        WBC.ShowResults = false;
        WBCButton.classList.add("rhBusy");
        setWBCCheck(WBC, function() {
            WBCButton.classList.remove("rhBusy");
            Callback();
        });
    }, function() {
        clearInterval(WBC.Request);
        clearInterval(WBC.Save);
        WBC.Canceled = true;
        setTimeout(function() {
            WBC.Progress.innerHTML = "";
        }, 500);
        WBCButton.classList.remove("rhBusy");
    });
    WBC.Progress = Popup.Progress;
    WBC.OverallProgress = Popup.OverallProgress;
    createResults(Popup.Results, WBC, [{
        Icon: (
            "<span class=\"sidebar__shortcut-inner-wrap rhWBIcon\">" +
            "    <i class=\"fa fa-heart sidebar__shortcut__whitelist is-disabled is-selected\" style=\"background: none !important;\"></i> " +
            "</span>"
        ),
        Description: "You are whitelisted by",
        Key: "Whitelisted"
    }, {
        Icon: (
            "<span class=\"sidebar__shortcut-inner-wrap rhWBIcon\">" +
            "    <i class=\"fa fa-ban sidebar__shortcut__blacklist is-disabled is-selected\" style=\"background: none !important;\"></i> " +
            "</span>"
        ),
        Description: "You are blacklisted by",
        Key: "Blacklisted"
    }, {
        Icon: "<i class=\"fa fa-check-circle\"></i> ",
        Description: "You are neither whitelisted nor blacklisted by",
        Key: "None"
    }, {
        Icon: "<i class=\"fa fa-question-circle\"></i> ",
        Description: "You are not blacklisted and there is not enough information to know if you are whitelisted by",
        Key: "NotBlacklisted"
    }, {
        Icon: "<i class=\"fa fa-question-circle\"></i> ",
        Description: "There is not enough information to know if you are whitelisted or blacklisted by",
        Key: "Unknown"
    }]);
    WBCButton.addEventListener("click", function() {
        WBC.Popup = Popup.popUp(function() {
            if (WBC.Update) {
                WBC.ShowResults = true;
                setWBCCheck(WBC);
            }
        });
    });
}

function setWBCCheck(WBC, Callback) {
    var SavedUsers, I, N, Username, Match;
    WBC.Progress.innerHTML = WBC.OverallProgress.innerHTML = "";
    WBC.Whitelisted.classList.add("rhHidden");
    WBC.Blacklisted.classList.add("rhHidden");
    WBC.None.classList.add("rhHidden");
    WBC.NotBlacklisted.classList.add("rhHidden");
    WBC.Unknown.classList.add("rhHidden");
    WBC.WhitelistedCount.textContent = WBC.BlacklistedCount.textContent = WBC.NoneCount.textContent = WBC.NotBlacklistedCount.textContent = WBC.UnknownCount.textContent = "0";
    WBC.WhitelistedUsers.innerHTML = WBC.BlacklistedUsers.innerHTML = WBC.NoneUsers.innerHTML = WBC.NotBlacklistedUsers.innerHTML = WBC.UnknownUsers.innerHTML = "";
    WBC.Popup.reposition();
    WBC.Users = [];
    WBC.Canceled = false;
    if (WBC.Update) {
        SavedUsers = GM_getValue("Users");
        for (I = 0, N = SavedUsers.length; I < N; ++I) {
            if (SavedUsers[I].WBC && SavedUsers[I].WBC.Result && (WBC.ShowResults || (!WBC.ShowResults && ((WBC.SU.checked &&
                                                                                                            SavedUsers[I].WBC.Result.match(/^(Whitelisted|Blacklisted)$/)) ||
                                                                                                           !WBC.SU.checked)))) {
                WBC.Users.push(SavedUsers[I].Username);
            }
        }
        WBC.Users = sortArray(WBC.Users);
        if (WBC.ShowResults) {
            for (I = 0, N = WBC.Users.length; I < N; ++I) {
                setWBCResult(WBC, SavedUsers[getUserIndex({
                    Username: WBC.Users[I]
                }, SavedUsers)], false);
            }
        } else {
            checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
        }
    } else if (WBC.User && WBC.SC.checked) {
        WBC.Users.push(WBC.User.Username);
        checkWBCUsers(WBC, 0, 1, Callback);
    } else {
        for (Username in esgst.users) {
            if (Username != WBC.Username) {
                WBC.Users.push(Username);
            }
        }
        if (WBC.FLC.checked) {
            Match = window.location.href.match(/(.+?)(\/search\?(page=(\d+))?(.*))?$/);
            getWBCUsers(WBC, 1, Match[4] ? parseInt(Match[4]) : 1, Match[1] + (window.location.pathname.match(/^\/$/) ? "giveaways/" : "/") + "search?" + (Match[5] ? (Match[5].replace(/^&|&$/g, "") + "&") :
                                                                                                                                       "") + "page=", function() {
                WBC.Users = sortArray(WBC.Users);
                checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
            });
        } else {
            WBC.Users = sortArray(WBC.Users);
            checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
        }
    }
}

function checkWBCUsers(WBC, I, N, Callback) {
    var User, SavedUser, Result;
    if (!WBC.Canceled) {
        WBC.Progress.innerHTML = "";
        WBC.OverallProgress.textContent = I + " of " + N + " users checked...";
        if (I < N) {
            User = (WBC.User && WBC.SC.checked) ? WBC.User : {
                Username: WBC.Users[I]
            };
            queueSave(WBC, function() {
                saveUser(User, WBC, function() {
                    GM_setValue("LastSave", 0);
                    SavedUser = getUser(User);
                    User.WBC = SavedUser.WBC;
                    if (User.WBC && User.WBC.Result) {
                        Result = User.WBC.Result;
                    }
                    User.Whitelisted = SavedUser.Whitelisted;
                    User.Blacklisted = SavedUser.Blacklisted;
                    if (esgst.wbc_n) {
                        User.Notes = SavedUser.Notes;
                    }
                    checkWBCUser(WBC, User, function() {
                        setTimeout(setWBCResult, 0, WBC, User, (Result != User.WBC.Result) ? true : false, I, N, Callback);
                    });
                });
            });
        } else if (Callback) {
            Callback();
        }
    }
}

function setWBCResult(WBC, User, New, I, N, Callback) {
    var Key;
    if (!WBC.Canceled) {
        Key = ((User.WBC.Result == "Blacklisted") && !WBC.B) ? "Unknown" : User.WBC.Result;
        WBC[Key].classList.remove("rhHidden");
        WBC[Key + "Count"].textContent = parseInt(WBC[Key + "Count"].textContent) + 1;
        WBC[Key + "Users"].insertAdjacentHTML("beforeEnd", "<a " + (New ? "class=\"rhBold rhItalic\" " : "") + "href=\"/user/" + User.Username + "\">" + User.Username + "</a>");
        if (!WBC.ShowResults) {
            WBC.Popup.reposition();
            if ((WBC.RW.checked && (User.WBC.Result == "Whitelisted") && !User.Whitelisted) || (WBC.B && WBC.RB.checked && (User.WBC.Result == "Blacklisted") && !User.Blacklisted)) {
                getUserID(User, WBC, function() {
                    returnWBCWhitelistBlacklist(WBC, User, function() {
                        queueSave(WBC, function() {
                            saveUser(User, WBC, function() {
                                GM_setValue("LastSave", 0);
                                setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                            });
                        });
                    });
                });
            } else {
                queueSave(WBC, function() {
                    saveUser(User, WBC, function() {
                        GM_setValue("LastSave", 0);
                        setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                    });
                });
            }
        }
    }
}

function returnWBCWhitelistBlacklist(WBC, User, Callback) {
    var Key, Type;
    if (!WBC.Canceled) {
        Key = User.WBC.Result;
        Type = Key.match(/(.+)ed/)[1].toLowerCase();
        WBC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Returning " + Type + " for " + User.Username + "...</span>";
        if (window.location.pathname.match(new RegExp("^\/user\/" + User.Username))) {
            document.getElementsByClassName("sidebar__shortcut__" + Type)[0].click();
            User.Whitelisted = User.Blacklisted = false;
            User[Key] = true;
            if (esgst.wbc_n) {
                var msg = `${Key} in return.`;
                if (User.Notes) {
                    User.Notes = `${msg}\n\n${User.Notes}`;
                } else {
                    User.Notes = msg;
                }
            }
            Callback();
        } else {
            queueRequest(WBC, "xsrf_token=" + esgst.xsrfToken + "&do=" + Type + "&child_user_id=" + User.ID + "&action=insert", "/ajax.php", function(Response) {
                if (parseJSON(Response.responseText).type == "success") {
                    User.Whitelisted = User.Blacklisted = false;
                    User[Key] = true;
                }
                if (esgst.wbc_n) {
                    var msg = `${Key} in return.`;
                    if (User.Notes) {
                        User.Notes = `${msg}\n\n${User.Notes}`;
                    } else {
                        User.Notes = msg;
                    }
                }
                Callback();
            });
        }
    }
}

function checkWBCUser(WBC, User, Callback) {
    var Match;
    if (!WBC.Canceled) {
        if (WBC.CC.checked) {
            delete User.WBC;
        }
        if (!User.WBC) {
            User.WBC = {
                LastSearch: 0,
                Timestamp: 0
            };
        }
        if ((((new Date().getTime()) - User.WBC.LastSearch) > 86400000) || WBC.Update) {
            if ((WBC.FC.checked && User.WBC.WhitelistGiveaway) || (!WBC.FC.checked && User.WBC.Giveaway)) {
                WBC.Timestamp = User.WBC.Timestamp;
                checkWBCGiveaway(WBC, User, Callback);
            } else {
                WBC.Timestamp = 0;
                WBC.GroupGiveaways = [];
                Match = window.location.href.match(new RegExp("\/user\/" + User.Username + "(\/search\?page=(\d+))?"));
                getWBCGiveaways(WBC, User, 1, Match ? (Match[2] ? parseInt(Match[2]) : 1) : 0, "/user/" + User.Username + "/search?page=", Callback);
            }
        } else {
            Callback();
        }
    }
}

function checkWBCGiveaway(WBC, User, Callback) {
    var ResponseText;
    if (!WBC.Canceled) {
        queueRequest(WBC, null, User.WBC.WhitelistGiveaway || User.WBC.Giveaway, function(Response) {
            var responseHtml = parseHTML(Response.responseText);
            var errorMessage = responseHtml.getElementsByClassName(`table--summary`)[0];
            var stop;
            if (errorMessage) {
                errorMessage = errorMessage.textContent;
                if (errorMessage.match(/blacklisted the giveaway creator/)) {
                    User.WBC.Result = "NotBlacklisted";
                    stop = true;
                } else if (errorMessage.match(/blacklisted by the giveaway creator/)) {
                    User.WBC.Result = "Blacklisted";
                } else if (errorMessage.match(/not a member of the giveaway creator's whitelist/)) {
                    User.WBC.Result = "None";
                } else {
                    User.WBC.Result = "NotBlacklisted";
                }
            } else if (User.WBC.WhitelistGiveaway) {
                User.WBC.Result = "Whitelisted";
            } else {
                User.WBC.Result = "NotBlacklisted";
            }
            User.WBC.LastSearch = new Date().getTime();
            User.WBC.Timestamp = WBC.Timestamp;
            Callback(stop);
        });
    }
}

function getWBCGiveaways(WBC, User, NextPage, CurrentPage, URL, Callback, Context) {
    var Giveaway, Pagination;
    if (Context) {
        if (!User.WBC.Giveaway) {
            Giveaway = Context.querySelector("[class='giveaway__heading__name'][href*='/giveaway/']");
            User.WBC.Giveaway = Giveaway ? Giveaway.getAttribute("href") : null;
        }
        Pagination = Context.getElementsByClassName("pagination__navigation")[0];
        Giveaway = Context.getElementsByClassName("giveaway__summary")[0];
        if (Giveaway && (WBC.Timestamp === 0)) {
            WBC.Timestamp = parseInt(Giveaway.querySelector("[data-timestamp]").getAttribute("data-timestamp"));
            if (WBC.Timestamp >= (new Date().getTime())) {
                WBC.Timestamp = 0;
            }
        }
        if (User.WBC.Giveaway) {
            checkWBCGiveaway(WBC, User, function(stop) {
                var WhitelistGiveaways, I, N, GroupGiveaway;
                if ((User.WBC.Result == "NotBlacklisted") && !stop && WBC.FC.checked) {
                    WhitelistGiveaways = Context.getElementsByClassName("giveaway__column--whitelist");
                    for (I = 0, N = WhitelistGiveaways.length; (I < N) && !User.WBC.WhitelistGiveaway; ++I) {
                        GroupGiveaway = WhitelistGiveaways[I].parentElement.getElementsByClassName("giveaway__column--group")[0];
                        if (GroupGiveaway) {
                            WBC.GroupGiveaways.push(GroupGiveaway.getAttribute("href"));
                        } else {
                            User.WBC.WhitelistGiveaway = WhitelistGiveaways[I].closest(".giveaway__summary").getElementsByClassName("giveaway__heading__name")[0].getAttribute("href");
                        }
                    }
                    if (User.WBC.WhitelistGiveaway) {
                        checkWBCGiveaway(WBC, User, Callback);
                    } else if (((WBC.Timestamp >= User.WBC.Timestamp) || (WBC.Timestamp === 0)) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                        window.setTimeout(getWBCGiveaways, 0, WBC, User, NextPage, CurrentPage, URL, Callback);
                    } else if ((User.WBC.GroupGiveaways && User.WBC.GroupGiveaways.length) || WBC.GroupGiveaways.length) {
                        getWBCGroupGiveaways(WBC, 0, WBC.GroupGiveaways.length, User, function(Result) {
                            var Groups, GroupGiveaways, Found, J, NumGroups;
                            if (Result) {
                                Callback();
                            } else {
                                Groups = GM_getValue("Groups");
                                for (GroupGiveaway in User.WBC.GroupGiveaways) {
                                    Found = false;
                                    GroupGiveaways = User.WBC.GroupGiveaways[GroupGiveaway];
                                    for (I = 0, N = GroupGiveaways.length; (I < N) && !Found; ++I) {
                                        for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Code != GroupGiveaways[I]); ++J);
                                        if (J < NumGroups) {
                                            Found = true;
                                        }
                                    }
                                    if (!Found) {
                                        break;
                                    }
                                }
                                if (Found) {
                                    Callback();
                                } else {
                                    User.WBC.Result = "Whitelisted";
                                    Callback();
                                }
                            }
                        });
                    } else {
                        Callback();
                    }
                } else {
                    Callback();
                }
            });
        } else if (((WBC.Timestamp >= User.WBC.Timestamp) || (WBC.Timestamp === 0)) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
            window.setTimeout(getWBCGiveaways, 0, WBC, User, NextPage, CurrentPage, URL, Callback);
        } else {
            User.WBC.Result = "Unknown";
            User.WBC.LastSearch = new Date().getTime();
            User.WBC.Timestamp = WBC.Timestamp;
            Callback();
        }
    } else if (!WBC.Canceled) {
        WBC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving " + User.Username + "'s giveaways (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            queueRequest(WBC, null, URL + NextPage, function(Response) {
                if (Response.finalUrl.match(/\/user\//)) {
                    window.setTimeout(getWBCGiveaways, 0, WBC, User, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
                } else {
                    User.WBC.Result = "Unknown";
                    User.WBC.LastSearch = new Date().getTime();
                    User.WBC.Timestamp = WBC.Timestamp;
                    Callback();
                }
            });
        } else {
            window.setTimeout(getWBCGiveaways, 0, WBC, User, ++NextPage, CurrentPage, URL, Callback, document);
        }
    }
}

function getWBCGroupGiveaways(WBC, I, N, User, Callback) {
    if (!WBC.Canceled) {
        if (I < N) {
            WBC.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch\"></i> " +
                "<span>Retrieving " + User.Username + "'s group giveaways (" + I + " of " + N + ")...</span>";
            getWBCGroups(WBC, WBC.GroupGiveaways[I] + "/search?page=", 1, User, function(Result) {
                if (Result) {
                    Callback(Result);
                } else {
                    window.setTimeout(getWBCGroupGiveaways, 0, WBC, ++I, N, User, Callback);
                }
            });
        } else {
            Callback();
        }
    }
}

function getWBCGroups(WBC, URL, NextPage, User, Callback) {
    if (!WBC.Canceled) {
        queueRequest(WBC, null, URL + NextPage, function(Response) {
            var ResponseText, ResponseHTML, Groups, N, GroupGiveaway, I, Group, Pagination;
            ResponseText = Response.responseText;
            ResponseHTML = parseHTML(ResponseText);
            Groups = ResponseHTML.getElementsByClassName("table__column__heading");
            N = Groups.length;
            if (N > 0) {
                if (!User.WBC.GroupGiveaways) {
                    User.WBC.GroupGiveaways = {};
                }
                GroupGiveaway = URL.match(/\/giveaway\/(.+)\//)[1];
                if (!User.WBC.GroupGiveaways[GroupGiveaway]) {
                    User.WBC.GroupGiveaways[GroupGiveaway] = [];
                }
                for (I = 0; I < N; ++I) {
                    Group = Groups[I].getAttribute("href").match(/\/group\/(.+)\//)[1];
                    if (User.WBC.GroupGiveaways[GroupGiveaway].indexOf(Group) < 0) {
                        User.WBC.GroupGiveaways[GroupGiveaway].push(Group);
                    }
                }
                Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    window.setTimeout(getWBCGroups, 0, WBC, URL, ++NextPage, User, Callback);
                } else {
                    Callback();
                }
            } else {
                var errorMessage = ResponseHTML.getElementsByClassName(`table--summary`)[0];
                if (errorMessage && errorMessage.textContent.match(/not a member of the giveaway creator's whitelist/)) {
                    User.WBC.Result = "None";
                    Callback(true);
                } else {
                    Callback(true);
                }
            }
        });
    }
}

function getWBCUsers(WBC, NextPage, CurrentPage, URL, Callback, Context) {
    var Matches, I, N, Match, Username, Pagination;
    if (Context) {
        Matches = Context.querySelectorAll("a[href*='/user/']");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Match = Matches[I].getAttribute("href").match(/\/user\/(.+)/);
            if (Match) {
                Username = Match[1];
                if ((WBC.Users.indexOf(Username) < 0) && (Username != WBC.Username) && (Username == Matches[I].textContent) && !Matches[I].closest(".markdown")) {
                    WBC.Users.push(Username);
                }
            }
        }
        Pagination = Context.getElementsByClassName("pagination__navigation")[0];
        if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
            window.setTimeout(getWBCUsers, 0, WBC, NextPage, CurrentPage, URL, Callback);
        } else {
            Callback();
        }
    } else if (!WBC.Canceled) {
        WBC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving users (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            queueRequest(WBC, null, URL + NextPage, function(Response) {
                window.setTimeout(getWBCUsers, 0, WBC, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
            });
        } else {
            window.setTimeout(getWBCUsers, 0, WBC, ++NextPage, CurrentPage, URL, Callback, document);
        }
    }
}

function addWbcIcons() {
    if (Object.keys(esgst.currentUsers).length) {
        var SavedUsers = GM_getValue("Users");
        for (var I = 0, N = SavedUsers.length; I < N; ++I) {
            var UserID = esgst.sg ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (esgst.currentUsers[UserID]) {
                addWBCIcon(SavedUsers[I], esgst.currentUsers[UserID]);
            }
        }
    }
}

function addWBCIcon(User, Matches) {
    var Result, HTML, I, N, Context, Container;
    if (User.WBC) {
        Result = User.WBC.Result;
        if ((Result == "Whitelisted") || ((Result == "Blacklisted") && esgst.wbc_b)) {
            HTML =
                "<span class=\"sidebar__shortcut-inner-wrap WBCIcon rhWBIcon\" title=\"" + User.Username + " has " + Result.toLowerCase() + " you.\">" +
                "    <i class=\"fa sidebar__shortcut__" + ((Result == "Whitelisted") ? "whitelist fa-check" : "blacklist fa-times") + " is-disabled is-selected\"" +
                "    style=\"background: none !important;\"></i>" +
                "</span>";
            for (I = 0, N = Matches.length; I < N; ++I) {
                Context = Matches[I];
                Container = Context.parentElement;
                if (Container.classList.contains("comment__username")) {
                    Context = Container;
                }
                Context.insertAdjacentHTML("beforeBegin", HTML);
            }
        }
    }
}

function loadWhitelistBlacklistHighlighter() {
    if (Object.keys(esgst.currentUsers).length) {
        var SavedUsers = GM_getValue("Users");
        for (var I = 0, N = SavedUsers.length; I < N; ++I) {
            var UserID = esgst.sg ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (esgst.currentUsers[UserID]) {
                addWBHIcon(SavedUsers[I], esgst.currentUsers[UserID]);
            }
        }
    }
}

function addWBHIcon(User, Matches) {
    var Message, Icon, HTML, I, N, Context, Container;
    if (User.Whitelisted || User.Blacklisted) {
        if (User.Whitelisted) {
            Message = "whitelisted";
            Icon = "whitelist fa-heart";
        } else {
            Message = "blacklisted";
            Icon = "blacklist fa-ban";
        }
        HTML =
            "<span class=\"sidebar__shortcut-inner-wrap WBHIcon rhWBIcon\" title=\"You have " + Message + " " + User.Username + ".\">" +
            "    <i class=\"fa sidebar__shortcut__" + Icon + " is-disabled is-selected\" style=\"background: none !important;\"></i>" +
            "</span>";
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I];
            Container = Context.parentElement;
            if (Container.classList.contains("comment__username")) {
                Context = Container;
            }
            Context.insertAdjacentHTML("beforeBegin", HTML);
        }
    }
}

function loadInboxWinnersHighlighter(context) {
    var className;
    var callback;
    if (esgst.winnersPath) {
        className = `table__gift-not-sent`;
        callback = setIWHObserver;
    } else {
        className = `comments__entity`;
        callback = highlightIWHWinner;
    }
    var matches = context.getElementsByClassName(className);
    for (var i = 0, n = matches.length; i < n; ++i) {
        callback(matches[i]);
    }
}

function setIWHObserver(Context) {
    var Key, Username;
    Key = window.location.pathname.match(/\/giveaway\/(.+?)\//)[1];
    Username = Context.closest(".table__row-inner-wrap").getElementsByClassName("table__column__heading")[0].querySelector("a[href*='/user/']").textContent;
    Context.addEventListener("click", function() {
        var Winners;
        Winners = GM_getValue("Winners");
        if (!Winners[Key]) {
            Winners[Key] = [];
        }
        if (Winners[Key].indexOf(Username) < 0) {
            Winners[Key].push(Username);
        }
        GM_setValue("Winners", Winners);
    });
}

function highlightIWHWinner(Context) {
    var Match, Key, Winners, Matches, I, N, Username;
    Match = Context.firstElementChild.firstElementChild.getAttribute("href").match(/\/giveaway\/(.+?)\//);
    if (Match) {
        Key = Match[1];
        Winners = GM_getValue("Winners");
        if (Winners[Key]) {
            Matches = Context.nextElementSibling.children;
            for (I = 0, N = Matches.length; I < N; ++I) {
                Context = Matches[I].getElementsByClassName("comment__username")[0];
                Username = Context.textContent;
                if (Winners[Key].indexOf(Username) >= 0) {
                    Context.insertAdjacentHTML("afterEnd", "<i class=\"fa fa-trophy IWHIcon\" title=\"This is the winner or one of the winners of this giveaway.\"></i>");
                }
            }
        }
    }
}

function loadGroupsHighlighter(context) {
    var matches = context.querySelectorAll(`.table__column__heading[href*="/group/"]`);
    highlightGHGroups(matches);
}

function highlightGHGroups(Matches) {
    var I, N, Groups, Group, J, NumGroups;
    Groups = GM_getValue("Groups");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Group = Matches[I].getAttribute("href").match(/\/group\/(.+)\//)[1];
        for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Code != Group); ++J);
        if (J < NumGroups) {
            Matches[I].closest(".table__row-outer-wrap").classList.add("GHHighlight");
        }
    }
}

function loadGroupsStats(context) {
    if (context == document) {
        addGSHeading();
    }
    var matches = document.getElementsByClassName(`table__row-inner-wrap`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        loadGSStatus(matches[i]);
    }
}

function addGSHeading() {
    var Context;
    Context = document.getElementsByClassName("table__heading")[0];
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"table__column--width-small text-center\">Sent</div>" +
        "<div class=\"table__column--width-small text-center\">Received</div>" +
        "<div class=\"table__column--width-small text-center\">Gift Difference</div>" +
        "<div class=\"table__column--width-small text-center\">Value Difference</div>"
    );
}

function loadGSStatus(Context) {
    var GS, URL;
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"table__column--width-small text-center\">" +
        "    <i class=\"fa fa-circle-o-notch fa-spin\"></i>" +
        "    <span>Loading group stats...</span>" +
        "</div>"
    );
    GS = {
        Progress: Context.lastElementChild
    };
    URL = Context.getElementsByClassName("table__column__heading")[0].getAttribute("href") + "/users/search?q=" + GM_getValue("Username");
    queueRequest(GS, null, URL, function(Response) {
        var Matches, I, N;
        GS.Progress.remove();
        Matches = parseHTML(Response.responseText).getElementsByClassName("table__row-inner-wrap")[0].getElementsByClassName("table__column--width-small");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context.appendChild(Matches[0]);
        }
    });
}

function loadGamesHighlighter() {
    if (esgst.giveawayCommentsPath) {
        setEGHHighlighter();
    }
    highlightEGHGames();
    esgst.endlessFeatures.push(highlightEGHGames);
}

function setEGHHighlighter() {
    var EnterButton, Context;
    EnterButton = document.getElementsByClassName("sidebar__entry-insert")[0];
    if (EnterButton) {
        Context = document.getElementsByClassName("featured__heading")[0];
        EnterButton.addEventListener("click", function() {
            saveEGHGame(Context);
        });
    }
}

function saveEGHGame(Context) {
    var Game, SavedGames;
    Game = Context.querySelector("[href*='store.steampowered.com']").getAttribute("href").match(/\d+/)[0];
    SavedGames = GM_getValue("Games");
    if (SavedGames[Game]) {
        SavedGames[Game].Entered = true;
        GM_setValue("Games", SavedGames);
    } else {
        SavedGames[Game] = {
            Entered: true
        };
        GM_setValue("Games", SavedGames);
    }
}

function highlightEGHGames() {
    var SavedGames = GM_getValue("Games");
    for (var Game in SavedGames) {
        if (esgst.currentGames[Game]) {
            if (SavedGames[Game].Entered) {
                highlightEGHGame(SavedGames, Game, esgst.currentGames[Game]);
            }
        }
    }
}

function highlightEGHGame(SavedGames, Game, Matches) {
    var I, N, Context;
    if (SavedGames[Game] && SavedGames[Game].Entered) {
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I].match.closest(".featured__summary, .giveaway__row-inner-wrap, .table__row-inner-wrap")
                .querySelector(".featured__heading, .giveaway__heading, .table__column--width-fill p");
            Context.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star EGHIcon\" title=\"You have entered giveaways for this game before. Click to unhighlight it.\"></i>");
            setEGHRemove(Context.firstElementChild, Game);
        }
    }
}

function setEGHRemove(EGHIcon, Game) {
    EGHIcon.addEventListener("click", function() {
        Games = GM_getValue("Games");
        Games[Game].Entered = false;
        GM_setValue("Games", Games);
        EGHIcon.remove();
    });
}

function loadGameTags() {
    for (var key in esgst.currentGames) {
        for (var i = 0, n = esgst.currentGames[key].length; i < n; ++i) {
            addGTButton(esgst.currentGames[key][i].match, key, esgst.currentGames[key][i].title);
        }
    }
    if (Object.keys(esgst.currentGames).length) {
        var SavedGames = GM_getValue("Games");
        for (var Game in SavedGames) {
            if (esgst.currentGames[Game] && SavedGames[Game].Tags) {
                addGTTags(Game, SavedGames[Game].Tags);
            }
        }
    }
}

function addGTButton(Context, Game, Title) {
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<a class=\"GTButton\">" +
        "    <i class=\"fa fa-tag\"></i>" +
        "    <span class=\"GTTags\"></i>" +
        "</a>"
    );
    Context.lastElementChild.addEventListener("click", function() {
        var Popup, SavedGames;
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-tag");
        Popup.Title.innerHTML = "Edit game tags for <span>" + Title + "</span>:";
        Popup.TextInput.classList.remove("rhHidden");
        Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Use commas to separate tags, for example: Tag1, Tag2, ..."));
        createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
            SavedGames = GM_getValue("Games");
            if (!SavedGames[Game]) {
                SavedGames[Game] = {};
            }
            SavedGames[Game].Tags = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
                return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
            });
            GM_setValue("Games", SavedGames);
            addGTTags(Game, SavedGames[Game].Tags);
            Callback();
            Popup.Close.click();
        });
        Popup.popUp(function() {
            Popup.TextInput.focus();
            SavedGames = GM_getValue("Games");
            if (SavedGames[Game]) {
                Popup.TextInput.value = SavedGames[Game].Tags;
            }
        });
    });
}

function addGTTags(Game, Tags) {
    var Matches, Prefix, Suffix, HTML, I, N;
    Matches = esgst.games[Game];
    Prefix = "<span class=\"global__image-outer-wrap author_avatar is_icon\">";
    Suffix = "</span>";
    HTML = Tags ? Tags.replace(/^|,\s|$/g, function(Match, Offset, String) {
        return ((Offset === 0) ? Prefix : ((Offset == (String.length - Match.length)) ? Suffix : (Suffix + Prefix)));
    }) : "";
    for (I = 0, N = Matches.length; I < N; ++I) {
        Matches[I].getElementsByClassName("GTTags")[0].innerHTML = HTML;
    }
}

function loadGameCategories() {
    if (esgst.newGiveawayPath) {
        if (esgst.gc_b && GM_getValue(`LastBundleSync`)) {
            var table = document.getElementsByClassName(`js__autocomplete-data`)[0];
            if (table) {
                var backup = table.innerHTML;
                var games = GM_getValue(`Games`);
                window.setInterval(function() {
                    if (table.innerHTML && (backup != table.innerHTML)) {
                        var matches = table.getElementsByClassName(`table__column__secondary-link`);
                        for (var i = 0, n = matches.length; i < n; ++i) {
                            var id = matches[i].getAttribute(`href`).match(/\d+/)[0];
                            if (!games[id]) {
                                games[id] = {};
                            }
                            if ((esgst.gc_b_r && !games[id].bundled) || (!esgst.gc_b_r && games[id].bundled)) {
                                var key, text;
                                if (games[id].bundled) {
                                    text = `Bundled`;
                                } else {
                                    text = `Not Bundled`;
                                }
                                if (!matches[i].parentElement.getElementsByClassName(`esgst-gc bundled`)[0]) {
                                    var html = `
                                        <div class="nav__notification esgst-gc bundled">${text}</div>
                                    `;
                                    matches[i].insertAdjacentHTML(`afterEnd`, html);
                                }
                            }
                        }
                        backup = table.innerHTML;
                    }
                }, 500);
            }
        }
    } else {
        esgst.endlessFeatures.push(setGameCategories);
        setGameCategories(document);
    }
}

function setGameCategories(context) {
    var query;
    if (esgst.newGiveawayPath) {
        query = `.table__column__secondary-link`;
        context = document;
    } else {
        query = `.giveaway__heading, .featured__heading`;
    }
    var matches = context.querySelectorAll(query);
    var games = GM_getValue(`Games`);
    addGameCategories(0, matches.length, matches, games);
}

function addGameCategories(i, n, matches, games) {
    if (i < n) {
        var steamButton;
        if (esgst.newGiveawayPath) {
            steamButton = matches[i];
        } else {
            steamButton = matches[i].querySelector(`a[href*="store.steampowered.com"]`);
        }
        if (steamButton) {
            var id = steamButton.getAttribute(`href`).match(/\d+/)[0];
            if (!games[id]) {
                games[id] = {};
            }
            addGameCategory(matches[i], games, id, function () {
                window.setTimeout(addGameCategories, 0, ++i, n, matches, games);
            });
        } else {
            window.setTimeout(addGameCategories, 0, ++i, n, matches, games);
        }
    } else {
        if (esgst.gf && esgst.giveawaysPath) {
            filterGfGiveaways();
        }
        queueSave({}, function() {
            updateGames(games);
            GM_setValue(`LastSave`, 0);
        });
    }
}

function addGameCategory(context, games, id, callback) {
    if ((typeof games[id].lastCheck == `undefined`) || (((new Date().getTime()) - games[id].lastCheck) > 2628000000)) {
        makeRequest(null, `http://store.steampowered.com/api/appdetails?appids=${id}`, null, function(response) {
            var responseJson = parseJSON(response.responseText);
            if (responseJson[id].success) {
                games[id].type = responseJson[id].data.type;
                if (games[id].type == `dlc`) {
                    games[id].dlc = true;
                }
                games[id].windows = responseJson[id].data.platforms.windows;
                games[id].linux = responseJson[id].data.platforms.linux;
                games[id].mac = responseJson[id].data.platforms.mac;
                if (responseJson[id].data.categories) {
                    for (var i = 0, n = responseJson[id].data.categories.length; i < n; ++i) {
                        if (responseJson[id].data.categories[i].description == `Steam Achievements`) {
                            games[id].achievements = true;
                        } else if (responseJson[id].data.categories[i].description == `Steam Trading Cards`) {
                            games[id].tradingCards = true;
                        } else if (responseJson[id].data.categories[i].description == `Multi-player`) {
                            games[id].multiplayer = true;
                        } else if (responseJson[id].data.categories[i].description == `Steam Cloud`) {
                            games[id].steamCloud = true;
                        }
                    }
                }
                if (responseJson[id].data.genres) {
                    games[id].genres = [];
                    for (var i = 0, n = responseJson[id].data.genres.length; i < n; ++i) {
                        games[id].genres.push(responseJson[id].data.genres[i].description);
                    }
                }
            }
            games[id].lastCheck = new Date().getTime();
            addGameCategory(context, games, id, callback);
        });
    } else {
        var categories = [
            {
                id: `gc_b`,
                key: `bundled`,
                name: `Bundled`
            },
            {
                id: `gc_b_r`,
                key: `bundled`,
                name: `Not Bundled`
            },
            {
                id: `gc_w`,
                key: `wishlist`,
                name: `Wishlist`
            },
            {
                id: `gc_o`,
                key: `owned`,
                name: `Owned`
            },
            {
                id: `gc_tc`,
                key: `tradingCards`,
                name: `Trading Cards`
            },
            {
                id: `gc_a`,
                key: `achievements`,
                name: `Achievements`
            },
            {
                id: `gc_mp`,
                key: `multiplayer`,
                name: `Multiplayer`
            },
            {
                id: `gc_sc`,
                key: `steamCloud`,
                name: `Steam Cloud`
            },
            {
                id: `gc_l`,
                key: `linux`,
                name: `Linux`
            },
            {
                id: `gc_m`,
                key: `mac`,
                name: `Mac`
            },
            {
                id: `gc_dlc`,
                key: `dlc`,
                name: `DLC`
            },
            {
                id: `gc_g`,
                key: `genres`,
                name: `Genres`
            }
        ];
        for (var i = 0, n = categories.length - 1; i <= n; ++i) {
            var category = categories[n - i];
            if (esgst[category.id] && ((category.id == `gc_b` && esgst.newGiveawayPath) || !esgst.newGiveawayPath) &&
                ((category.id == `gc_b` && !esgst.gc_b_r) || (category.id != `gc_b`))) {
                var value = games[id][category.key];
                if ((value && category.id != `gc_b_r`) || (!value && category.id == `gc_b_r` && esgst.gc_b)) {
                    if (!context.parentElement.getElementsByClassName(`esgst-gc-${category.key}`)[0]) {
                        var text;
                        if (category.key == `genres`) {
                            text = value.join(`, `);
                        } else {
                            text = category.name;
                        }
                        var html = `
                            <div class="nav__notification esgst-gc ${category.key}">${text}</div>
                        `;
                        context.insertAdjacentHTML(`afterEnd`, html);
                    }
                }
            }
        }
        callback();
    }
}

function loadMultiTag() {
    addMTContainer(esgst.mainPageHeading);
}

function addMTContainer(Context, MT, SM) {
    var MTContainer, MTButton, MTBox, MTUsers, MTGames, MTAll, MTNone, MTInverse, MTUsersCheckbox, MTGamesCheckbox, Popup;
    if (!MT) {
        MT = {};
    }
    MT.UserCheckboxes = {};
    MT.GameCheckboxes = {};
    MT.UsersSelected = [];
    MT.GamesSelected = [];
    Context.insertAdjacentHTML(
        "afterBegin",
        "<div class=\"MTContainer" + (SM ? " rhHidden" : "") + "\">" +
        "    <a class=\"MTButton page_heading_btn\" title=\"Tag multiple users / games at the same times.\">" +
        "        <i class=\"fa fa-tags\"></i>" +
        "    </a>" +
        "</div>"
    );
    MTContainer = Context.firstElementChild;
    MTButton = MTContainer.firstElementChild;
    MTBox = createPopout(MTContainer);
    MTBox.Popout.classList.add("MTBox");
    MTBox.customRule = function(Target) {
        return (!MTContainer.contains(Target) && !Target.closest(".MTUserCheckbox") && !Target.closest(".MTGameCheckbox"));
    };
    Context = SM ? SM.Popup.Options : MTBox.Popout;
    Context.innerHTML =
        "<div" + ((GM_getValue("PUT") && !SM) ? "" : " class=\"rhHidden\"") + "><span class=\"MTUsers\"></span> Enable selection for user tags.</div>" +
        "<div" + ((GM_getValue("GT") && !SM) ? "" : " class=\"rhHidden\"") + "><span class=\"MTGames\"></span> Enable selection for game tags.</div>" +
        "<div><i class=\"fa fa-check-square-o MTAll\"></i> Select all.</div>" +
        "<div><i class=\"fa fa-square-o\ MTNone\"></i> Select none.</div>" +
        "<div><i class=\"fa fa-minus-square-o MTInverse\"></i> Select inverse.</div>" +
        "<div><span class=\"MTCount\">0</span> selected.</div>" +
        "<div class=\"MTTag\"></div>";
    MTUsers = Context.getElementsByClassName("MTUsers")[0];
    MTGames = Context.getElementsByClassName("MTGames")[0];
    MTAll = Context.getElementsByClassName("MTAll")[0];
    MTNone = Context.getElementsByClassName("MTNone")[0];
    MTInverse = Context.getElementsByClassName("MTInverse")[0];
    MT.Count = Context.getElementsByClassName("MTCount")[0];
    MT.Tag = Context.getElementsByClassName("MTTag")[0];
    MTUsersCheckbox = createCheckbox(MTUsers);
    MTGamesCheckbox = createCheckbox(MTGames);
    setMTCheckboxes(MTUsers, MTUsersCheckbox.Checkbox, esgst.users, "User", "beforeBegin", "previousElementSibling", MT);
    setMTCheckboxes(MTGames, MTGamesCheckbox.Checkbox, esgst.games, "Game", "afterBegin", "firstElementChild", MT);
    setMTSelect(MTAll, MT, "check");
    setMTSelect(MTNone, MT, "uncheck");
    setMTSelect(MTInverse, MT, "toggle");
    MT.Tag.classList.add("rhHidden");
    Popup = createPopup();
    Popup.Icon.classList.add("fa-tags");
    Popup.TextInput.classList.remove("rhHidden");
    Popup.TextInput.insertAdjacentHTML(
        "afterEnd",
        createDescription(
            "Use commas to separate tags, for example: Tag1, Tag2, ...<br/><br/>" +
            "A [*] tag means that the selected users / games have individual tags (not shared between all of them). Removing the [*] tag will delete those individual tags."
        )
    );
    createButton(MT.Tag, "fa-tags", "Multi-Tag", "", "", function(Callback) {
        var Tags, Shared, I, N, UserID, User, SavedUser, SavedTags, J, NumTags, SavedTag, SavedGames, SavedGame, Game, Key, Individual;
        Callback();
        if (!MTButton.classList.contains("rhBusy")) {
            Popup.Title.textContent = "Multi-tag " + MT.UsersSelected.length + " users and " + MT.GamesSelected.length + " games:";
            Tags = {};
            MT.UserTags = {};
            Shared = [];
            for (I = 0, N = MT.UsersSelected.length; I < N; ++I) {
                UserID = MT.UsersSelected[I];
                User = {};
                User[esgst.sg ? "Username" : "SteamID64"] = UserID;
                SavedUser = getUser(User);
                if (SavedUser && SavedUser.Tags) {
                    SavedTags = SavedUser.Tags.split(/,\s/);
                    Tags[UserID] = MT.UserTags[UserID] = SavedTags;
                    for (J = 0, NumTags = SavedTags.length; J < NumTags; ++J) {
                        SavedTag = SavedTags[J];
                        if (Shared.indexOf(SavedTag) < 0) {
                            Shared.push(SavedTag);
                        }
                    }
                } else {
                    Tags[UserID] = MT.UserTags[UserID] = "";
                }
            }
            SavedGames = GM_getValue("Games");
            MT.GameTags = {};
            for (I = 0, N = MT.GamesSelected.length; I < N; ++I) {
                Game = MT.GamesSelected[I];
                SavedGame = SavedGames[Game];
                if (SavedGame && SavedGame.Tags) {
                    SavedTags = SavedGame.Tags.split(/,\s/);
                    Tags[Game] = MT.GameTags[Game] = SavedTags;
                    for (J = 0, NumTags = SavedTags.length; J < NumTags; ++J) {
                        SavedTag = SavedTags[J];
                        if (Shared.indexOf(SavedTag) < 0) {
                            Shared.push(SavedTag);
                        }
                    }
                } else {
                    Tags[Game] = MT.GameTags[Game] = "";
                }
            }
            for (Key in Tags) {
                Shared = Shared.filter(function(N) {
                    if (Tags[Key].indexOf(N) >= 0) {
                        return true;
                    } else {
                        Individual = true;
                        return false;
                    }
                });
            }
            for (Key in Tags) {
                for (I = 0, N = Shared.length; I < N; ++I) {
                    J = Tags[Key].indexOf(Shared[I]);
                    if (J >= 0) {
                        Tags[Key].splice(J, 1);
                    }
                }
            }
            Popup.TextInput.value = Shared.length ? (Shared.join(", ") + (Individual ? ", [*]" : "")) : (Individual ? "[*]" : "");
        }
        Popup.popUp(function() {
            Popup.TextInput.focus();
        });
    });
    createButton(Popup.Button, "fa-check", "Save", "fa-times-circle", "Cancel", function(Callback) {
        var Shared, I, Individual, Keys;
        MT.Canceled = false;
        MTButton.classList.add("rhBusy");
        Shared = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
            return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
        }).split(", ");
        I = Shared.indexOf("[*]");
        if (I >= 0) {
            Shared.splice(I, 1);
            Individual = true;
        } else {
            Individual = false;
        }
        Shared = Shared.join(", ");
        Keys = Object.keys(MT.UserTags);
        saveMTUserTags(MT, 0, Keys.length, Keys, Individual, Shared, MT.UserTags, function() {
            Keys = Object.keys(MT.GameTags);
            saveMTGameTags(MT, 0, Keys.length, Keys, Individual, Shared, MT.GameTags, function() {
                MTButton.classList.remove("rhBusy");
                MT.Progress.innerHTML = MT.OverallProgress.innerHTML = "";
                Callback();
                Popup.Close.click();
            });
        });
    }, function() {
        clearInterval(MT.Request);
        clearInterval(MT.Save);
        MT.Canceled = true;
        setTimeout(function() {
            MT.Progress.innerHTML = MT.OverallProgress.innerHTML = "";
        }, 500);
        MTButton.classList.remove("rhBusy");
    });
    MT.Progress = Popup.Progress;
    MT.OverallProgress = Popup.OverallProgress;
    MTButton.addEventListener("click", function() {
        if (MTBox.Popout.classList.contains("rhHidden")) {
            MTBox.popOut(MTContainer);
        } else {
            MTBox.Popout.classList.add("rhHidden");
        }
    });
}

function setMTCheckboxes(Element, Checkbox, Selection, Type, InsertionPosition, Position, MT) {
    Element.addEventListener("click", function() {
        var Key, Matches, I, N, Context, MTCheckbox;
        if (Checkbox.checked) {
            addMTCheckboxes(Selection, Type, InsertionPosition, Position, MT);
        } else {
            removeMTCheckboxes(Type, MT);
        }
    });
}

function addMTCheckboxes(Selection, Type, InsertionPosition, Position, MT) {
    var Key, Matches, I, N, Context, MTCheckbox;
    for (Key in Selection) {
        Matches = Selection[Key];
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I];
            Context.insertAdjacentHTML(InsertionPosition, "<span class=\"MT" + Type + "Checkbox\"></span>");
            MTCheckbox = createCheckbox(Context[Position]);
            if (!MT[Type + "Checkboxes"][Key]) {
                MT[Type + "Checkboxes"][Key] = [];
            }
            MT[Type + "Checkboxes"][Key].push(MTCheckbox);
            setMTCheckbox(Type, Context[Position], MT, Key, MTCheckbox.Checkbox, MT.Tag);
        }
    }
}

function setMTCheckbox(Type, Context, MT, Key, Checkbox) {
    Context.addEventListener("click", function() {
        checkMTCheckbox(MT, Type, Key, Checkbox);
    });
}

function checkMTCheckbox(MT, Type, Key, Checkbox) {
    var Count, I, Checkboxes, N;
    Count = parseInt(MT.Count.textContent);
    I = MT[Type + "sSelected"].indexOf(Key);
    if (Checkbox.checked) {
        MT.Count.textContent = ++Count;
        if (I < 0) {
            MT[Type + "sSelected"].push(Key);
        }
    } else {
        MT.Count.textContent = --Count;
        if (I >= 0) {
            MT[Type + "sSelected"].splice(I, 1);
        }
    }
    Checkboxes = MT[Type + "Checkboxes"][Key];
    for (I = 0, N = Checkboxes.length; I < N; ++I) {
        if (Checkboxes[I].Checkbox != Checkbox) {
            Checkboxes[I].toggle();
        }
    }
    MT.Tag.classList[(Count > 1) ? "remove" : "add"]("rhHidden");
}

function removeMTCheckboxes(Type, MT) {
    var Matches, I, N;
    Matches = document.getElementsByClassName("MT" + Type + "Checkbox");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Matches[0].remove();
    }
    MT[Type + "Checkboxes"] = {};
    MT[Type + "sSelected"] = [];
}

function setMTSelect(Element, MT, Call) {
    Element.addEventListener("click", function() {
        selectMTCheckboxes(MT.UserCheckboxes, Call, MT, "User");
        selectMTCheckboxes(MT.GameCheckboxes, Call, MT, "Game");
    });
}

function selectMTCheckboxes(MTCheckboxes, Call, MT, Type) {
    var Key, Checkbox, Previous, Current;
    for (Key in MTCheckboxes) {
        Checkbox = MTCheckboxes[Key][0];
        Previous = Checkbox.Checkbox.checked;
        Checkbox[Call]();
        Current = Checkbox.Checkbox.checked;
        if (Previous != Current) {
            checkMTCheckbox(MT, Type, Key, Checkbox.Checkbox);
        }
    }
}

function saveMTUserTags(MT, I, N, Keys, Individual, Shared, Tags, Callback) {
    var UserID, User;
    if (!MT.Canceled) {
        MT.OverallProgress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>" + I + " of " + N + " users tagged...</span>";
        if (I < N) {
            UserID = Keys[I];
            User = {
                Tags: Individual ? (Shared + ", " + Tags[UserID]) : Shared
            };
            User[esgst.sg ? "Username" : "SteamID64"] = UserID;
            queueSave(MT, function() {
                saveUser(User, MT, function() {
                    GM_setValue("LastSave", 0);
                    addPUTTags(UserID, getUser(User).Tags);
                    setTimeout(saveMTUserTags, 0, MT, ++I, N, Keys, Individual, Shared, Tags, Callback);
                });
            });
        } else {
            Callback();
        }
    }
}

function saveMTGameTags(MT, I, N, Keys, Individual, Shared, Tags, Callback) {
    var Game, SavedGames;
    if (!MT.Canceled) {
        MT.OverallProgress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>" + I + " of " + N + " groups tagged...</span>";
        if (I < N) {
            Game = Keys[I];
            SavedGames = GM_getValue("Games");
            if (!SavedGames[Game]) {
                SavedGames[Game] = {};
            }
            SavedGames[Game].Tags = Individual ? (Shared + ", " + Tags[Game]) : Shared;
            GM_setValue("Games", SavedGames);
            addGTTags(Game, SavedGames[Game].Tags);
            setTimeout(saveMTGameTags, 0, MT, ++I, N, Keys, Individual, Shared, Tags, Callback);
        } else {
            Callback();
        }
    }
}

function loadHeaderButton() {
    var html = `
        <div class="nav__button-container nav_btn_container">
            <div class="nav__relative-dropdown dropdown ${esgst.hiddenClass}">
                <div class="nav__absolute-dropdown">
                    <a class="nav__row dropdown_btn" href="https://github.com/revilheart/ESGST/raw/master/ESGST.user.js">
                        <i class="icon-blue blue fa fa-fw fa-refresh"></i>
                        <div class="nav__row__summary">
                            <p class="nav__row__summary__name">Update</p>
                            ${esgst.sg ? `
                                <p class="nav__row__summary__description">Check for updates.</p>
                            ` : ``}
                        </div>
                    </a>
                    <a class="nav__row dropdown_btn" href="https://github.com/revilheart/ESGST">
                        <i class="icon-grey grey fa fa-fw fa-github"></i>
                        <div class="nav__row__summary">
                            <p class="nav__row__summary__name">GitHub</p>
                            ${esgst.sg ? `
                                <p class="nav__row__summary__description">Visit the GitHub page.</p>
                            ` : ``}
                        </div>
                    </a>
                    <a class="nav__row dropdown_btn" href="https://www.steamgifts.com/discussion/TDyzv/">
                        <i class="icon-green green fa fa-fw fa-commenting"></i>
                        <div class="nav__row__summary">
                            <p class="nav__row__summary__name">Discussion</p>
                            ${esgst.sg ? `
                                <p class="nav__row__summary__description">Visit the discussion page.</p>
                            ` : ``}
                        </div>
                    </a>
                    ${esgst.uh ? `
                        <div class="nav__row dropdown_btn SMRecentUsernameChanges">
                            <i class="icon-red red fa fa-fw fa-user"></i>
                            <div class="nav__row__summary">
                                <p class="nav__row__summary__name">Recent Username Changes</p>
                                ${esgst.sg ? `
                                    <p class="nav__row__summary__description">Check out the recent username changes.</p>
                                ` : ``}
                            </div>
                        </div>
                    ` : ``}
                    ${esgst.ch ? `
                        <div class="nav__row dropdown_btn SMCommentHistory">
                            <i class="icon-yellow yellow fa fa-fw fa-comments"></i>
                            <div class="nav__row__summary">
                                <p class="nav__row__summary__name">Comment History</p>
                                ${esgst.sg ? `
                                    <p class="nav__row__summary__description">Check out your comment history.</p>
                                ` : ``}
                            </div>
                        </div>
                    ` : ``}
                </div>
            </div>
            <a class="nav__button nav__button--is-dropdown nav_btn nav_btn_left" href="https://www.steamgifts.com/account#ESGST">
                <i class="fa"><img src="${GM_getResourceURL(`esgstIcon`)}"/></i>
                <span>ESGST</span>
            </a>
            <div class="nav__button nav__button--is-dropdown-arrow nav_btn nav_btn_right nav_btn_dropdown">
                <i class="fa fa-angle-down"></i>
            </div>
        </div>
    `;
    var className;
    if (esgst.sg) {
        className = `nav__left-container`;
        insertPosition = `beforeEnd`;
        getPosition = `lastElementChild`;
    } else {
        className = `nav_logo`;
        insertPosition = `afterEnd`;
        getPosition = `nextElementSibling`;
    }
    var context = document.getElementsByClassName(className)[0];
    context.insertAdjacentHTML(insertPosition, html);
    var menu = context[getPosition];
    var SMRecentUsernameChanges = menu.getElementsByClassName("SMRecentUsernameChanges")[0];
    var SMCommentHistory = menu.getElementsByClassName("SMCommentHistory")[0];
    if (SMRecentUsernameChanges) {
        setSMRecentUsernameChanges(SMRecentUsernameChanges);
    }
    if (SMCommentHistory) {
        setSMCommentHistory(SMCommentHistory);
    }
    var button = menu.lastElementChild;
    button.addEventListener(`click`, toggleHeaderButton);

    function toggleHeaderButton(e) {
        if (esgst.sg) {
            $("nav .nav__button").removeClass("is-selected");
            $("nav .nav__relative-dropdown").addClass("is-hidden");
            $(this).addClass("is-selected").siblings(".nav__relative-dropdown").removeClass("is-hidden");
            e.stopPropagation();
        } else {
            $(".nav_btn_dropdown").removeClass("is_selected");
            $(".page_heading_btn_dropdown").removeClass("is_selected");
            $(".dropdown").addClass("is_hidden");
            $(this).addClass("is_selected").siblings(".dropdown").removeClass("is_hidden");
            e.stopPropagation()
        }
    }
}

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
    esgst.eg = {};
    esgst.eg.button = context.lastElementChild;
    esgst.eg.popup = createPopup();
    esgst.eg.popup.Icon.classList.add(`fa-star`);
    esgst.eg.popup.Title.textContent = `Exclusive Giveaways`;
    esgst.eg.button.addEventListener(`click`, function() {
        esgst.eg.popup.popUp();
    });
    getExclusiveGiveaways(document);
    esgst.endlessFeatures.push(getExclusiveGiveaways);
}

function getExclusiveGiveaways(context) {
    var matches = context.querySelectorAll(`[href^="ESGST-"]`);
    var n = matches.length;
    if (n > 0) {
        esgst.eg.button.classList.remove(`esgst-hidden`);
        for (var i = 0; i < n; ++i) {
            var code = matches[i].getAttribute(`href`).match(/ESGST-(.+)/)[1];
            var decodedCode = decodeGiveawayCode(code);
            var html = `<a href="/giveaway/${decodedCode}/">/giveaway/${decodedCode}/</a><br/>`;
            esgst.eg.popup.Description.insertAdjacentHTML(`afterBegin`, html);
            var actions = matches[i].closest(`.comment`).getElementsByClassName(`comment__actions`)[0];
            html = `
                <a class="esgst-eg" href="/giveaway/${decodedCode}/" title="ESGST Exclusive Giveaway">
                    <i class="fa fa-star"></i>
                </a>
            `;
            actions.insertAdjacentHTML(`beforeEnd`, html);
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

function addSMButton() {
    var Sidebar, SMButton;
    Sidebar = document.getElementsByClassName("sidebar")[0];
    Sidebar.insertAdjacentHTML("beforeEnd", createNavigationSection("ESGST", [{
        Name: "SMButton",
        Title: "Settings",
        URL: "#ESGST"
    }, {
        Title: "Update",
        URL: "https://github.com/revilheart/ESGST/raw/master/ESGST.user.js"
    }, {
        Title: "GitHub",
        URL: "https://github.com/revilheart/ESGST"
    }, {
        Title: "Discussion",
        URL: "/discussion/TDyzv/"
    }]));
    SMButton = Sidebar.getElementsByClassName("SMButton")[0];
    SMButton.addEventListener("click", function() {
        window.location.hash = "ESGST";
        window.location.reload();
    });
    if (esgst.esgstHash) {
        loadSMMenu(Sidebar, SMButton);
    }
}

function loadSMMenu(Sidebar, SMButton) {
    var Selected, Item, SMSyncFrequency, I, Container, SMGeneral, SMGiveaways, SMDiscussions, SMCommenting, SMUsers, SMOthers, SMManageData, SMRecentUsernameChanges,
        SMCommentHistory, SMManageTags, SMGeneralFeatures, SMGiveawayFeatures, SMDiscussionFeatures, SMCommentingFeatures, SMUserGroupGamesFeatures, SMOtherFeatures, ID,
        SMLastSync, LastSync, SMAPIKey;
    Selected = Sidebar.getElementsByClassName("is-selected")[0];
    Selected.classList.remove("is-selected");
    SMButton.classList.add("is-selected");
    Item = SMButton.getElementsByClassName("sidebar__navigation__item__link")[0];
    Item.insertBefore(Selected.getElementsByClassName("fa")[0], Item.firstElementChild);
    SMSyncFrequency = "<select class=\"SMSyncFrequency\">";
    for (I = 0; I <= 30; ++I) {
        SMSyncFrequency += "<option>" + I + "</option>";
    }
    SMSyncFrequency += "</select>";
    Container = Sidebar.nextElementSibling;
    Container.innerHTML =
        "<div class=\"page__heading\">" +
        "    <div class=\"page__heading__breadcrumbs\">" +
        "        <a href=\"/account\">Account</a>" +
        "        <i class=\"fa fa-angle-right\"></i>" +
        "        <a href=\"#ESGST\">Enhanced SteamGifts & SteamTrades</a>" +
        "    </div>" +
        "</div>" +
        "<div class=\"form__rows SMMenu\">" +
        createSMSections([{
            Title: "General",
            Name: "SMGeneral"
        }, {
            Title: "Giveaways",
            Name: "SMGiveaways"
        }, {
            Title: "Discussions",
            Name: "SMDiscussions"
        }, {
            Title: "Commenting",
            Name: "SMCommenting"
        }, {
            Title: "Users, Groups & Games",
            Name: "SMUsers"
        }, {
            Title: "Others",
            Name: "SMOthers"
        }, {
            Title: "Sync Groups / Whitelist / Blacklist / Owned Games / Wishlist",
            HTML: SMSyncFrequency + createDescription("Select from how many days to how many days you want the automatic sync to run (0 to disable it).") + (
                "<div class=\"form__sync\">" +
                "    <div class=\"form__sync-data\">" +
                "        <div class=\"notification notification--warning SMLastSync\">" +
                "            <i class=\"fa fa-question-circle\"></i> Never synced." +
                "        </div>" +
                "    </div>" +
                "    <div class=\"form__submit-button SMSync\">" +
                "        <i class=\"fa fa-refresh\"></i> Sync" +
                "    </div>" +
                "</div>"
            )
        },
        {
            Title: "Sync Bundle List",
            HTML: (
                "<div class=\"form__sync\">" +
                "    <div class=\"form__sync-data\">" +
                "        <div class=\"notification notification--warning SMLastBundleSync\">" +
                "            <i class=\"fa fa-question-circle\"></i> Never synced." +
                "        </div>" +
                "    </div>" +
                "    <div class=\"form__submit-button SMBundleSync\">" +
                "        <i class=\"fa fa-refresh\"></i> Sync" +
                "    </div>" +
                "</div>"
            )
        }, {
            Title: "Steam API Key",
            HTML: "<input class=\"SMAPIKey\" type=\"text\"/>" +
            createDescription("This is required for Entries Remover to work." +
                              "Get a Steam API Key <a class=\"rhBold\" href=\"https://steamcommunity.com/dev/apikey\" target=\"_blank\">here</a>.")
        }]) +
        "</div>";
    createSMButtons([{
        Check: true,
        Icons: ["fa-arrow-circle-up", "fa-arrow-circle-down", "fa-trash"],
        Name: "SMManageData",
        Title: "Manage data."
    }, {
        Check: esgst.uh,
        Icons: ["fa-user"],
        Name: "SMRecentUsernameChanges",
        Title: "See recent username changes."
    }, {
        Check: esgst.ch,
        Icons: ["fa-comments"],
        Name: "SMCommentHistory",
        Title: "See comment history."
    }, {
        Check: esgst.ut,
        Icons: ["fa-tags", "fa-cog"],
        Name: "SMManageTags",
        Title: "Manage tags."
    }, {
        Check: esgst.wbc,
        Icons: ["fa-heart", "fa-ban", "fa-cog"],
        Name: "WBCButton",
        Title: "Manage Whitelist / Blacklist Checker caches."
    }, {
        Check: esgst.namwc,
        Icons: ["fa-trophy", "fa-cog"],
        Name: "NAMWCButton",
        Title: "Manage Not Activated / Multiple Wins Checker caches."
    }]);
    esgst.mainPageHeading = Container.getElementsByClassName(`page__heading`)[0];
    SMGeneral = Container.getElementsByClassName("SMGeneral")[0];
    SMGiveaways = Container.getElementsByClassName("SMGiveaways")[0];
    SMDiscussions = Container.getElementsByClassName("SMDiscussions")[0];
    SMCommenting = Container.getElementsByClassName("SMCommenting")[0];
    SMUsers = Container.getElementsByClassName("SMUsers")[0];
    SMOthers = Container.getElementsByClassName("SMOthers")[0];
    SMManageData = Container.getElementsByClassName("SMManageData")[0];
    SMRecentUsernameChanges = Container.getElementsByClassName("SMRecentUsernameChanges")[0];
    SMCommentHistory = Container.getElementsByClassName("SMCommentHistory")[0];
    SMManageTags = Container.getElementsByClassName("SMManageTags")[0];
    SMSyncFrequency = Container.getElementsByClassName("SMSyncFrequency")[0];
    SMLastSync = Container.getElementsByClassName("SMLastSync")[0];
    SMLastBundleSync = Container.getElementsByClassName("SMLastBundleSync")[0];
    SMAPIKey = Container.getElementsByClassName("SMAPIKey")[0];
    SMGeneralFeatures = ["fh", "fs", "fmph", "ff", "hir", "vai", "ev", "hbs", "at", "pnot", "es"];
    SMGiveawayFeatures = ["dgn", "pr", "hfc", "ags", "pgb", "gf", "gv", "egf", "gp", "ggp", "gt", "sgg", "rcvc", "ugs", "er", "gwl", "gesl", "as"];
    SMDiscussionFeatures = ["adot", "dh", "mpp", "ded"];
    SMCommentingFeatures = ["ch", "ct", "cfh", "rbot", "rbp", "mr", "rfi", "rml"];
    SMUserGroupGamesFeatures = ["ap", "uh", "un", "rwscvl", "ugd", "namwc", "nrf", "swr", "luc", "sgpb", "stpb", "sgc", "wbc", "wbh", "ut", "iwh", "gh", "gs", "ggh", "ggt", "gc", "mt"];
    SMOtherFeatures = ["sm_ebd", "sm_hb", "eg"];
    for (var i = 0, n = esgst.features.length; i < n; ++i) {
        var id = esgst.features[i].id;
        if (SMGeneralFeatures.indexOf(id) >= 0) {
            SMGeneral.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMGiveawayFeatures.indexOf(id) >= 0) {
            SMGiveaways.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMDiscussionFeatures.indexOf(id) >= 0) {
            SMDiscussions.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMCommentingFeatures.indexOf(id) >= 0) {
            SMCommenting.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMUserGroupGamesFeatures.indexOf(id) >= 0) {
            SMUsers.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMOtherFeatures.indexOf(id) >= 0) {
            SMOthers.appendChild(getSMFeature(esgst.features[i]));
        }
    }
    SMSyncFrequency.selectedIndex = GM_getValue("SyncFrequency");
    LastSync = GM_getValue("LastSync");
    if (LastSync) {
        SMLastSync.classList.remove("notification--warning");
        SMLastSync.classList.add("notification--success");
        SMLastSync.innerHTML = "<i class=\"fa fa-check-circle\"></i> Last synced " + (new Date(LastSync).toLocaleString()) + ".";
    }
    checkSync(true, function(CurrentDate) {
        SMLastSync.classList.remove("notification--warning");
        SMLastSync.classList.add("notification--success");
        SMLastSync.innerHTML =
            "<i class=\"fa fa-check-circle\"></i> Last synced " + CurrentDate.toLocaleString() + ".";
    });
    LastBundleSync = GM_getValue("LastBundleSync");
    if (LastBundleSync) {
        SMLastBundleSync.classList.remove("notification--warning");
        SMLastBundleSync.classList.add("notification--success");
        SMLastBundleSync.innerHTML = "<i class=\"fa fa-check-circle\"></i> Last synced " + (new Date(LastBundleSync).toLocaleString()) + ".";
    }
    document.getElementsByClassName("SMBundleSync")[0].addEventListener("click", function() {
        if (((new Date().getTime()) - LastBundleSync) > 604800000) {
            syncBundleList();
        } else {
            window.alert(`You synced the bundle list in less than a week ago. You can sync only once per week.`);
        }
    });
    if (GM_getValue("SteamAPIKey")) {
        SMAPIKey.value = GM_getValue("SteamAPIKey");
    }
    SMSyncFrequency.addEventListener("change", function() {
        GM_setValue("SyncFrequency", SMSyncFrequency.selectedIndex);
    });
    SMManageData.addEventListener("click", function() {
        var Popup, SM, SMImport, SMExport, SMDelete;
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-cog");
        Popup.Title.textContent = "Manage data:";
        SM = {
            Names: {
                Users: "U",
                Games: "G",
                Comments: "C",
                Comments_ST: "C_ST",
                Emojis: "E",
                Rerolls: "R",
                CommentHistory: "CH",
                StickiedGroups: "SG",
                Templates: "T"
            }
        };
        createOptions(Popup.Options, SM, [{
            Check: function() {
                return true;
            },
            Description: "Users data.",
            Title: "Includes user notes, tags and checker caches.",
            Name: "Users",
            Key: "U",
            ID: "SM_U"
        }, {
            Check: function() {
                return true;
            },
            Description: "Games data.",
            Title: "Includes game tags and Entered Games Highlighter data.",
            Name: "Games",
            Key: "G",
            ID: "SM_G"
        }, {
            Check: function() {
                return true;
            },
            Description: "Comments data (SteamGifts).",
            Title: "Includes Comment Tracker data from SteamGifts.",
            Name: "Comments",
            Key: "C",
            ID: "SM_C"
        }, {
            Check: function() {
                return true;
            },
            Description: "Comments data (SteamTrades).",
            Title: "Includes Comment Tracker data from SteamTrades.",
            Name: "Comments_ST",
            Key: "C_ST",
            ID: "SM_C_ST"
        }, {
            Check: function() {
                return true;
            },
            Description: "Emojis data.",
            Title: "Includes Comment Formatting Helper emojis data.",
            Name: "Emojis",
            Key: "E",
            ID: "SM_E"
        }, {
            Check: function() {
                return true;
            },
            Description: "Rerolls data.",
            Title: "Includes Unsent Gifts Sender rerolls data.",
            Name: "Rerolls",
            Key: "R",
            ID: "SM_R"
        }, {
            Check: function() {
                return true;
            },
            Description: "Comment history data.",
            Title: "Includes Comment History data.",
            Name: "CommentHistory",
            Key: "CH",
            ID: "SM_CH"
        }, {
            Check: function() {
                return true;
            },
            Description: "Stickied groups data.",
            Title: "Includes Stickied Giveaway Groups data.",
            Name: "StickiedGroups",
            Key: "SG",
            ID: "SM_SG"
        }, {
            Check: function() {
                return true;
            },
            Description: "Templates data.",
            Title: "Includes Giveaway Templates data.",
            Name: "Templates",
            Key: "T",
            ID: "SM_T"
        }, {
            Check: function() {
                return true;
            },
            Description: "Settings data.",
            Title: "Includes feature settings.",
            Name: "Settings",
            Key: "S",
            ID: "SM_S"
        }]);
        Popup.Button.classList.add("SMManageDataPopup");
        Popup.Button.innerHTML =
            "<div class=\"SMImport\"></div>" +
            "<div class=\"SMExport\"></div>" +
            "<div class=\"SMDelete\"></div>";
        SMImport = Popup.Button.firstElementChild;
        SMExport = SMImport.nextElementSibling;
        SMDelete = SMExport.nextElementSibling;
        createButton(SMImport, "fa-arrow-circle-up", "Import", "", "", function(Callback) {
            Callback();
            importSMData(SM);
        });
        createButton(SMExport, "fa-arrow-circle-down", "Export", "", "", function(Callback) {
            Callback();
            exportSMData(SM);
        });
        createButton(SMDelete, "fa-trash", "Delete", "", "", function(Callback) {
            Callback();
            deleteSMData(SM);
        });
        Popup.popUp();
    });
    if (SMManageTags) {
        SMManageTags.addEventListener("click", function() {
            var Popup, MT, SMManageTagsPopup;
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-cog");
            Popup.Title.textContent = "Manage tags:";
            Popup.TextInput.classList.remove("rhHidden");
            Popup.TextInput.insertAdjacentHTML("beforeBegin", "<div class=\"page__heading\"></div>");
            MT = {};
            addMTContainer(Popup.TextInput.previousElementSibling, MT, {
                Popup: Popup
            });
            Popup.TextInput.insertAdjacentHTML(
                "afterEnd",
                createDescription("Filter users by tag (use commas to separate filters, for example: Filter1, Filter2, ...). Filters are not case sensitive.")
            );
            SMManageTagsPopup = Popup.popUp(function() {
                var SavedUsers, MTUsers, Tags, I, N, Context, Username, SavedTags, J, NumTags, Key;
                Popup.TextInput.focus();
                SavedUsers = GM_getValue("Users");
                MTUsers = {};
                Tags = {};
                for (I = 0, N = SavedUsers.length; I < N; ++I) {
                    if (SavedUsers[I].Tags) {
                        Popup.Results.insertAdjacentHTML(
                            "beforeEnd",
                            "<div>" +
                            "    <a href=\"/user/" + SavedUsers[I].Username + "\">" + SavedUsers[I].Username + "</a>" +
                            "</div>"
                        );
                        Context = Popup.Results.lastElementChild.firstElementChild;
                        Username = SavedUsers[I].Username;
                        if (!MTUsers[Username]) {
                            MTUsers[Username] = [];
                        }
                        MTUsers[Username].push(Context);
                        SMManageTagsPopup.reposition();
                        SavedTags = SavedUsers[I].Tags.split(/,\s/g);
                        for (J = 0, NumTags = SavedTags.length; J < NumTags; ++J) {
                            Key = SavedTags[J].toLowerCase();
                            if (!Tags[Key]) {
                                Tags[Key] = [];
                            }
                            Tags[Key].push(Popup.Results.children.length - 1);
                        }
                    }
                }
                addMTCheckboxes(MTUsers, "User", "beforeBegin", "previousElementSibling", MT);
                loadEndlessFeatures(Popup.Results);
                Popup.TextInput.addEventListener("input", function() {
                    var MTUsers, Matches, Filters, Context, Username;
                    selectMTCheckboxes(MT.UserCheckboxes, "uncheck", MT, "User");
                    removeMTCheckboxes("User", MT);
                    MTUsers = {};
                    Matches = Popup.Results.getElementsByClassName("SMTag");
                    for (I = 0, N = Matches.length; I < N; ++I) {
                        if (Matches[I]) {
                            Matches[I].classList.remove("SMTag");
                        }
                    }
                    if (Popup.TextInput.value) {
                        Popup.Results.classList.add("SMTags");
                        Filters = Popup.TextInput.value.split(/,\s*/g);
                        for (I = 0, N = Filters.length; I < N; ++I) {
                            Key = Filters[I].toLowerCase();
                            if (Tags[Key]) {
                                for (J = 0, NumTags = Tags[Key].length; J < NumTags; ++J) {
                                    Context = Popup.Results.children[Tags[Key][J]];
                                    Context.classList.add("SMTag");
                                    Context = Context.querySelector("a[href*='/user/']");
                                    Username = Context.textContent;
                                    if (!MTUsers[Username]) {
                                        MTUsers[Username] = [];
                                    }
                                    MTUsers[Username].push(Context);
                                }
                            }
                        }
                    } else {
                        Popup.Results.classList.remove("SMTags");
                        Matches = Popup.Results.querySelectorAll("a[href*='/user/']");
                        for (I = 0, N = Matches.length; I < N; ++I) {
                            Context = Matches[I];
                            Username = Context.textContent;
                            if (!MTUsers[Username]) {
                                MTUsers[Username] = [];
                            }
                            MTUsers[Username].push(Context);
                        }
                    }
                    addMTCheckboxes(MTUsers, "User", "beforeBegin", "previousElementSibling", MT);
                    SMManageTagsPopup.reposition();
                });
            });
        });
    }
    if (SMRecentUsernameChanges) {
        setSMRecentUsernameChanges(SMRecentUsernameChanges);
    }
    if (SMCommentHistory) {
        setSMCommentHistory(SMCommentHistory);
    }
    SMAPIKey.addEventListener("input", function() {
        GM_setValue("SteamAPIKey", SMAPIKey.value);
    });
}

function getSMFeature(Feature, mainId) {
    var Menu, Checkbox, CheckboxInput, SMFeatures, Key;
    Menu = document.createElement("div");
    var ID = Feature.id;
    Menu.insertAdjacentHTML(
        "beforeEnd",
        "<span></span>" + (ID.match(/_/) ? (
            "<span> " + Feature.name + "</span>") : (
            "<span class=\"popup__actions\">" +
            "    <a href=\"https://github.com/rafaelgs18/ESGST#" + Feature.name.replace(/(-|\s)/g, "-").replace(/\//g, "").toLowerCase() + "\" target=\"_blank\">" + Feature.name + "</a>" +
            "</span>")) +
        "<div class=\"form__row__indent SMFeatures rhHidden\"></div>"
    );
    Checkbox = Menu.firstElementChild;
    CheckboxInput = createCheckbox(Checkbox, GM_getValue(ID)).Checkbox;
    SMFeatures = Menu.lastElementChild;
    if (Feature.options) {
        for (var i = 0, n = Feature.options.length; i < n; ++i) {
            SMFeatures.appendChild(getSMFeature(Feature.options[i], Feature.id));
        }
    }
    if (mainId == `gc`) {
        var color = GM_getValue(`${Feature.id}_color`);
        var bgColor = GM_getValue(`${Feature.id}_bgColor`);
        var html = `
            <div class="esgst-sm-colors">
                Text: <input type="color" value="${color}">
                Background: <input type="color" value="${bgColor}">
            </div>
        `;
        SMFeatures.insertAdjacentHTML(`beforeEnd`, html);
        var colorContext = SMFeatures.lastElementChild.firstElementChild;
        var bgColorContext = colorContext.nextElementSibling;
        addColorObserver(colorContext, Feature.id, `color`);
        addColorObserver(bgColorContext, Feature.id, `bgColor`);
    }
    if (CheckboxInput.checked && SMFeatures.children.length) {
        SMFeatures.classList.remove("rhHidden");
    }
    Checkbox.addEventListener("click", function() {
        GM_setValue(ID, CheckboxInput.checked);
        if (CheckboxInput.checked && SMFeatures.children.length) {
            SMFeatures.classList.remove("rhHidden");
        } else {
            SMFeatures.classList.add("rhHidden");
        }
    });
    return Menu;
}

function addColorObserver(context, id, key) {
    context.addEventListener(`change`, function() {
        GM_setValue(`${id}_${key}`, context.value);
    });
}

function createSMSections(Sections) {
    var SectionsHTML, I, N;
    SectionsHTML = "";
    for (I = 0, N = Sections.length; I < N; ++I) {
        SectionsHTML +=
            "<div class=\"form__row\">" +
            "    <div class=\"form__heading\">" +
            "        <div class=\"form__heading__number\">" + (I + 1) + ".</div>" +
            "        <div class=\"form__heading__text\">" + Sections[I].Title + "</div>" +
            "    </div>" +
            "    <div class=\"form__row__indent" + (Sections[I].Name ? (" " + Sections[I].Name) : "") + "\">" + (Sections[I].HTML ? Sections[I].HTML : "") + "</div>" +
            "</div>";
    }
    return SectionsHTML;
}

function createSMButtons(Items) {
    var Heading, I, N, Item, Icons, J, NumIcons;
    Heading = document.getElementsByClassName("page__heading")[0];
    for (I = 0, N = Items.length; I < N; ++I) {
        Item = Items[I];
        if (Item.Check) {
            Icons = "";
            for (J = 0, NumIcons = Item.Icons.length; J < NumIcons; ++J) {
                Icons += "<i class=\"fa " + Item.Icons[J] + "\"></i> ";
            }
            Heading.insertAdjacentHTML("beforeEnd", "<a class=\"" + Item.Name + "\" title=\"" + Item.Title + "\">" + Icons + "</a>");
        }
    }
}

function importSMData(SM) {
    var File, Reader;
    File = document.createElement("input");
    File.type = "file";
    File.click();
    File.addEventListener("change", function() {
        File = File.files[0];
        if (File.name.match(/\.json/)) {
            Reader = new FileReader();
            Reader.readAsText(File);
            Reader.onload = function() {
                var Key, Setting;
                File = parseJSON(Reader.result);
                if ((File.rhSGST && (File.rhSGST == "Data")) || (File.ESGST && (File.ESGST == "Data"))) {
                    if (window.confirm("Are you sure you want to import this data? A copy will be downloaded as precaution.")) {
                        exportSMData(SM);
                        for (Key in File.Data) {
                            if (Key == "Settings") {
                                if (SM.S.checked) {
                                    for (Setting in File.Data.Settings) {
                                        GM_setValue(Setting, File.Data.Settings[Setting]);
                                    }
                                }
                            } else if (SM[SM.Names[Key]].checked) {
                                GM_setValue(Key, File.Data[Key]);
                            }
                        }
                        window.alert("Imported!");
                    }
                } else {
                    window.alert("Wrong file!");
                }
            };
        } else {
            window.alert("File should be in the .json format.");
        }
    });
}

function exportSMData(SM) {
    var File, Data, Key, URL;
    File = document.createElement("a");
    File.download = "ESGST.json";
    Data = {};
    for (Key in SM.Names) {
        if (SM[SM.Names[Key]].checked) {
            Data[Key] = GM_getValue(Key);
        }
    }
    if (SM.S.checked) {
        Data.Settings = {};
        for (var i = 0, n = esgst.features.length; i < n; ++i) {
            Data.Settings[esgst.features[i].id] = esgst[esgst.features[i].id];
            if (esgst.features[i].options) {
                for (var j = 0, numO = esgst.features[i].options; j < numO; ++j) {
                    Data.Settings[esgst.features[i].options[j].id] = esgst[esgst.features[i].options[j].id];
                }
            }
        }
    }
    Data = new Blob([JSON.stringify({
        ESGST: "Data",
        Data: Data
    })]);
    URL = window.URL.createObjectURL(Data);
    File.href = URL;
    document.body.appendChild(File);
    File.click();
    File.remove();
    window.URL.revokeObjectURL(URL);
    window.alert("Exported!");
}

function exportSMSettings(Data, Key, Feature) {
    Data[Key] = GM_getValue(Key);
    for (Key in Feature) {
        if (Key != "Name") {
            exportSMSettings(Data, Key, Feature[Key]);
        }
    }
}

function deleteSMData(SM) {
    var Key;
    if (window.confirm("Are you sure you want to delete this data? A copy will be downloaded as precaution.")) {
        exportSMData(SM);
        for (Key in SM.Names) {
            if (SM[SM.Names[Key]].checked) {
                GM_deleteValue(Key);
            }
        }
        if (SM.S.checked) {
            for (Key in Features) {
                deleteSMSettings(Key, Features[Key]);
            }
        }
        window.alert("Deleted!");
    }
}

function deleteSMSettings(Key, Feature) {
    for (Key in Feature) {
        if (Key != "Name") {
            deleteSMSettings(Key, Feature[Key]);
        }
    }
}

function setSMRecentUsernameChanges(SMRecentUsernameChanges) {
    SMRecentUsernameChanges.addEventListener("click", function() {
        var Popup, SMRecentUsernameChangesPopup;
        Popup = createPopup(true);
        Popup.Results.classList.add("SMRecentUsernameChangesPopup");
        Popup.Icon.classList.add("fa-comments");
        Popup.Title.textContent = "Recent Username Changes";
        Popup.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Loading recent username changes...</span>";
        makeRequest(null, "https://script.google.com/macros/s/AKfycbzvOuHG913mRIXOsqHIeAuQUkLYyxTHOZim5n8iP-k80iza6g0/exec?Action=2", Popup.Progress, function(Response) {
            var RecentChanges, HTML, I, N;
            Popup.Progress.innerHTML = "";
            RecentChanges = parseJSON(Response.responseText).RecentChanges;
            HTML = "";
            for (I = 0, N = RecentChanges.length; I < N; ++I) {
                HTML += "<div>" + RecentChanges[I][0] + " changed to <a class=\"rhBold\" href=\"/user/" + RecentChanges[I][1] + "\">" + RecentChanges[I][1] + "</a></div>";
            }
            Popup.Results.innerHTML = HTML;
            if (esgst.sg) {
                loadEndlessFeatures(Popup.Results);
            }
            SMRecentUsernameChangesPopup.reposition();
        });
        SMRecentUsernameChangesPopup = Popup.popUp();
    });
}

function setSMCommentHistory(SMCommentHistory) {
    SMCommentHistory.addEventListener("click", function() {
        var Popup;
        Popup = createPopup(true);
        Popup.Popup.style.width = "600px";
        Popup.Icon.classList.add("fa-comments");
        Popup.Title.textContent = "Comment History";
        Popup.Results.classList.add("SMComments");
        Popup.Results.innerHTML = GM_getValue("CommentHistory");
        if (esgst.at) {
            loadAccurateTimestamps(Popup.Results);
        }
        Popup.popUp();
    });
}

