import { VoidShipPartModel } from "./scripts/voidship-part-model.js";
import { VoidShipPartSheet } from "./scripts/voidship-part-sheet.js";
import { VoidshipModel } from "./scripts/voidship-model.js";
import { VoidShipSheet } from "./scripts/voidship-sheet.js";
import { VOIDSHIP_CONFIG } from "./constants.js"
import { VoidshipTest } from "./scripts/tests/voidship-test.js";
import { VoidshipAttackTest } from "./scripts/tests/voidship-attack-test.js";
import { VoidshipMessageModel } from "./scripts/tests/voidship-message-model.js";
import { VoidshipOpposedTestMessageModel } from "./scripts/tests/voidship-opposed-test-message-model.js";
import { registerHooks } from "./hooks.js";
import { registerOverride } from "./override.js";
import { VoidcombatSettings } from "./scripts/voidcombat-settings.js";

Hooks.on('init', () => {
    const socketName = "module.impmal-rtim";

    game.settings.registerMenu("impmal-rtim", "voidcombatSettingsMenu", {
        name : game.i18n.localize("IMPMAL_RTIM.VoidCombat.Settings.Name"),
        label : game.i18n.localize("IMPMAL_RTIM.VoidCombat.Settings.Label"),
        hint : game.i18n.localize("IMPMAL_RTIM.VoidCombat.Settings.Hint"),
        icon : "fa-solid fa-list",
        type : VoidcombatSettings,
        restricted : true
    });

    game.settings.register("impmal-rtim", "voidcombatSettings", {
        name: "IMPMAL_RTIM.VoidCombat.Settings.Settings",
        scope: "world",
        config: false,
        type: VoidcombatSettings.schema
    });

    registerOverride();
    registerHooks();

    foundry.documents.collections.Actors.registerSheet('impmal-rtim', VoidShipSheet, {
        types: ['impmal-rtim.voidshipSheet'],
        makeDefault: true, label: "Ship Sheet"
    });

    foundry.documents.collections.Items.registerSheet('impmal-rtim', VoidShipPartSheet, {
        types: ['impmal-rtim.voidshipPart'],
        makeDefault: true, label: "Ship Part Sheet"
    });

    Object.assign(CONFIG.Actor.dataModels, {
        'impmal-rtim.voidshipSheet': VoidshipModel
    });

    Object.assign(CONFIG.Item.dataModels, {
        'impmal-rtim.voidshipPart': VoidShipPartModel,
    }); 

    Object.assign(CONFIG.ChatMessage.dataModels, {
        'impmal-rtim.voidshipMessage': VoidshipMessageModel,
        'impmal-rtim.voidshipOpposedMessage': VoidshipOpposedTestMessageModel
    }); 
    foundry.utils.mergeObject(IMPMAL, VOIDSHIP_CONFIG, {overwrite: false});

    foundry.utils.mergeObject(game.impmal.testClasses, {VoidshipTest, VoidshipAttackTest}, {overwrite: false});

    foundry.applications.handlebars.loadTemplates({
        voidshipWeaponItem : "modules/impmal-rtim/voidcombat/templates/voidship-part/parts/voidship-weapon-partial.hbs",
        voidshipHullItem : "modules/impmal-rtim/voidcombat/templates/voidship-part/parts/voidship-hull-partial.hbs",
        voidshipRoleItem : "modules/impmal-rtim/voidcombat/templates/voidship-part/parts/voidship-role-partial.hbs",
        voidshipComponentItem : "modules/impmal-rtim/voidcombat/templates/voidship-part/parts/voidship-component-partial.hbs",
        voidshipTraitItem : "modules/impmal-rtim/voidcombat/templates/voidship-part/parts/voidship-trait-partial.hbs",
        voidshipCriticalItem : "modules/impmal-rtim/voidcombat/templates/voidship-part/parts/voidship-critical-partial.hbs",
        voidshipWeaponOptionsSheet : "modules/impmal-rtim/voidcombat/templates/voidship/parts/voidship-weapon-options.hbs",
    });

    IMPMAL.conditions.push({
        img: "modules/impmal-rtim/assets/voidcombat/escortVoidship.webp",
        id: "escortVoidship",
        name: "IMPMAL_RTIM.VoidCombat.EscortVoidship",
        system : {
                scriptData: [
                    {
                        label: "Turret Rating",
                        script: `
                        this.actor.system.turretRating.modifier += 10
                        `,
                        trigger: "prePrepareDerivedData",
                    }
                ]
        },
        img: "modules/impmal-rtim/assets/voidcombat/silentRunning.webp",
        id: "silentRunning",
        name: "IMPMAL_RTIM.VoidCombat.SilentRunning",
        system : {
                scriptData: [
                    {
                        label : "Advantage on shooting at unaware targets",
                        script: "args.advCount++;",
                        trigger: "dialog",
                        options: {
                                hideScript: `return args.context.type !== "shooting"`,
                                activateScript: `return args.context.type === "shooting"`,
                                submissionScript : ``
                        }
                    }
                ]
        },
    });

    let clone = foundry.utils.deepClone(CONFIG.Token.movement.actions["walk"]);
    clone.canSelect = (() => false);
    CONFIG.Token.movement.actions["freeMove"] = clone;

    foundry.utils.mergeObject(IMPMAL.scriptTriggers, {
        voidshipOptions: "IMPMAL_RTIM.VoidCombat.VoidshipOptions",
    })

    game.socket?.on(socketName, (data) => {
        if (!data) return;
        if (!game.user?.isGM) return;
        if (data.type === "voidshipRotateToken")
        {
            let scene = game.scenes?.get(data.sceneId) ?? canvas?.scene;
            let token = scene?.tokens?.get(data.tokenId);
            if (!token) return;
            token.actor.system.rotateToken(token, data.rotation);
        }
        if (data.type === "applyDamage")
        {
            let actor = fromUuidSync(data.actorUuid);
            if (actor)
            {
                actor.applyDamage(data.damage, data.options);
            }
        }
        
    });

});
