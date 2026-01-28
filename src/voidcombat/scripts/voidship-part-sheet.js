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
    }
}
