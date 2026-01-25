export class VoidshipOpposedTestResult extends OpposedTestResult
{
    //damageFormula = undefined;
    static damagingTypes = ["shooting", "bomberRun", "torpedoSalvo"];

    evaluateResult(attackerTest, defenderTest)
    {
        this.SL = attackerTest.result.SL - (defenderTest?.result?.SL || 0); // If no defender test, unopposed 
        if (this.SL > 0)
        {
            this.winner = "attacker";
        }
        else if (this.SL < 0)
        {
            this.winner = "defender";
        }
        else if (this.SL == 0)
        {
            // If both parties in an Opposed Test get the same SL, the character with the higher Skill wins
            if (defenderTest)
            {
                let attackerSkillTotal = attackerTest.computeTarget(true);
                let defenderSkillTotal = defenderTest.computeTarget(true);

                if (attackerSkillTotal > defenderSkillTotal)
                {
                    this.winner = "attacker";
                }
                else if (attackerSkillTotal < defenderSkillTotal)
                {
                    this.winner = "defender";
                }
                // GM decides in event of skill tie
            }
            // If Unopposed, use the outcome of the attacker test to determine winner
            else
            {
                if (attackerTest.succeeded)
                {
                    this.winner = "attacker";
                }
                else
                {
                    this.winner = "defender";
                }
            }
        }

        if ((this.winner == "attacker" && this.constructor.damagingTypes.includes(attackerTest.context?.type)) 
            || attackerTest.context.type === "ramming")
        {
            this.damage = this.computeDamage(attackerTest.item, {attackerTest, defenderTest});
            this.formatTooltips();
        }

    }

    computeDamage(item, {attackerTest, defenderTest})
    {
        let additional = attackerTest.result.additionalDamage ?? 0;
        if (additional)
        {
            this._tooltips.damage.additional = {label : "IMPMAL.Other", value : additional};
        }
        switch (attackerTest.context.type)
        {
            case "shooting":
                return this._computeShootingDamage(item, {attackerTest, defenderTest}) + (attackerTest.result.additionalDamage || 0);
            case "bomberRun":
                return this._computeBomberRunDamage(item, {attackerTest, defenderTest}) + (attackerTest.result.additionalDamage || 0);
            case "torpedoSalvo":
                return this._computeTorpedoSalvoDamage(item, {attackerTest, defenderTest}) + (attackerTest.result.additionalDamage || 0);
            case "ramming":
                return this._computeRammingDamage({attackerTest, defenderTest}) + (attackerTest.result.additionalDamage || 0);
        }
    }

    _computeRammingDamage({attackerTest, defenderTest}={})
    {
        let damage = attackerTest.actor.system.options.takeAvgArmour ? 
        attackerTest.actor.system.armour.average.value :
        attackerTest.actor.system.armour.prow.value;
        this._tooltips.damage.base = {label : "IMPMAL_RTIM.VoidCombat.ProwArmour", value : damage};

        let sizeBonus = Math.max(attackerTest?.actor?.system?.size?.value - defenderTest?.actor?.system?.size?.value, 0);
        
        damage += sizeBonus;
        if (sizeBonus > 0) this._tooltips.damage.size = {label : "IMPMAL_RTIM.VoidCombat.SizeBonus", value : sizeBonus};

        if ((attackerTest.result.SL - defenderTest?.result?.SL) > 0) 
        {
            damage += (attackerTest.result.SL - defenderTest?.result?.SL);
            this._tooltips.damage.SL = {label : "IMPMAL.Opposed", value : (attackerTest.result.SL - defenderTest?.result?.SL)};
        }

        return damage;
    }

    _computeTorpedoSalvoDamage(item, {attackerTest, defenderTest}={})
    {
        let damage = 0;
        if (!item?.system?.weapon?.damage === undefined)
        {
            return damage;
        }

        damage += item?.system.weapon.damage;
        this._tooltips.damage.base = {label : "IMPMAL.Weapon", value : item?.system.weapon.damage};

        if (item?.system.weapon.damageFormula)
        {
            this.damageFormula = item?.system.weapon.damageFormula;
            damage += attackerTest.result.damageFormulaResult;
            this._tooltips.damage.formula = {label : game.i18n.format("IMPMAL_RTIM.VoidCombat.FormulaDisplay",{formula:item?.system.weapon.damageFormula}), value : attackerTest.result.damageFormulaResult};
        }

        if (item?.system.weapon.damageSL)
        {
            damage += attackerTest.result.SL;
            this._tooltips.damage.SL = {label : "IMPMAL.SL", value : attackerTest.result.SL};

            if (defenderTest?.result?.SL > 0)
            {
                let opposed = (defenderTest?.result?.SL || 0);
                this._tooltips.damage.opposed = {label : "IMPMAL.Opposed", value : -opposed};
                damage -= opposed;
            }
        }

        return damage;
    }

    _computeBomberRunDamage(item, {attackerTest, defenderTest}={})
    {
        let damage = 0;
        if (!item?.system?.weapon?.damage === undefined)
        {
            return damage;
        }

        damage += item?.system.weapon.damage;
        this._tooltips.damage.base = {label : "IMPMAL.Weapon", value : item?.system.weapon.damage};

        if (item?.system.weapon.damageFormula)
        {
            this.damageFormula = item?.system.weapon.damageFormula;
            damage += attackerTest.result.damageFormulaResult;
            this._tooltips.damage.formula = {label : game.i18n.format("IMPMAL_RTIM.VoidCombat.FormulaDisplay",{formula:item?.system.weapon.damageFormula}), value : attackerTest.result.damageFormulaResult};
        }

        if (item?.system.weapon.damageSL)
        {
            damage += attackerTest.result.SL;
            this._tooltips.damage.SL = {label : "IMPMAL.SL", value : attackerTest.result.SL};

            if (defenderTest?.result?.SL > 0)
            {
                let opposed = (defenderTest?.result?.SL || 0);
                this._tooltips.damage.opposed = {label : "IMPMAL.Opposed", value : -opposed};
                damage -= opposed;
            }
        }

        return damage;
    }

    _computeShootingDamage(item, {attackerTest, defenderTest}={})
    {
        let damage = 0;
        if (!item?.system?.weapon?.damage === undefined)
        {
            return damage;
        }

        damage += item?.system.weapon.damage;
        this._tooltips.damage.base = {label : "IMPMAL.Weapon", value : item?.system.weapon.damage};

        if (item?.system.weapon.damageFormula)
        {
            this.damageFormula = item?.system.weapon.damageFormula;
            damage += attackerTest.result.damageFormulaResult;
            this._tooltips.damage.formula = {label : game.i18n.format("IMPMAL_RTIM.VoidCombat.FormulaDisplay",{formula:item?.system.weapon.damageFormula}), value : attackerTest.result.damageFormulaResult};
        }

        if (item?.system.weapon.damageSL)
        {
            damage += attackerTest.result.SL;
            this._tooltips.damage.SL = {label : "IMPMAL.SL", value : attackerTest.result.SL};

            if (defenderTest?.result?.SL > 0)
            {
                let opposed = (defenderTest?.result?.SL || 0);
                this._tooltips.damage.opposed = {label : "IMPMAL.Opposed", value : -opposed};
                damage -= opposed;
            }
        }

        return damage;
    }

}