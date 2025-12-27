export default class ModuleItemSheet extends IMItemSheet {
    static DEFAULT_OPTIONS = {
        classes: [this.type]
    };

    static PARTS = {
        header: {
            scrollable: [''],
            template: 'modules/impmal-rtim/baseBuilding/templates/module/module-header.hbs',
            classes: ['sheet-header']
        },
        tabs: { scrollable: [''], template: 'templates/generic/tab-navigation.hbs' },
        main: {
            scrollable: [''],
            template: 'modules/impmal-rtim/baseBuilding/templates/module/module-details.hbs'
        },
        description: { scrollable: [''], template: 'systems/impmal/templates/item/item-description.hbs' }
    };

    static TABS = {
        main: {
            id: 'main',
            group: 'primary',
            label: 'IMPMAL.Description'
        },
        description: {
            id: 'description',
            group: 'primary',
            label: 'IMPMAL.Details'
        }
    };

    async _prepareContext(options) {
        let context = await super._prepareContext(options);

        context.enriched = foundry.utils.expandObject({
            'notes.player': await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                context.item.system.notes?.player,
                {
                    relativeTo: this.item,
                    async: true
                }
            ),
            'notes.gm': await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                context.item.system.notes?.gm,
                {
                    relativeTo: this.item,
                    async: true
                }
            ),
            'levelZeroEffect': await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                context.item.system.levelZeroEffect,
                {
                    relativeTo: this.item,
                    async: true
                }
            ),
            'levelOneEffect': await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                context.item.system.levelOneEffect,
                {
                    relativeTo: this.item,
                    async: true
                }
            ),
            'levelTwoEffect': await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                context.item.system.levelTwoEffect,
                {
                    relativeTo: this.item,
                    async: true
                }
            ),
            'levelThreeEffect': await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                context.item.system.levelThreeEffect,
                {
                    relativeTo: this.item,
                    async: true
                }
            ),
            'levelFourEffect': await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                context.item.system.levelFourEffect,
                {
                    relativeTo: this.item,
                    async: true
                }
            ),
            'levelFiveEffect': await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                context.item.system.levelFiveEffect,
                {
                    relativeTo: this.item,
                    async: true
                }
            )
        });

        return context;
    }
}
