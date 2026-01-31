import { VoidshipCharacteristicsModel } from "./tests/voidship-characteristics-model.js";
import { VoidshipSkillsModel } from "./tests/voidship-skills-model.js";
import { VoidshipTokenHandler } from "./voidship-token-handler.js";
import { VoidshipSetupTests } from "./tests/voidship-setup-tests.js";

export class VoidshipModel extends StandardActorModel {
    static preventItemTypes = ["boonLiability", "corruption", "power", "talent", "duty", "origin", "role", "trait", "critical", "injury", "pack", "weapon", "protection", "equipment"];

    static defineSchema() {
        const fields = foundry.data.fields;
        let schema = super.defineSchema();
        schema.shipMembers = new fields.ArrayField(new fields.StringField({ initial: "" }));
        schema.shipType = new fields.StringField({ initial: "standard" });
        schema.faction = new fields.EmbeddedDataField(SingletonItemModel);
        schema.characteristics = new fields.EmbeddedDataField(VoidshipCharacteristicsModel);
        schema.skills = new fields.EmbeddedDataField(VoidshipSkillsModel);
        const createValueSchema = (min=0) => {
            return new fields.SchemaField({
            base: new fields.NumberField({ min : min, initial: 0 }),
            modifier: new fields.NumberField({ initial: 0 }),
            value: new fields.NumberField({ min : min, initial: 0 }),
        })
        };
        const createMaxSchema = (min=0) => {
            return new fields.SchemaField({
            value: new fields.NumberField({ initial: 0 }),
            base: new fields.NumberField({ min : min, initial: 0 }),
            modifier: new fields.NumberField({ initial: 0 }),
            max: new fields.NumberField({ min : min, initial: 0 }),
        })
        };
        schema.fate = createMaxSchema();
        schema.hull = new fields.SchemaField({
            value: new fields.NumberField({ initial: 0 }),
            base: new fields.NumberField({ min : 0, initial: 0 }),
            modifier: new fields.NumberField({ initial: 0 }),
            max: new fields.NumberField({ min : 0, initial: 0 }),
            uuid: new fields.StringField({ initial: "" }),
        });
        schema.options = new fields.SchemaField({
            takeAvgShield : new fields.BooleanField({ initial: false }),
            takeAvgArmour : new fields.BooleanField({ initial: false }),
            noFatigue : new fields.BooleanField({ initial: false }),
            autoTest : new fields.BooleanField({ initial: false }),
            autoTestSL : new fields.NumberField({ initial: 0 }),
            fated : new fields.BooleanField({ initial: false }),
            noActionPoints : new fields.BooleanField({ initial: false }),
            noExperiencePoints : new fields.BooleanField({ initial: true }),
            restartShieldsDifficulty : new fields.StringField({ initial: "routine" }),
            fireResistance : new fields.NumberField({ initial: 0 }),
            minionTargetUuid : new fields.StringField({ initial: "" }),
            boardingRange : new fields.NumberField({ initial: 2 }),
            rammingRange : new fields.NumberField({ initial: 2 }),
            rammingDamage : new fields.NumberField({ initial: 0 }),
            defyDeath : new fields.SchemaField({
                has : new fields.BooleanField({ initial: false }),
                used : new fields.BooleanField({ initial: false }),
                resetOnEnd : new fields.NumberField({ initial: 0 }),
                amountRoles : new fields.NumberField({ initial: 2 }),
                roleIds: new fields.ArrayField(new fields.StringField({ initial: "" })),
            }),
            noManeuvers : new fields.BooleanField({ initial: false }),
        });
        schema.bonuses = new fields.ArrayField(new fields.SchemaField({
            SL : new fields.NumberField({ initial: 0 }),
            modifier : new fields.NumberField({ initial: 0 }),
            damage : new fields.NumberField({ initial: 0 }),
            advantage : new fields.BooleanField({ initial: false }),
            disadvantage : new fields.BooleanField({ initial: false }),
            removeAfterTurns : new fields.NumberField({ initial: -1 }),
            removeOnNextTest : new fields.BooleanField({ initial: false }),
            removeOnStartTurn : new fields.BooleanField({ initial: false }),
            removeOnEndTurn : new fields.BooleanField({ initial: false }),
            removeOnNextEndTurn : new fields.BooleanField({ initial: false }),
            items : new fields.ArrayField(new fields.StringField({ initial: "" })),
            type : new fields.ArrayField(new fields.StringField({ initial: "" })),
            comment : new fields.StringField({ initial: "" })
        }));
        schema.speedRating = createValueSchema();
        schema.turnRating = new fields.SchemaField({
            current: new fields.NumberField({ min : 0, initial: 0 }),
            base: new fields.NumberField({ initial: 0 }),
            modifier: new fields.NumberField({ initial: 0 }),
            value: new fields.NumberField({ initial: 0 }),
        })
        schema.detectionRating = createValueSchema();
        schema.movementMult = new fields.NumberField({ initial: 1 });        
        schema.size = createValueSchema();
        schema.supplemental = createValueSchema();
        schema.evasionRating = createValueSchema();
        schema.turretRating = createValueSchema();
        schema.fatigue = createMaxSchema();
        schema.fire = new fields.NumberField({ min : 0, initial: 0 });
        schema.crewExperience = new fields.SchemaField({
            gained: new fields.NumberField({ min : 0, initial: 0 }),
            spent: new fields.NumberField({ min : 0, initial: 0 }),
            remaining: new fields.NumberField({ min : 0, initial: 0 })
        });
        schema.shields = new fields.SchemaField({
            fore: createMaxSchema(),
            average: createMaxSchema(),
            port: createMaxSchema(),
            starboard: createMaxSchema(),
            aft: createMaxSchema()
        });
        schema.armour = new fields.SchemaField({
            fore: createValueSchema(),
            average: createValueSchema(),
            port: createValueSchema(),
            starboard: createValueSchema(),
            aft: createValueSchema()
        });
        const createWeaponSlotSchema = () => {
            return new fields.SchemaField({
                base: new fields.NumberField({ min : 0, initial: 0 }),
                modifier: new fields.NumberField({ initial: 0 }),
                value: new fields.NumberField({ min : 0, initial: 0 }),
                assigned: new fields.ArrayField(new fields.StringField({ initial: "" }))
        })
        };
        schema.weaponSlots = new fields.SchemaField({
            prow: createWeaponSlotSchema(),
            port: createWeaponSlotSchema(),
            starboard: createWeaponSlotSchema(),
            aft: createWeaponSlotSchema(),
            dorsal: createWeaponSlotSchema(),
            keel: createWeaponSlotSchema()
        });
        schema.actionPoints = createMaxSchema();
        schema.movementPoints = createMaxSchema();
        const createBaseSchema = (base=0) => {
            return new fields.SchemaField({
            base: new fields.NumberField({ initial: base }),
            byTurn: new fields.NumberField({ initial: 0 }),
            modifier: new fields.NumberField({ initial: 0 }),
            value: new fields.NumberField({ initial: 0 }),
        })
        };

        schema.actionCosts = new fields.SchemaField({
            repair: createBaseSchema(game.impmal.config.RTIM.voidship.actions.repair.defaultCost),
            rally: createBaseSchema(game.impmal.config.RTIM.voidship.actions.rally.defaultCost),
            scan: createBaseSchema(game.impmal.config.RTIM.voidship.actions.scan.defaultCost),
            boarding: createBaseSchema(game.impmal.config.RTIM.voidship.actions.boarding.defaultCost),
            assaultBoarding: createBaseSchema(game.impmal.config.RTIM.voidship.actions.boarding.defaultCost),
            reloadSpecial: createBaseSchema(game.impmal.config.RTIM.voidship.actions.reload.defaultCost),
            reloadTorpedoes: createBaseSchema(game.impmal.config.RTIM.voidship.actions.reload.defaultCost),
            reloadSquadrons: createBaseSchema(game.impmal.config.RTIM.voidship.actions.reload.defaultCost),
            reloadNovaCannon: createBaseSchema(game.impmal.config.RTIM.voidship.actions.reload.defaultCost),
            restartShields: createBaseSchema(game.impmal.config.RTIM.voidship.actions.restartShields.defaultCost),
            seek: createBaseSchema(game.impmal.config.RTIM.voidship.actions.seek.defaultCost),
            evasiveManeuvers: createBaseSchema(game.impmal.config.RTIM.voidship.maneuvers.evasiveManeuvers.defaultCost),
            ramming: createBaseSchema(game.impmal.config.RTIM.voidship.maneuvers.ramming.defaultCost),
            silentRunning: createBaseSchema(game.impmal.config.RTIM.voidship.maneuvers.silentRunning.defaultCost),
        });

        schema.autoCalc.fields = {}
        schema.autoCalc = new fields.SchemaField({
            endCombat: new fields.BooleanField({initial : true, 
                label : "IMPMAL_RTIM.VoidCombat.AutoCalc.EndCombat.Label", 
                hint: "IMPMAL_RTIM.VoidCombat.AutoCalc.EndCombat.Hint"}),
            movement: new fields.BooleanField({initial : true, 
                label : "IMPMAL_RTIM.VoidCombat.AutoCalc.AutomateMovementPoints.Label", 
                hint: "IMPMAL_RTIM.VoidCombat.AutoCalc.AutomateMovementPoints.Hint"}),
            allowMovement: new fields.BooleanField({initial : false, 
                label : "IMPMAL_RTIM.VoidCombat.AutoCalc.UnrestrictedMovement.Label", 
                hint: "IMPMAL_RTIM.VoidCombat.AutoCalc.UnrestrictedMovement.Hint"}),
            allowNoPoints: new fields.BooleanField({initial : false, 
                label : "IMPMAL_RTIM.VoidCombat.AutoCalc.AllowNoPoints.Label", 
                hint: "IMPMAL_RTIM.VoidCombat.AutoCalc.AllowNoPoints.Hint"}),
            allowOnCooldown: new fields.BooleanField({initial : true, 
                label : "IMPMAL_RTIM.VoidCombat.AutoCalc.AllowOnCooldown.Label", 
                hint: "IMPMAL_RTIM.VoidCombat.AutoCalc.AllowOnCooldown.Hint"}),
            allowOutsideRange: new fields.BooleanField({initial : true, 
                label : "IMPMAL_RTIM.VoidCombat.AutoCalc.AllowOutsideRange.Label", 
                hint: "IMPMAL_RTIM.VoidCombat.AutoCalc.AllowOutsideRange.Hint"}),
            allowDeactivated: new fields.BooleanField({initial : false, 
                label : "IMPMAL_RTIM.VoidCombat.AutoCalc.AllowDeactivatedComponents.Label", 
                hint: "IMPMAL_RTIM.VoidCombat.AutoCalc.AllowDeactivatedComponents.Hint"}),
            movementSound: new fields.StringField({initial : "", 
                label : "IMPMAL_RTIM.VoidCombat.AutoCalc.MovementSound.Label", 
                hint: "IMPMAL_RTIM.VoidCombat.AutoCalc.MovementSound.Hint"}),
        });
        
        return schema;
    }

