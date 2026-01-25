import { VoidshipSetupTests } from "./tests/voidship-setup-tests.js";
import { VoidshipTokenHandler } from "./voidship-token-handler.js";

const MODULE_ID = "impmal-community";
const SOCKET_NAME = `module.${MODULE_ID}`;

export class VoidShipSheet extends IMActorSheet {

    blockRangeCheck = false;
    blockMovementCheck = false;
    collapsed = {};

    static DEFAULT_OPTIONS = {
        actions: {
            removeShipMember: this._onRemoveShipMember,
            openShipMember: this._onOpenShipMember,
            expandRow: this._onExpandRow,
            createSpecialisation : this._onCreateSpecialisation,
            makeTest : this._onMakeTest,
            assignRoleMember : this._onAssignRoleMember,
            editShipPart : this._onEditShipPart,
            removeShipPart : this._onRemoveShipPart,
            removeHull : this._onRemoveHull,
            weaponCheckRange : this._onWeaponCheckRange,
            toggleMovementPreview: this._onToggleMovementPreview,
            toggleMovementMove: this._onToggleMovementMove,
            fixProperty : this._onFixProperty,
            useReload : this._onUseReload,
            addBonus: this._onAddBonus,
            removeBonus: this._onRemoveBonus,
            addBonusType: this._onAddBonusType,
            removeBonusType: this._onRemoveBonusType,
            goSilent: this._onGoSilent,
        },
        position: {
            height: 900,
            width: 800
        },
        defaultTab : "combat"
    }

    static PARTS = {
        header: {
            scrollable: [''],
            template: 'modules/impmal-rtim/voidcombat/templates/voidship/voidship-sheet-header.hbs',
            classes: ['sheet-header']
        },
        tabs: { scrollable: [''], template: 'templates/generic/tab-navigation.hbs' },
        main: {
            scrollable: [''],
            template: 'modules/impmal-rtim/voidcombat/templates/voidship/voidship-sheet-main.hbs'
        },
        combat: {
            scrollable: [''],
            template: 'modules/impmal-rtim/voidcombat/templates/voidship/voidship-sheet-combat.hbs'
        },
        roles: {
            scrollable: [''],
            template: 'modules/impmal-rtim/voidcombat/templates/voidship/voidship-sheet-roles.hbs'
        },
        components: {
            scrollable: [''],
            template: 'modules/impmal-rtim/voidcombat/templates/voidship/voidship-sheet-components.hbs'
        },
        modifiers: {
            scrollable: [''],
            template: 'modules/impmal-rtim/voidcombat/templates/voidship/voidship-sheet-modifiers.hbs'
        },
        effects: { scrollable: [""], template: 'modules/impmal-rtim/voidcombat/templates/voidship/voidship-sheet-effects.hbs' },
        notes: { scrollable: [""], template: 'modules/impmal-rtim/voidcombat/templates/voidship/voidship-sheet-notes.hbs' },
    };

    static TABS = {
        main: {
            id: 'main',
            group: 'primary',
            label: 'IMPMAL_RTIM.VoidCombat.SheetName'
        },
        combat: {
            id: 'combat',
            group: 'primary',
            label: 'IMPMAL_RTIM.VoidCombat.Combat'
        },
        roles: {
            id: 'roles',
            group: 'primary',
            label: 'IMPMAL_RTIM.VoidCombat.Roles'
        },
        components: {
            id: 'components',
            group: 'primary',
            label: 'IMPMAL_RTIM.VoidCombat.Components'
        },
        modifiers: {
            id: 'modifiers',
            group: 'primary',
            label: 'IMPMAL_RTIM.VoidCombat.Modifiers'
        },
        effects: {
          id: "effects",
          group: "primary",
          label: "IMPMAL.Effects",
        },
        notes: {
          id: "notes",
          group: "primary",
          label: "IMPMAL.Notes",
        },
    };

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        if (!this.collapsed || Object.keys(this.collapsed).length === 0) {
            this.collapsed = foundry.utils.deepClone(
                game.user.getFlag("impmal-rtim", "voidshipCollapsedRows") ?? {}
            );
        }
        const shipParts = this.actor.itemTypes["impmal-rtim.voidshipPart"];
        const weaponParts = shipParts.filter(item => item.system?.partType === "weapon");
        context.criticalParts = shipParts.filter(item => item.system?.partType === "critical");
        const hullPart = shipParts.find(item => item.system?.partType === "hull");

