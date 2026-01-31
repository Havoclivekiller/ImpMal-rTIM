import { registerActiveEffects } from "./active-effects.js";

Hooks.on('init', () => {
    registerSettings();

    foundry.utils.mergeObject(game.impmal.config.disciplines, {
        waaagh: "WAAAGH!"
    });

    foundry.utils.mergeObject(game.impmal.config.corruptionType, {
        exaltation: "Exaltation",
        revelation: "Revelation",
        cosmeticmutation: "Cosmetic Mutation"
    });   
    
    registerActiveEffects();
});

function registerSettings() {
}