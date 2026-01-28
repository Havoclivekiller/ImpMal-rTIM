export class VoidcombatSettings extends HandlebarsApplicationMixin(ApplicationV2)
{
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["impmal-rtim","warhammer","voidcombatSettings"],
        window: {
            title: "IMPMAL_RTIM.VoidCombat.Settings.Name",
            contentClasses : ["standard-form"],
            resizable : true,
        },
        position : {
            width: 600
        },
        form: {
            submitOnChange: false,
            closeOnSubmit : true,
            handler: this.submit
        },
        actions : {
            reset : this._onReset
        }
    }

    /** @override */
    static PARTS = {
        form: {
            template: "modules/impmal-rtim/voidcombat/templates/voidcombat-settings.hbs",
            scrollable: [""]
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    };

    static #schema = new foundry.data.fields.SchemaField({
        randomDamaged : new foundry.data.fields.BooleanField({
            initial : true, 
            isTable : false,
            label : "IMPMAL_RTIM.VoidCombat.Settings.RandomDamage.Label", 
            hint :"IMPMAL_RTIM.VoidCombat.Settings.RandomDamage.Hint"
        }),
        tokenDragMove : new foundry.data.fields.BooleanField({
            initial : true, 
            isTable : false,
            label : "IMPMAL_RTIM.VoidCombat.Settings.TokenDragMove.Label", 
            hint :"IMPMAL_RTIM.VoidCombat.Settings.TokenDragMove.Hint"
        }),
        voidshipCriticalTable : new foundry.data.fields.StringField({
            initial : "5jxoqStV9YSRL4g5", 
            isTable : true,
            label : "IMPMAL_RTIM.VoidCombat.Settings.VoidshipCriticalTable.Label", 
            hint :"IMPMAL_RTIM.VoidCombat.Settings.VoidshipCriticalTable.Hint"
        }),
        voidshipCatastrophicTable : new foundry.data.fields.StringField({
            initial : "EZuCX0aW4QXkzb5a", 
            isTable : true,
            label : "IMPMAL_RTIM.VoidCombat.Settings.VoidshipCatastrophicTable.Label", 
            hint :"IMPMAL_RTIM.VoidCombat.Settings.VoidshipCatastrophicTable.Hint"
        }),
    })

    static get schema()
    {
        return this.#schema
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.settings = game.settings.get("impmal-rtim", "voidcombatSettings");
        context.schema = this.constructor.schema;
        context.tables = game.tables.contents.reduce((tables, t) => {tables[t._id] = t.name; return tables}, {});
        context.buttons = [
            {
              type: "button",
              icon: "fa-solid fa-arrow-rotate-left",
              label: "Reset",
              action: "reset"
            },
            {type: "submit", icon: "fa-solid fa-floppy-disk", label: "SETTINGS.Save"}];
        return context
    }


    static async submit(event, form, formData) {
        return game.settings.set("impmal-rtim", "voidcombatSettings", formData.object)
    }

    static async _onReset(ev, target)
    {
        let defaults = {};

        for(let setting in this.constructor.schema.fields)
        {
            defaults[setting] = this.constructor.schema.fields[setting].initial;
        }

        await game.settings.set("impmal-rtim", "voidcombatSettings", defaults);
        this.render(true);
    }

}