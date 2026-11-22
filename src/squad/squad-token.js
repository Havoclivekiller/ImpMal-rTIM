import { SQUAD_TYPE } from "./squad-rules.js";

export function squadTokenDimensions(size) {
    const dimension = { large: 2, enormous: 3, monstrous: 4 }[size] ?? 1;
    return { width: dimension, height: dimension, depth: dimension };
}

/** Resize only tokens which share this actor's current Squad data. */
export async function resizeSquadTokens(actor) {
    if (!actor.system.autoCalc.autoResizeToken) return;
    const dimensions = squadTokenDimensions(actor.system.combat.size);
    const needsResize = token => Object.entries(dimensions).some(([key, value]) => token[key] !== value);
    if (actor.isToken) {
        if (needsResize(actor.token)) await actor.token.update(dimensions);
        return;
    }

    if (needsResize(actor.prototypeToken)) {
        await actor.update({ prototypeToken: dimensions }, { squadTokenResize: true });
    }
    for (const token of actor.getDependentTokens({ linked: true, concreteOnly: true })) {
        if (needsResize(token)) await token.update(dimensions);
    }
}

export function resizeNewSquadToken(token) {
    const actor = token.actor;
    if (actor?.type !== SQUAD_TYPE || !actor.system.autoCalc.autoResizeToken) return;
    token.updateSource(squadTokenDimensions(actor.system.combat.size));
}

export function registerSquadTokenResize() {
    Hooks.on("preCreateToken", resizeNewSquadToken);
}
