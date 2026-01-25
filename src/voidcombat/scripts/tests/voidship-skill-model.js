export class VoidshipSkillModel extends SkillModel
{
    static _characteristic = "";

    static defineSchema() 
    {
        let schema = {};
        const fields = foundry.data.fields;

        schema.characteristic = new fields.StringField({initial : this._characteristic});
        schema.advances = new fields.NumberField({min: 0, initial: 0});
        schema.modifier = new fields.NumberField({initial : 0});
        schema.modifierManual = new fields.NumberField({initial : 0});

        return schema;
    }

    static createModel(characteristic)
    {
        return new fields.EmbeddedDataField(class cls extends VoidshipSkillModel {
            static _characteristic = characteristic
        })
    }

    computeTotal(characteristics) 
    {
        this.characteristicData = characteristics[this.characteristic];
        this.total = this.characteristicData.total + (5 * this.advances) + this.modifier + this.modifierManual;
    }

    getTotalFor(characteristic, actor)
    {
        if (!characteristic)
        {
            characteristic = this.characteristic;
        }
        return actor.system.characteristics[characteristic].total + (5 * this.advances) + this.modifier + this.modifierManual;
    }
}