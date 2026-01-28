export class VoidshipTestDialog extends CharacteristicTestDialog
{

    static DEFAULT_OPTIONS = {
        form : {
            handler : this.submit,
            submitOnChange : false,
            closeOnSubmit : true,
        }
    };

    constructor(...args)
    {
        super(...args);
        this.data.hitLocations = {
            "aft" : "IMPMAL_RTIM.VoidCombat.Aft",
            "fore" : "IMPMAL_RTIM.VoidCombat.Fore",
            "port" : "IMPMAL_RTIM.VoidCombat.Port",
            "starboard" : "IMPMAL_RTIM.VoidCombat.Starboard",
        };

    }

    get skillItem() 
    {
        return this.actor.items.get(this.data.skillItemId);
    }

    get skill()
    {
        return this.data.skill;
    }

    get weapon() 
    {
        return this.actor.items.get(this.data.weaponId ?? this.data.itemId);
    }

    get item()
    {
        return this.actor.items.get(this.data.itemId ?? this.data.weaponId);
    }


    static PARTS = {
        fields : {
            template : "systems/impmal/templates/apps/test-dialog/test-dialog.hbs",
            fields: true
        },
        voidship : {
            template : "modules/impmal-rtim/voidcombat/templates/tests/dialog-voidship.hbs",
            fields: true
        },
        state : {
            template : "systems/impmal/templates/apps/test-dialog/dialog-state.hbs",
            fields: true
        },
        mode : {
            template : "modules/warhammer-lib/templates/apps/dialog/dialog-mode.hbs",
            fields: true
        },
        modifiers : {
            template : "modules/warhammer-lib/templates/partials/dialog-modifiers.hbs",
            modifiers: true
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    }

    
    async computeFields() 
    {
        super.computeFields();

        if (this.fields.useSizePenalty)
        {
            this.fields.modifier -= this.fields.shipSize;
            this.tooltips.add("modifier", -this.fields.shipSize, "Size Penalty");
        }

        if (this.fields.useHalfRange)
        {
            this.advCount++;
            this.tooltips.add("advantage", 1, "Target in Half Range");
        }

        if (this.fields.useEvasiveManeuvers)
        {
            this.disCount++;
            this.tooltips.add("disadvantage", 1, "In Evasive Maneuvers");
        }

        if (this.fields.useWeaponDamaged)
        {
            this.disCount++;
            this.tooltips.add("disadvantage", 1, "Weapon is damaged");
        }

        if (this.fields.useDetection)
        {
            this.fields.modifier += this.fields.detectionRating;
            this.tooltips.add("modifier", this.fields.detectionRating, "Using Detection Rating");
        }

        if (this.fields.useEvasion)
        {
            this.fields.modifier += this.fields.evasionRating;
            this.tooltips.add("modifier", this.fields.evasionRating, "Using Evasion Rating");
        }

        if (this.fields.useTurret)
        {
            this.fields.modifier += this.fields.turretRating;
            this.tooltips.add("modifier", this.fields.turretRating, "Using Turret Rating");
        }

        if (this.fields.useHalfTurret)
        {
            this.fields.modifier -= this.fields.useHalfTurret;
            this.tooltips.add("modifier", -this.fields.useHalfTurret, "Turret Rating Halved (Assault Boats)");
        }

        if (this.fields.useWeaponRating)
        {
            this.fields.modifier += this.fields.weaponRating;
            this.tooltips.add("modifier", this.fields.weaponRating, "Using Weapon Rating");
        }

        if (this.fields.useEnemyEvasion)
        {
            this.fields.modifier -= this.fields.enemyEvasionRating;
            this.tooltips.add("modifier", -this.fields.enemyEvasionRating, "Using Enemy Evasion Rating");
        }

        if (this.fields.useEnemyTurret)
        {
            this.fields.modifier -= this.fields.enemyTurretRating;
            this.tooltips.add("modifier", -this.fields.enemyTurretRating, "Using Enemy Turret Rating");
        }

        if (this.fields.useEnemyEvasiveManeuvers)
        {
            this.fields.SL -= this.fields.enemyEvasiveManeuversSL;
            this.disCount++;
            this.tooltips.add("disadvantage", 1, "Enemy Evasive Maneuvers");
            this.tooltips.add("SL", -this.fields.enemyEvasiveManeuversSL, "Enemy Evasive Maneuvers");
        }

        if (this.fields.escortingSquadrons > 0)
        {
            this.advCount++;
            this.fields.SL += (this.fields.escortingSquadrons - 1);
            this.tooltips.add("advantage", 1, "Squadron is Escorted");
            if (this.fields.escortingSquadrons > 1)
                this.tooltips.add("SL", (this.fields.escortingSquadrons - 1), "Squadron is Escorted");
        }

        if (this.fields.alliedSquadrons > 0)
        {
            this.fields.SL += this.fields.alliedSquadrons;
            this.tooltips.add("SL", this.fields.alliedSquadrons, "Allied Squadrons in Range");
        }

        if (this.fields.minionTargetUuid)
        {
            this.fields.SL += 1;
            this.tooltips.add("SL", 1, "Target of Scan");
        }

        if (this.fields.leftoverMovement > 0)
        {
            this.fields.damage += this.fields.leftoverMovement;
            this.tooltips.add("damage", this.fields.leftoverMovement, "Leftover MP");
        }
        
        if (this.data.bonuses?.length !== 0)
        {   
            this.data.bonuses.map((bonus) =>{
                if (bonus.SL)
                {
                    this.fields.SL += bonus.SL;
                    this.tooltips.add("SL", bonus.SL, bonus.comment);
                }
                if (bonus.modifier)
                {
                    this.fields.SL += bonus.modifier;
                    this.tooltips.add("modifier", bonus.modifier, bonus.comment);
                }
                if (bonus.advantage)
                {
                    this.advCount++;
                    this.tooltips.add("advantage", 1, bonus.comment);
                }
                if (bonus.disadvantage)
                {
                    this.disCount++;
                    this.tooltips.add("disadvantage", 1, bonus.comment);
                }
                if (bonus.damage)
                {
                    this.fields.damage += bonus.damage;
                    this.tooltips.add("damage", bonus.damage, bonus.comment);
                }
            });
        }
    }

    /**
     * 
     * @param {string} characteristic Characteristic key, such as "ws" or "str"
     * @param {object} actor Actor performing the test
     * @param {object} title Customize dialog title
     * @param {string} title.replace Replace dialog title
     * @param {string} title.append Append to dialog title
     * @param {object} fields Predefine dialog fields
     */
    static setupData({itemId, name, key}, actor, context={}, options)
    {   
        log(`${this.prototype.constructor.name} - Setup Dialog Data`, {args : Array.from(arguments).slice(2)});

        let skillItem = actor.items.get(itemId);
        
        // If name provided, find Skill by name (and make sure key is correct)
        if (!skillItem)
        {
            skillItem = actor.items.find(i => 
                i.type == "specialisation" && 
                i.name == name && 
                i.system.skill == key);
        }
        let skillKey = key || skillItem.system.skill;
        let skillObject = actor.system.skills[skillKey];
        let characteristic = skillObject.characteristic;

        let dialogData = super.setupData(characteristic, actor, context, options);

        dialogData.fields.difficulty = context?.difficulty || "challenging";

        dialogData.fields.damage = context?.damage ?? 0;
        // TODO find a way to avoid duplicating this code from the parent class
        dialogData.data.title = (context.title || game.i18n.format("IMPMAL_RTIM.VoidCombat.VoidshipTest", {skill : game.impmal.config.skills[skillKey] + (skillItem?.name ? ` (${skillItem.name})` : "")})) + (context.appendTitle || "");

        dialogData.data.skillItemId = skillItem?.id;
        dialogData.data.skill = skillKey;

        dialogData.data.weapon = context?.weapon;
        dialogData.data.item = context?.weapon;

        let item = actor.items.get(context?.itemId ?? context?.weaponId);

        if (item?.system.partType === "weapon") dialogData.data.damageFormula = item.system.weapon.damageFormula;

        if (skillItem)
        {
            dialogData.data.scripts = dialogData.data.scripts.concat(skillItem.getScripts("dialog").filter(i => !i.options.defending));
        }

        let targetActor;
        if (context?.targetActorId)
        {
            targetActor = fromUuidSync(context.targetActorId);
        }

        if (targetActor && (context?.type === "shooting" || context?.type === "torpedoSalvo"))
        {
            dialogData.fields.hasEnemyEvasiveManeuvers = targetActor.system.options.evasiveManeuvers.value ?? false;
            dialogData.fields.useEnemyEvasiveManeuvers = targetActor.system.options.evasiveManeuvers.value ?? false;
            dialogData.fields.enemyEvasiveManeuversSL = targetActor.system.options.evasiveManeuvers.slPenalty ?? 0;            
        }

        if (context?.type === "shooting")
        {
            dialogData.fields.hasHalfRange = true;
            dialogData.fields.useHalfRange = context?.useHalfRange ?? false;       
            dialogData.fields.minionTargetUuid = (actor.system.options.minionTargetUuid === context?.targetActorId) ? actor.system.options.minionTargetUuid : "";     
        }

        dialogData.fields.distanceToTarget = context?.distanceToTarget ?? 0;

        dialogData.fields.targetCriticalFatigue = context?.targetCriticalFatigue ?? false;

        dialogData.fields.hasWeaponRating = context?.hasWeaponRating ?? false;
        dialogData.fields.useWeaponRating = context?.hasWeaponRating ?? false;  
        dialogData.fields.weaponRating = item?.system?.weapon?.rating || 0;  

        dialogData.data.bonuses = actor.system.getBonuses(context?.type, context?.itemId ?? context?.weaponId);

        dialogData.data.moveTo = context?.moveTo;

        dialogData.fields.hasDamage = context?.hasDamage ?? false;
        dialogData.fields.damage = context?.damage ?? 0;

        dialogData.fields.hasHitLocation = context?.hitLocation ? true : false;
        dialogData.fields.hitLocation = context?.hitLocation;
        dialogData.data.hitLocation = context?.hitLocation;

        dialogData.fields.hasSelfDamage = context?.selfDamage ? true : false;
        dialogData.fields.selfDamage = context?.selfDamage ?? 0;
        dialogData.data.selfDamage = context?.selfDamage ?? 0;

        dialogData.fields.dogfight = context?.dogfight ?? false;
        dialogData.fields.alliedSquadrons = 0;
        dialogData.fields.dogfightOpposed = context?.dogfightOpposed ?? false;
        dialogData.fields.escortingSquadrons = 0;

        dialogData.fields.hasWeaponDamaged = context?.hasWeaponDamaged ?? false;
        dialogData.fields.useWeaponDamaged = context?.useWeaponDamaged ?? false;       

        dialogData.fields.characteristic = context.fields?.characteristic || skillObject.characteristic;    

        dialogData.fields.useSizePenalty = context?.useSizePenalty ?? false;
        dialogData.fields.shipSize = actor?.system?.size?.value || 0;
        
        dialogData.fields.type = context?.type;
        dialogData.fields.weaponType = context?.weaponType;
        dialogData.data.weaponId = context?.weaponId;
        dialogData.fields.weaponId = context?.weaponId;
        dialogData.data.itemId = context?.itemId;
        dialogData.fields.itemId = context?.itemId;

        dialogData.fields.inEvasiveManeuvers = context?.inEvasiveManeuvers ?? false;
        dialogData.fields.useEvasiveManeuvers = context?.inEvasiveManeuvers ?? false;
        
        dialogData.fields.hasEnemyTurret = context?.hasEnemyTurret ?? false;
        dialogData.fields.useEnemyTurret = context?.useEnemyTurret ?? false;
        dialogData.fields.enemyTurretRating = targetActor?.system?.turretRating?.value || 0;        
        
        dialogData.fields.hasEnemyEvasion = context?.hasEnemyEvasion ?? false;
        dialogData.fields.useEnemyEvasion = context?.useEnemyEvasion ?? false;
        dialogData.fields.enemyEvasionRating = targetActor?.system?.evasionRating?.value || 0;
        
        dialogData.fields.hasTurret = context?.hasTurret ?? false;
        dialogData.fields.useTurret = context?.useTurret ?? false;
        dialogData.fields.turretRating = actor?.system?.turretRating?.value || 0;
        
        dialogData.fields.leftoverMovement = context?.leftoverMovement ?? 0;
        dialogData.data.leftoverMovement = context?.leftoverMovement ?? 0;

        dialogData.fields.useHalfTurret = context?.useHalfTurret ?? false;
        if (dialogData.fields.useHalfTurret)
        {
            dialogData.fields.assaultHalfTurret = Math.max(Math.ceil(dialogData.fields.turretRating/2), 0);
            dialogData.fields.useAssaultHalfTurret = true;
        }

        dialogData.fields.hasDetection = context?.hasDetection ?? false;
        dialogData.fields.useDetection = context?.useDetection ?? false;
        dialogData.fields.detectionRating = actor?.system?.detectionRating?.value || 0;
        
        dialogData.fields.hasEvasion = context?.hasEvasion ?? false;
        dialogData.fields.useEvasion = context?.useEvasion ?? false;
        dialogData.fields.evasionRating = actor?.system?.evasionRating?.value;

        log(`${this.prototype.constructor.name} - Dialog Data`, {args : dialogData});
        return dialogData;
    }

    static submit(ev)
    {
        ev.preventDefault();
        ev.stopPropagation();
        
        if (this.context.type === "torpedoSalvo")
        {
            let item = this.actor.items.get(this.context.weaponId);
            item?.update({"system.weapon.torpedo.salvos.value" : Math.max(item.system.weapon.torpedo.salvos.value - 1, 0)});
        }
        if (this.context.type === "role")
        {            
            let item = this.actor.items.get(this.context.itemId);
            let path = `system.role.action${this.context.roleUpgraded ? "Upgraded" : ""}.cooldownCount`
            item?.update({[path] : 0});
        }
        if (this.context.type === "restartShields")
        {   
            let difficulties = ['veryEasy','easy','routine','challenging','difficult','hard','veryHard','disabled'];
            let index = difficulties.indexOf(this.actor.system.options.restartShieldsDifficulty);
            index++;
            this.actor.update({ "system.options.restartShieldsDifficulty": difficulties[index] })
            
        }
        if (this.data.bonuses?.length !== 0)
        {
            let bonusesToRemove = this.data.bonuses.filter((bonus) => {
                return bonus.removeOnNextTest;
            });
            let bonuses = this.actor.system.bonuses.filter(bonus => !bonusesToRemove.includes(bonus));;
            this.actor.update({"system.bonuses" : bonuses});  
        }
        if (this.context.type === "evasiveManeuvers")
        {   
            this.actor.update({"system.movementPoints.value" : Math.floor(this.actor.system.movementPoints.value/2)}); 
            
        }
        if (this.context.type === "nova")
        {
            let item = this.actor.items.get(this.context.weaponId);
            item?.update({"system.weapon.reloaded" : false});
        }
        if (this.data.moveTo)
        {
            let token = this.actor.token;
            if (!token) //we got the unlinked token otherwise
            {
                token = this.actor.getActiveTokens()[0];
                if (!token)
                {
                    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
                    return super.submit(ev);
                }
            }
            let doc = token.document ?? token;
            doc.move([ { 
                x : this.data.moveTo.x, 
                y : this.data.moveTo.y, 
                action : "freeMove" 
            } ], 
            {
                autoRotate : true,
                freeMove : true
            });
        }
        return super.submit(ev);
    }
}