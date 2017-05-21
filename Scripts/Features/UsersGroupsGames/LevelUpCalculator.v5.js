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