    computeDerived() {
        super.computeDerived();
        const skills = this.skills || {};
        Object.keys(skills).forEach((key) => {
            this.skills[key].characteristic = "crew";
        });
        const updateTotalValue = (path) => {
            this[path].value = this[path].base + this[path].modifier;
        };
        const updateTotalMax = (path) => {
            this[path].max = this[path].base + this[path].modifier;
        };
        const updateSubTotalValue = (path, sub) => {
            this[path][sub].value = this[path][sub].base + this[path][sub].modifier;
        };
        const updateSubTotalMax = (path, sub) => {
            this[path][sub].max = this[path][sub].base + this[path][sub].modifier;
        };
        let hull = this.parent?.items?.filter(item => item.system?.partType === "hull")[0];
        if (hull)
        {
            this.hull.base = hull.system.hull.value;
            this.speedRating.base = hull.system.hull.speedRating;
            this.turnRating.base = hull.system.hull.turnRating;
            this.evasionRating.base = hull.system.hull.evasionRating;
            this.detectionRating.base = hull.system.hull.detectionRating;
            this.turretRating.base = hull.system.hull.turretRating;
            this.supplemental.base = hull.system.hull.supplemental;
            ["fore", "port", "starboard", "aft", "average"].forEach((key) =>
            {
                this.shields[key].base = hull.system.hull.shields[key];
                this.armour[key].base = hull.system.hull.armour[key];
            });
            ["prow", "port", "starboard", "aft", "dorsal", "keel"].forEach((key) =>
            {
                this.weaponSlots[key].base = hull.system.hull.weapons[key];
            });
        }
        
        const componentItems = this.parent?.items?.filter(item => item.system?.partType === "component") || [];
        const baseModifierPaths = [
            "speedRating",
            "detectionRating",
            "evasionRating",
            "turretRating",
            "hull",
            "turnRating"
        ];
        const applyDelta = (path, delta) => {
            const current = Number(foundry.utils.getProperty(this, path) ?? 0);
            foundry.utils.setProperty(this, path, current + delta);
        };
        componentItems.forEach((item) => {
            const changes = item.system?.component?.changes || {};
            baseModifierPaths.forEach((path) => {
                const value = Number(changes[path] ?? 0);
                if (value) {
                    applyDelta(`${path}.modifier`, value);
                }
            });
            if (changes.rammingDamage ?? 0) {
                applyDelta(`options.rammingDamage`, changes.rammingDamage);
            }
            const locationKeys = ["fore", "port", "starboard", "aft", "average"];
            if (changes.shields?.all ?? 0) {
                locationKeys.forEach((key) => applyDelta(`shields.${key}.modifier`, changes.shields.all));
            }
            if (changes.armour?.all ?? 0) {
                locationKeys.forEach((key) => applyDelta(`armour.${key}.modifier`, changes.armour.all));
            }
            locationKeys.forEach((key) => {
                const shieldDelta = Number(changes.shields[key] ?? 0);
                if (shieldDelta) {
                    applyDelta(`shields.${key}.modifier`, shieldDelta);
                }
                const armourDelta = Number(changes.armour[key] ?? 0);
                if (armourDelta) {
                    applyDelta(`armour.${key}.modifier`, armourDelta);
                }
            });
        });

        updateTotalMax("hull");
        Object.keys(this.characteristics).forEach((key) => {
            this.characteristics[key].computeTotal();
        });
        foundry.utils.setProperty(this, "fatigue.base", this.characteristics.crew.bonus);
        updateTotalMax("fatigue");
        let fatiguePenalty = 0;
        if (this.fatigue.value > this.fatigue.max)
        {
            fatiguePenalty = Math.max(0, this.fatigue.value - this.fatigue.max) * 10;
        }   
        foundry.utils.setProperty(this, "characteristics.crew.fatiguePenalty", fatiguePenalty);
        this.characteristics.crew.computeTotal();

        updateTotalValue("speedRating");
        foundry.utils.setProperty(this, "movementPoints.base", foundry.utils.getProperty(this, "speedRating.value"));
        foundry.utils.setProperty(this, "actionPoints.base", this.characteristics.crew.bonus);
        updateTotalMax("actionPoints");
        updateTotalMax("movementPoints");
        foundry.utils.setProperty(this, "combat.speed.land.value", foundry.utils.getProperty(this, "movementPoints.max"));
        

        updateTotalMax("fate");
        updateTotalValue("detectionRating");
        updateTotalValue("size");
        updateTotalValue("turnRating");
        updateTotalValue("supplemental");
        updateTotalValue("evasionRating");
        updateTotalValue("turretRating");
        ["fore", "port", "starboard", "aft", "average"].forEach((key) => {
            updateSubTotalMax("shields", key);
            updateSubTotalValue("armour", key);
        });
        
        ["prow", "port", "starboard", "aft", "dorsal", "keel"].forEach((key) => {
            this.weaponSlots[key].value = this.weaponSlots[key].base + this.weaponSlots[key].modifier;
        });

        foundry.utils.setProperty(this, "crewExperience.remaining", this.crewExperience.gained - this.crewExperience.spent);
        

        const updateActionCostsValue = (path) => {
            this.actionCosts[path].value = this.actionCosts[path].base + this.actionCosts[path].modifier + this.actionCosts[path].byTurn;
        };

        this.actionCosts.evasiveManeuvers.base = this.movementPoints.max;
        updateActionCostsValue("repair");
        updateActionCostsValue("rally");
        updateActionCostsValue("scan");
        updateActionCostsValue("boarding");
        updateActionCostsValue("reloadSpecial");
        updateActionCostsValue("seek");
        updateActionCostsValue("evasiveManeuvers");
        updateActionCostsValue("ramming");
        updateActionCostsValue("silentRunning");
        updateActionCostsValue("reloadTorpedoes");
        updateActionCostsValue("reloadSquadrons");
        updateActionCostsValue("reloadNovaCannon");
        updateActionCostsValue("restartShields");
        updateActionCostsValue("assaultBoarding");


        this.combat.initiative = this.evasionRating.value + this.detectionRating.value;

        this.computeRoleSkills();

        this.runScripts("postPrepareDerivedData", this);

        //Some values can't be below their min.
        let checkMinValue = (path, min) => {
            let currentValue = this[path].value;
            if (currentValue < min)
                this[path].value = min;
        };
        let checkMinValueSubPath = (path, subpath, min) => {
            let currentValue = this[path][subpath].value;
            if (currentValue < min)
                this[path][subpath].value = min;
        };
        checkMinValue("turnRating",1);
        checkMinValue("size",1);
        checkMinValue("supplemental",0);
        checkMinValue("movementPoints",0);
        checkMinValue("actionPoints",0);
        ["fore", "port", "starboard", "aft", "average"].forEach((key) => {
            checkMinValueSubPath("shields",key,0);
            checkMinValueSubPath("armour",key,0);
        });
        ["prow", "port", "starboard", "aft", "dorsal", "keel"].forEach((key) => {
            checkMinValueSubPath("weaponSlots",key,0);
        });

    }

