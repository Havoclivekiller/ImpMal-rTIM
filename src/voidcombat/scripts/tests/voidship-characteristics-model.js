import { VoidshipCharacteristicModel } from "./voidship-characteristic-model.js";

export class VoidshipCharacteristicsModel extends foundry.abstract.DataModel 
{
    static defineSchema() 
    {
        const fields = foundry.data.fields;
        let schema = {};
        schema.crew = new fields.EmbeddedDataField(VoidshipCharacteristicModel);

        schema.ws = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        schema.bs = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        schema.str = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        schema.tgh = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        schema.ag = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        schema.int = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        schema.per = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        schema.wil = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        schema.fel = new fields.EmbeddedDataField(VoidshipCharacteristicModel);
        return schema;
    }


    computeTotals() 
    {
        for(let ch in this)
        {
            this[ch].computeTotal();
        }
    }

    computeBonuses() 
    {
        for(let ch in this)
        {
            this[ch].computeBonus();
        }
    }
}