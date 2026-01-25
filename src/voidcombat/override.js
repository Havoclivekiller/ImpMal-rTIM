
export function registerOverride()
{
    //Due to how the ImpMalTables are static/private, we can't override them easily, so we need to override the method that gets the table.
    let old_findTable = ImpMalTables.findTable;
    
    ImpMalTables.findTable = (key) => {
        let table = old_findTable.call(this, key);
        if (!table)
        {
            if (key === "critvoidship") return game.tables.get("5jxoqStV9YSRL4g5"); //TODO: add tables to settings. get their ids from there
            if (key === "catastrophicvoidship") return game.tables.get("EZuCX0aW4QXkzb5a");
        }
        return table;
    };

    Handlebars.registerHelper('times', function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    });

    Handlebars.registerHelper('floor', (a) => Math.floor(a));
    Handlebars.registerHelper('ceil', (a) => Math.ceil(a));
    Handlebars.registerHelper('max', (a, b) => Math.max(a, b));
    Handlebars.registerHelper('min', (a, b) => Math.min(a, b));
}