export default class BaseBuildingActorSheet extends IMActorSheet {
    static PARTS = {
        header: {
            scrollable: [''],
            template: 'modules/impmal-rtim/baseBuilding/templates/baseBuilding/baseBuilding-header.hbs',
            classes: ['sheet-header']
        },
        tabs: { scrollable: [''], template: 'templates/generic/tab-navigation.hbs' },
        main: {
            scrollable: [''],
            template: 'modules/impmal-rtim/baseBuilding/templates/baseBuilding/baseBuilding-modules.hbs'
        },
        equipment: { scrollable: [''], template: 'systems/impmal/templates/actor/tabs/actor-equipment.hbs' }
    };

    static TABS = {
        main: {
            id: 'main',
            group: 'primary',
            label: 'impmal-rtim-base-building.module.name'
        },
        equipment: {
            id: 'equipment',
            group: 'primary',
            label: 'IMPMAL.Details'
        }
    };

    async _prepareContext(options) {
        let context = await super._prepareContext(options);

        context.modules = this.organizeModules(context);
        context.actor.system.totalLevels = context.modules.reduce((levels, module) => levels + module.system.level, 0);
        return context;
    }

    organizeModules(context) {
        return context.actor.items.filter(item => item.type === 'impmal-rtim.module');
    }
}
