import { VoidshipTest } from "./voidship-test.js";
import { VoidshipTestDialog } from "./voidship-test-dialog.js";
import { VoidshipAttackTest } from "./voidship-attack-test.js";
import { VoidshipTokenHandler } from "../voidship-token-handler.js";
import { VoidshipMessageModel } from "./voidship-message-model.js";

export class VoidshipSetupTests 
{
    actor = undefined;

    static setupVoidshipTest({itemId, name, key, actor}={}, context={}, options, roll=true)
    {
        if (actor) this.actor = actor;
        return this.actor._setupTest(VoidshipTestDialog, VoidshipTest, {itemId, name, key}, context, options, roll, false);
    }

    static setupVoidshipAttackTest({itemId, name, key, actor}={}, context={}, options, roll=true)
    {
        if (actor) this.actor = actor;
        return this.actor._setupTest(VoidshipTestDialog, VoidshipAttackTest, {itemId, name, key}, context, options, roll, false);
    }   

    static computeActionCost(type)
    {
        if (this.actor.system.noActionPoints) return;

        if (this.actor.system.actionPoints.value < this.actor.system.getActionCost(type)){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NotEnoughActionPoints"));
            return false;
        }
        return true;
    }
    

    static computeMovementCost(type)
    {
        if (this.actor.system.movementPoints.value < this.actor.system.getMovementCost(type)){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NotEnoughMovementPoints"));
            return false;
        }
        return true;
    }


