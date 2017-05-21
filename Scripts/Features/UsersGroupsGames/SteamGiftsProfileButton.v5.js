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