    computeRoleSkills()
    {
        let getSkillSpecialisation = (skillKey, specKey) => {
            let spec = this.parent.system.skills[skillKey]?.specialisations?.find(i => i.name.slugify() == specKey?.slugify());
            if (spec)
            {
                return spec;
            } 
        };
        let roleItems = this.parent?.items?.filter(item => item.system?.partType === "role");
        const takeHigher = (obj, path, change) => {
            let current = Number(foundry.utils.getProperty(obj, path) ?? 0);
            if (current < change) foundry.utils.setProperty(obj, path, change);
        };
        if (roleItems)
        {
            roleItems.forEach(item => {
                let role = item.system.role.assignee;
                if (!role.uuid) return;
            
                let actor = fromUuidSync(role.uuid);
                if (!actor) return;

                ["skillOne","skillTwo"].forEach(key => {
                    if (role[key].key)
                    {
                        takeHigher(this, `skills.${role[key].key}.advances`, actor.system.skills[role[key].key].advances);
                        if (role[key].specialisation)
                        {
                            let specActor = actor.system.skills[role[key].key]?.specialisations?.find(i => i.name.slugify() == role[key].specialisation?.slugify());
                            if (!specActor) return;

                            let specShip = getSkillSpecialisation(role[key].key, role[key].specialisation);
                            if (specShip)
                            {
                                takeHigher(specShip, `system.advances`, specActor.system.advances);
                            }
                        }
                    }
                });                            
            });
        }

        Object.keys(this.skills).forEach((key) => {
            this.skills[key].computeTotal(this.characteristics);
        });
    }

