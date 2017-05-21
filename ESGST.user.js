// ==UserScript==
// @name ESGST
// @namespace ESGST
// @description Enhances SteamGifts and SteamTrades by adding some cool features to them.
// @version 6.Beta.0.1
// @author revilheart
// @contributor Royalgamer06
// @downloadURL https://github.com/revilheart/ESGST/raw/master/ESGST.user.js
// @updateURL https://github.com/revilheart/ESGST/raw/master/ESGST.meta.js
// @match https://www.steamgifts.com/*
// @match https://www.steamtrades.com/*
// @connect api.steampowered.com
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
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/HelperFunctions.v6.0.1.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Other/HeaderButton.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Other/SettingsMenu.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/FixedHeader.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/FixedSidebar.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/FixedMainPageHeading.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/FixedFooter.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/HeaderIconsRefresher.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/HiddenBlacklistStats.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/VisibleAttachedImages.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/EmbeddedVideos.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/AccurateTimestamps.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/PaginationNavigationOnTop.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/General/EndlessScrolling.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/DeliveredGiftsNotifier.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/PointsRefresher.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/HiddenFeaturedContainer.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/AdvancedGiveawaySearch.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/PinnedGiveawaysButton.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/GridView.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/EnteredGiveawaysFilter.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/GiveawayPanel.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/GiveawayGroupsPopup.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/GiveawayTemplates.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/StickiedGiveawayGroups.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/UnsentGiftsSender.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/EntriesRemover.v5.0.2.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/GiveawayWinnersLink.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/GiveawayErrorSearchLinks.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Giveaways/ArchiveSearcher.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Discussions/ActiveDiscussionsOnTop.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Discussions/DiscussionsHighlighter.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Discussions/MainPostPopup.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Discussions/DiscussionEditDetector.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Commenting/CommentHistory.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Commenting/CommentTracker.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Commenting/CommentFormattingHelper.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Commenting/ReplyBoxOnTop.v6.0.0.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Commenting/ReplyBoxPopup.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Commenting/MultiReply.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/Commenting/ReplyMentionLink.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/AvatarPopout.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/UsernameHistory.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/UserNotes.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/RealWonSentCVLinks.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/UserGiveawaysData.v5.0.1.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/NotActivatedMultipleWinsChecker.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/NotReceivedFinder.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/SentWonRatio.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/LevelUpCalculator.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/SteamGiftsProfileButton.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/SteamTradesProfileButton.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/SharedGroupsChecker.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/WhitelistBlacklistChecker.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/WhitelistBlacklistHighlighter.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/UserTags.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/InboxWinnersHighlighter.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/GroupsHighlighter.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/GroupsStats.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/GamesHighlighter.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/GameTags.v5.js
// @require https://github.com/revilheart/ESGST/raw/master/Scripts/Features/UsersGroupsGames/MultiTag.v5.js
// @resource style https://github.com/revilheart/ESGST/raw/master/Resources/style.v6.0.0.css
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
// @run-at document-idle
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
