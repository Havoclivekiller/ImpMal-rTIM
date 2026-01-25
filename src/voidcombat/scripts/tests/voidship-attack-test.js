import { VoidshipTest } from "./voidship-test.js";
import { VoidshipAttackEvaluator } from "./voidship-attack-evaluator.js";

export class VoidshipAttackTest extends VoidshipTest
{
    static evaluatorClass = VoidshipAttackEvaluator;

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
        data.hitLocation = "prow";
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

}