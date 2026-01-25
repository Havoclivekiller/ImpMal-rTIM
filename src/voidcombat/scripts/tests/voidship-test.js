import { VoidshipTestContext } from "./voidship-test-context.js";
import { VoidshipMessageModel } from "./voidship-message-model.js";
import { VoidshipOpposedTestResult } from "./voidship-opposed-test-result.js";

export class VoidshipTest extends CharacteristicTest
{

    static contextClass = VoidshipTestContext;

    /**
     * Compute the target value for this test
     * 
     * @param {Boolean} base Whether to add modifiers/difficulty
     * @returns 
     */
    computeTarget(base=false)
    {
        let targetData = {
            actor : this.actor, 
            type : "skill", 
            data : {skill : this.specialisation || this.skill, characteristic : this.context.characteristic}, 
        };

        if (!base)
        {
            targetData.modifier = this.data.modifier, 
            targetData.difficulty = this.data.difficulty;
        }

        return TargetCalculator.compute(targetData);
    }

    async runPreScripts()
    {
        await super.runPreScripts();
        await Promise.all(this.actor.runScripts("preRollSkillTest", this));
        await Promise.all(this.specialisation?.runScripts?.("preRollSkillTest", this) || []);
        await Promise.all(this.item?.runScripts?.("preRollSkillTest", this) || []);
    }

    async runPostScripts()
    {
        await super.runPostScripts();
        await Promise.all(this.actor.runScripts("rollSkillTest", this));
        await Promise.all(this.specialisation?.runScripts?.("rollSkillTest", this) || []);
        await Promise.all(this.item?.runScripts?.("rollSkillTest", this) || []);
    }

    async postRoll()
    {
        await super.postRoll();
    }

    get tags() 
    {
        let tags = super.tags;

        // if (this.context.useEvasiveManeuvers)
        // {
        //     tags.push(game.i18n.localize("IMPMAL_RTIM.VoidCombat.EvasiveManeuvers"));
        // }

        // if (this.context.useDetection)
        // {
        //     tags.push(game.i18n.localize("IMPMAL_RTIM.VoidCombat.DetectionRating"));
        // }

        // if (this.context.useEvasion)
        // {
        //     tags.push(game.i18n.localize("IMPMAL_RTIM.VoidCombat.EvasionRating"));
        // }

        // if (this.context.useTurret)
        // {
        //     tags.push(game.i18n.localize("IMPMAL_RTIM.VoidCombat.TurretRating"));
        // }

        // if (this.context.useEnemyEvasion)
        // {
        //     tags.push(game.i18n.localize("IMPMAL_RTIM.VoidCombat.EnemyEvasionRating"));
        // }

        // if (this.context.useEnemyTurret)
        // {
        //     tags.push(game.i18n.localize("IMPMAL_RTIM.VoidCombat.EnemyTurretRating"));
        // }

        return tags;
    }

    get specialisation() 
    {
        // Only return if SkillSpec item is used
        return this.context.actorSkill instanceof Item ? this.context.actorSkill : undefined;
    }

    get skill() 
    {
        return this.context.skill;
    }

    async roll() 
    {
        await this.runPreScripts();
        await this.evaluate();
        if (this.actor.system.options.autoTest)
        {
            this.result.SL = this.actor.system.options.autoTestSL;
            this.result.outcome = this.actor.system.options.autoTestSL >= 0 ? "success" : "failure";
            this.result.outcomeDescription = this.result.formatOutcomeDescription();
        }
        await this.runPostScripts();
        await this.postRoll();   

        if (!this.context.actionComputed)
        {   
            await this.computeActionEconomy({type : this.context.type, result : this.result, actor : this.actor});

            this.context.actionComputed = true;
        }

        if (!this.context.fumbledComputed && this.result.outcome === "failure" && (this.result.roll % 11 == 0 || this.result.roll == 100))
        {   
            await this.computeFatigueChange(this.actor, 1);

            this.context.fumbledComputed = true;
        }

        let apCost = 0;
        if (!this.context.criticalComputed && this.result.outcome === "success" && (this.result.roll % 11 == 0 || this.result.roll == 100))
        {   
            if (this.actor.system.fatigue.value > 0)
                await this.computeFatigueChange(this.actor, -1);
            else
                apCost = -1;

            this.context.criticalComputed = true;
        }
        
        if (this.context.voidshipMessage)
        {
            let message = game.messages.get(this.context.voidshipMessage._id)
            message.system.result = this.result;
            await message.system.renderContent();
        }

        let computed = false;
        if (!this.context.executionComputed && this.result.outcome === "success")
        {   
            this.context.voidshipMessage = await this.computeActionExecution({apCost, type : this.context.type, result : this.result, actor : this.actor, item : this.item});
            
            computed = true;

            this.context.executionComputed = true;
        }
        
        if (computed && apCost < 0)
        {
            apCost = 0;
            switch (this.context.type)
            {
                case "repair":
                case "rally":
                case "scan":
                case "seek":
                case "boarding":
                case "reloadSpecial":
                case "reloadTorpedoes":
                case "reloadSquadrons":
                case "restartShields":
                    apCost = 1;
                    break;
            }
            if (apCost > 0) 
            {
                this.actor.update({"system.actionPoints.value" : 
                    Math.min(this.actor.system.actionPoints.value + apCost, 
                        this.actor.system.actionPoints.max)});
            }
        }    

        await this.sendToChat();

        return this;
    }

