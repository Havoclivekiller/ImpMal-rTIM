export const SQUAD_TYPE = "impmal-rtim.squad";

// rTIM - Group Up!, pp. 1-2. Index is the number of surviving members.
const SL = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 5];

export function squadBonuses(members) {
    return {
        SL: SL[members] ?? 0,
        damage: members > 1 ? Math.floor(members / 2) : 0,
        actions: members >= 9 ? 2 : members >= 5 ? 1 : 0,
        size: members >= 7 ? 2 : members >= 3 ? 1 : 0
    };
}

/** Elites take two squad Critical Wounds per casualty, independent of NPC injuries. */
export function resolveSquadWounds({ members, wounds, criticals, woundThreshold, role }, gained, { overflow = false, criticalHits = 0 } = {}) {
    let total = wounds + Math.max(0, gained);
    let addedCriticals = Math.max(0, Math.trunc(criticalHits));
    const allowOverflow = overflow || role === "elite";
    if (woundThreshold > 0 && total >= woundThreshold) {
        addedCriticals += allowOverflow ? Math.floor(total / woundThreshold) : 1;
        total = allowOverflow ? total % woundThreshold : 0;
    }

    const perMember = role === "elite" ? 2 : 1;
    const accumulated = criticals + addedCriticals;
    const lost = Math.min(members, Math.floor(accumulated / perMember));
    members -= lost;
    return {
        members,
        wounds: members ? total : 0,
        criticals: members ? accumulated % perMember : 0,
        lost,
        addedCriticals
    };
}

/** Copy raw data, preserving embedded IDs and rebasing references into the copy. */
export function buildSquadProfile(source, targetUuid, members) {
    const data = source.toObject();
    const oldUuids = [source.uuid];
    // Compendium profiles can retain world-style origins for their embedded effects.
    if (source.id || data._id) oldUuids.push(`Actor.${source.id || data._id}`);
    const rebase = value => {
        if (typeof value === "string") {
            // Covers origins, script data and enriched links without touching unrelated IDs.
            for (const oldUuid of oldUuids) {
                if (value === oldUuid) return targetUuid;
                value = value.split(`${oldUuid}.`).join(`${targetUuid}.`)
                    .split(`@UUID[${oldUuid}]`).join(`@UUID[${targetUuid}]`);
            }
            return value;
        }
        if (Array.isArray(value)) return value.map(rebase);
        if (value && typeof value === "object") {
            return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, rebase(entry)]));
        }
        return value;
    };
    const profile = rebase({
        img: data.img,
        system: data.system,
        items: data.items.filter(item => item.type !== "critical"),
        effects: data.effects,
        prototypeToken: data.prototypeToken,
        // Sheet selection and runtime opposed-test flags belong to the source actor.
        flags: foundry.utils.deepClone(data.flags || {})
    });
    delete profile.flags.core?.sheetClass;
    delete profile.flags.impmal?.opposed;
    delete profile.flags["impmal-rtim"];
    const excludedOrigins = data.items.filter(item => item.type === "critical").map(item => `${targetUuid}.Item.${item._id}`);
    profile.effects = profile.effects.filter(effect => !excludedOrigins.includes(effect.origin));
    profile.system.combat.wounds.value = 0;
    profile.system.combat.criticals.value = 0;
    profile.system.squad = { members: { value: members.value, max: 10 }, criticals: 0, source: { uuid: source.uuid, name: source.name } };
    profile.prototypeToken.actorLink = false;
    delete profile.prototypeToken._id;
    delete profile.prototypeToken.actorId;
    return profile;
}
