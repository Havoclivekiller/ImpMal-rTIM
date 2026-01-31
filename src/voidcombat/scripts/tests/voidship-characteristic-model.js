export class VoidshipCharacteristicModel extends foundry.abstract.DataModel
{
    static defineSchema() 
    {
        let schema = {};
        const fields = foundry.data.fields;

        schema.starting = new fields.NumberField({min: 0, initial: 20});
        schema.modifier = new fields.NumberField({initial: 0});
        schema.advances = new fields.NumberField({min: 0, initial: 0});
        schema.fatiguePenalty = new fields.NumberField({min: 0, initial: 0});
        return schema;
    }


    computeTotal() 
    {
        this.total = Math.max(this.starting + this.modifier + this.advances - this.fatiguePenalty, 0);
    }

    computeBonus() 
    {
        this.bonus = Math.floor((this.total + this.fatiguePenalty) / 10);
    }
}