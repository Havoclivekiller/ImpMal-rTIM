const fields = foundry.data.fields;

export default class ModuleData extends StandardItemModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            description: new fields.StringField({ initial: '' }),
            level: new fields.NumberField({ initial: 0 }),

            levelZeroEffect: new fields.HTMLField({ initial: '' }),
            levelOneEffect: new fields.HTMLField({ initial: '' }),
            levelTwoEffect: new fields.HTMLField({ initial: '' }),
            levelThreeEffect: new fields.HTMLField({ initial: '' }),
            levelFourEffect: new fields.HTMLField({ initial: '' }),
            levelFiveEffect: new fields.HTMLField({ initial: '' })
        };
    }

    async summaryData() {
        let data = await super.summaryData();
        data.details.item.effect = 'blablabla';
        return data;
    }
}