    get displayWeapons() {
        const capitalizeFirstLetter = (value) =>
            String(value || "").charAt(0).toUpperCase() + String(value || "").slice(1);
        const slots = this.weaponSlots || {};
        return Object.entries(slots)
            .map(([key, data]) => [key, Number(data?.value ?? 0)])
            .filter(([_, value]) => value !== 0)
            .map(([key, value]) => `${game.i18n.localize("IMPMAL_RTIM.VoidCombat." + capitalizeFirstLetter(key))} ${value}`)
            .join(", ");
    }

    async _onUpdate(changed, options, userId) {
        await super._onUpdate(changed, options, userId);
        if (userId != game.user.id)
        {
            return;
        }
    }

    static getCriticalFormula(modifier)
    {
        let dice = 1;
        let criticals = this.parent.items.filter(item => item.system?.partType === "critical");
        if (criticals)
        {
            dice += criticals.length;
        }
        return `${dice}d10+${modifier}`;
    }

    getCriticalFormula(modifier)
    {
        let dice = 1;
        let criticals = this.parent.items.filter(item => item.system?.partType === "critical");
        if (criticals)
        {
            dice += criticals.length;
        }
        return `${dice}d10+${modifier}`;
    }

    getRandomLocation(random)
    {
        switch (random)
        {
            case 1:
            case 2:
                return "fore";
            case 3:
            case 4:
            case 5:
                return "port";
            case 6:
            case 7:
            case 8:
                return "starboard";
            case 9:
            case 10:
                return "aft";
            default:
                return "fore";
        }
    }

