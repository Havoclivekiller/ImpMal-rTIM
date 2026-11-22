import { SquadModel } from "./squad-model.js";
import { SquadSheet } from "./squad-sheet.js";
import { SQUAD_TYPE } from "./squad-rules.js";
import { registerSquadDialogBonuses } from "./squad-dialog.js";
import { registerSquadTokenResize } from "./squad-token.js";

registerSquadDialogBonuses();
registerSquadTokenResize();
CONFIG.Actor.dataModels[SQUAD_TYPE] = SquadModel;
foundry.documents.collections.Actors.registerSheet("impmal-rtim", SquadSheet, {
    types: [SQUAD_TYPE], makeDefault: true, label: "IMPMAL_RTIM.Squad.Name"
});
