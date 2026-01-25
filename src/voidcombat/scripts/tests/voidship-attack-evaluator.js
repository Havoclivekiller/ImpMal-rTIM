export class VoidshipAttackEvaluator extends BaseTestEvaluator
{
    computeOther(data) 
    {
        this.damageFormula = data.damageFormula;
        this.damageFormulaResult = data.result.formulaRoll;
        this.additionalDamage = data.additionalDamage;
        this.critModifier = data.critModifier;
        this.selfDamage = data.selfDamage;
        this.computeHitLocation(data);
        super.computeOther(data);
    }

    computeTagsAndText()
    {
        super.computeTagsAndText();
    }

    computeHitLocation(data)
    {
        if (this.hitLocation)
        {
            return;
        }
        this.hitLocation = data.hitLocation;
    }

    async evaluate(data)
    {
        this.clear();
        this.tags = {};
        this.text = {};
        let roll = await new Roll("1d100").evaluate({async: true});
        if (data.damageFormula) {
            let formulaRoll = await new Roll(data.damageFormula).evaluate({async: true});
            data.result.formulaRoll = data.result.formulaRoll || formulaRoll.total;
            data.result.formulaRollObject = formulaRoll;
        }
        data.result.roll = data.result.roll || roll.total;
        data.result.rollObject = roll;
        this.computeResult(data);
    }

}