    async applyDamageSocket(value, {type, ignoreShields=false, ignoreArmour=false, location="", message=false, opposed, update=true, context={}}={})
    {
        game.socket?.emit("module.impmal-rtim", {
            type: "applyDamage",
            actorUuid: this.parent.uuid,
            damage: value,
            options: {type, ignoreShields, ignoreArmour, location, message, opposed, update, context}
        });
    }

    async applyDamage(value, {type, ignoreShields=false, ignoreArmour=false, location="", message=false, opposed, update=true, createCriticalMessage=false, context={}}={})
    {
        if (!game.user.isGM || !this.parent.isOwner) return await this.applyDamageSocket(value, {type : type ?? opposed?.attackerTest?.context?.type, ignoreShields, ignoreArmour, location, message, opposed, update, createCriticalMessage, context});
        if (type === "fire") return await this.applyFire(value);
        if (type === "fatigue") return await this.applyFatigue(value);
        return await this.applyDamageByType(value, {type : type ?? opposed?.attackerTest?.context?.type, ignoreShields, ignoreArmour, location, message, opposed, update, createCriticalMessage, context})   
    }

    async applyFire(value)
    {
        await this.parent.update({"system.fire": this.fire + value});
    }

    async applyFatigue(value)
    {
        if (this.options.noFatigue)
        {
            ui.notifications.info(`The ship doesn't use Fatigue, dealing ${Number(value)*2} Hull damage.`);
            await this.applyDamageByType(value*2, {type : "selfDamage", createCriticalMessage : true});
            return;
        }
        await this.parent.update({"system.fatigue.value": this.fatigue.value + value});
    }