    static setupSeekTest(actor, fromAction=false)
    {
        if (!actor) return;
        this.actor = actor;
        
        let key = "awareness";
        let spec = this.actor.system.skills.awareness.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Void")?.slugify()); 

        if (fromAction && !this.computeActionCost("seek") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        let context = { 
            voidshipTest: true, 
            type: "seek", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.SeekAction")}`,
            useDetectionMode: "full", 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupOpposedSeekTest(actor) 
    {
       return this.setupSeekTest(actor);
    }

    static setupSilentRunningTest(actor, fromAction=false) 
    {
        if (!actor) return;
        this.actor = actor;
                
        let key = "piloting";
        let spec = this.actor.system.skills.piloting.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.MajorVoidship")?.slugify());;  
        
        let context = { 
            voidshipTest: true, 
            type: "silentRunning", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.SilentRunning")}`,
            useSizePenalty: true
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupOpposedSilentRunningTest(actor) 
    {
       return this.setupSilentRunningTest(actor);
    }
    
    static setupEvasiveManeuversTest(actor, fromAction=false)
    {
        if (!actor) return;
        this.actor = actor;

        let key = "piloting";
        let spec = this.actor.system.skills.piloting.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.MajorVoidship")?.slugify());;  
        
        if (!this.computeMovementCost("evasiveManeuvers") && !this.actor.system.autoCalc.allowNoPoints) {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NotEnoughMovementPoints"));
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});
  
        let context = { 
            voidshipTest: true, 
            type: "evasiveManeuvers", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.EvasiveManeuvers")}`,  
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);

    }

    static setupOpposedRammingTest(actor, fromAction=false)
    {
        if (!actor) return;
        this.actor = actor;

        let key = "piloting";
        let spec = this.actor.system.skills.piloting.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.MajorVoidship")?.slugify());;  
        
        let token = this.actor.token;
        if (!token) //we got the unlinked token otherwise
        {
            token = this.actor.getActiveTokens()[0];
            if (!token)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
                return null;
            }
        }

        let context = { 
            voidshipTest: true, 
            type: "rammingOpposed", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.OpposedRamming")}`, 
            useEvasionMode: "full", 
        };
        
        return this.setupVoidshipAttackTest({itemId : spec?.id, key}, context);
    }

    static setupRammingManeuverTest(actor, fromAction=false)
    {
        if (!actor) return;
        this.actor = actor;

        let key = "piloting";
        let spec = this.actor.system.skills.piloting.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.MajorVoidship")?.slugify());;  
        
        if (fromAction && !this.computeActionCost("ramming") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        let token = this.actor.token;
        if (!token) //we got the unlinked token otherwise
        {
            token = this.actor.getActiveTokens()[0];
            if (!token)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
                return null;
            }
        }

        let targetToken = game?.user?.targets?.first();
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
            return null;
        }
        
        let rammingLine = null;
        if (targetToken) {
            rammingLine = VoidshipTokenHandler.isTargetInHexLine(token, targetToken);
            if (!rammingLine.inLine) {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NotInRammingLine"));
                return null;
            }
        }

        let hitSide = VoidshipTokenHandler.getTargetHitSide(token, targetToken);
        let moveTo = VoidshipTokenHandler.getNearestHexToTarget(token, targetToken);
        
        let distance = VoidshipTokenHandler.getTargetDistance(token, targetToken);

        let context = { 
            voidshipTest: true, 
            type: "ramming", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.RammingManeuver")}`, 
            targetActorId : targetToken?.actor?.uuid,
            hitLocation: hitSide?.side,
            hasDamage: true,
            damage: this.actor.system.options.rammingDamage,
            moveTo,
            leftoverMovement : Math.max(this.actor.system.movementPoints.value - this.actor.system.actionCosts.ramming.value, 0),
            distanceToTarget : distance
        };
        
        return this.setupVoidshipAttackTest({itemId : spec?.id, key}, context);
    }    

    static setupRepairTest(actor, fromAction=false) {
        if (!actor) return;
        this.actor = actor;

        let key = "tech";
        let spec = this.actor.system.skills.tech.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Voidship")?.slugify());;  
        
        if (fromAction && !this.computeActionCost("repair") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});

        let context = { 
            voidshipTest: true, 
            type: "repair",
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.RepairAction")}`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupRepairMinionTest(actor, fromAction=false) {
        if (!actor) return;
        this.actor = actor;

        if (fromAction && !this.computeActionCost("repair") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        this.actor.update({"system.actionPoints.value": 0});

        VoidshipMessageModel.postRepairMinion({ actor })
    }

    static setupRallyTest(actor, fromAction=false) {
        if (!actor) return;
        this.actor = actor;

        let key = "rapport";
        let spec = this.actor.system.skills.rapport.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Rallying")?.slugify());;  
        
        if (fromAction && !this.computeActionCost("rally") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});

        let context = { 
            voidshipTest: true, 
            type: "rally",
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.RallyAction")}`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupScanTest(actor, fromAction=false) {
        if (!actor) return;
        this.actor = actor;

        let key = "awareness";
        let spec = this.actor.system.skills.awareness.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Void")?.slugify());;  
        
        if (fromAction && !this.computeActionCost("scan") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});

        let context = { 
            voidshipTest: true, 
            type: "scan",
            useDetectionMode: "full", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ScanAction")}`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupScanMinionTest(actor, fromAction=false) {
        if (!actor) return;
        this.actor = actor;

        if (fromAction && !this.computeActionCost("repair") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        let targetToken = game?.user?.targets?.first();
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
            return;
        }
        
        this.actor.update({"system.options.minionTargetUuid": targetToken.actor.uuid, "system.actionPoints.value": 0});
        
        ui.notifications.info(game.i18n.format("IMPMAL_RTIM.VoidCombat.MinionTarget", { target: targetToken.name }));
    }
    
    static setupBoardingTest(actor, fromAction=false) {
        if (!actor) return;
        this.actor = actor;

        let key = "presence";
        let spec = this.actor.system.skills.presence.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Boarding")?.slugify());;  
        
        let token = actor.token;
        if (!token) //we got the unlinked token otherwise
        {
            token = actor.getActiveTokens()[0];
            if (!token)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
                return;
            }
        }

        let targetToken = game?.user?.targets?.first();
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
            targetToken = null;
        }

        let distance = VoidshipTokenHandler.getTargetDistance(token, targetToken);
        if (distance)
        {
            if (distance > actor.system.options.boardingRange){
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OutsideBoarding"));
                if (!this.actor.system.autoCalc.allowOutsideRange) return;
            }
        }

        if (fromAction && !this.computeActionCost("boarding") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        let context = { 
            voidshipTest: true, 
            type: "boarding",
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.BoardingAction")}`, 
            targetActorId : targetToken?.actor?.uuid,
            distanceToTarget : distance,
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupOpposedBoardingTest(actor) {
        if (!actor) return;
        this.actor = actor;

        let key = "rapport";
        let spec = this.actor.system.skills.rapport.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Rallying")?.slugify());;  
        
        let context = { 
            voidshipTest: true, 
            type: "opposedBoarding",
            useTurretMode: "full", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.OpposedBoarding")}`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);

    }

    static setupRestartShieldsTest(actor, fromAction=false) {
        if (!actor) return;
        this.actor = actor;

        let key = "logic";
        let spec = this.actor.system.skills.logic.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Complex")?.slugify());;  
        
        if (this.actor.system.options.restartShieldsDifficulty === "disabled")
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.RestartShieldsActionDifficultyTooHigh"));
            return;
        }

        if (fromAction && !this.computeActionCost("restartShields") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});

        let context = { 
            voidshipTest: true, 
            type: "restartShields",
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.RestartShieldsAction")}`, 
            difficulty: this.actor.system.options.restartShieldsDifficulty
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupReloadSpecialTest(actor, fromAction=false) {
        if (!actor) return;
        this.actor = actor;

        let key = "rapport";
        let spec = this.actor.system.skills.rapport.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Rallying")?.slugify());;  
        
        if (fromAction && !this.computeActionCost("reloadSpecial") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});

        let context = { 
            voidshipTest: true, 
            type: "reloadSpecial",
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ReloadAction")} (${game.i18n.localize("IMPMAL_RTIM.VoidCombat.Special")})`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupNovaCannonTest(actor, fromAction=false, item)
    {
        if (!actor) return;
        this.actor = actor;
        
        let key = "ranged";
        let spec = this.actor.system.skills.ranged.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Voidship")?.slugify());
        
        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }
        
        if (item.system.status === "destroyed")
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponDestroyed"));
            return;
        }

        if (item.system.weapon.reloaded === false)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponNotReloaded"));
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});
        
        let context = { 
            voidshipTest: true, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.NovaCannonTest")}`,
            type: "nova",  
            weaponType: item.system.weapon.type,
            weaponId: item.id, 
            hasDamage: true,
            useDetectionMode: "full", 
            difficulty: "hard",
            targetCriticalFatigue: true,
            hasWeaponDamaged: item.system.status === "damaged", 
            useWeaponDamaged: item.system.status === "damaged"
        };
        
        return this.setupVoidshipAttackTest({itemId : spec?.id, key}, context);
    }

    static setupReloadNovaCannonTest(actor, fromAction=false, item)
    {
        if (!actor) return;
        this.actor = actor;

        let key = "rapport";
        let spec = this.actor.system.skills.rapport.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Rallying")?.slugify());;  
        
        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        if (fromAction && !this.computeActionCost("reloadNovaCannon") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});

        let context = { 
            voidshipTest: true, 
            type: "reloadNovaCannon",
            weaponId: item.id, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ReloadAction")} (${game.i18n.localize("IMPMAL_RTIM.VoidCombat.NovaCannon")})`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);        
    }

    static setupReloadTorpedoesTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;

        let key = "rapport";
        let spec = this.actor.system.skills.rapport.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Rallying")?.slugify());;  
            
        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        if (fromAction && !this.computeActionCost("reloadTorpedoes") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});

        let context = { 
            voidshipTest: true, 
            type: "reloadTorpedoes",
            weaponId: item.id, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ReloadAction")} (${game.i18n.localize("IMPMAL_RTIM.VoidCombat.Torpedoes")})`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupOpposedTorpedoSalvoTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;

        let key = "awareness";
        let spec = this.actor.system.skills.awareness.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Void")?.slugify());;  
        
        let context = { 
            voidshipTest: true, 
            type: "opposedTorpedoSalvo",
            useTurretMode: "full", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.OpposedTorpedoSalvoTest")}`, 
            targetCriticalFatigue: true,
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupTorpedoSalvoTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;

        let key = "navigation";
        let spec = this.actor.system.skills.navigation.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Void")?.slugify());;  
            
        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        let targetToken = game?.user?.targets?.first();
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
            return
        }

        if (item.system.status === "destroyed")
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponDestroyed"));
            return;
        }

        if (item.system.weapon.torpedo.salvos.value == 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoTorpedoSalvos"));
            return;
        }
        
        let context = { 
            voidshipTest: true, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.TorpedoSalvoTest")}`,
            type: "torpedoSalvo",  
            weaponType: item.system.weapon.type,
            weaponId: item.id, 
            hasDamage: true,
            hasWeaponRating: true,
            hasWeaponDamaged: item.system.status === "damaged", 
            useWeaponDamaged: item.system.status === "damaged", 
            hitLocation: "fore",
            targetCriticalFatigue: true,
            targetActorId : targetToken?.actor?.uuid };
        
        return this.setupVoidshipAttackTest({itemId : spec?.id, key}, context);
    }

