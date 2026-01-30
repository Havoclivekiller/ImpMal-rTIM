export class VoidShipPartModel extends StandardItemModel {

    static defineSchema() {
        const fields = foundry.data.fields;
        let schema = super.defineSchema();
        schema.shipPoints = new fields.NumberField({ initial: 0 });
        schema.partType = new fields.StringField({ initial: "component" });
        schema.restrictions = new fields.StringField({ initial: "" });
        schema.effect = new fields.StringField({ initial: "" });
        schema.space = new fields.NumberField({ initial: 0 });
        schema.active = new fields.BooleanField({ initial: true });
        schema.status = new fields.StringField({ initial: "default" });


        schema.weapon = new fields.SchemaField({
            type : new fields.StringField({ initial: "macro" }),
            armour : new fields.SchemaField({
                mult : new fields.NumberField({ initial: 1 }),
                change : new fields.NumberField({ initial: 0 })
            }),
            shield : new fields.SchemaField({
                mult : new fields.NumberField({ initial: 1 }),
                change : new fields.NumberField({ initial: 0 })
            }),
            hull : new fields.SchemaField({
                mult : new fields.NumberField({ initial: 1 }),
                change : new fields.NumberField({ initial: 0 })
            }),
            location : new fields.StringField({ initial: "" }),
            damage : new fields.NumberField({ initial: 10 }),
            damageFormula : new fields.StringField({ initial: "" }),
            damageSL : new fields.BooleanField({ initial: true }),
            wideArc : new fields.BooleanField({ initial: false }),
            reloaded : new fields.BooleanField({ initial: true }),
            range : new fields.NumberField({ initial: 10 }),
            rating : new fields.NumberField({ initial: 10 }),
            torpedo : new fields.SchemaField({
                salvos : new fields.SchemaField({
                    value : new fields.NumberField({ initial: 6 }),
                    total : new fields.NumberField({ initial: 6 }),
                }),
                speedRating : new fields.NumberField({ initial: 10 }),
                turnRating : new fields.NumberField({ initial: 3 }),
                thermal : new fields.NumberField({ initial: 3 })
            }),
            landing : new fields.SchemaField({
                housing : new fields.SchemaField({
                    assault : new fields.SchemaField({
                        value : new fields.NumberField({ initial: 2 }),
                        total : new fields.NumberField({ initial: 2 }),
                    }),
                    bombers : new fields.SchemaField({
                        value : new fields.NumberField({ initial: 2 }),
                        total : new fields.NumberField({ initial: 2 }),
                    }),
                    fighters : new fields.SchemaField({
                        value : new fields.NumberField({ initial: 2 }),
                        total : new fields.NumberField({ initial: 2 }),
                    }),
                    other : new fields.SchemaField({
                        value : new fields.NumberField({ initial: 0 }),
                        total : new fields.NumberField({ initial: 0 }),
                    }),
                }),
                speedRating : new fields.NumberField({ initial: 10 }),
            })
        });

        schema.component = new fields.SchemaField({
            type : new fields.StringField({ initial: "essential" }),
            subtypeEssential : new fields.StringField({ initial: "plasmaDrives" }),
            subtypeSupplemental : new fields.StringField({ initial: "combat" }),
            changes : new fields.SchemaField({
                speedRating : new fields.NumberField({ initial: 0 }),
                detectionRating : new fields.NumberField({ initial: 0 }),
                evasionRating : new fields.NumberField({ initial: 0 }),
                turretRating : new fields.NumberField({ initial: 0 }),
                turnRating : new fields.NumberField({ initial: 0 }),
                hull : new fields.NumberField({ initial: 0 }),
                rammingDamage : new fields.NumberField({ initial: 0 }),
                shields : new fields.SchemaField({
                    fore : new fields.NumberField({ initial: 0 }),
                    aft : new fields.NumberField({ initial: 0 }),
                    port : new fields.NumberField({ initial: 0 }),
                    starboard : new fields.NumberField({ initial: 0 }),
                    all : new fields.NumberField({ initial: 0 })
                }),
                armour : new fields.SchemaField({
                    fore : new fields.NumberField({ initial: 0 }),
                    aft : new fields.NumberField({ initial: 0 }),
                    port : new fields.NumberField({ initial: 0 }),
                    starboard : new fields.NumberField({ initial: 0 }),
                    all : new fields.NumberField({ initial: 0 })
                })
            })
        });

        schema.role = new fields.SchemaField({
            upgraded : new fields.BooleanField({ initial: false }),
            bonus : new fields.StringField({ initial: "" }),
            bonusUpgraded : new fields.StringField({ initial: "" }),
            action : new fields.SchemaField({
                name : new fields.StringField({ initial: "" }),
                cooldown : new fields.NumberField({ initial: 1 }),
                cooldownCount : new fields.NumberField({ initial: 2 }),
                skill: new fields.SchemaField({
                    key: new fields.StringField({ initial: "" }),
                    specialisation: new fields.StringField({ initial: "" })
                }),
                difficulty: new fields.StringField({ initial: "challenging" }),
                description : new fields.StringField({ initial: "" }),                
                opposed : new fields.BooleanField({ initial: false }),
            }),
            actionUpgraded : new fields.SchemaField({
                name : new fields.StringField({ initial: "" }),
                cooldown : new fields.NumberField({ initial: 1 }),
                cooldownCount : new fields.NumberField({ initial: 2 }),
                skill: new fields.SchemaField({
                    key: new fields.StringField({ initial: "" }),
                    specialisation: new fields.StringField({ initial: "" })
                }),
                difficulty: new fields.StringField({ initial: "challenging" }),
                description : new fields.StringField({ initial: "" }),               
                opposed : new fields.BooleanField({ initial: false }),
            }),
            assignee: new fields.SchemaField({
                uuid: new fields.StringField({ initial: "" }),
                name: new fields.StringField({ initial: "" }),
                img: new fields.StringField({ initial: "" }),
                skillOne: new fields.SchemaField({
                    key: new fields.StringField({ initial: "" }),
                    specialisation: new fields.StringField({ initial: "" })
                }),
                skillTwo: new fields.SchemaField({
                    key: new fields.StringField({ initial: "" }),
                    specialisation: new fields.StringField({ initial: "" })
                }),
            })
        });

        schema.hull = new fields.SchemaField({
            type : new fields.StringField({ initial: "transport" }),
            size : new fields.NumberField({ initial: 0 }),
            speedRating : new fields.NumberField({ initial: 0 }),
            turnRating : new fields.NumberField({ initial: 0 }),
            evasionRating : new fields.NumberField({ initial: 0 }),
            detectionRating : new fields.NumberField({ initial: 0 }),
            turretRating : new fields.NumberField({ initial: 0 }),
            supplemental : new fields.NumberField({ initial: 0 }),
            value : new fields.NumberField({ initial: 0 }),
            shields : new fields.SchemaField({
                fore : new fields.NumberField({ initial: 0 }),
                aft : new fields.NumberField({ initial: 0 }),
                port : new fields.NumberField({ initial: 0 }),
                starboard : new fields.NumberField({ initial: 0 }),
                average : new fields.NumberField({ initial: 0 })
            }),
            armour : new fields.SchemaField({
                fore : new fields.NumberField({ initial: 0 }),
                aft : new fields.NumberField({ initial: 0 }),
                port : new fields.NumberField({ initial: 0 }),
                starboard : new fields.NumberField({ initial: 0 }),
                average : new fields.NumberField({ initial: 0 })
            }),
            weapons : new fields.SchemaField({
                aft : new fields.NumberField({ initial: 0 }),
                prow : new fields.NumberField({ initial: 0 }),
                keel : new fields.NumberField({ initial: 0 }),
                starboard : new fields.NumberField({ initial: 0 }),
                port : new fields.NumberField({ initial: 0 }),
                dorsal : new fields.NumberField({ initial: 0 })
            })
        });

        schema.critical = new fields.SchemaField({
            type : new fields.StringField({ initial: "criticalDamage" }),
            level : new fields.NumberField({ initial: 0 })
        });

        return schema;
    }

    get damageString()
    {
        return `${this.weapon.damage}${this.weapon.damageFormula ? "+"+this.weapon.damageFormula:""}${this.weapon.damageSL ? "+SL":""}`;
    }

    get getWeaponMultipliers()
    {
        const entries = [];
        const addEntry = (labelKey, data = {}) => {
            const mult = Number(data.mult ?? 1);
            const change = Number(data.change ?? 0);
            if (mult === 1 && change === 0) {
                return;
            }
            let detail = mult !== 1 ? `x${mult}` : "";
            if (change !== 0) {
                detail = detail ? `${detail} - ${change}` : `${change}`;
            }
            entries.push(`${game.i18n.localize(labelKey)} (${detail})`);
        };
        addEntry("IMPMAL_RTIM.VoidCombat.Armour", this.weapon.armour);
        addEntry("IMPMAL_RTIM.VoidCombat.Shields", this.weapon.shield);
        addEntry("IMPMAL_RTIM.VoidCombat.Hull", this.weapon.hull);
        return entries.join(", ");
    }

    get displayWeapons() {
        return Object.entries(this.hull.weapons)
        .filter(([_, value]) => value !== 0)
        .map(([key, value]) => `${game.i18n.localize("IMPMAL_RTIM.VoidCombat." + capitalizeFirstLetter(key))} ${value}`)
        .join(', ');
    }

    get displayChangeSummary()
    {
        let locationLabels = {
            fore: "IMPMAL_RTIM.VoidCombat.Fore",
            aft: "IMPMAL_RTIM.VoidCombat.Aft",
            port: "IMPMAL_RTIM.VoidCombat.Port",
            starboard: "IMPMAL_RTIM.VoidCombat.Starboard",
            all: "IMPMAL_RTIM.VoidCombat.All"
        };
        let changeLabels = {
            speedRating: "IMPMAL_RTIM.VoidCombat.SpeedRating",
            detectionRating: "IMPMAL_RTIM.VoidCombat.DetectionRating",
            evasionRating: "IMPMAL_RTIM.VoidCombat.EvasionRating",
            turretRating: "IMPMAL_RTIM.VoidCombat.TurretRating",
            turnRating: "IMPMAL_RTIM.VoidCombat.TurnRating",
            hull: "IMPMAL_RTIM.VoidCombat.Hull",
            rammingDamage: "IMPMAL_RTIM.VoidCombat.RammingDamage"
        };

        let entries = [];

        for (let [key, labelKey] of Object.entries(changeLabels)) {
            let value = Number(this.component.changes[key] || 0);
            if (value != 0) {
                entries.push(`${game.i18n.localize(labelKey)} ${value>0?"+":""}${value}`);
            }
        }
        const addNested = (groupKey, groupLabelKey) => {
            let group = this.component.changes[groupKey] || {};
            for (let [locKey, locLabelKey] of Object.entries(locationLabels)) {
                let value = Number(group[locKey] || 0);
                if (value != 0) {
                    entries.push(`${game.i18n.localize(groupLabelKey)} ${game.i18n.localize(locLabelKey)} ${value>0?"+":""}${value}`);
                }
            }
        };
        addNested("shields", "IMPMAL_RTIM.VoidCombat.Shields");
        addNested("armour", "IMPMAL_RTIM.VoidCombat.Armour");
        if (entries.length == 0) return "";
        return entries.join(", ");
    }

    async _preUpdate(changed, options, userId)
    {
        await super._preUpdate(changed, options, userId);
        if (this.partType === "role") 
        {
            if (changed.system?.status !== undefined)
            {
                if ((changed.system?.status === "destroyed" || changed.system?.status === "damaged") && this.active)
                {
                    foundry.utils.setProperty(changed, "system.active", false);
                }
                if (changed.system?.status === "default" && !this.active)
                {
                    foundry.utils.setProperty(changed, "system.active", true);
                }
            }
        }
        if (this.partType === "weapon" || this.partType === "component") 
        {
            if (changed.system?.status !== undefined)
            {
                if (changed.system?.status === "destroyed" && this.active)
                {
                    foundry.utils.setProperty(changed, "system.active", false);
                }
                if ((changed.system?.status === "default" || changed.system?.status === "damaged") && !this.active)
                {
                    foundry.utils.setProperty(changed, "system.active", true);
                }
            }
        }
    }

    async _onUpdate(changed, options, userId) {
        await super._onUpdate(changed, options, userId);
        if (userId != game.user.id)
        {
            return;
        }

        if (this.partType === "hull" && this.parent.parent)
        {
            let hullData = this.hull || {};
            let updates = { "system.hull.uuid": this.id };
            const updateBase = (path, baseValue) => {
                updates[`system.${path}.base`] = Number(baseValue ?? 0);
            };
            updateBase("hull", hullData.value);
            updateBase("speedRating", hullData.speedRating);
            updateBase("detectionRating", hullData.detectionRating);
            updateBase("size", hullData.size);
            updateBase("turnRating", hullData.turnRating);
            updateBase("supplemental", hullData.supplemental);
            updateBase("evasionRating", hullData.evasionRating);
            updateBase("turretRating", hullData.turretRating);
            const updateDirectional = (groupPath, values = {}) => {
                Object.entries(values).forEach(([key, value]) => {
                    updateBase(`${groupPath}.${key}`, value);
                });
            };
            updateDirectional("shields", hullData.shields);
            updateDirectional("armour", hullData.armour);
            let weaponSlots = hullData.weapons || {};
            Object.entries(weaponSlots).forEach(([key, value]) => {
                updateBase(`weaponSlots.${key}`, value);
            });
            await this.parent.parent.update(updates);
        }
    }
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
