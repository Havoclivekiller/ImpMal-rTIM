import { VoidshipSkillModel } from "./voidship-skill-model.js";

export class VoidshipSkillsModel extends foundry.abstract.DataModel
{
    static defineSchema() 
    {
        let schema = {};
        schema.athletics = VoidshipSkillModel.createModel("crew");
        schema.awareness = VoidshipSkillModel.createModel("crew");
        schema.dexterity = VoidshipSkillModel.createModel("crew");
        schema.discipline = VoidshipSkillModel.createModel("crew");
        schema.fortitude = VoidshipSkillModel.createModel("crew");
        schema.intuition = VoidshipSkillModel.createModel("crew");
        schema.linguistics = VoidshipSkillModel.createModel("crew");
        schema.logic = VoidshipSkillModel.createModel("crew");
        schema.lore = VoidshipSkillModel.createModel("crew");
        schema.medicae = VoidshipSkillModel.createModel("crew");
        schema.melee = VoidshipSkillModel.createModel("crew");
        schema.navigation = VoidshipSkillModel.createModel("crew");
        schema.presence = VoidshipSkillModel.createModel("crew");
        schema.piloting = VoidshipSkillModel.createModel("crew");
        schema.psychic = VoidshipSkillModel.createModel("crew");
        schema.ranged = VoidshipSkillModel.createModel("crew");
        schema.rapport = VoidshipSkillModel.createModel("crew");
        schema.reflexes = VoidshipSkillModel.createModel("crew");
        schema.stealth = VoidshipSkillModel.createModel("crew");
        schema.tech = VoidshipSkillModel.createModel("crew");
        return schema;
    }

    computeTotals(characteristics) 
    {
        for(let sk in this)
        {
            this[sk].computeTotal(characteristics);
        }
    }

    findSpecialisations(specialisations)
    {
        for(let sk in this)
        {
            this[sk].specialisations = [];
        }

        for(let item of specialisations)
        {
            try 
            {
                this[item.system.skill].specialisations.push(item);
            }
            catch (e)
            {
                warhammer.utility.log("Error assigning skill specialisation:", {args: item});
            }
        }
    }

    /** @inheritdoc */
    static migrateData(source) {
        super.migrateData(source);
    }
}