        context.areMembers = this.actor.system.shipMembers.length !== 0;
        context.notMinion = this.actor.system.shipType !== "minion";
        context.isCrewRiots = this.actor.system?.characteristics?.crew?.total <= 0 && this.actor.system?.fatigue?.value >= this.actor.system?.fatigue?.max;
        context.isFatigued = !context.isCrewRiots && this.actor.system?.fatigue?.value >= this.actor.system?.fatigue?.max;
        context.weaponOptions = weaponParts.map(item => ({
            value: item.id,
            label: item.name
        }));
        context.weaponById = Object.fromEntries(
            weaponParts.map(item => [
                item.id,
                {
                    id: item.id,
                    uuid: item.uuid,
                    img: item.img,
                    type: item.system.weapon.type || "",
                    damaged: item.system.status === "damaged",
                    destroyed: item.system.status === "destroyed",
                    active: item.system.active,
                    reloaded: item.system.weapon.reloaded
                }
            ])
        );
        context.hasCriticalParts = context.criticalParts.length > 0;
        const slotKeys = ["prow", "port", "starboard", "aft", "dorsal", "keel"];
        const slotData = this.actor.system?.weaponSlots || {};
        const assignedBySlot = Object.fromEntries(slotKeys.map((key) => {
            const assigned = Array.isArray(slotData[key]?.assigned) ? slotData[key].assigned : [];
            return [key, assigned];
        }));
        const assignedSetAll = new Set(
            Object.values(assignedBySlot).flat().filter(Boolean)
        );
        context.weaponSlots = Object.fromEntries(slotKeys.map((key) => {
            const count = Number(slotData[key]?.value ?? 0);
            const assigned = Array.isArray(assignedBySlot[key]) ? assignedBySlot[key] : [];
            const slots = Array.from({ length: count }, (_, index) => {
                const currentAssigned = assigned[index] || "";
                const reserved = new Set(assignedSetAll);
                if (currentAssigned) {
                    reserved.delete(currentAssigned);
                }
                const options = weaponParts
                    .filter(item => !reserved.has(item.id))
                    .map(item => ({
                        value: item.id,
                        label: item.name,
                        img : item.img
                    }));
                return {
                    index,
                    assigned: currentAssigned,
                    options
                };
            });
            return [
                key,
                {
                    value: count,
                    slots
                }
            ];
        }));
        context.hasWeaponSlots = slotKeys.some(key => Number(slotData[key]?.value ?? 0) > 0);        
        context.macroWeapons = weaponParts
            .filter(item => item.system?.weapon?.type === "macro");
        context.lanceWeapons = weaponParts
            .filter(item => item.system?.weapon?.type === "lance");
        context.novaWeapons = weaponParts
            .filter(item => item.system?.weapon?.type === "nova");
        context.otherWeapons = weaponParts
            .filter(item => item.system?.weapon?.type === "other");
        context.torpedoWeapons = weaponParts
            .filter(item => item.system?.weapon?.type === "torpedo");
        context.landingWeapons = weaponParts
            .filter(item => item.system?.weapon?.type === "landing");
        context.hasMacroWeapons = context.macroWeapons.length > 0;
        context.hasLanceWeapons = context.lanceWeapons.length > 0;
        context.hasTorpedoWeapons = context.torpedoWeapons.length > 0;
        context.hasLandingWeapons = context.landingWeapons.length > 0;
        context.hasNovaWeapons = context.novaWeapons.length > 0;
        context.hasOtherWeapons = context.otherWeapons.length > 0;
        context.hasAnyWeapons = context.hasMacroWeapons ||
            context.hasLanceWeapons ||
            context.hasTorpedoWeapons ||
            context.hasLandingWeapons ||
            context.hasNovaWeapons ||
            context.hasOtherWeapons;
            
        context.crewTraits = shipParts.filter(item => item.system?.partType === "trait");
        context.hullName = hullPart?.name || "";
        context.hullId = hullPart?.id || "";
        context.hullStats = hullPart
            ? {
                value: hullPart.system.hull.value ?? 0,
                size: hullPart.system.hull.size ?? 0,
                speedRating: hullPart.system.hull.speedRating ?? 0,
                turnRating: hullPart.system.hull.turnRating ?? 0,
                evasionRating: hullPart.system.hull.evasionRating ?? 0,
                detectionRating: hullPart.system.hull.detectionRating ?? 0,
                turretRating: hullPart.system.hull.turretRating ?? 0,
                effect: hullPart.system.effect
            }
            : null;

