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
