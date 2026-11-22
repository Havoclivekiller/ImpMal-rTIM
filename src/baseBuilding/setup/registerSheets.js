import BaseBuildingActorSheet from '../actor/baseBuildingActorSheet.js';
import ModuleItemSheet from '../item/moduleItemSheet.js';

export const registerSheets = () => {
    foundry.documents.collections.Actors.registerSheet('impmal-rtim', BaseBuildingActorSheet, {
        types: ['impmal-rtim.baseBuilding'],
        makeDefault: true
    });
    foundry.documents.collections.Items.registerSheet('impmal-rtim', ModuleItemSheet, {
        types: ['impmal-rtim.module'],
        makeDefault: true
    });
};