    async computeActionExecution(data){        
        if (!data) return;

        switch (data.type)
        {
            case "repair":
                return VoidshipMessageModel.postRepair({ actor : data.actor, result : data.result });
            case "rally":
                return VoidshipMessageModel.postRally({ actor : data.actor, result : data.result });
            case "scan":
                return VoidshipMessageModel.postScan({ actor : data.actor, result : data.result });
            case "restartShields":
                return VoidshipMessageModel.postRestartShields({ actor : data.actor, result : data.result});
        }       
        if (data.item)
        {
            switch (data.type)
            {
                case "reloadSquadrons":
                case "reloadNovaCannon":
                case "reloadTorpedoes":
                    if (data.result.outcome === "success")
                    {
                        data.item.update({[`system.weapon.reloaded`] : true});
                    }
                    break;
            }     
        } 

    }
    
    async computeFatigueChange(actor, value)
    {
        let currentFatigue = actor.system.fatigue.value;
        if (actor.system.options.noFatigue && value > 0)
        {
            actor.applyDamage((Number(value) * 2), {type: "selfDamage", ignoreShields: true, ignoreArmour: true})
        }
        if (currentFatigue == 0 && value < 0) return;

        if (currentFatigue < actor.system.fatigue.max && (currentFatigue + value) >= actor.system.fatigue.max)
        {
            ChatMessage.create({
                speaker : ChatMessage.getSpeaker({actor}),
                content : game.i18n.localize("IMPMAL_RTIM.VoidCombat.CrewBecomesFatigued")
            });
        }

        actor.update({"system.fatigue.value" : Math.max(currentFatigue + value, 0)});
    }

    async computeActionEconomy(data)
    {
        if (!data) return;

        let apCost = data.apCost ?? 0;
        switch (data.type){
            case "repair":
            case "rally":
            case "scan":
            case "seek":
                apCost = 1;
                break;
            case "boarding":
            case "reloadSpecial":
            case "reloadTorpedoes":
            case "reloadSquadrons":
            case "restartShields":
                apCost = 2;
                break;
        }
        if (apCost > 0)
        {
            data.actor.update({"system.actionPoints.value" : Math.max(data.actor.system.actionPoints.value - apCost, 0)});
        }

        let movementCost = 0;
        switch (data.type){
            case "ramming":
                movementCost = 4;
                break;
        }
        if (movementCost > 0)
        {
            data.actor.update({"system.movementPoints.value" : Math.max(data.actor.system.movementPoints.value - movementCost, 0)});
        }
    }

    get defending() 
    {
        let attackMessage = this.context.findAttackingMessage();
        let attackingTest = attackMessage?.system.test;
        if (attackingTest)
        {

            let attackerId = attackingTest.context.speaker.token;
            let attackingActor = attackingTest.actor;

            // Flip attacker / defender to get results in the right perspective
            // e.g. If the attacker won by +2, the defender lost by -2
            let result = new VoidshipOpposedTestResult(this, attackingTest); 
            
            return {
                test : attackingTest,
                id : attackerId,
                actor : attackingActor,
                result
            };
        }
        return null;
    }

    // Targets details
    get opposedTests()
    {
        let opposedTests = foundry.utils.deepClone(this.context.targets);
        for (let opposed of opposedTests)
        {
            if (opposed.test)
            {
                opposed.result = new VoidshipOpposedTestResult(this, opposed.test);
            }
            else if (opposed.unopposed)
            {
                opposed.result = new VoidshipOpposedTestResult(this);
            }
            opposed.attackerTest = this;
            opposed.defenderTest = opposed.test;
        }
        return opposedTests;
    }

}