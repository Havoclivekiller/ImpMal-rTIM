export class VoidShipPartSheet extends IMItemSheet {

    static type = "impmal-rtim.voidshipPart"

    static DEFAULT_OPTIONS = {
      classes: ["voidship"],
      actions : {
      }
    }

    static PARTS = {
        header: { scrollable: [""], template: 'modules/impmal-rtim/voidcombat/templates/voidship-part/voidship-part-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        description: { scrollable: [""], template: 'modules/impmal-rtim/voidcombat/templates/voidship-part/voidship-part-notes.hbs' },
        details: { scrollable: [""], template: `modules/impmal-rtim/voidcombat/templates/voidship-part/voidship-part-details.hbs` },
        effects: { scrollable: [""], template: 'modules/impmal-rtim/voidcombat/templates/voidship-part/voidship-part-effects.hbs' },
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        return context;
    }

    async _onRender(options)
    {
        await super._onRender(options);

        this.element.querySelectorAll("[data-action='editItemProperty']").forEach(element => 
        {
            element.addEventListener(element.type !== "button" ? "change" : "click", this.constructor._onEditItemProperty.bind(this));
        });
    }

    static async _onEditItemProperty(ev, target)
    {
        let document = (await this._getDocumentAsync(ev, target)) || this.document;
        let path = ev.target.dataset.path;
        let itemId = ev.target.dataset.id;
        if (document.id !== itemId) return;
        let value = ev.target.value;
        if (ev.target.type == "number" && value == "")
        {
            value = 0;
        }
        else if (ev.target.type == "number")
        {
            value = Number(ev.target.value);
        }
        if (ev.target.type == "checkbox")
        {
            value = ev.target.checked;
        }
        document.update({[path] : value});
    }
}
