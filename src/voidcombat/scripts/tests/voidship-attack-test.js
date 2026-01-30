import { VoidshipTest } from "./voidship-test.js";
import { VoidshipAttackEvaluator } from "./voidship-attack-evaluator.js";

export class VoidshipAttackTest extends VoidshipTest
{
    static evaluatorClass = VoidshipAttackEvaluator;
    testDetailsTemplate = "modules/impmal-rtim/voidcombat/templates/tests/voidship-test.hbs";

    // static get actions() 
    // { 
    //     return {
    //         testButton :  this._onDealFatigueToTarget,
    //     };
    // }

    // static async _onDealFatigueToTarget(ev, target)
    // {
    //     console.log(this.system.test.targetTokens);
    // }

    static _getDialogTestData(data)
    {
        let testData = super._getDialogTestData(data);
        testData.hitLocation = data.hitLocation;
        testData.hasDamage = true;
        testData.additionalDamage = data.damage;
        testData.damageFormula = data.damageFormula;
        testData.selfDamage = data.selfDamage;
        return testData;
    }

    _defaultData() 
    {
        let data = super._defaultData();
        data.hitLocation = "fore";
        data.hasDamage = true;
        data.additionalDamage = 0;
        data.damageFormula = "";
        return data;
    }

    async runPreScripts()
    {
        await super.runPreScripts();
        if(this.actor) await Promise.all(this.actor.runScripts("preRollWeaponTest", this));
        if(this.item) await Promise.all(this.item.runScripts("preRollWeaponTest", this));
    }

    async runPostScripts()
    {
        await super.runPostScripts();
        if(this.actor) await Promise.all(this.actor.runScripts("rollWeaponTest", this));
        if(this.item) await Promise.all(this.item.runScripts("rollWeaponTest", this));
    }

    // onChatAction(event, target)
    // {
    //     let action = target.dataset.action;
    //     let actionFn = this.constructor?.actions?.[action]?.bind(this.message);
    //     if (actionFn)
    //     {
    //         actionFn(event, target);
    //     }
    // }

    // listeners(html)
    // {
    //     html.addEventListener("click", event => 
    //     {
    //         const target = event.target.closest("[data-action]");
    //         if ( target ) 
    //         {
    //             this.onChatAction(event, target);
    //         }
    //     });
    // }
}