    async applyDamageByType(value, {type="shooting",ignoreShields=false, ignoreArmour=false, location="", message=false, opposed, update=true, createCriticalMessage=false, context={}}={})
    {
        let thermalPen = "";
        switch (type)
        {
            case "torpedoSalvo":
                ignoreShields = true;
                if (opposed?.result?.SL > 0 && opposed?.attackerTest?.item)
                {
                    ignoreArmour = opposed?.result?.SL >= opposed?.attackerTest?.item.system.weapon.torpedo.thermal;
                    thermalPen += `Thermal Penetration of ${opposed?.attackerTest?.item.system.weapon.torpedo.thermal} is activated! `
                }
                break;
            case "ramming":
                ignoreShields = true;
                break;
            case "bomberRun":
            case "boarding":
            case "selfDamage":
                ignoreShields = true;
                ignoreArmour = true;
                break;
            case "nova":
                ignoreArmour = true;
                location = location ?? this.getRandomLocation(Math.ceil(CONFIG.Dice.randomUniform() * 10));
                break;
        }

        let traits = {};   
        let modifiers = []; 
        traits["armour.mult"] = { value : 1 };
        traits["armour.change"] = { value : 0 };
        traits["shield.mult"] = { value : 1 };
        traits["shield.change"] = { value : 0 };
        traits["hull.mult"] = { value : 1 };
        traits["hull.change"] = { value : 0 };
        if (opposed?.attackerTest?.item)
        {
            traits["armour.mult"].value = opposed?.attackerTest?.item.system.weapon.armour.mult;
            traits["armour.change"].value = opposed?.attackerTest?.item.system.weapon.armour.change;
            traits["shield.mult"].value = opposed?.attackerTest?.item.system.weapon.shield.mult;
            traits["shield.change"].value = opposed?.attackerTest?.item.system.weapon.shield.change;
            traits["hull.mult"].value = opposed?.attackerTest?.item.system.weapon.hull.mult;
            traits["hull.change"].value = opposed?.attackerTest?.item.system.weapon.hull.change;
        }
        let args = {actor : this.parent, type, value, ignoreShields, ignoreArmour, traits, modifiers, location, opposed, context};
        await Promise.all(opposed?.attackerTest?.actor?.runScripts("preApplyDamage", args) || []);
        await Promise.all(opposed?.attackerTest?.item?.runScripts?.("preApplyDamage", args) || []);
        await Promise.all(this.parent.runScripts("preTakeDamage", args)); 
        let damage = args.value;
        ignoreShields = args.ignoreShields;
        ignoreArmour = args.ignoreArmour;
        traits = args.traits;
        modifiers = args.modifiers;


        let updateObj = {};
        let shieldOverflow = 0;
        if (!location)
        {
            location = this.getRandomLocation(Math.ceil(CONFIG.Dice.randomUniform() * 10));
        }

        let shieldMult = traits["shield.mult"]?.value || 0;
        let shieldChange = traits["shield.change"]?.value || 0;

        let shieldLoc = location;
        if (this.options.takeAvgShield)
        {
            shieldLoc = "average";
        }

        shieldOverflow = damage;
        let shieldDamageValue = 0;
        if (this.shields[shieldLoc].value != 0 && !ignoreShields)
        {
            let locationStr = game.i18n.localize(game.impmal.config.RTIM.voidship.hitLocations[shieldLoc].display);
            shieldOverflow = 0;
            let toDamage = (damage * shieldMult) + shieldChange;
            let shieldDamage = this.shields[shieldLoc].value - toDamage;
            
            modifiers.push({value : this.shields[shieldLoc].value, 
                label : `Current Shields (${locationStr})`});
            modifiers.push({value : -toDamage, 
                label : `Shields Damage (${locationStr})${damage != toDamage ? " [Modified]" : ""}`});

            shieldDamageValue = toDamage;
            if (shieldDamage < 0)
            {
                shieldDamageValue = this.shields[shieldLoc].value;
                shieldOverflow = Math.floor((shieldDamage*-1)/2);
                shieldDamage = 0;
                modifiers.push({value : -shieldOverflow, 
                    label : `Shields Overflow`});
            }
            updateObj[`system.shields.${shieldLoc}.value`] = shieldDamage;
        }

        let excess = 0;
        let critical = false;
        let hullDamageValue = 0;
        let text = "";
        if (shieldOverflow > 0)
        {
            let armourLoc = location;
            if (this.options.takeAvgArmour)
            {
                armourLoc = "average";
            }
            let locationStr = game.i18n.localize(game.impmal.config.RTIM.voidship.hitLocations[armourLoc].display);
            let armourMult = traits["armour.mult"]?.value || 0;
            let armourChange = traits["armour.change"]?.value || 0;
            let currentArmour = (this.armour[armourLoc].value * armourMult) + armourChange;
            if (ignoreArmour) currentArmour = 0;

            modifiers.push({value : currentArmour, 
                label : `Armour (${locationStr})${this.armour[armourLoc].value != currentArmour ? " [Modified]" : ""}`});

            if (currentArmour < shieldOverflow)
            {
                let hullMult = traits["hull.mult"]?.value || 0;
                let hullChange = traits["hull.change"]?.value || 0;
                let modifiedDamage = (shieldOverflow * hullMult) + hullChange;
                let toDamage = modifiedDamage - currentArmour;

                let hullDamage = this.hull.value - toDamage;
                hullDamageValue = toDamage;

                modifiers.push({value : this.hull.value, 
                    label : `Current Hull`});
                modifiers.push({value : -toDamage, 
                    label : `Hull Damage${shieldOverflow != modifiedDamage ? " [Modified]" : ""}`});

                if (hullDamage < 0)
                {
                    hullDamageValue = this.hull.value;
                    excess -= hullDamage;
                    critical = true;
                    hullDamage = 0;
                }
                updateObj[`system.hull.value`] = hullDamage;
            }
            else
            {
                text += "No hull damage (Armour). "
            }
        }
        let critModifier = opposed?.attackerTest?.result.critModifier || 0;
        args = {actor : this.parent, type, hullDamageValue, shieldDamageValue, shieldOverflow, damage, opposed, critModifier, location, excess, critical, text, traits, modifiers, context};
        await Promise.all(opposed?.attackerTest?.actor?.runScripts("applyDamage", args) || []);
        await Promise.all(opposed?.attackerTest?.item?.runScripts?.("applyDamage", args) || []);
        await Promise.all(this.parent.runScripts("takeDamage", args)); 
        excess = args.excess + args.critModifier;
        critical = args.critical;
        text = args.text;
        modifiers = args.modifiers;

        if (shieldDamageValue > 0)
        {
            //modifiers.push({value : shieldDamageValue, label : "Damage Taken (Shields)"});
            text += `Shields has taken ${shieldDamageValue} damage. `;
        }
        if (hullDamageValue > 0)
        {
            //modifiers.push({value : hullDamageValue, label : "Damage Taken (Hull)"});
            text += `Hull has taken ${hullDamageValue} damage. `;
            text += thermalPen;
        }
        

        let critString;
        if (excess > 0)
        {
            text += `Ship has taken ${excess} Critical Damage! `;
            modifiers.push({value : -excess, label : "Excess Damage (Critical)"});
            critString = ` <a class="table-roll" data-table="critvoidship" data-formula="${this.getCriticalFormula(excess)}"><i class="fa-solid fa-dice-d10"></i>Critical ${this.getCriticalFormula(excess)}</a>`;
        }

        if (type === "nova")
        {
            let contentNova = `<div class="nova"><div class="chat-message opposed"><span>${text}</span>`;
            
            let novaCrit = ""
            if (hullDamageValue > 0 || excess > 0)
            {
                let criticalChance = Math.ceil(CONFIG.Dice.randomUniform() * 10);
                contentNova += ` Rolled for Nova Critical (1d10, 7+): ${criticalChance}.`
                if (criticalChance > 6)
                {
                    novaCrit += ` <br><div class="opposed opposed-buttons critical"><span class="critical-voidship"><a class="table-roll" data-table="critvoidship" data-formula="1d10"><i class="fa-solid fa-dice-d10"></i>Nova Critical 1d10</a></span></div>`;
                }
            }
            contentNova += `</div>${novaCrit}`
            if (excess > 0) contentNova += `<br><div class="opposed opposed-buttons"><span class="critical-voidship">${critString}</span></div>`;
            
            contentNova += `</div>`
            ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : this.parent}),
                    content : contentNova
                });            
        }

        if (createCriticalMessage && excess > 0)
        {
            ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : this.parent}),
                    content : `${this.parent.name}: ${critString}`
                });      
        }

        if (update)
        {
            await this.parent.update(updateObj);
        }
        let damageData = {
            damage : value,
            text, 
            message : message ? ChatMessage.create({content : (`<p>${text}</p>` + `<p>${(critString ? critString : "")}</p>`), speaker : ChatMessage.getSpeaker({actor : this.parent})}) : null,
            modifiers,
            critical : critString,
            excess,
            location,
            updateObj
        };
        return damageData;
    }

    async moveTokenFoward(token, steps, autoRotate=true, blink=false)
    {
        if (!token) return null;
        VoidshipTokenHandler.moveTokenFoward(token, steps, autoRotate, blink);
    }

    async rotateToken(token, rotation=60) //60 for one side hex, to the right
    {
        if (!token) return null;
        VoidshipTokenHandler.rotateToken(token, rotation);
    }

    async moveTokenSide(token, side, end, autoRotate=false)
    {
        if (!token) return null;
        VoidshipTokenHandler.moveTokenSide(token, side, end, autoRotate);
    }

    setupVoidshipTest({itemId, name, key, actor}, context={}, options, roll=true)
    {
        return VoidshipSetupTests.setupVoidshipTest({itemId, name, key, actor}, context, options, roll, false);
    }


    async computeStartTurn()
    {
        let updateObj = {};
        updateObj["system.actionPoints.value"] = this.actionPoints.max;
        updateObj["system.movementPoints.value"] = this.movementPoints.max;
        updateObj["system.turnRating.current"] = 0;
        if (this.shipType === "minion") updateObj["system.actionPoints.value"] = 1;
        updateObj["system.options.minionTargetUuid"] = "";

        let bonuses = this.bonuses.filter((item) => {
            let remove = !item.removeOnStartTurn;
            if (item.removeAfterTurns >= 0)
            {
                item.removeAfterTurns -= 1;
                remove = item.removeAfterTurns < 0;
            }
            return remove;
        });
        updateObj["system.bonuses"] = bonuses;  

        if (this.fire - this.options.fireResistance > 0)
        {
            this.hull.value -= this.fire - this.options.fireResistance;
            let fireResStr = this.options.fireResistance > 0 ? game.i18n.format("IMPMAL_RTIM.VoidCombat.FireResistanceMessage", { value : this.options.fireResistance}) : "";
            let content = `<i class="fa-solid fa-fire"></i> ${game.i18n.format("IMPMAL_RTIM.VoidCombat.FireDamageMessage", { fire : this.fire})} ${fireResStr}`;
            
            if (this.hull.value < 0)
            {
                let damage = -this.hull.value;
                let critString = ` <a class="table-roll" data-table="critvoidship" data-formula="${this.getCriticalFormula(damage)}"><i class="fa-solid fa-dice-d10"></i>Critical ${this.getCriticalFormula(damage)}</a>`;
                content += `<br><i class="fa-solid fa-fire"></i><i class="fa-solid fa-fire"></i><i class="fa-solid fa-fire"></i> ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.FireCriticalMessage")} <br><div class="criticalButton"><p>${critString}</p></div>`;
                
                this.hull.value = 0;
            }
            ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : this.parent}),
                    content : content
                });
            updateObj["system.hull.value"] = this.hull.value;
        }

            
        const roleItems = this.parent?.items?.filter(item => item.system?.partType === "role") || [];
        roleItems.forEach((item) => {
            let updateItem = {};
            if (item.system.role.action.cooldown > item.system.role.action.cooldownCount)
            {
                updateItem["system.role.action.cooldownCount"] = item.system.role.action.cooldownCount + 1;
            }
            if (item.system.role.actionUpgraded.cooldown > item.system.role.actionUpgraded.cooldownCount)
            {
                updateItem["system.role.actionUpgraded.cooldownCount"] = item.system.role.action.cooldownCount + 1;
            }
            item.update(updateItem);
        });
        Object.keys(this.actionCosts).forEach((key) => {
            if (this.actionCosts[key].byTurn > 0)
            {
                updateObj[`system.actionCosts.${key}.byTurn`] = 0;
            }
        });

        
        if (this.parent.hasCondition('evasiveManeuvers'))
        {
            this.parent.removeCondition('evasiveManeuvers');
        }

        this.parent.update(updateObj);
    }

    async computeEndCombat()
    {
        if (!this.autoCalc.endCombat) return;
        let updateObj = {};
        updateObj["system.actionPoints.value"] = this.actionPoints.max;
        updateObj["system.movementPoints.value"] = this.movementPoints.max;
        updateObj["system.turnRating.current"] = 0;

            
        
        updateObj["system.options.restartShieldsDifficulty"] = "routine";         
        updateObj["system.options.defyDeath.resetOnEnd"] = 0; 
        updateObj["system.options.defyDeath.used"] = false;   

        Object.keys(this.actionCosts).forEach((key) => {
            if (this.actionCosts[key].byTurn > 0)
            {
                updateObj[`system.actionCosts.${key}.byTurn`] = 0;
            }
        });

        const roleItems = this.parent?.items?.filter(item => item.system?.partType === "role") || [];
        roleItems.forEach((item) => {
            let updateItem = {};
            updateItem["system.role.action.cooldownCount"] = item.system.role.action.cooldown;
            updateItem["system.role.actionUpgraded.cooldownCount"] = item.system.role.actionUpgraded.cooldown;
            item.update(updateItem);
        });
        this.parent.update(updateObj);
    }

    async computeEndTurn()
    {
        let updateObj = {};

        let bonuses = this.bonuses.filter((item) => {
            return !item.removeOnEndTurn;
        });
        bonuses = bonuses.map((item) => {
            if (item.removeOnNextEndTurn)
            {
                item.removeOnNextEndTurn = false;
                item.removeOnEndTurn = true;
            }
        });
        updateObj["system.bonuses"] = bonuses;  

        if (this.options.defyDeath.resetOnEnd > 0 && this.options.defyDeath.used)
        {
            updateObj["system.options.defyDeath.resetOnEnd"] = this.options.defyDeath.resetOnEnd-1;
            if ((this.options.defyDeath.resetOnEnd-1) == 0)
            {
                let changedRoles = [];
                this.options.defyDeath.roleIds.forEach(key =>
                {
                    let item = this.parent.items.get(key);
                    if (item && !item.system.active && item.system.status === "default")
                    {
                        item.update({"system.active": true});
                        changedRoles.push(item);
                    }
                })
                updateObj["system.options.defyDeath.roleIds"] = [];
                ui.notifications.info(`Defy Death! ${changedRoles.map(item => item.name).join(", ")} were activated back!`);
            }
        }

        this.parent.update(updateObj);
    }

    getBonuses(type, itemId)
    {
        if (type == "type") return this.bonuses;
        let modifiers = this.bonuses.filter((bonus) => {
            return (bonus.type.includes(type) || bonus.type.includes("all")) || bonus.items.includes(itemId);
        });
        return modifiers;
    }
    
    handleMovement({movement, preMove})
    {
        if (!this.autoCalc.movement) return preMove;
        let movementCost = movement?.passed?.cost ?? 0;
        let movedHexes = movement?.passed?.spaces ?? 0;
        if (movedHexes > 0)
        {
            movementCost = movementCost * this.movementMult;
            
            if (movementCost > this.movementPoints.value)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NotEnoughMovement"));
                if (preMove && !this.autoCalc.allowMovement) return false;
            }
            if (preMove) return true;
            
            movementCost = this.movementPoints.value - movementCost;
            if (movementCost < 0) movementCost = 0;
            this.parent.update({ "system.movementPoints.value": movementCost})
        }
    }

    async defyDeath()
    {
        if (this.options.defyDeath.used)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.CantDefyDeathUsed"));
            return;
        }

        let amountRoles = this.options.defyDeath.amountRoles;
        let roles = this.parent.items
            .filter(item => item.system?.partType === "role")
            .filter(item => item.system.status === "default" && item.system.active);
        if (!roles || roles.length < amountRoles)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.CantDefyDeathRoles"));
            return;
        }

        let defyDeathRoles = "";
        let updateObj = {};
        if (amountRoles > 0)
        {
            let chosenItems = [];
            if (!game.settings.get("impmal-rtim", "voidcombatSettings").randomDamaged)
            {
                let resultItems = (await ItemDialog.create(roles, amountRoles, 
                    {title : "List of Roles", text: `Choose ${amountRoles}}`}));
                if (resultItems && resultItems.length > 0) chosenItems = resultItems;
                if (chosenItems.length < amountRoles) 
                {
                    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.CantDefyDeathRoles"));
                    return;
                }
            }
            else
            {
                for (let i = 0; i < amountRoles; i++) {
                    let random = Math.floor(CONFIG.Dice.randomUniform() * roles.length);
                    chosenItems.push(roles[random]);
                    roles.splice(random, 1);
                }
            }

            if (!chosenItems || chosenItems.length == 0) return;
            defyDeathRoles = chosenItems.map(item => item.name).join(", ");
            updateObj["system.options.defyDeath.roleIds"] = chosenItems.map(item => item.id);
            chosenItems.forEach(item => {
                item.update({"system.active": false});
            });
        }

        updateObj["system.options.defyDeath.used"] = true;
        updateObj["system.options.defyDeath.resetOnEnd"] = 2;
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				`The ship DEFIES DEATH! Roles were deactivated until end of the next turn: ${defyDeathRoles}`
			});  
        await this.parent.update(updateObj);    
    }
    
    getMovementCost(type) {        
        switch (type)
        {
            case "ramming":
            case "silentRunning":
                return this.actionCosts[type].value ?? 0;
            case "evasiveManeuvers":
                return this.actionCosts.evasiveManeuvers.value ?? this.movementPoints.max;
        }
        return 0;
    }

    getActionCost(type) {        
        switch (type)
        {
            case "scanMinion":
            case "repairMinion":
                return 1;
            case "repair":
            case "rally":
            case "scan":
            case "seek":
                return (this.actionCosts[type].value) ?? 1;
            case "boarding":
            case "reloadSpecial":
            case "reloadTorpedoes":
            case "reloadNovaCannon":
            case "reloadSquadrons":
            case "restartShields":
                return (this.actionCosts[type].value) ?? 2;
        }
        return 0;
    }  
}