        context.requiredSkills = ["piloting","ranged","presence","rapport","tech","awareness","navigation","logic"];
        context.shipPointsTotal = shipParts.reduce((total, item) => total + Number(item.system?.shipPoints || 0), 0);
        context.componentSpaceUsed = shipParts.filter(item => item.system?.partType === "component")
                            .reduce((total, item) => total + Number(item.system?.space || 0), 0);
        
        context.essentialComponents = shipParts.filter(item => item.system?.partType === "component" && item.system?.component.type === "essential");
        context.supplementalComponentsCombat = shipParts.filter(item => item.system?.partType === "component" 
            && item.system?.component.type === "supplemental" && item.system?.component.subtypeSupplemental === "combat");
        context.supplementalComponentsNonCombat = shipParts.filter(item => item.system?.partType === "component" 
            && item.system?.component.type === "supplemental" && item.system?.component.subtypeSupplemental === "noncombat");

        const memberUuids = Array.from(this.actor.system.shipMembers || []);
        const members = await Promise.all(memberUuids.map(uuid => fromUuid(uuid)));
        const userCharacters = new Set(
            game.users
                .filter(user => user.character)
                .map(user => user.character.uuid)
        );
        const resolvedMembers = members
            .filter(member => member)
            .map(member => ({
                uuid: member.uuid,
                name: member.name,
                img: member.img,
                origin: member.system?.origin?.name || "",
                faction: member.system?.faction?.name || "",
                role: member.system?.role?.name || "",
                species: member.system?.details?.species || member.system?.species || "",
                isPlayerCharacter: userCharacters.has(member.uuid)
            }));
        context.playerCharacters = resolvedMembers.filter(member => member.isPlayerCharacter);
        context.alliedCharacters = resolvedMembers.filter(member => !member.isPlayerCharacter);
        context.shipMemberOptions = resolvedMembers.map(member => ({
            uuid: member.uuid,
            name: member.name,
            img: member.img
        }));
        context.collapsed = this.collapsed;
        context.roleParts = shipParts.filter(item => item.system?.partType === "role");
        return context;
    }

    _prepareTabs(options) 
    {
        let tabs = super._prepareTabs(options);
        if (this.actor.itemTypes["impmal-rtim.voidshipPart"].length == 0 || 
            this.actor.itemTypes["impmal-rtim.voidshipPart"].filter((item) => item.system.partType === "role").length == 0)
        {
            delete tabs.roles;
        }
        if (this.actor.itemTypes["impmal-rtim.voidshipPart"].length == 0 || 
            this.actor.itemTypes["impmal-rtim.voidshipPart"].filter((item) => item.system.partType === "component").length == 0)
        {
            delete tabs.components;
        }
        return tabs;
    }

    async _onRender(options) {
        await super._onRender(options);
        if (!this.element) {
            return;
        }

        this.element.querySelectorAll("[data-action='adjustPoints']").forEach((element) => {
            element.onclick = this._onAdjustPoints.bind(this);
            element.oncontextmenu = this._onAdjustPoints.bind(this);
        });

        this.element.querySelectorAll("[data-action='advanceRoleCooldown']").forEach((element) => {
            element.onclick = this._onAdvanceRoleCooldown.bind(this);
            element.oncontextmenu = this._onAdvanceRoleCooldown.bind(this);
        });

        this.element.querySelectorAll("[data-action='editItemProperty']").forEach(element => 
        {
            element.addEventListener("change", this.constructor._onEditItemProperty.bind(this));
        });

        this.element.querySelectorAll("[data-action='assignRoleMember']").forEach(element =>
        {
            element.addEventListener("change", this.constructor._onAssignRoleMember.bind(this));
        });

    }

    static _onExpandRow(ev, target) {    
        let dropdown = target.closest(".list-row").querySelector(".dropdown-content");
        if (dropdown.classList.contains("expanded")) {
            dropdown.classList.replace("expanded", "collapsed");
            if (target.dataset.collapseid)
            {
              this.collapsed[target.dataset.collapseid] = true;
            }
        }
        else if (dropdown.classList.contains("collapsed")) {
            dropdown.classList.replace("collapsed", "expanded");
            if (target.dataset.collapseid)
            {
              this.collapsed[target.dataset.collapseid] = false;
            }
        }
        if (target.dataset.collapseid) {
            game.user.setFlag("impmal-rtim", "voidshipCollapsedRows", this.collapsed);
        }
    }

    async _onDropActor(data, event) {
        let drop = await super._onDropActor(data, event);
        if (data?.type !== "Actor" || !data?.uuid) {
            return drop;
        }
        let actor = await fromUuid(data.uuid);
        if (!actor) {
            return drop;
        }
        if (!["npc", "character"].includes(actor.type)) {
            return drop;
        }
        const current = Array.from(this.actor.system.shipMembers || []);
        if (!current.includes(actor.uuid)) {
            current.push(actor.uuid);
            await this.actor.update({ "system.shipMembers": current });
        }

        return drop;
    }

    async _onDropItem(data, ev) {
        if (data?.type === "Item" && data?.uuid) {
            let item = await Item.implementation.fromDropData(data);
            if (item?.system?.partType === "hull") {
                const existingHulls = this.actor.items.filter(existingItem =>
                    existingItem.type === "impmal-rtim.voidshipPart" &&
                    existingItem.system?.partType === "hull"
                );
                const isSameHull = item?.parent?.uuid === this.actor.uuid &&
                    existingHulls.some(existing => existing.id === item.id);
                if (existingHulls.length && !isSameHull) {
                    const confirm = await foundry.applications.api.DialogV2.confirm({
                        window: {title:`${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ReplaceHullConfirm")}`}
                    });
                    if (!confirm) {
                        return false;
                    }
                    await this.actor.deleteEmbeddedDocuments("Item", existingHulls.map(entry => entry.id));
                }
                const hullData = item.system?.hull || {};
                const updates = { "system.hull.uuid": item.uuid };
                const updateTrack = (path, baseValue, hasMax) => {
                    const modifier = Number(foundry.utils.getProperty(this.actor.system, `${path}.modifier`) ?? 0);
                    const manual = Number(foundry.utils.getProperty(this.actor.system, `${path}.modifierManual`) ?? 0);
                    const base = Number(baseValue ?? 0);
                    const total = base + modifier + manual;
                    updates[`system.${path}.base`] = base;
                    if (hasMax)
                    {
                        updates[`system.${path}.max`] = total;
                    }
                    updates[`system.${path}.value`] = total;
                };
                updateTrack("hull", hullData.value, true);
                updateTrack("speedRating", hullData.speedRating);
                updateTrack("detectionRating", hullData.detectionRating);
                updateTrack("size", hullData.size);
                updateTrack("supplemental", hullData.supplemental);
                updateTrack("evasionRating", hullData.evasionRating);
                updateTrack("turretRating", hullData.turretRating);
                const updateDirectional = (groupPath, values = {}, hasMax) => {
                    Object.entries(values).forEach(([key, value]) => {
                        updateTrack(`${groupPath}.${key}`, value, hasMax);
                    });
                };
                updateDirectional("shields", hullData.shields, true);
                updateDirectional("armour", hullData.armour, false);
                const weaponSlots = hullData.weapons || {};
                Object.entries(weaponSlots).forEach(([key, value]) => {
                    const baseValue = Number(value ?? 0);
                    updates[`system.weaponSlots.${key}.base`] = baseValue;
                    if (baseValue <= 0) {
                        updates[`system.weaponSlots.${key}.assigned`] = [];
                    }
                });
                await this.actor.update(updates);
            }
            if (item?.system?.partType === "component" && item.system?.component?.type === "essential") {
                const subtype = item.system?.component?.subtypeEssential;
                if (subtype) {
                    const existing = this.actor.items.filter(existingItem =>
                        existingItem.type === "impmal-rtim.voidshipPart" &&
                        existingItem.system?.partType === "component" &&
                        existingItem.system?.component?.type === "essential" &&
                        existingItem.system?.component?.subtypeEssential === subtype
                    );
                    if (existing.length) {
                        await this.actor.deleteEmbeddedDocuments("Item", existing.map(entry => entry.id));
                    }
                }
            }
            if (item?.type === "faction")
            {
                let createdItem = (await this.document.createEmbeddedDocuments("Item", [item]))[0];
                if (!createdItem) return;
                this.document.update(this.document.system.faction.set(createdItem));
                return;
            }
            if (item?.system?.partType === "critical" && item?.system?.critical?.type === "catastrophicDamage") {
                this.actor.toggleStatusEffect("dead", { overlay: true });
            }
        }
        return super._onDropItem(data, ev);
    }

    static async _onRemoveShipMember(ev, target) {
        ev.stopPropagation();
        const uuid = target.dataset.uuid;
        if (!uuid) {
            return;
        }
        const confirm = await foundry.applications.api.DialogV2.confirm({
            window: {title:`${game.i18n.localize("IMPMAL_RTIM.VoidCombat.RemoveCharacterConfirm")}`}
        });
        if (!confirm) {
            return;
        }
        const current = Array.from(this.actor.system.shipMembers || []);
        const next = current.filter(entry => entry !== uuid);
        await this.actor.update({ "system.shipMembers": next });
    }

    static async _onOpenShipMember(ev, target) {
        const uuid = target.dataset.uuid;
        if (!uuid) {
            return;
        }
        const actor = await fromUuid(uuid);
        actor?.sheet?.render(true);
    }

    static async _onAssignRoleMember(ev, target) {
        ev.preventDefault();

        let assignee = { uuid: "", name: "", img: "" };
        let roleItems = this.actor.items
            .filter(item => item.type === "impmal-rtim.voidshipPart")
            .filter(item => item.system?.partType === "role" && item.id !== target?.dataset?.id);

        let memberUuids = Array.from(this.actor.system.shipMembers || []);
        let members = await Promise.all(memberUuids.map(uuid => fromUuid(uuid)));

        if (!members.length)
        {
            return;
        }

        let items = (await ItemDialog.create(members, 1, {title : "Assign to Role", text: `Choose ship member`}));
        if (!items || items.length == 0)
        {
            return;
        }
        assignee.uuid = items[0].uuid;
        assignee.name = items[0].name;
        assignee.img = items[0].img;

        let roleItem = this.actor.items.get(target?.dataset?.id);
        roleItem.update({"system.role.assignee" : assignee});

        let updates = roleItems
            .filter(item => item.system?.role?.assignee?.uuid === assignee.uuid)
            .map(item => item.update({ "system.role.assignee": { uuid: "", name: "", img: "" } }));
        if (updates.length) {
            await Promise.all(updates);
        }
    }

    async _onAdvanceRoleCooldown(event) {
        event.preventDefault();
        const target = event.currentTarget;
        const isRightClick = event.type === "contextmenu" || event.button === 2;
        let value = isRightClick ? -1 : 1;
        const actionPath = target?.dataset?.actionPath;
        
        const roleItem = this.actor.items.get(target?.dataset?.id);
        if (!roleItem) {
            return;
        }
        
        const action = foundry.utils.getProperty(roleItem.system, actionPath) || {};
        const cooldownCount = Number(action.cooldownCount ?? 0);
        const updatePath = `system.${actionPath}.cooldownCount`;
        await roleItem.update({ [updatePath]: cooldownCount + value });
    }

    static async _onEditShipPart(ev, target) {
        ev.preventDefault();
        this.actor.items.get(target?.dataset?.id)?.sheet?.render(true, { editable: true });
    }

    static async _onRemoveShipPart(ev, target) {
        ev.preventDefault();
        let item = this.actor.items.get(target?.dataset?.id);
        if (!item) {
            return;
        }
        let confirm = await foundry.applications.api.DialogV2.confirm({
            window: {title:`${game.i18n.localize("IMPMAL_RTIM.VoidCombat.RemovePartConfirm")}`}
        });
        if (!confirm) {
            return;
        }
        await this.actor.deleteEmbeddedDocuments("Item", [item.id]);
    }

    static async _onRemoveHull(ev, target) {
        ev.preventDefault();
        const hulls = this.actor.items.filter(item =>
            item.type === "impmal-rtim.voidshipPart" &&
            item.system?.partType === "hull"
        );
        if (!hulls.length) {
            return;
        }
        const confirm = await foundry.applications.api.DialogV2.confirm({
            window: {title:`${game.i18n.localize("IMPMAL_RTIM.VoidCombat.RemoveHullConfirm")}`}
        });
        if (!confirm) {
            return;
        }
        await this.actor.deleteEmbeddedDocuments("Item", hulls.map(entry => entry.id));
        const updates = { "system.hull.uuid": "" };
        const updateTrack = (path, hasMax) => {
            const modifier = Number(foundry.utils.getProperty(this.actor.system, `${path}.modifier`) ?? 0);
            const manual = Number(foundry.utils.getProperty(this.actor.system, `${path}.modifierManual`) ?? 0);
            const total = modifier + manual;
            updates[`system.${path}.base`] = 0;
            if (hasMax) {
                updates[`system.${path}.max`] = total;
            }
            updates[`system.${path}.value`] = total;
        };
        updateTrack("hull", true);
        updateTrack("speedRating", false);
        updateTrack("detectionRating", false);
        updateTrack("size", false);
        updateTrack("supplemental", false);
        updateTrack("evasionRating", false);
        updateTrack("turretRating", false);
        const resetDirectional = (groupPath, keys, hasMax) => {
            keys.forEach((key) => {
                updateTrack(`${groupPath}.${key}`, hasMax);
            });
        };
        resetDirectional("shields", ["prow", "port", "starboard", "aft", "average"], true);
        resetDirectional("armour", ["prow", "port", "starboard", "aft", "average"], false);
        ["prow", "port", "starboard", "aft", "dorsal", "keel"].forEach((key) => {
            updates[`system.weaponSlots.${key}.base`] = 0;
            updates[`system.weaponSlots.${key}.assigned`] = [];
        });
        await this.actor.update(updates);
    }

    static async _onEditItemProperty(ev, target)
    {
        let document = (await this._getDocumentAsync(ev, target)) || this.document;
        let path = ev.target.dataset.path;
        let itemId = ev.target.dataset.id;
        if (document.id !== itemId) return;
        let value = ev.target.value;
        if (ev.target.type == "number" && value == "")
        {
            value = 0;
        }
        else if (ev.target.type == "number")
        {
            value = Number(ev.target.value);
        }
        if (ev.target.type == "checkbox")
        {
            value = ev.target.checked;
        }
        document.update({[path] : value});
    }

    static async _onWeaponCheckRange(ev, target) {
        ev.preventDefault();   

        if (this.blockRangeCheck) return; 

        let token = this.actor.token;
        if (!token) //we got the unlinked token otherwise
        {
            token = this.actor.getActiveTokens()[0];
            if (!token)
            {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
                return;
            }
        }

        let previousLayer = canvas.activeLayer;
        let weapon = this.actor.items.get(target?.dataset?.id);
        let arc = VoidshipTokenHandler.drawArcFromWeapon(token, weapon, target?.dataset?.half === "true")
        if (!arc) return;

        this.blockRangeCheck = true;

        setTimeout(() => {
            arc.layer.clearPreviewContainer();
            previousLayer.activate();
            this.blockRangeCheck = false;
        }, 2000);
    }

    static async _onMakeTest(ev, target) {
        ev.preventDefault();
        let type = target?.dataset?.type;
        if (!type) return;

        switch (type)
        {
            case "shooting":
                VoidshipSetupTests.setupShootingTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;

            case "dogFight":
                VoidshipSetupTests.setupSquadronDogfightTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;
            case "bomberRun":
                VoidshipSetupTests.setupSquadronBomberRunTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;
            case "assaultBoarding":
                VoidshipSetupTests.setupSquadronAssaultBoardingTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;
            case "reloadSquadrons":
                VoidshipSetupTests.setupReloadSquadronsTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;

            case "torpedoSalvo":
                VoidshipSetupTests.setupTorpedoSalvoTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;
            case "reloadTorpedoes":
                VoidshipSetupTests.setupReloadTorpedoesTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;
                
            case "nova":
                VoidshipSetupTests.setupNovaCannonTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;
            case "reloadNovaCannon":
                VoidshipSetupTests.setupReloadNovaCannonTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;
                
            case "boarding":
                VoidshipSetupTests.setupBoardingTest(this.actor, true);
                break;
            case "rally":
                VoidshipSetupTests.setupRallyTest(this.actor, true);
                break;
            case "reloadSpecial":
                VoidshipSetupTests.setupReloadSpecialTest(this.actor, true);
                break;
            case "repair":
                VoidshipSetupTests.setupRepairTest(this.actor, true);
                break;
            case "repairMinion":
                VoidshipSetupTests.setupRepairMinionTest(this.actor, true);
                break;
            case "restartShields":
                VoidshipSetupTests.setupRestartShieldsTest(this.actor, true);
                break;
            case "scan":
                VoidshipSetupTests.setupScanTest(this.actor, true);
                break;
            case "scanMinion":
                VoidshipSetupTests.setupScanMinionTest(this.actor, true);
                break;
            case "seek":
                VoidshipSetupTests.setupSeekTest(this.actor, true);
                break;

            case "evasiveManeuvers":
                VoidshipSetupTests.setupEvasiveManeuversTest(this.actor, true);
                break;
            case "ramming":
                VoidshipSetupTests.setupRammingManeuverTest(this.actor, true);
                break;
            case "silentRunning":
                VoidshipSetupTests.setupSilentRunningTest(this.actor, true);
                break;

            case "role":
                VoidshipSetupTests.setupShipRoleTest(this.actor, true, this.actor.items.get(target?.dataset?.id));
                break;

            case "skill":
                VoidshipSetupTests.setupShipSkillTest(this.actor, true, target.dataset?.skill, target.dataset?.specialisation);
                break;
        }
    }

    async _onAdjustPoints(event) {
        event.preventDefault();
        const target = event.currentTarget;
        const pointsType = target?.dataset?.points;
        const isRightClick = event.type === "contextmenu" || event.button === 2;
        const delta = isRightClick ? -1 : 1;
        let pointsPath = "";
        if (pointsType === "movement") {
            pointsPath = "movementPoints";
        } else if (pointsType === "action") {
            pointsPath = "actionPoints";
        }
        if (!pointsPath) {
            return;
        }
        const current = Number(foundry.utils.getProperty(this.actor.system, `${pointsPath}.value`) ?? 0);
        const max = Number(foundry.utils.getProperty(this.actor.system, `${pointsPath}.max`) ?? 0);
        const next = Math.min(Math.max(current + delta, 0), Math.max(max, 0));
        if (next === current) {
            return;
        }
        await this.actor.update({ [`system.${pointsPath}.value`]: next });
    }

    static async _onFixProperty(ev, target)
    {
        let property = target?.dataset?.property;

        let confirm = await foundry.applications.api.DialogV2.confirm({
            window: {title:`${game.i18n.localize("IMPMAL_RTIM.VoidCombat.AreYouSure")}`}
        });
        if (!confirm) {
            return;
        }

        if (property === "actionPoints")
        {
            this.actor.update({ [`system.actionPoints.value`]: this.actor.system.actionPoints.max });
        }
        if (property === "movementPoints")
        {
            this.actor.update({ [`system.movementPoints.value`]: this.actor.system.movementPoints.max });
            this.actor.update({ [`system.turnRating.current`]: 0 });
        }
        if (property === "hull")
        {
            this.actor.update({ [`system.hull.value`]: this.actor.system.hull.max });
        }
        if (property === "shields")
        {
            ["prow", "port", "starboard", "aft", "average"].forEach((key) => 
                this.actor.update({ [`system.shields.${key}.value`]: this.actor.system.shields[key].max }));
        }
        if (property === "blocks")
        {
            this.blockRangeCheck = false;
            this.blockMovementCheck = false;
        }
    }

    static async _onAddBonus(ev, target) {
        ev.preventDefault();
        const bonuses = Array.isArray(this.actor.system?.bonuses)
            ? [...this.actor.system.bonuses]
            : [];
        bonuses.push({
            SL: 0,
            modifier: 0,
            advantage: false,
            disadvantage: false,
            removeAfterTurns: -1,
            removeOnNextTest: false,
            removeOnStartTurn: false,
            removeOnEndTurn: false,
            removeOnNextEndTurn: false,
            type: [],
            comment: ""
        });
        await this.actor.update({ "system.bonuses": bonuses });
    }

    static async _onRemoveBonus(ev, target) {
        ev.preventDefault();
        const index = Number(target?.dataset?.index);
        if (!Number.isInteger(index) || index < 0) {
            return;
        }
        const bonuses = Array.isArray(this.actor.system?.bonuses)
            ? [...this.actor.system.bonuses]
            : [];
        if (index >= bonuses.length) {
            return;
        }
        bonuses.splice(index, 1);
        await this.actor.update({ "system.bonuses": bonuses });
    }

    static async _onAddBonusType(ev, target) {
        ev.preventDefault();       
        let bonusIndex = Number(target?.dataset?.bonusIndex);
        let type = target?.dataset?.type; 
        let bonuses = this.actor.system.bonuses;

        bonuses[bonusIndex][type].push("");

        await this.actor.update({ "system.bonuses": bonuses });
    }

    static async _onRemoveBonusType(ev, target) {
        ev.preventDefault();
        let bonusIndex = Number(target?.dataset?.bonusIndex);
        let typeIndex = Number(target?.dataset?.typeIndex);
        let type = target?.dataset?.type;

        let bonuses = this.actor.system.bonuses;
        bonuses[bonusIndex][type].splice(typeIndex, 1);

        await this.actor.update({ "system.bonuses": bonuses });
    }

    static async _onGoSilent(ev, target)
    {
        ev.preventDefault();

        if (!this.actor.hasCondition('silentRunning'))
            await this.actor.addCondition('silentRunning');
    }

    static async _onUseReload(ev, target)
    {
        ev.preventDefault();
        let weapon = this.actor.items.get(target?.dataset?.id);
        if (!weapon) return;        

        if (target?.dataset?.type)
        {
            if (target.dataset.type == "escortVoidship")
            {
                if (weapon.system.status === "destroyed")
                {
                    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponDestroyed"));
                    return;
                }

                if (weapon.system.weapon.landing.housing.fighters <= 0)
                {
                    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoSquadrons"));
                    return;
                }

                let targetToken = game?.user?.targets?.first();
                if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
                    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
                    return;
                }

                await targetToken.actor.addCondition('escortVoidship');
            }   
        }

        if (weapon.system.weapon.reloaded === false)
        {
            ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.WeaponNotReloaded"));
            return;
        }

        weapon.update({ [`system.weapon.reloaded`]: false });

    }

    static async _onToggleMovementPreview(ev, target) {
        ev.preventDefault();

        if (this.blockMovementCheck) return;

        let token = this.actor.token;
        if (!token) {
            token = this.actor.getActiveTokens()[0];
            if (!token) {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
                return;
            }
        }

        if (this.actor.system.movementPoints.value <= 0) {
            ui.notifications.warn("No movement points available.");
            return;
        }

        this.blockMovementCheck = true;

        VoidshipTokenHandler.toggleMovementPreview({ actor : this.actor, token });
        setTimeout(() => {
            VoidshipTokenHandler.toggleMovementPreview({ actor : this.actor, token })
            this.blockMovementCheck = false;
        }, 2000)
    }

    static async _onToggleMovementMove(ev, target) {
        ev.preventDefault();

        let token = this.actor.token;
        if (!token) {
            token = this.actor.getActiveTokens()[0];
            if (!token) {
                ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
                return;
            }
        }

        if (this.actor.system.movementPoints.value <= 0) {
            ui.notifications.warn("No movement points available.");
            return;
        }

        VoidshipTokenHandler.toggleClickMove({ actor: this.actor, token });
    }

    static async _onCreateSpecialisation(ev)
    {
        let skill = this._getKey(ev);
        
        let specialisations = await warhammer.utility.findAllItems("specialisation", "", true, ["system.skill"]);

        specialisations = specialisations.filter(i => i.system.skill == skill);
        let choice = [];
        if (specialisations.length)
        {
            choice = await ItemDialog.create(specialisations, 1, {text : game.i18n.localize("IMPMAL.ChooseSpecialisation")});
        }

        if (choice[0])
        {
            Item.implementation.create((await fromUuid(choice[0].uuid)).toObject(), {parent: this.actor});
        }

        else 
        {
            Item.implementation.create({
                type : "specialisation",
                name : game.i18n.format("IMPMAL.SkillSpecialisation", {skill : game.impmal.config.skills[skill]}), 
                system : {skill}, 
            }, {renderSheet:true, parent: this.actor});
        }
            
    }
    
    _addEventListeners()
    {
        super._addEventListeners();  

    }
}
