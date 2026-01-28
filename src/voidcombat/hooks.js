import { VoidshipTokenHandler } from "./scripts/voidship-token-handler.js";

export function registerHooks() {
    Hooks.on('preMoveToken', (document, movement, operation) => {
        if (document.actor.type === "impmal-rtim.voidshipSheet" && document?.inCombat && !operation?.teleport && !operation?.freeMove)
        {
            if (movement.method === "dragging" && !game.settings.get("impmal-rtim", "voidcombatSettings").tokenDragMove) return true;
            return document.actor.system.handleMovement({actor : document.actor, movement, preMove : true});
        }
    })

    Hooks.on('moveToken', (document, movement, operation, user) => {
        if (document.actor.type === "impmal-rtim.voidshipSheet" && document?.inCombat && !operation?.teleport && !operation?.freeMove)
        {            
            if (movement.method === "dragging" && !game.settings.get("impmal-rtim", "voidcombatSettings").tokenDragMove) return;
            document.actor.system.handleMovement({actor : document.actor, movement, preMove : false});
        }
    })

    Hooks.on('impmal:startTurn', async (combat) => {
        if (combat?.combatant?.actor?.type === "impmal-rtim.voidshipSheet")
        {
            combat.combatant.actor.system.computeStartTurn();
        }
    })

    Hooks.on('deleteCombat', async (combat) => {
        for(let actor of combat.combatants.map(i => i.actor))
        {
            if (actor?.type === "impmal-rtim.voidshipSheet")
            {
                actor.system.computeEndCombat();
            }
        }
    })

    Hooks.on('impmal:endTurn', async (combat) => {
        let previousCombatant = combat.combatants.get(combat.previous.combatantId);
        if (previousCombatant?.actor?.type === "impmal-rtim.voidshipSheet")
        {
            previousCombatant.actor.system.computeEndTurn();
        }
    })


    Hooks.on("updateToken", (document, change) => {
        if (!document?.object) {
            return;
        }
        if (!document.object._voidshipMovementPreview) {
            return;
        }
        if ("x" in change || "y" in change || "rotation" in change) {
            VoidshipTokenHandler.clearMovementPreview(document.object);
        }
    });

    Hooks.on("deleteToken", (document) => {
        if (document?.object?._voidshipMovementPreview) {
            VoidshipTokenHandler.clearMovementPreview(document.object);
        }
    });

    Hooks.on("canvasReady", () => {
        canvas.tokens?.placeables?.forEach((token) => {
            if (token._voidshipMovementPreview) {
                VoidshipTokenHandler.clearMovementPreview(token);
            }
        });
        VoidshipTokenHandler.bindCanvasClick();
    });

    Hooks.on("canvasTearDown", () => {
        VoidshipTokenHandler.unbindCanvasClick();
        VoidshipTokenHandler.clearMoveMode();
    });

    Hooks.on("preCreateItem", (item, data) => {
        if (!data.img || data.img === "modules/impmal-core/assets/icons/blank.webp") {
            let img = data?.img ?? "";
            if (item.type == "impmal-rtim.voidshipPart")
            {
                img = "modules/impmal-rtim/assets/rtim-smalllogo.webp"
            }
            item.updateSource({ "img": img })
        }
    })

}
