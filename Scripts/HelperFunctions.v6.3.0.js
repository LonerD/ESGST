function loadEsgst() {
    var style = GM_getResourceText(`style`);
    GM_addStyle(style);
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
        checkSync();
        updateGroups();
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
    esgst.sidebarAd = document.getElementsByClassName(`sidebar__mpu`)[0];
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
    esgst.videoTypes = [
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
    ];
    esgst.dateMonths = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
    esgst.pageTop = 25;
    esgst.commentsTop = 0;
    esgst.APBoxes = {};
    esgst.users = {};
    esgst.games = {};
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
        gv: `GV`,
        egf: `EGF`,
        gp: `gp`,
        gpGwc: `GWC`,
        gpGdrbp: `GDCBP`,
        gpElgb: `ELGB`,
        gpGdrbp_eg: `GDCBP_EG`,
        gpGdrbp_d: `GDCBP_D`,
        ggp: `GGP`,
        gt: `GTS`,
        sgg: `SGG`,
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
        gc_tc: `gc_tc`,
        gc_a: `gc_a`,
        gc_mp: `gc_mp`,
        gc_sc: `gc_sc`,
        gc_dlc: `gc_dlc`,
        gc_l: `gc_l`,
        gc_m: `gc_m`,
        gc_g: `gc_g`,
        mt: `MT`
    };
    esgst.defaultValues = {
        sm_hb: true,
        sm_ebd: true,
        gp: true,
        gc_b_color: `#ffffff`,
        gc_w_color: `#ffffff`,
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
        gc_tc_bgColor: `#1a5276`,
        gc_a_bgColor: `#117864`,
        gc_mp_bgColor: `#212f3c`,
        gc_sc_bgColor: `#196f3d`,
        gc_l_bgColor: `#9a7d0a`,
        gc_m_bgColor: `#935116`,
        gc_dlc_bgColor: `#63397a`,
        gc_g_bgColor: `#5f6a6a`,
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
            load: loadEmbeddedVideos,
            endless: true
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
            id: `gv`,
            name: `Grid View`,
            check: getValue(`gv`) && esgst.giveawaysPath,
            load: loadGridView,
            endless: true
        },
        {
            id: `egf`,
            name: `Entered Giveaways Filter`,
            check: getValue(`egf`) && esgst.giveawaysPath,
            load: loadEnteredGiveawaysFilter,
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
    loadFeatures();
    goToComment(esgst.originalHash);
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
    } else if (SyncFrequency && ((CurrentDate - GM_getValue("LastSync")) > (SyncFrequency * 86400000))) {
        setSync(CurrentDate, Update, Callback);
    }
}

function setSync(CurrentDate, Update, Callback) {
    var Popup, Sync;
    GM_setValue("LastSync", CurrentDate);
    Popup = createPopup(Update ? false : true);
    Popup.Icon.classList.add("fa-refresh");
    Popup.Title.textContent = Update ? "Syncing..." : "ESGST is performing the automatic sync. Please do not close the popup or reload / close the tab until it has finished.";
    Sync = {};
    createButton(Popup.Button, "fa-times-circle", "Cancel", "", "", function() {
        Sync.Canceled = true;
        Popup.Close.click();
    }, null, true);
    Sync.Progress = Popup.Progress;
    Sync.OverallProgress = Popup.OverallProgress;
    Popup.popUp().reposition();
    sync(Sync, function(CurrentDate) {
        Popup.Icon.classList.remove("fa-refresh");
        Popup.Icon.classList.add("fa-check");
        Popup.Title.textContent = Update ? "Synced!" : "Automatic sync finished. You can now close the popup or reload / close the tab.";
        Popup.Button.innerHTML = "";
        Sync.Progress.innerHTML = Sync.OverallProgress.innerHTML = "";
        if (Update) {
            Popup.Close.click();
            Callback(CurrentDate);
        }
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
            syncOwnedGames(Sync, function() {
                syncWishlist(Sync, function() {
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

function syncWishlist(Sync, Callback) {
    var games = GM_getValue(`Games`);
    for (key in games) {
        delete games[key].wishlist;
    }
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

function syncOwnedGames(Sync, Callback) {
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

function setFadedGiveaway(Context) {
    Context.classList.remove("is-faded");
    Context.classList.add("rhFaded");
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
            id: `gc_tc`,
            key: `tradingCards`
        },
        {
            id: `gc_a`,
            key: `achievements`
        },
        {
            id: `gc_m`,
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
        ".rhFaded .giveaway__summary >:not(.GPPanel):not(.giveaway__columns), .rhFaded .giveaway__columns >:not(.GGPContainer), .rhFaded .global__image-outer-wrap--game-medium {" +
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
