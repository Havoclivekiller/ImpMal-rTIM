import { buildSquadProfile, resolveSquadWounds, squadBonuses } from "./squad-rules.js";
import { resizeSquadTokens, squadTokenDimensions } from "./squad-token.js";

export class SquadModel extends NPCModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = super.defineSchema();
        schema.autoCalc.fields.autoResizeToken = new fields.BooleanField({
            initial: true, label: "IMPMAL_RTIM.Squad.AutoResizeToken"
        }, { name: "autoResizeToken", parent: schema.autoCalc });
        schema.squad = new fields.SchemaField({
            members: new fields.SchemaField({
                value: new fields.NumberField({ required: true, nullable: false, integer: true, min: 0, max: 10, initial: 5 }),
                max: new fields.NumberField({ required: true, nullable: false, integer: true, min: 10, max: 10, initial: 10 })
            }),
            criticals: new fields.NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 }),
            source: new fields.SchemaField({
                uuid: new fields.StringField(),
                name: new fields.StringField()
            })
        });
        return schema;
    }

    static migrateData(source) {
        source = super.migrateData(source);
        if (typeof source.squad?.members === "number") {
            source.squad.members = { value: source.squad.members, max: 10 };
        }
        else if (source.squad?.members) source.squad.members.max = 10;
        return source;
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        if (!data.system?.role) this.parent.updateSource({ "system.role": "troop" });
        if (!data.system?.combat?.size) this.parent.updateSource({ "system.combat.size": "medium" });
        if (this.autoCalc.autoResizeToken) {
            this.parent.updateSource({ prototypeToken: squadTokenDimensions(this.combat.size) });
        }
    }

    get isSquad() {
        return this.squad.members.value > 1;
    }

    computeBase() {
        super.computeBase();
        // The final survivor resumes NPC rules with any remaining critical progress.
        if (!this.isSquad) this.combat.criticals.value += this.squad.criticals;
    }

    computeDerived() {
        super.computeDerived();
        this.squad.bonuses = squadBonuses(this.squad.members.value);
        this.squad.woundThreshold = this.combat.wounds.max;
        this.squad.criticalThreshold = this.role === "elite" ? 2 : 1;
        if (!this.isSquad) return;

        const sizes = Object.keys(game.impmal.config.sizes);
        const baseIndex = sizes.indexOf(this.combat.size);
        if (baseIndex >= 0) this.combat.size = sizes[Math.min(sizes.length - 1, baseIndex + this.squad.bonuses.size)];
        this.combat.resolve = Math.min(this.role === "elite" ? 5 : 4, this.combat.resolve + 1);
    }

    _resolveWounds(gained, options) {
        return resolveSquadWounds({
            members: this.squad.members.value,
            wounds: this.combat.wounds.value,
            criticals: this.squad.criticals,
            woundThreshold: this.combat.wounds.max,
            role: this.role
        }, gained, options);
    }

    _woundUpdate(result) {
        return {
            "system.squad.members.value": result.members,
            "system.squad.criticals": result.criticals,
            "system.combat.wounds.value": result.wounds
        };
    }

    async _preUpdate(data, options, user) {
        options.squadPreviousSize = this.combat.size;
        // Resolve before StandardActorModel clamps Wounds, including direct sheet edits.
        const wounds = foundry.utils.getProperty(data, "system.combat.wounds.value");
        const criticals = foundry.utils.getProperty(data, "system.squad.criticals");
        if (foundry.utils.getProperty(data, "system.squad.members.max") !== undefined) {
            foundry.utils.setProperty(data, "system.squad.members.max", 10);
        }
        const maxMembers = 10;
        let members = foundry.utils.getProperty(data, "system.squad.members.value") ?? this.squad.members.value;
        if (members > maxMembers) {
            members = maxMembers;
            foundry.utils.setProperty(data, "system.squad.members.value", members);
        }
        if (members > 1 && !options.squadResolved && !options.squadImport
            && (criticals !== undefined || (wounds >= this.combat.wounds.max && this.combat.wounds.max > 0))) {
            const result = resolveSquadWounds({
                members, wounds: wounds ?? this.combat.wounds.value,
                criticals: criticals ?? this.squad.criticals, woundThreshold: this.combat.wounds.max,
                role: foundry.utils.getProperty(data, "system.role") ?? this.role
            }, 0);
            for (const [key, value] of Object.entries(this._woundUpdate(result))) foundry.utils.setProperty(data, key, value);
        }
        return super._preUpdate(data, options, user);
    }

    async _onUpdate(data, options, user) {
        await super._onUpdate(data, options, user);
        if (user !== game.user.id || options.squadTokenResize || !this.autoCalc.autoResizeToken) return;
        const enabled = foundry.utils.getProperty(data, "system.autoCalc.autoResizeToken") === true;
        if (this.combat.size !== options.squadPreviousSize || enabled || options.squadImport) {
            await resizeSquadTokens(this.parent);
        }
    }

    /** Manual adjustment for Critical Wounds outside the normal attack damage flow. */
    async applySquadCritical() {
        if (!this.parent.isOwner || !this.isSquad) return;
        return this.parent.update(this._woundUpdate(this._resolveWounds(0, { criticalHits: 1 })), { squadResolved: true });
    }

    // Adapted from ImpMal 4.1.0 StandardActorModel.applyDamage. Keep its damage
    // hooks, protection and return contract; resolve casualties instead of injury rolls.
    async applyDamage(value, { ignoreAP = false, location = "roll", message = false, opposed, update = true, context = {}, traits = null } = {}) {
        if (!this.squad.members.value) return {
            damage: 0, woundsGained: 0, critical: false, excess: 0,
            text: game.i18n.localize("IMPMAL_RTIM.Squad.Defeated"), updateData: {}, modifiers: [], message: null
        };
        if (!this.isSquad) return super.applyDamage(value, { ignoreAP, location, message, opposed, update, context, traits });
        traits = traits ?? opposed?.attackerTest?.itemTraits;
        // Keep the original trait collection untouched (including for subsequent targets).
        const rend = Math.floor(Number(traits?.has("rend")?.value || 0) / 2);
        traits = traits ? new Proxy(traits, {
            get(target, key) {
                if (key === "has") return name => {
                    if (name === "rend") return undefined;
                    if (name === "penetrating" && rend) return { value: Number(target.has(name)?.value || 0) + rend };
                    return target.has(name);
                };
                const property = Reflect.get(target, key, target);
                return typeof property === "function" ? property.bind(target) : property;
            }
        }) : null;
        const isZone = Boolean(context.squadZone || context.hazard);
        const isSpread = Boolean(traits?.has("spread") || context.impmalCommunitySpread
            || opposed?.attackerTest?.result?.fireMode === "rapidFireSpread");
        const multiplier = traits?.has("blast") || isZone ? 4 : isSpread ? 2 : 1;
        let overflow = multiplier > 1;
        value *= multiplier;

        let modifiers = [];
        let locationKey;
        if (typeof location === "string") {
            locationKey = location === "roll" ? this.combat.randomHitLoc() : location;
        } else if (typeof location === "number") {
            locationKey = this.combat.hitLocAt(location);
        }
        const locationData = this.combat.hitLocations[locationKey];
        let penetrating = Number(traits?.has("penetrating")?.value || 0);

        let args = { actor: this.parent, value, ignoreAP, penetrating, modifiers, locationData, opposed, traits, context, overflow };
        await Promise.all(opposed?.attackerTest?.actor?.runScripts?.("preApplyDamage", args) || []);
        await Promise.all(opposed?.attackerTest?.item?.runScripts?.("preApplyDamage", args) || []);
        await Promise.all(this.parent.runScripts("preTakeDamage", args));
        value = args.value;
        ignoreAP = args.ignoreAP;
        penetrating = args.penetrating;
        if (args.overflow) overflow = true;

        let woundsGained = value;
        let armourRoll;
        if (locationData.field) {
            await locationData.field.system.applyField(value, modifiers);
        }

        const shieldBrace = opposed?.shieldBrace ? (opposed.shieldBraceRating || 0) : 0;
        if (!ignoreAP && (locationData.armour || locationData.formula || shieldBrace)) {
            let armourValue = locationData.armour || 0;
            if (locationData.formula) {
                armourRoll = new Roll(locationData.formula);
                await armourRoll.roll();
                if (game.dice3d) game.dice3d.showForRoll(armourRoll);
                armourValue += armourRoll.total;
            }
            modifiers.push({ value: -armourValue, label: game.i18n.localize("IMPMAL.Protection"), armour: true });
            if (shieldBrace) {
                armourValue += shieldBrace;
                modifiers.push({ value: -shieldBrace, label: game.i18n.format("IMPMAL.ShieldBrace", { rating: shieldBrace }), armour: true });
            }
            if (penetrating) {
                modifiers.push({ value: Math.min(armourValue, penetrating), label: game.i18n.localize("IMPMAL.Penetrating") });
                armourValue = Math.max(0, armourValue - Number(penetrating || 0));
            }
            if (traits?.has("ineffective")) {
                modifiers.push({ value: -armourValue, label: game.i18n.localize("IMPMAL.Ineffective"), armour: true });
            }
        }

        for (const modifier of modifiers) {
            if (!modifier.applied && (!modifier.armour || !ignoreAP)) {
                woundsGained += Number(modifier.value || 0);
            }
        }
        woundsGained = Math.max(0, woundsGained);

        // A critical hit is additional to a Critical Wound caused by the threshold.
        // Spread's secondary attacks explicitly clear result.critical in their source test.
        const criticalHits = opposed?.attackerTest?.result?.critical && opposed?.result?.winner !== "defender" ? 1 : 0;
        const preliminary = this._resolveWounds(woundsGained, { overflow, criticalHits });
        args = {
            actor: this.parent, woundsGained, locationData, opposed,
            critModifier: opposed?.attackerTest?.result?.critModifier,
            excess: 0, critical: preliminary.addedCriticals > 0, criticalHits,
            text: "", modifiers, context
        };
        await Promise.all(opposed?.attackerTest?.actor?.runScripts?.("applyDamage", args) || []);
        await Promise.all(opposed?.attackerTest?.item?.runScripts?.("applyDamage", args) || []);
        await Promise.all(this.parent.runScripts("takeDamage", args));
        woundsGained = Math.max(0, Number(args.woundsGained) || 0);
        // Scripts may change damage: resolve thresholds from their final Wounds value.
        const result = this._resolveWounds(woundsGained, {
            overflow, criticalHits: args.critical ? Math.max(0, Math.trunc(Number(args.criticalHits) || 0)) : 0
        });
        const summary = game.i18n.format("IMPMAL_RTIM.Squad.DamageResult", {
            wounds: woundsGained, criticals: result.addedCriticals, lost: result.lost, members: result.members
        });
        const text = args.text ? `${args.text} ${summary}` : summary;
        const updateData = this._woundUpdate(result);
        const damageData = {
            damage: value, text, woundsGained, message: null, modifiers,
            // No standard Critical Wound table link: casualties have already been resolved.
            critical: false, excess: 0, location, updateData, armourRoll, squad: result
        };

        if (update) {
            const unreliableArmour = (locationData.items || []).filter(item => item.type === "protection"
                && item.system.traits.has("unreliable") && !item.system.destroyed[locationKey]
                && (item.system.damage[locationKey] || 0) < item.system.armour);
            await this.parent.update(updateData, { squadResolved: true });
            const whisper = ChatMessage.getWhisperRecipients("GM").map(user => user.id);
            if (value > 0 && unreliableArmour.length && whisper.length) {
                const reminder = game.i18n.format("IMPMAL.UnreliableArmourReminder", {
                    actor: this.parent.name,
                    location: game.i18n.localize(locationData.label),
                    items: unreliableArmour.map(item => item.name).join(", ")
                });
                await ChatMessage.create({
                    content: `<p>${foundry.utils.escapeHTML(reminder)}</p>`,
                    speaker: ChatMessage.getSpeaker({ actor: this.parent }), whisper
                });
            }
        }
        if (message) {
            damageData.message = await ChatMessage.create({
                content: `<p>${text}</p>`, speaker: ChatMessage.getSpeaker({ actor: this.parent })
            });
        }
        // Squad armour never suffers Rend; its converted Penetrating was applied above.
        return damageData;
    }

    async importNPC(source) {
        const actor = this.parent;
        if (!actor.isOwner) throw new Error(game.i18n.localize("IMPMAL_RTIM.Squad.NotOwner"));
        if (source?.type !== "npc" || !["troop", "elite"].includes(source.system.role)) {
            throw new Error(game.i18n.localize("IMPMAL_RTIM.Squad.InvalidNPC"));
        }
        if (!source.testUserPermission(game.user, "OBSERVER")) {
            throw new Error(game.i18n.localize("IMPMAL_RTIM.Squad.NoSourcePermission"));
        }
        const profile = buildSquadProfile(source, actor.uuid, this.squad.members);
        profile.system.autoCalc ??= {};
        profile.system.autoCalc.autoResizeToken = this.autoCalc.autoResizeToken;
        profile.prototypeToken.name = actor.name;
        // Validate the entire profile before touching existing embedded documents.
        new CONFIG.Actor.documentClass({ ...profile, name: actor.name, type: actor.type }, { strict: true });
        // Same replacement operation as Foundry's importFromJSON: one server update,
        // including full embedded arrays, rather than a destructive delete/create sequence.
        await actor.update(profile, { diff: false, recursive: false, squadImport: true });
        return actor;
    }
}
