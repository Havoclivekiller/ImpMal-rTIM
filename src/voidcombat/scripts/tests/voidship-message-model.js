export class VoidshipMessageModel extends WarhammerMessageModel
{
    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};

        schema.penaltyChoice = new fields.BooleanField({ initial: false });
        schema.hullDamaged = new fields.BooleanField({ initial: false });
        schema.failed = new fields.BooleanField({ initial: false });
        schema.usages = new fields.NumberField({ initial: 1 });
        schema.result = new fields.ObjectField();
        schema.options = new fields.ObjectField();
        schema.critical = new fields.NumberField({ initial: 0 });
        schema.criticalBtn = new fields.StringField();
        schema.targetName = new fields.StringField();
        schema.actorUuid = new fields.StringField();
        schema.targetUuid = new fields.StringField();
        schema.testType = new fields.StringField();

        return schema;
    }

    static get actions() 
    { 
        return foundry.utils.mergeObject(super.actions, {
            repairShield :  this._onRepairShield,
            repairWeapon : this._onRepairWeapon,
            repairDamagedComponents : this._onRepairDamagedComponents,
            removeFire : this._onRemoveFire,
            removeFatigue : this._onRemoveFatigue,
            removeCritical : this._onRemoveCritical,
            addWeaponSL : this._onAddWeaponSL,
            restartShields : this._onRestartShields,
            damageHull : this._onDamageHull,
            addFatigue : this._onAddFatigue,
            damageWeapon : this._onDamageWeapon,
            damageComponent : this._onDamageComponent,
            addFireStack : this._onAddFireStack,
            addUsage : this._onAddUsage,
        });
    }

    static async _onAddUsage(ev, target)
    {
        if (!game.user.isGM) 
        {
            ui.notifications.warn("Only GM can change this!");
            return;
        }
        this.usages += 1;
        await this.renderContent(); 
    }

    static getButtonStr(action, label, data=[])
    {
        let dataStr = "";
        data.forEach((item) => {
            dataStr += `data-${item.label}="${item.value}" `;
        });
        return `<button class="voidshipOption" data-action="${action}" ${dataStr}>${label}</button>`
    }

    static async getContentSquadronFail({SL, usages, failed, hullDamaged, result, critical, criticalBtn}, options)
    {
        let innerHtml = "";
        if (-SL >= 3 && options?.squadronIndestructible)
            innerHtml = "<span>The Squadron is destroyed</span>"
        if (-SL >= 5)
            innerHtml = "<span>If the Squadron is escorted, the escorts are destroyed!</span>"

        if (options?.comment) innerHtml += `<span class="rewards">${options.comment}</span>`;
        
        let templateData = {
            testType : this.testType,
            actorUuid : this.actorUuid,
            usages : usages,
            hasUsages : false,
            failed : failed,
            hullDamaged : hullDamaged,
            result : result,
            targetName : this.targetName,
            targetUuid : this.targetUuid,
            innerHtml : innerHtml,
            critical : critical,
            options : options,
            criticalBtn : criticalBtn,
        };

        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-message.hbs", templateData);
        return content;
    }

    static async getContentDogfight({SL, usages, failed, hullDamaged, result, critical, criticalBtn}, options)
    {
        let innerHtml = ""
        innerHtml += "<span>Enemy squadron is defeated!</span>"
        if (SL >= 5 && options?.squadronIndestructible)
            innerHtml = "<span>Enemy squadron is destroyed!</span>"
        if (SL >= 3)
            innerHtml = "<span>Another squadron in range (2 hexes) can be defeated!</span>"
        innerHtml += "<span>If enemy Squadron was escorted, the escort is defeated.</span>"

        if (options?.comment) innerHtml += `<span class="rewards">${options.comment}</span>`;
        
        let templateData = {
            testType : this.testType,
            actorUuid : this.actorUuid,
            usages : usages,
            hasUsages : true,
            failed : failed,
            hullDamaged : hullDamaged,
            result : result,
            targetName : this.targetName,
            targetUuid : this.targetUuid,
            innerHtml : innerHtml,
            critical : critical,
            options : options,
            criticalBtn : criticalBtn,
        };

        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-message.hbs", templateData);
        return content;
    }

    static async getContentBoarding({usages=1,hullDamaged=false,fire=1,component=1,weapon=1,fatigue=1,critical=0,criticalBtn="",failed,result}, options)
    {
        let innerHtml = ""
        if (options?.additionalFire > 0) fire += options.additionalFire;
        if (options?.additionalComponent > 0) component += options.additionalComponent;
        if (options?.additionalWeapon > 0) weapon += options.additionalWeapon;
        if (options?.additionalFatigue > 0) fatigue += options.additionalFatigue;
        let damageHull = result.SL;
        if (options?.additionalHull > 0) damageHull += options.additionalHull;
        innerHtml += this.getButtonStr("addFireStack", `Start a fire on the ship - ${fire} On Fire! stack`, [{label : "value", value : fire}]);
        innerHtml += this.getButtonStr("damageComponent", `Damage ${component} of the components - Damaged Component (Role)`, [{label : "value", value : component}]);
        innerHtml += this.getButtonStr("damageWeapon", `Disable ${weapon} of the weapons - Damaged Weapon`, [{label : "value", value : weapon}]);
        innerHtml += this.getButtonStr("addFatigue", `Devastate the Crew - ${fatigue} of Morale Damage`, [{label : "value", value : fatigue}]);
        innerHtml += this.getButtonStr("damageHull", `Deal ${damageHull} Hull damage to the target`, [{label : "value", value : damageHull}]);
        
        if (options?.alwaysAllowHullDamage) hullDamaged = false;
        if (options?.comment) innerHtml += `<span class="rewards">${options.comment}</span>`;

        let templateData = {
            testType : this.testType,
            actorUuid : this.actorUuid,
            usages : usages,
            hasUsages : true,
            failed : failed,
            hullDamaged : hullDamaged,
            result : result,
            targetName : this.targetName,
            targetUuid : this.targetUuid,
            innerHtml : innerHtml,
            critical : critical,
            options : options,
            criticalBtn : criticalBtn,
        };

        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-message.hbs", templateData);
        return content;
    }

    static async getContentScan({usages=1,addSL=1,amount=1,failed,result}, options)
    {
        let innerHtml = ""
        amount = 1 + Math.floor(result?.SL/2);
        if (options?.weaponPerSL)
        {
            if (options.weaponPerSL === true) amount = Math.floor(result.SL/1)+1
            else amount = Math.floor(result.SL/options.weaponPerSL)+1
        }
        if (options?.weaponAmount) amount += options.weaponAmount === true ? 1 : Number(options.weaponAmount);
        if (options?.weaponSL) addSL += options.weaponSL === true ? 1 : Number(options.weaponSL);

        innerHtml += this.getButtonStr("addWeaponSL", `Add ${addSL} SL to the next test of ${amount} weapons`, [{label : "value", value : amount}, {label : "sl", value : addSL}]);
        
        if (options?.comment) innerHtml += `<span class="rewards">${options.comment}</span>`;

        let templateData = {
            testType : this.testType,
            actorUuid : this.actorUuid,
            targetName : this.targetName,
            usages : usages,
            hasUsages : false,
            failed : failed,
            innerHtml : innerHtml,
            result : result,
            options : options
        };

        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-message.hbs", templateData);
        return content;
    }

    static async getContentRepair({usages=1,weapon=1,shield=5,repair="all",failed,result}, options)
    {
        let innerHtml = ""
        if (options?.additionalRepair > 0) repair += options.additionalRepair;
        if (options?.additionalShield > 0) shield += options.additionalShield;

        innerHtml += this.getButtonStr("repairDamagedComponents", `Repair ${repair} Damaged Components on the Ship`, [{label : "value", value : repair}]);
        innerHtml += this.getButtonStr("repairWeapon", `Repair ${weapon} Damaged Weapon`, [{label : "value", value : weapon}]);
        innerHtml += this.getButtonStr("repairShield", `Regain ${shield} points of Shield on one Side`, [{label : "value", value : shield}]);

        if (options?.comment) innerHtml += `<span class="rewards">${options.comment}</span>`;

        let templateData = {
            testType : this.testType,
            actorUuid : this.actorUuid,
            targetName : this.targetName,
            usages : usages,
            hasUsages : true,
            failed : failed,
            innerHtml : innerHtml,
            result : result,
            options : options,
        };

        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-message.hbs", templateData);
        return content;
    }

    static async getContentRepairMinion({usages=1,weapon=1,fire="all",failed,result}, options)
    {
        let innerHtml = ""

        innerHtml += this.getButtonStr("removeFire", `Extinguish ${fire} On Fire stacks on the Ship`, [{label : "value", value : fire}]);
        innerHtml += this.getButtonStr("repairWeapon", `Repair ${weapon} Damaged Weapon`, [{label : "value", value : weapon}]);

        if (options?.comment) innerHtml += `<span class="rewards">${options.comment}</span>`;

        let templateData = {
            testType : this.testType,
            actorUuid : this.actorUuid,
            targetName : this.targetName,
            usages : usages,
            hasUsages : true,
            failed : failed,
            innerHtml : innerHtml,
            result : result,
            options : options,
        };

        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-message.hbs", templateData);
        return content;
    }

    static async getContentRally({usages=1, criticalAmount=1,critical=11, fatigue=1,fire="all",failed,result}, options)
    {
        let innerHtml = ""

        if (options?.additionalFire > 0) fire += options.additionalFire;
        if (options?.additionalCriticals > 0) criticalAmount += options.additionalCriticals;
        if (options?.additionalCriticalValue > 0) critical += options.additionalCriticalValue;
        if (options?.additionalFatigue > 0) fatigue += options.additionalFatigue;

        innerHtml += this.getButtonStr("removeFire", `Extinguish ${fire} On Fire stacks on the Ship`, [{label : "value", value : fire}]);
        innerHtml += this.getButtonStr("removeFatigue", `Remove ${fatigue} point of Fatigue from Morale`, [{label : "value", value : fatigue}]);
        innerHtml += this.getButtonStr("removeCritical", `Remove ${criticalAmount} Critical Damage effect of value less than ${critical}`, [{label : "value", value : criticalAmount},{label : "critical", value : critical}]);
        
        if (options?.comment) innerHtml += `<span class="rewards">${options.comment}</span>`;

        let templateData = {
            testType : this.testType,
            actorUuid : this.actorUuid,
            targetName : this.targetName,
            usages : usages,
            hasUsages : true,
            failed : failed,
            innerHtml : innerHtml,
            result : result,
            options : options,
        };

        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-message.hbs", templateData);
        return content;
    }

    static async getContentRestartShields({usages=1, penaltyChoice=false, penalty=1,failed,result}, options)
    {
        let innerHtml = "";

        if (options?.alwaysChoice) penaltyChoice = true;
        if (options?.additionalSLPenalty) penalty += options.additionalSLPenalty;

        if (!penaltyChoice) {
            innerHtml += this.getButtonStr("restartShields", `Restart Shields on one side with -${penalty} SL penalty to Shooting tests until end of the next turn`, [{label : "value", value : 1},{label : "penalty", value : penalty}]);
        }            
        else {
            innerHtml += this.getButtonStr("restartShields", `Restart Shields on one side without a penalty`, [{label : "value", value : 1},{label : "penalty", value : 0}]);
            innerHtml += this.getButtonStr("restartShields", `Restart Shields on all sides with -${penalty} SL penalty to Shooting tests until end of the next turn`, [{label : "value", value : "all"},{label : "penalty", value : penalty}]);
            innerHtml += `<div class="reason"><label>Choose one</label></div>`;
        }

        if (options?.comment) innerHtml += `<span class="rewards">${options.comment}</span>`;

        let templateData = {
            testType : this.testType,
            actorUuid : this.actorUuid,
            targetName : this.targetName,
            usages : usages,
            penaltyChoice : penaltyChoice,
            hasUsages : false,
            failed : failed,
            innerHtml : innerHtml,
            result : result,
            options : options,
        };

        let content = await foundry.applications.handlebars.renderTemplate("modules/impmal-rtim/voidcombat/templates/tests/voidship-message.hbs", templateData);
        return content;
    }

    async getContent(data, options)
    {
        if (this.testType === "repair") return await this.constructor.getContentRepair(data, options);
        if (this.testType === "rally") return await this.constructor.getContentRally(data, options);
        if (this.testType === "scan") return await this.constructor.getContentScan(data, options);
        if (this.testType === "restartShields") return await this.constructor.getContentRestartShields(data, options);
        if (this.testType === "boarding") return await this.constructor.getContentBoarding(data, options);
        if (this.testType === "dogfight") return await this.constructor.getContentDogfight(data, options);
        if (this.testType === "squadronFail") return await this.constructor.getContentSquadronFail(data, options);
        if (this.testType === "repairMinion") return await this.constructor.getContentRepairMinion(data, options);
    }

    async renderContent(update={})
    {
        await this.parent.update(update);        
        
        let contentChange = {
            usages : this.usages, 
            penaltyChoice : this.penaltyChoice, 
            targetName : this.targetName, 
            hullDamaged : this.hullDamaged,            
            critical : this.critical,
            criticalBtn : this.criticalBtn,
            result : this.result,
            failed : this.failed,
            options : this.options,
        };
        if (this.result)
        {
            contentChange = await this.getOptionsFromResult(this.result)
        }

        let content = await this.getContent(contentChange, this.options);
        return this.parent.update({content, system : contentChange});
    }

    static getCriticalFormula(actor, modifier)
    {
        let dice = 1;
        let criticals = actor.items.filter(item => item.system?.partType === "critical");
        if (criticals)
        {
            dice += criticals.length;
        }
        return `${dice}d10+${modifier}`;
    }

    getCriticalFormula(actor, modifier)
    {
        let dice = 1;
        let criticals = actor.items.filter(item => item.system?.partType === "critical");
        if (criticals)
        {
            dice += criticals.length;
        }
        return `${dice}d10+${modifier}`;
    }

    static async _onDamageComponent(ev, target)
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.targetUuid);
        if (!actor) return;

        let roleItems = actor.items
            .filter(item => item.type === "impmal-rtim.voidshipPart")
            .filter(item => item.system?.partType === "role");
        if (roleItems.length == 0 || roleItems.filter((item => item.status !== "destroyed")).length == 0)
        {
            ui.notifications.info(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoComponentsToDamage"));

            let hullDamage = Number(value) * 2;
            let hullLeft = actor.system.hull.value - hullDamage;

            if (hullLeft < 0)
            {
                this.critical += -hullLeft;
                this.criticalBtn = `<a class="table-roll critical-voidship" 
            data-table="critvoidship" 
            data-formula="${this.getCriticalFormula(actor, this.critical)}"><i class="fa-solid fa-dice-d10"></i>${game.i18n.localize("IMPMAL.Critical")} (${this.getCriticalFormula(actor, this.critical)})</a>`;
                hullLeft = 0;
            }
            
            actor.update({"system.hull.value": hullLeft});
        }
        else
        {
            let chosenItems = roleItems;
            if (value !== "all")
            {
                let copied = roleItems;
                chosenItems = [];
                for (let i = 0; i < value; i++) {
                    let random = Math.floor(CONFIG.Dice.randomUniform() * copied.length);
                    chosenItems.push(copied[random]);
                    copied.splice(random, 1);
                }
            }

            if (!game.settings.get("impmal-rtim", "voidcombatSettings").randomDamaged)
            {
                let resultItems = (await ItemDialog.create(roleItems, Number(value === "all" ? roleItems.length : value), 
                    {title : "Damage Component (Role)", text: `Choose ${value === "all" ? roleItems.length : value}`}));
                if (resultItems && resultItems.length > 0) chosenItems = resultItems;
            }
            
            if (!chosenItems || chosenItems.length == 0) return;
            chosenItems.forEach(item => {
                let newStatus = item.system.status === "default" ? "damaged" : "destroyed";
                item.update({"system.status": newStatus});
                ui.notifications.info(`${item.name} was ${newStatus}`);
            });
        }


        this.usages -= 1;

        await this.renderContent(); 
    }

    static async _onDamageWeapon(ev, target)
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.targetUuid);
        if (!actor) return;

        let items = actor.items
            .filter(item => item.type === "impmal-rtim.voidshipPart")
            .filter(item => item.system?.partType === "weapon")
            .filter(item => item.system.status !== "destroyed");
        if (!items.length)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoWeapons"));
            return;
        }

        let chosenItems = items;
        if (value !== "all")
        {
            let copied = items;
            chosenItems = [];
            for (let i = 0; i < value; i++) {
                let random = Math.floor(CONFIG.Dice.randomUniform() * copied.length);
                chosenItems.push(copied[random]);
                copied.splice(random, 1);
            }
        }

        if (!game.settings.get("impmal-rtim", "voidcombatSettings").randomDamaged)
        {
            let resultItems = (await ItemDialog.create(items, Number(value === "all" ? items.length : value), 
                {title : "Damage Weapon", text: `Choose ${value === "all" ? items.length : value}`}));
            if (resultItems && resultItems.length > 0) chosenItems = resultItems;
        }
        
        if (!chosenItems || chosenItems.length == 0) return;

        chosenItems.forEach(item => {
            let newStatus = item.system.status === "default" ? "damaged" : "destroyed";
            item.update({"system.status": newStatus});
            ui.notifications.info(`${item.name} was ${newStatus}`)
        }); 

        this.usages -= 1;

        await this.renderContent(); 
    }

    static async _onAddFireStack(ev, target)
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.targetUuid);
        if (!actor) return;

        actor.update({"system.fire": actor.system.fire + Number(value)});

        this.usages -= 1;

        await this.renderContent(); 
    }

    static async _onDamageHull(ev, target)
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }
        if (this.hullDamaged)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.HullDamagedAlready"));
            return;
        }

        let actor = await fromUuid(this.targetUuid);
        if (!actor) return;

        let hullDamage = Number(value);
        let hullLeft = actor.system.hull.value - hullDamage;

        if (hullLeft < 0)
        {
            this.critical += -hullLeft;
            this.criticalBtn = `<a class="table-roll critical-voidship" 
        data-table="critvoidship" 
        data-formula="${this.getCriticalFormula(actor, this.critical)}"><i class="fa-solid fa-dice-d10"></i>${game.i18n.localize("IMPMAL.Critical")} (${this.getCriticalFormula(actor, this.critical)})</a>`;
            hullLeft = 0;
        }
        
        actor.update({"system.hull.value": hullLeft});

        this.hullDamaged = true;

        this.usages -= 1;

        await this.renderContent(); 
    }

    static async _onAddFatigue(ev, target)
    {
        if (!game.user.isGM)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.OnlyGM"));
            return;
        }
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.targetUuid);
        if (!actor) return;

        if (actor.system.options.noFatigue)
        {
            ui.notifications.info(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUseFatigue"));

            let hullDamage = Number(value) * 2;
            let hullLeft = actor.system.hull.value - hullDamage;

            if (hullLeft < 0)
            {
                this.critical += -hullLeft;
                this.criticalBtn = `<a class="table-roll critical-voidship" 
            data-table="critvoidship" 
            data-formula="${this.getCriticalFormula(actor, this.critical)}"><i class="fa-solid fa-dice-d10"></i>${game.i18n.localize("IMPMAL.Critical")} (${this.getCriticalFormula(actor, this.critical)})</a>`;
                hullLeft = 0;
            }
            
            actor.update({"system.hull.value": hullLeft});
        }
        else
        {
            let noFatigued = actor.system.fatigue.value < actor.system.fatigue.max;
            actor.update({"system.fatigue.value": actor.system.fatigue.value + Number(value)});
            if (noFatigued && actor.system.fatigue.value >= actor.system.fatigue.max)
            {
                ChatMessage.create({
                        speaker : ChatMessage.getSpeaker({actor : this.parent}),
                        content : game.i18n.localize("IMPMAL_RTIM.VoidCombat.CrewBecomesFatigued")
                    });
            }
            else if (actor.system.fatigue.value > actor.system.fatigue.max && actor.characteristics.crew.total == 0)
            {
                ChatMessage.create({
                        speaker : ChatMessage.getSpeaker({actor : this.parent}),
                        content : game.i18n.localize("IMPMAL_RTIM.VoidCombat.CrewBecomesRiot")
                    });
            }
        }

        this.usages -= 1;

        await this.renderContent(); 
    }

    static async _onRestartShields(ev, target)
    {
        let value = target.dataset.value;
        let penalty = target.dataset.penalty;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.actorUuid);
        if (!actor) return;

        let locations = []
        if (value === "all")
        {
            ["fore", "aft", "starboard", "port", "average"].map((key) => {
                locations.push(key);
            }) 
        }
        else if (actor.system.options.takeAvgShield)
        {
            locations.push("average");
        }
        else
        {
            let sides = ["fore", "aft", "starboard", "port"].filter((key) => {
                return actor.system.shields[key].value !== actor.system.shields[key].max;
            });
            if (sides.length === 0)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.AllShieldsFull"));
                return;
            }            
            let btns = [];
            sides.map((key) => {
                btns.push({action : key,
                    label : game.impmal.config.RTIM.voidship.hitLocations[key].display});
            })      
            locations.push(await foundry.applications.api.Dialog.wait({
                window : {title : "Shield Location"},
                content : `<p>${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ChooseLocation")}</p>`,
                buttons : btns
            }));
        }
            
        locations.map((key) => {
            actor.update({[`system.shields.${key}.value`]: actor.system.shields[key].max});
        });

        if (penalty > 0)
        {
            let bonuses = actor.system.bonuses;
            bonuses.push({
                SL : -penalty,
                modifier : 0,
                advantage : false,
                disadvantage : false,
                removeAfterTurns : -1,
                removeOnStartTurn : false,
                removeOnEndTurn : false,
                removeOnNextEndTurn : true,
                type : ["shooting"],
                comment : `Restart Shields Penalty`
            })
            actor.update({"system.bonuses": bonuses});
        }

        this.usages -= 1;

        await this.renderContent();    
    }

    static async _onAddWeaponSL(ev, target)
    {
        let value = target.dataset.value;
        let SL = target.dataset.sl;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.actorUuid);
        if (!actor) return;

        let weaponItems = actor.items
            .filter(item => item.type === "impmal-rtim.voidshipPart")
            .filter(item => item.system?.partType === "weapon");
        if (!weaponItems.length)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoWeapons"));
            return;
        }

        let items = (await ItemDialog.create(weaponItems, Number(value === "all" ? weaponItems.length : value), {title : "Next Test SL bonus to Weapons", text: `Choose ${value === "all" ? weaponItems.length : value}`}));
        if (!items || items.length == 0) return;

        let bonuses = actor.system.bonuses;
        items.forEach(item => {
            bonuses.push({
                SL: Number(SL),
                modifier: 0,
                advantage: false,
                disadvantage: false,
                removeAfterTurns: -1,
                removeOnNextTest: true,
                removeOnStartTurn: false,
                removeOnEndTurn: false,
                removeOnNextEndTurn: false,
                items: [item.id],
                type: [],
                comment: "Scan Action"
            })
        }); 
        await actor.update({ "system.bonuses": bonuses});     

        this.usages -= 1;

        await this.renderContent();    
    }

    static async _onRemoveCritical(ev, target)
    {
        let value = target.dataset.value;
        let critical = target.dataset.critical;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.actorUuid);
        if (!actor) return;

        let criticalItems = actor.items
            .filter(item => item.type === "impmal-rtim.voidshipPart")
            .filter(item => item.system?.partType === "critical" 
                && item.system?.critical.type === "criticalDamage" 
                && item.system?.critical.level < Number(critical));
        if (!criticalItems.length)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoCriticals"));
            return;
        }

        let items = (await ItemDialog.create(criticalItems, Number(value === "all" ? criticalItems.length : value), {title : "Critical Damage", text: `Choose ${value === "all" ? criticalItems.length : value}`}));
        if (!items || items.length == 0) return;

        await actor.deleteEmbeddedDocuments("Item", items.map(entry => entry.id));      

        this.usages -= 1;

        await this.renderContent();  
    }

    static async _onRemoveFatigue(ev, target)
    {
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.actorUuid);
        if (!actor) return;

        if (actor.system.fatigue.value <= 0 || actor.system.options.noFatigue)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoFatigue"));
            return;
        }

        let fatigue = 0;
        if (value !== "all")
        {
            fatigue = Number(value);
            if (fatigue > actor.system.fatigue.value) fatigue = 0;
            fatigue = actor.system.fatigue.value - fatigue;
        }

        actor.update({"system.fatigue.value": fatigue});

        this.usages -= 1;

        await this.renderContent(); 
    }

    static async _onRemoveFire(ev, target)
    {
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.actorUuid);
        if (!actor) return;

        if (actor.system.fire <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoFireExtinguish"));
            return;
        }

        let fire = 0;
        if (value !== "all")
        {
            fire = Number(value);
            if (fire > actor.system.fire) fire = 0;
            fire = actor.system.fire - fire;
        }

        actor.update({"system.fire": fire});

        this.usages -= 1;

        await this.renderContent();  
    }

    //RepairComponents aka Damaged Roles (status == "damaged" >> "default", skip "destroyed")
    static async _onRepairDamagedComponents(ev, target)
    {
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.actorUuid);
        if (!actor) return;

        let roleItems = actor.items
            .filter(item => item.type === "impmal-rtim.voidshipPart")
            .filter(item => item.system?.partType === "role" && item.system?.status === "damaged");
        if (!roleItems.length)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoDamagedComponentsRoles"));
            return;
        }

        let items = (await ItemDialog.create(roleItems, Number(value === "all" ? roleItems.length : value), {title : "Damaged Components", text: `Choose ${value === "all" ? roleItems.length : value}`}));
        if (!items || items.length == 0) return;
        items.forEach(item => {
            item.update({"system.status": "default"});
        });      

        this.usages -= 1;

        await this.renderContent();   
    }

    //RepairWeapon
    static async _onRepairWeapon(ev, target)
    {
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.actorUuid);
        if (!actor) return;

        let weaponItems = actor.items
            .filter(item => item.type === "impmal-rtim.voidshipPart")
            .filter(item => item.system?.partType === "weapon" && item.system?.status === "damaged");
        if (!weaponItems.length)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoDamagedWeapons"));
            return;
        }

        let items = (await ItemDialog.create(weaponItems, Number(value === "all" ? weaponItems.length : value), {title : "Damaged Weapons", text: `Choose ${value === "all" ? weaponItems.length : value}`}));
        if (!items || items.length == 0) return;
        items.forEach(item => {
            item.update({"system.status": "default"});
        });      

        this.usages -= 1;

        await this.renderContent();    
    }

    //RepairShield
    static async _onRepairShield(ev, target)
    {        
        let value = target.dataset.value;
        if (this.usages <= 0)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoUsagesLeft"));
            return;
        }

        let actor = await fromUuid(this.actorUuid);
        if (!actor) return;

        let takeAvgShield = actor.system.options.takeAvgShield;

        let location = "fore";
        let btns = [];
        if (takeAvgShield)
        {
            if (actor.system.shields.average.value >= actor.system.shields.average.max)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.AllShieldsFull"));
                return;
            }
            btns = [
                {
                    action : "average",
                    label : game.i18n.localize("IMPMAL_RTIM.VoidCombat.Average")
                }
            ];
        }
        else
        {
            let noShields = true;
            ["fore", "aft", "starboard", "port"].map((key) => {
                if (actor.system.shields[key].value < actor.system.shields[key].max)
                {
                    noShields = false;
                    btns.push({action : key,
                        label : game.impmal.config.RTIM.voidship.hitLocations[key].display});
                }
            })            
            if (noShields)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.AllShieldsFull"));
                return;
            }
        }

        location  = await foundry.applications.api.Dialog.wait({
            window : {title : "Shield Location"},
            content : `<p>${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ChooseLocation")}</p>`,
            buttons : btns
        });

        if (!location) return;

        let newShield = 0;
        if (value === "all")
        {
            newShield = actor.system.shields[location].max;
        }
        else
        {
            newShield = actor.system.shields[location].value + Number(value);
            if (newShield > actor.system.shields[location].max) newShield = actor.system.shields[location].max;
        }
        let path = `system.shields.${location}.value`;
        actor.update({ [path]: newShield });

        this.usages -= 1;

        await this.renderContent();
    }

    async getOptionsFromResult(result)
    {
        this.failed = result.outcome === "failure";
        switch (this.testType)
        {
            case "restartShields":
                return ({ 
                    targetName : this.targetName, 
                    hullDamaged : this.hullDamaged,            
                    critical : this.critical,
                    criticalBtn : this.criticalBtn,
                    result : this.result,
                    usages : this.usages, 
                    options : this.options, 
                    failed : result.outcome === "failure",
                    penaltyChoice : result.SL >= 3 })
            case "repair":
            case "repairMinion":
            case "rally":
                return ({ 
                    penaltyChoice : this.penaltyChoice, 
                    targetName : this.targetName, 
                    hullDamaged : this.hullDamaged,            
                    critical : this.critical,
                    criticalBtn : this.criticalBtn,
                    result : this.result,
                    options : this.options, 
                    failed : result.outcome === "failure",
                    usages : this.usages })
            case "scan":
                return ({ 
                    penaltyChoice : this.penaltyChoice, 
                    targetName : this.targetName, 
                    hullDamaged : this.hullDamaged,            
                    critical : this.critical,
                    criticalBtn : this.criticalBtn,
                    result : this.result,
                    usages : this.usages, 
                    options : this.options, 
                    failed : result.outcome === "failure",
                    amount : Math.floor(result.SL/2)+1 })
            case "boarding":
                return ({ 
                    penaltyChoice : this.penaltyChoice, 
                    targetName : this.targetName, 
                    hullDamaged : this.hullDamaged,            
                    critical : this.critical,
                    criticalBtn : this.criticalBtn,
                    result : this.result,
                    usages : this.usages, 
                    options : this.options, 
                    failed : result.outcome === "failure",
                    SL : result.SL });
            case "squadronFail":
                this.failed = result.outcome !== "failure";
                return ({ 
                    penaltyChoice : this.penaltyChoice, 
                    targetName : this.targetName, 
                    hullDamaged : this.hullDamaged,            
                    critical : this.critical,
                    criticalBtn : this.criticalBtn,
                    result : this.result,
                    usages : this.usages, 
                    options : this.options, 
                    failed : result.outcome === "success",
                    SL : result.SL });
            default:
                return ({
                    penaltyChoice : this.penaltyChoice, 
                    targetName : this.targetName, 
                    hullDamaged : this.hullDamaged,            
                    critical : this.critical,
                    criticalBtn : this.criticalBtn,
                    result : this.result,
                    options : this.options, 
                    failed : result.outcome === "failure",
                    usages : this.usages, 
                });
        }
    }

    static async postRestartShields({actor, result})
    {
        this.testType = "restartShields";
        this.result = result;
        this.usages = result.SL >= 3 ? 2 : 1;
        this.penaltyChoice = result.SL >= 3;
        this.actorUuid = actor.uuid ? actor.uuid : actor.parent.uuid;
        this.targetName = actor.name ?? actor.parent.name;
        this.options = {};
        let args = { actor, result, testType : this.testType, options : this.options}
        await Promise.all(actor.runScripts("voidshipOptions", args)); 
        this.options = args.options;

        let content = await this.getContentRestartShields({penaltyChoice : result.SL >= 3, result}, this.options);
        return ChatMessage.create({
            content,
            type : "impmal-rtim.voidshipMessage",
            system : { 
                usages : 1,
                penaltyChoice : result.SL >= 3, 
                testType : "restartShields", 
                hasUsages : false,
                failed : this.failed,
                result : this.result,
                targetName : actor.name ?? actor.parent.name,
                options : this.options,
                actorUuid : this.actorUuid
            },
            speaker : actor,
            flavor : game.i18n.localize("IMPMAL_RTIM.VoidCombat.RestartShieldsAction")
        });
    }

    static async postRepair({actor, result})
    {
        this.testType = "repair";
        this.result = result;
        this.usages = result.SL >= 3 ? 2 : 1;
        this.actorUuid = actor.uuid ? actor.uuid : actor.parent.uuid;
        this.targetName = actor.name ?? actor.parent.name;
        this.options = {};
        let args = { actor, result, testType : this.testType, options : this.options}
        await Promise.all(actor.runScripts("voidshipOptions", args)); 
        this.options = args.options;
        if (this.options?.additionalUsages > 0) this.usages += this.options.additionalUsages;

        let content = await this.getContentRepair({usages : this.usages, result}, this.options);
        return ChatMessage.create({
            content,
            type : "impmal-rtim.voidshipMessage",
            system : { 
                usages : this.usages, 
                testType : "repair", 
                hasUsages : true,
                failed : this.failed,
                result : this.result,
                targetName : actor.name ?? actor.parent.name,
                actorUuid : this.actorUuid,
                options : this.options,
                result : this.result
            },
            speaker : actor,
            flavor : game.i18n.localize("IMPMAL_RTIM.VoidCombat.RepairAction")
        });
    }

    static async postRepairMinion({actor, result})
    {
        this.testType = "repairMinion";
        this.result = result;
        this.usages = 1;
        this.actorUuid = actor.uuid ? actor.uuid : actor.parent.uuid;
        this.targetName = actor.name ?? actor.parent.name;
        this.options = {};
        let args = { actor, result, testType : this.testType, options : this.options}
        await Promise.all(actor.runScripts("voidshipOptions", args)); 
        this.options = args.options;
        if (this.options?.additionalUsages > 0) this.usages += this.options.additionalUsages;

        let content = await this.getContentRepairMinion({usages : this.usages, result}, this.options);
        return ChatMessage.create({
            content,
            type : "impmal-rtim.voidshipMessage",
            system : { 
                usages : this.usages, 
                testType : "repairMinion", 
                hasUsages : true,
                failed : this.failed,
                result : this.result,
                targetName : actor.name ?? actor.parent.name,
                actorUuid : this.actorUuid,
                options : this.options,
                result : this.result
            },
            speaker : actor,
            flavor : game.i18n.localize("IMPMAL_RTIM.VoidCombat.RepairMinionAction")
        });
    }

    static async postRally({actor, result})
    {
        this.testType = "rally";
        this.result = result;
        this.usages = result.SL >= 3 ? 2 : 1;
        this.actorUuid = actor.uuid ? actor.uuid : actor.parent.uuid;
        this.targetName = actor.name ?? actor.parent.name;
        this.options = {};
        let args = { actor, result, testType : this.testType, options : this.options}
        await Promise.all(actor.runScripts("voidshipOptions", args)); 
        this.options = args.options;
        if (this.options?.additionalUsages > 0) this.usages += this.options.additionalUsages;

        let content = await this.getContentRally({usages : this.usages}, this.options);
        return ChatMessage.create({
            content,
            type : "impmal-rtim.voidshipMessage",
            system : { 
                usages : this.usages, 
                testType : "rally", 
                hasUsages : true,
                failed : this.failed,
                result : this.result,
                targetName : actor.name ?? actor.parent.name,
                actorUuid : this.actorUuid,
                options : this.options,
                result : this.result
            },
            speaker : actor,
            flavor : game.i18n.localize("IMPMAL_RTIM.VoidCombat.RallyAction")
        });
    }

    static async postScan({actor, result})
    {
        this.testType = "scan";
        this.actorUuid = actor.uuid ? actor.uuid : actor.parent.uuid;
        this.targetName = actor.name ?? actor.parent.name;
        this.result = result;
        this.usages = 1;
        this.options = {};
        let args = { actor, result, testType : this.testType, options : this.options}
        await Promise.all(actor.runScripts("voidshipOptions", args)); 
        this.options = args.options;

        let content = await this.getContentScan({usages : 1, result, amount : Math.floor(result.SL/2)+1}, this.options);
        return ChatMessage.create({
            content,
            type : "impmal-rtim.voidshipMessage",
            system : { 
                usages : 1,
                testType : "scan", 
                hasUsages : false,
                failed : this.failed,
                result : this.result,
                targetName : actor.name ?? actor.parent.name,
                actorUuid : this.actorUuid,
                result : this.result,
                options : this.options,
            },
            speaker : actor,
            flavor : game.i18n.localize("IMPMAL_RTIM.VoidCombat.ScanAction")
        });
    }

    static async postBoarding({actor, target, result})
    {
        this.testType = "boarding";
        this.actorUuid = actor.uuid ?? actor.parent.uuid;
        this.targetUuid = target.uuid ?? target.parent.uuid;
        this.targetName = target.name ?? target.parent.name;
        this.usages = result.SL >= 3 ? 2 : 1;
        this.result = result;
        this.options = {};
        let args = { actor, result, testType : this.testType, options : this.options, target}
        await Promise.all(actor.runScripts("voidshipOptions", args)); 
        this.options = args.options;
        if (this.options?.additionalUsages > 0) this.usages += this.options.additionalUsages;

        let content = await this.getContentBoarding({usages : this.usages, hullDamaged : false, result, targetName : this.targetName}, this.options);
        return ChatMessage.create({
            content,
            type : "impmal-rtim.voidshipMessage",
            system : { 
                usages : this.usages,
                testType : "boarding", 
                targetName : target.name ?? target.parent.name,
                hasUsages : true,
                hullDamaged : false,
                actorUuid : this.actorUuid,
                targetUuid : this.targetUuid,
                failed : this.failed,
                result : this.result,
                critical : this.critical,
                criticalBtn : this.criticalBtn,
                options : this.options,
            },
            speaker : actor,
            flavor : game.i18n.localize("IMPMAL_RTIM.VoidCombat.BoardingAction")
        });
    }

    static async postDogfight({actor, target, result})
    {
        this.testType = "dogfight";
        this.actorUuid = actor.uuid ?? actor.parent.uuid;
        this.targetUuid = target.uuid ?? target.parent.uuid;
        this.targetName = target.name ?? target.parent.name;
        this.usages = 1;
        this.result = result;
        this.options = {};
        let args = { actor, result, testType : this.testType, options : this.options, target}
        await Promise.all(actor.runScripts("voidshipOptions", args)); 
        this.options = args.options;

        let content = await this.getContentDogfight({usages : 1, hullDamaged : false, result, targetName : this.targetName}, this.options);
        return ChatMessage.create({
            content,
            type : "impmal-rtim.voidshipMessage",
            system : { 
                usages : 1,
                testType : "dogfight", 
                targetName : target.name ?? target.parent.name,
                hasUsages : false,
                hullDamaged : false,
                actorUuid : this.actorUuid,
                targetUuid : this.targetUuid,
                failed : this.failed,
                result : this.result,
                critical : this.critical,
                criticalBtn : this.criticalBtn,
                options : this.options,
            },
            speaker : actor,
            flavor : game.i18n.localize("IMPMAL_RTIM.VoidCombat.Dogfight")
        });
    }

    static async postSquadronFail({actor, target, result})
    {
        this.testType = "squadronFail";
        this.actorUuid = actor.uuid ?? actor.parent.uuid;
        this.targetUuid = target.uuid ?? target.parent.uuid;
        this.targetName = target.name ?? target.parent.name;
        this.usages = 1;
        this.result = result;
        this.options = {};
        let args = { actor, result, testType : this.testType, options : this.options, target}
        await Promise.all(actor.runScripts("voidshipOptions", args)); 
        this.options = args.options;

        let content = await this.getContentSquadronFail({usages : 1, hullDamaged : false, result, failed : false, targetName : this.targetName}, this.options);
        return ChatMessage.create({
            content,
            type : "impmal-rtim.voidshipMessage",
            system : { 
                usages : 1,
                testType : "squadronFail", 
                targetName : target.name ?? target.parent.name,
                hasUsages : false,
                hullDamaged : false,
                actorUuid : this.actorUuid,
                targetUuid : this.targetUuid,
                failed : false,
                result : this.result,
                critical : this.critical,
                criticalBtn : this.criticalBtn,
                options : this.options,
            },
            speaker : actor,
            flavor : game.i18n.localize("IMPMAL_RTIM.VoidCombat.FailedSquadronAction")
        });
    }

}