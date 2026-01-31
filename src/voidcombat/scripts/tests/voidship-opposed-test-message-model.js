import { VoidshipOpposedTestResult } from "./voidship-opposed-test-result.js";
import { VoidshipSetupTests } from "./voidship-setup-tests.js";
import { VoidshipMessageModel } from "./voidship-message-model.js";

export class VoidshipOpposedTestMessageModel extends OpposedTestMessageModel
{
    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = super.defineSchema();
        schema.voidshipApplied = new fields.BooleanField({initial:false});
        schema.appliedFatigue = new fields.BooleanField({initial:false});
        schema.appliedComponent = new fields.BooleanField({initial:false});
        schema.appliedSelf = new fields.ObjectField();
        schema.selfDamage = new fields.NumberField({ initial: 0 });
        return schema;
    }

    static get actions() 
    { 
        return foundry.utils.mergeObject(super.actions, {
            applyBoarding : this._onApplyBoarding,
            applyAssaultBoarding : this._onApplyAssaultBoarding,
            applySelfDamage : this._onApplySelfDamage,
            applyDogfight : this._onApplyDogfight,
            applySquadronFail : this._onApplySquadronFail,
            applyDamage : this._onApplyDamage,
            applyFatigue : this._onApplyFatigue,
            applyDamageComponent : this._onApplyDamageComponent,
        });

    }

    static async createOpposed(attackerMessage, defenderToken)
    {
        let attackerTest = attackerMessage.system.test;
        let templateData = {
            attacker : attackerTest.context.token || attackerTest.actor.prototypeToken,
            defender : defenderToken,
            attackerTest : attackerTest,
            selfDamage : this.selfDamage,
            voidshipApplied : this.voidshipApplied,
            appliedFatigue : this.appliedFatigue,
            appliedComponent : this.appliedComponent,
        };
        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-opposed.hbs", templateData);

        let alias = `${game.i18n.localize("IMPMAL.OpposedTest")} - `;

        if (attackerTest.item)
        {
            alias += attackerTest.item.name;
        }
        else 
        {
            alias += attackerTest.context.skill ? game.impmal.config.skills[attackerTest.context.skill] : game.impmal.config.characteristic[attackerTest.context.characteristic];
        }

        return ChatMessage.create({content, author : getActiveDocumentOwner(defenderToken?.actor)?.id, type : "impmal-rtim.voidshipOpposedMessage", speaker : {alias}, system : {
            attackerMessageId : attackerMessage.id,
            targetTokenUuid : defenderToken.uuid,
            selfDamage : this.selfDamage,
            voidshipApplied : this.voidshipApplied,
            appliedFatigue : this.appliedFatigue,
            appliedComponent : this.appliedComponent,
        }})
    }

    async getContent()
    {
        let templateData = {
            attacker : this.attackerTest.context.token,
            defender : this.target,
            attackerTest : this.attackerTest,
            result : this.result,
            applied : foundry.utils.isEmpty(this.applied) ? false : this.applied,
            appliedSelf : foundry.utils.isEmpty(this.appliedSelf) ? false : this.appliedSelf,
            voidshipApplied : this.voidshipApplied,
            selfDamage : this.selfDamage,
            appliedFatigue : this.appliedFatigue,
            appliedComponent : this.appliedComponent,
            responseButtons : this.constructor._getResponseButtons(this.target)
        };
        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-opposed.hbs", templateData);
        return content;
    }

    async renderContent(update={})
    {
        await this.parent.update(update);
        // foundry.utils.mergeObject(this.parent, update);
        this.result = this.computeResult();
        this.computeSelfDamage();

        let content = await this.getContent();
        return this.parent.update({content, system : {
            result : {...this.result},
            voidshipApplied : this.voidshipApplied,
            selfDamage : this.selfDamage,
            appliedFatigue : this.appliedFatigue,
            appliedComponent : this.appliedComponent,
        }});
    }

    computeSelfDamage() 
    {
        let attacker = this.attackerTest?.actor;
        let defender = this.defenderTest?.actor;
        if (!defender) return 0;
        if (!this.result) return 0;
        if (this.attackerTest?.context?.type !== "ramming") return 0;
        if (!this.result.tooltips) this.result.tooltips = {};
        this.result.tooltips.selfDamage = "";

        let selfDamage = attacker.system.options.takeAvgArmour ? 
        attacker.system.armour.average.value :
        attacker.system.armour.fore.value;
        selfDamage = Math.ceil(selfDamage/2);

        let location = this.attackerTest.result.hitLocation ?? "fore";
        if (defender.system.options.takeAvgArmour) location = "average";

        this.result.tooltips.selfDamage = `<p>Fore Armour (1/2): ${selfDamage}</p>`;
        if (selfDamage < defender.system.armour[location].value)
        {
            selfDamage = defender.system.armour[location].value;
            this.result.tooltips.selfDamage = `<p>Enemy Armour: ${selfDamage}</p>`;
        }

        
        if (this.attackerTest?.data.selfDamage > 0) {
            selfDamage += this.attackerTest.data.selfDamage;
            this.result.tooltips.selfDamage += `<p>Enemy Additional Damage: ${this.attackerTest.data.selfDamage}</p>`;
        }

        if (this.result?.winner !== "attacker")
        {
            selfDamage += -this.result?.SL || 0;
            this.result.tooltips.selfDamage += `<p>Negative SL: ${-this.result?.SL}</p>`;
        }
        this.selfDamage = selfDamage;
    }

    static _onApplyDamageComponent(ev, target)
    {
        this.applyDamageComponent();
    }

    async applyDamageComponent()
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }

        if (!this.target?.actor) return;

        let items = this.target.actor.items
            .filter(item => item.type === "impmal-rtim.voidshipPart")
            .filter(item => item.system?.partType === "role" || item.system.partType === "weapon")
            .filter(item => item.system.status !== "destroyed");
        if (items.length == 0)
        {
            ui.notifications.info(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoComponentsToDamage"));

            this.target.actor.applyDamage(2, {type: "selfDamage", criticalcreateCriticalMessage: true});
                
            this.appliedComponent = true;
            this.renderContent({"system.appliedComponent" : true});
        }
        else
        {
            let random = Math.floor(CONFIG.Dice.randomUniform() * items.length);
            let chosenItem = items[random];

            if (!game.settings.get("impmal-rtim", "voidcombatSettings").randomDamaged)
            {
                let item = (await ItemDialog.create(items, 1, 
			        {title : "List of Components and Weapons", text: "Choose 1"}));
                if (item && item.length > 0) chosenItem = item[0];
            }
            
            if (chosenItem)
            {
                let newStatus = chosenItem.system.status === "default" ? "damaged" : "destroyed";
                chosenItem.update({"system.status": newStatus});
                ui.notifications.info(`${chosenItem.name} was ${newStatus}.`);

                this.appliedComponent = true;
                this.renderContent({"system.appliedComponent" : true});
            }
        }
    }

    static _onApplyFatigue(ev, target)
    {
        this.applyFatigue();
    }
    
    applyFatigue()
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        this.target?.actor?.applyDamage(1, { type : "fatigue"}).then(data => {
            this.appliedFatigue = true;
            this.renderContent({"system.appliedFatigue" : true});
            ui.notifications.info(`${this.target.name} received Fatigue from Critical.`);
        });
    }

    static _onApplyDamage(ev, target)
    {
        this.applyDamage();
    }
    
    applyDamage()
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        let attackerTest = this.attackerTest;
        this.target?.actor?.applyDamage(this.result.damage, {ignoreAP : attackerTest.item?.system?.damage?.ignoreAP, location: attackerTest.result.hitLocation, opposed : this}).then(data => {
            data.multiple = this.applied.multiple ? this.applied.multiple + 1 : 1;
            this.applied = data;
            this.renderContent({"system.applied" : data});
            if (data.woundsGained > 0 && attackerTest.damageEffects.length)
            {
                this.target.actor.applyEffect({effectUuids : attackerTest.damageEffects.map(i => i.uuid), messageId : this.attackerMessageId});
            }
        });
    }

    static _onApplySelfDamage(ev, target)
    {
        this.applySelfDamage();
    }

    applySelfDamage()
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        let attacker = this.attackerTest.actor;
        let defender = this.defenderTest.actor;

        let selfDamage = attacker.system.options.takeAvgArmour ? 
        attacker.system.armour.average.value :
        attacker.system.armour.fore.value;
        selfDamage = Math.ceil(selfDamage/2);
        let location = this.attackerTest.result.hitLocation ?? "fore";
        if (defender.system.options.takeAvgArmour) location = "average";
        if (selfDamage < defender.system.armour[location].value)
            selfDamage = defender.system.armour[location].value;
        if (this.result.winner !== "attacker")
        {
            selfDamage += -this.result.SL;
        }

        attacker.applyDamage(selfDamage, {type: "selfDamage", ignoreShields: true, ignoreArmour: true, location, opposed : this}).then(data => {
            data.multiple = this.appliedSelf.multiple ? this.appliedSelf.multiple + 1 : 1;
            this.appliedSelf = data;
            this.renderContent({"system.appliedSelf" : data});
        });
    }

    static _onApplySquadronFail(ev, target)
    {
        this.applySquadronFail();
    }
    
    applySquadronFail()
    {
        if (this.voidshipApplied) return;
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        if (this.result.winner === "defender")
        {
            this.voidshipApplied = true;
            VoidshipMessageModel.postSquadronFail({ actor : this.attackerTest.actor, 
                        target : this.attackerTest.actor, 
                        result : this.result }); 

            this.renderContent(); 
        } 
    }

    static _onApplyDogfight(ev, target)
    {
        this.applyDogfight();
    }
    
    applyDogfight()
    {
        if (!this.defenderTest || this.voidshipApplied) return;
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        if (this.result.winner === "attacker")
        {
            this.voidshipApplied = true;
            VoidshipMessageModel.postDogfight({ actor : this.attackerTest.actor, 
                        target : this.defenderTest.actor, 
                        result : this.result }); 

            this.renderContent(); 
        } 
    }

    static _onApplyAssaultBoarding(ev, target)
    {
        this.applyAssaultBoarding();
    }
    
    applyAssaultBoarding()
    {
        if (!this.defenderTest || this.voidshipApplied) return;
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        if (this.result.winner === "attacker")
        {
            this.voidshipApplied = true;
            VoidshipMessageModel.postBoarding({ actor : this.attackerTest.actor, 
                        target : this.defenderTest.actor, 
                        result : this.result }); 

            this.renderContent(); 
        } 
    }

    static _onApplyBoarding(ev, target)
    {
        this.applyBoarding();
    }
    
    applyBoarding()
    {
        if (!this.defenderTest || this.voidshipApplied) return;
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        if (this.result.winner === "attacker")
        {
            this.voidshipApplied = true;
            VoidshipMessageModel.postBoarding({ actor : this.attackerTest.actor, 
                        target : this.defenderTest.actor, 
                        result : this.result }); 

            this.renderContent(); 
        } 
    }

    performResponse(type,id)
    {
        switch(type)
        {
            case "unopposed": 
                this.target.actor.setFlag("impmal", "opposed", null); 
                return this.renderContent({"system.unopposed" : true})
            case "silentRunning":
                return VoidshipSetupTests.setupOpposedSilentRunningTest(this.target?.actor);
            case "seek":
                return VoidshipSetupTests.setupOpposedSeekTest(this.target?.actor);   
            case "boarding":
                return VoidshipSetupTests.setupOpposedBoardingTest(this.target?.actor);  
            case "ramming":
                return VoidshipSetupTests.setupOpposedRammingTest(this.target?.actor);   
            case "dogfight":
                return VoidshipSetupTests.setupOpposedSquadronDogfightTest(this.target?.actor);  
            case "bomberRun":
                return VoidshipSetupTests.setupOpposedSquadronBomberRunTest(this.target?.actor); 
            case "assaultBoarding":
                return VoidshipSetupTests.setupOpposedSquadronAssaultBoardingTest(this.target?.actor);
            case "torpedoSalvo":
                return VoidshipSetupTests.setupOpposedTorpedoSalvoTest(this.target?.actor);                
        }
    }


    computeResult()
    {
        return new VoidshipOpposedTestResult(this.attackerTest, this.defenderTest);
    }

}