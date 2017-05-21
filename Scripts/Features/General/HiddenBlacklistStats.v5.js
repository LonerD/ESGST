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
