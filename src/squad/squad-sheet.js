export class SquadSheet extends NPCSheet {
    static DEFAULT_OPTIONS = {
        classes: ["impmal-rtim-squad"],
        actions: { squadCritical: this._onSquadCritical }
    };

    static PARTS = {
        ...NPCSheet.PARTS,
        header: {
            scrollable: [""], classes: ["npc-header"],
            template: "modules/impmal-rtim/squad/templates/squad-header.hbs"
        }
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.squad = this.actor.system.squad;
        context.isSquad = this.actor.system.isSquad;
        // The NPC header edits the base profile. Derived Size/Resolve are shown separately.
        context.baseSize = this.actor._source.system.combat.size;
        context.baseResolve = this.actor._source.system.combat.resolve;
        context.effectiveSize = game.impmal.config.sizes[this.actor.system.combat.size];
        context.squadRoles = Object.fromEntries(Object.entries(game.impmal.config.npcRoles).filter(([key]) => ["troop", "elite"].includes(key)));
        return context;
    }

    static async _onSquadCritical() {
        if (!this.isEditable) return;
        await this.actor.system.applySquadCritical();
    }

    // WarhammerSheetMixinV2 dispatches (dropData, event), overriding core's signature.
    async _onDropActor(data) {
        if (!this.actor.isOwner || !this.isEditable || this._importingNPC) return;
        this._importingNPC = true;
        try {
            const source = await Actor.implementation.fromDropData(data);
            if (source?.type !== "npc" || !["troop", "elite"].includes(source.system.role)) {
                return ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.Squad.InvalidNPC"));
            }
            if (this.actor.system.squad.source.uuid || this.actor.items.size || this.actor.effects.size) {
                const confirmed = await foundry.applications.api.DialogV2.confirm({
                    window: { title: game.i18n.localize("IMPMAL_RTIM.Squad.ReplaceTitle") },
                    content: `<p>${game.i18n.localize("IMPMAL_RTIM.Squad.ReplaceHint")}</p>`
                });
                if (!confirmed) return;
            }
            await this.actor.system.importNPC(source);
            ui.notifications.info(game.i18n.format("IMPMAL_RTIM.Squad.Imported", { name: source.name }));
            return source;
        } catch (error) {
            console.error("impmal-rtim | Squad NPC import failed", error);
            ui.notifications.error(error.message);
        } finally {
            this._importingNPC = false;
        }
    }
}
