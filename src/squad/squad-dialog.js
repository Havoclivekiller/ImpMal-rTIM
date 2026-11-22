import { SQUAD_TYPE } from "./squad-rules.js";

/** Add native, independently selectable dialog scripts, scoped to this roll. */
export function addSquadDialogBonuses(dialog) {
    const actor = dialog.actor;
    if (!(dialog instanceof TestDialog) || actor?.type !== SQUAD_TYPE || !actor.system.isSquad) return;
    const activeSquad = `args.actor?.type === "${SQUAD_TYPE}" && args.actor.system.isSquad`;
    const conditionDebuff = new WarhammerScript({
        label: game.i18n.localize("IMPMAL_RTIM.Squad.ConditionDebuff"),
        trigger: "dialog",
        script: `if (${activeSquad}) args.fields.SL = Number(args.fields.SL || 0) - 1;`,
        options: {
            hideScript: `return !(${activeSquad});`,
            activateScript: "return false;"
        }
    }, WarhammerScript.createContext(actor));
    // Offer the manual debuff on every test; Availability has no Squad bonuses.
    if (dialog instanceof AvailabilityDialog) {
        dialog.data.scripts.push(conditionDebuff);
        return;
    }
    const makeScript = (field, label, activateScript) => new WarhammerScript({
        label: `${game.i18n.localize(label)} (+@actor.system.squad.bonuses.${field})`,
        trigger: "dialog",
        script: `if (${activeSquad}) {
            args.fields.${field} = Number(args.fields.${field} || 0) + Number(args.actor.system.squad.bonuses.${field} || 0);
        }`,
        options: {
            hideScript: `return !(${activeSquad});`,
            activateScript
        }
    }, WarhammerScript.createContext(actor));

    dialog.data.scripts.push(makeScript("SL", "IMPMAL_RTIM.Squad.DialogSL", `
        return args instanceof AttackDialog || Boolean(args.actor.defendingAgainst || args.context.dodge)
            || ["melee", "ranged", "awareness", "discipline", "fortitude"].includes(args.data.skill)
            || (!args.data.skill && ["ws", "bs"].includes(args.fields.characteristic || args.data.characteristic));
    `));
    // AttackTest maps fields.damage to additionalDamage for both weapons and traits.
    if (dialog instanceof AttackDialog) {
        dialog.data.scripts.push(makeScript("damage", "IMPMAL_RTIM.Squad.DialogDamage", "return args.isAttack;"));
    }
    dialog.data.scripts.push(conditionDebuff);
}

export function registerSquadDialogBonuses() {
    Hooks.on("impmal:createRollDialog", addSquadDialogBonuses);
}
