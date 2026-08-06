const fields = foundry.data.fields;

export default class BaseBuildingData extends BaseActorModel {
    static preventItemTypes = ["boonLiability", "corruption", "power", "specialisation", "talent", "duty", "faction", "origin", "role", "trait", "critical", "injury", "pack"];

    static defineSchema() {
        return {
            ...super.defineSchema(),
            levelLimit: new fields.NumberField({ initial: 0 }),
            totalLevelsLimit: new fields.NumberField({ initial: 0 }),
            totalLevels: new fields.NumberField({ initial: 0 }),
            availableUpgradePoints: new fields.NumberField({ initial: 0 }),
            solars: new fields.NumberField({ initial: 0 }),
            spentUpgradePoints: new fields.NumberField({ initial: 0 })
        };
    }

    computeDerived() {
        const equippedTypes = new Set([
            "weapon",
            "protection",
            "forceField",
            "equipment",
            "modification",
            "augmetic",
            "ammo"
        ]);

        const updates = [];
        for (const item of this.parent.items.contents) {
            if (!equippedTypes.has(item.type)) {
                continue;
            }
            if (item?.system?.equipped?.value) {
                updates.push({
                    _id: item.id,
                    "system.equipped.value": false
                });
            }
        }

        if (updates.length) {
            this.parent.update({ items: updates });
        }

        super.computeDerived();
    }
}