    static setupReloadSquadronsTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;

        let key = "rapport";
        let spec = this.actor.system.skills.rapport.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Rallying")?.slugify());;  
        
        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        if (fromAction && !this.computeActionCost("reloadSquadrons") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }  

        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});

        let context = { 
            voidshipTest: true, 
            type: "reloadSquadrons",
            weaponId: item.id, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ReloadAction")} (${game.i18n.localize("IMPMAL_RTIM.VoidCombat.Squadrons")})`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupOpposedSquadronAssaultBoardingTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;

        let key = "rapport";
        let spec = this.actor.system.skills.rapport.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Rallying")?.slugify());;  
        
        let context = { 
            voidshipTest: true, 
            type: "opposedAssaultBoarding",
            useTargetTurretMode: "half",
            targetCriticalFatigue: true,
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.OpposedAssaultBoardingTest")}`, 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupSquadronAssaultBoardingTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;

        let key = "presence";
        let spec = this.actor.system.skills.presence.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Boarding")?.slugify());;  
          
        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        let targetToken = game?.user?.targets?.first();
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
            return;
        }

        if (fromAction && !this.computeActionCost("boarding") && !this.actor.system.autoCalc.allowNoPoints) {
            return;
        }

        let context = { 
            voidshipTest: true, 
            type: "assaultBoarding",
            hasWeaponRating: true,
            weaponId: item.id, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.AssaultBoardingTest")}`, 
            targetCriticalFatigue: true,
            targetActorId : targetToken?.actor?.uuid 
        };
        
        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }

    static setupSquadronBomberRunTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;
        
        let key = "navigation";
        let spec = this.actor.system.skills.navigation.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Void")?.slugify());
        
        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        if (item.system.status === "destroyed")
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponDestroyed"));
            return;
        }

        let targetToken = game?.user?.targets?.first();
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
            return;
        }
        
        let context = { 
            voidshipTest: true, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.BomberRunTest")}`,
            type: "bomberRun",  
            weaponType: item.system.weapon.type,
            weaponId: item.id, 
            hasWeaponRating: true,
            hasDamage: true,
            targetCriticalFatigue: true,
            hasWeaponDamaged: item.system.status === "damaged", 
            useWeaponDamaged: item.system.status === "damaged", 
            targetActorId : targetToken?.actor?.uuid };
        
        return this.setupVoidshipAttackTest({itemId : spec?.id, key}, context);
    }

    static setupOpposedSquadronBomberRunTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;
        
        let skill = "awareness";
        let spec = this.actor.system.skills.awareness.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Void")?.slugify());
        
        let context = { 
            voidshipTest: true, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.OpposedBomberRunTest")}`,
            type: "bomberRunOpposed", 
            useTurretMode: "full", 
            targetCriticalFatigue: true,
         };
        
        return this.setupVoidshipTest({itemId : spec?.id, key : skill}, context);    
    }

    static setupSquadronDogfightTest(actor, fromAction=false, item) 
    {
        if (!actor) return;
        this.actor = actor;
        
        let skill = "navigation";
        let spec = this.actor.system.skills.navigation.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Void")?.slugify());
        
        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        if (item.system.status === "destroyed")
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponDestroyed"));
            return;
        }

        let targetToken = game?.user?.targets?.first();
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
            return;
        }

        let context = { 
            voidshipTest: true, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.DogfightTest")}`,
            type: "dogfight", 
            dogfight : true,
            hasWeaponRating: true,
            weaponId: item.id, 
            targetCriticalFatigue: true,
            hasWeaponDamaged: item.system.status === "damaged", 
            useWeaponDamaged: item.system.status === "damaged", 
            targetActorId : targetToken?.actor?.uuid };
        
        return this.setupVoidshipTest({itemId : spec?.id, key : skill}, context);    
    }

    static setupOpposedSquadronDogfightTest(actor, fromAction=false, item) 
    {
        if (!actor) return;
        this.actor = actor;
        
        let skill = "navigation";
        let spec = this.actor.system.skills.navigation.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Void")?.slugify());
        
        let context = { 
            voidshipTest: true, 
            type: "dogfightOpposed", 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.OpposedDogfightTest")}`,
            dogfight : true,
            targetCriticalFatigue: true,
            dogfightOpposed : true };
        
        return this.setupVoidshipTest({itemId : spec?.id, key : skill}, context); 
    }

    static setupShootingTest(actor, fromAction=false, item) {
        if (!actor) return;
        this.actor = actor;
        
        let key = "ranged";
        let spec = this.actor.system.skills.ranged.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.Voidship")?.slugify());
        
        let token = actor.token;
        if (!token) //we got the unlinked token otherwise
        {
            token = actor.getActiveTokens()[0];
            if (!token)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
                return;
            }
        }

        if (!item.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        if (item.system.status === "destroyed")
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponDestroyed"));
            return;
        }

        let targetToken = game?.user?.targets?.first();
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
            targetToken = null;
        }

        let distance = VoidshipTokenHandler.getTargetDistance(token, targetToken);
        let useHalfRange = false;
        if (distance)
        {
            if (item.system.weapon.range < distance)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OutsideRange"));
                if (!this.actor.system.autoCalc.allowOutsideRange) return;
            }
            useHalfRange = Math.floor(item.system.weapon.range/2) >= distance;
        }

        let hitSide = VoidshipTokenHandler.getTargetHitSide(token, targetToken);
        
        let context = { 
            voidshipTest: true, 
            appendTitle: ` - ${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ShootingTest")}`,
            type: "shooting",  
            weaponType: item.system.weapon.type,
            weaponId: item.id, 
            hasDamage: true,
            useHalfRange: useHalfRange,
            useDetectionMode: "full", 
            useTargetEvasionMode: "full", 
            targetCriticalFatigue: true,
            hasWeaponDamaged: item.system.status === "damaged", 
            useWeaponDamaged: item.system.status === "damaged", 
            hitLocation: hitSide?.side,
            distanceToTarget : distance,
            hitLocationAmbiguous: Boolean(hitSide?.ambiguous),
            targetActorId : targetToken?.actor?.uuid };
        
        return this.setupVoidshipAttackTest({itemId : spec?.id, key}, context);
    }

    static setupShipSkillTest(actor, fromAction=false, skill, specId) {
        if (!actor) return;
        this.actor = actor;

        let targetToken = game?.user?.targets?.first();
        let hasTarget = true;
        if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
            hasTarget = false;
            targetToken = null;
        }

        let context = { 
            voidshipTest: true, 
            type: "skill", 
            targetActorId : targetToken?.actor?.uuid };
        
        return this.setupVoidshipTest({itemId : specId, key : skill}, context);        
    }

    static setupShipRoleTest(actor, fromAction=false, roleItem) {
        if (!actor) return;
        this.actor = actor;

        if (!roleItem.system.active)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.RoleIsDeactivated"));
            if (!this.actor.system.autoCalc.allowDeactivated) return;
        }

        let actionPath = roleItem.system.role.upgraded ? "actionUpgraded" : "action";
        if (roleItem.system.role[actionPath].cooldown > roleItem.system.role[actionPath].cooldownCount)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.RoleActionOnCooldown"));
            if (!this.actor.system.autoCalc.allowOnCooldown) return;
        }

        let key = roleItem.system.role[actionPath].skill.key;
        let difficulty = roleItem.system.role[actionPath].difficulty;
        let spec = this.actor.system.skills?.[key]?.specialisations?.find(i => i.name.slugify() == roleItem.system.role[actionPath].skill.specialisation?.slugify());;  
        
        let actionName = "";
        if (roleItem.system.role[actionPath].name && roleItem.system.role[actionPath].name != roleItem.name)
        {
            actionName = " (" + roleItem.system.role[actionPath].name + ")";
        }

        let targetToken = game?.user?.targets?.first();
        if (roleItem.system.role[actionPath].opposed)
        {
            if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
                targetToken = null;
            }
        }

        let context = { 
            voidshipTest: true, 
            type: "role", 
            roleUpgraded: roleItem.system.role.upgraded,
            itemId: roleItem.id, 
            difficulty: difficulty ?? "challenging",
            appendTitle: ` - ${roleItem.name}${actionName} ${game.i18n.localize("IMPMAL.Test")}`,
            targetActorId : targetToken?.actor?.uuid,
        };

        return this.setupVoidshipTest({itemId : spec?.id, key}, context);
    }
}
