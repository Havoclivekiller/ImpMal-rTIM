export class VoidshipTokenHandler
{    
    static PREVIEW_LAYER_PREFIX = "voidship-movement-preview";
    static PREVIEW_COLOR_STOPS = [
        "#1f6f3b",
        "#2f8f4f",
        "#43b96a",
        "#6add8f",
        "#97f0b7",
        "#c4f8dd"
    ];
    static ROTATION_OFFSET_DEG = 90;
    static _directionCache = new Map();
    static _moveMode = null;
    static _clickHandler = null;
    static _keyHandler = null;

    static normalizeDegrees(deg) {
        if (foundry?.utils?.normalizeDegrees) {
            return foundry.utils.normalizeDegrees(deg);
        }
        let value = deg % 360;
        if (value < 0) value += 360;
        return value;
    }

    static smallestAngleDiff(a, b) {
        const diff = Math.abs(a - b) % 360;
        return diff > 180 ? 360 - diff : diff;
    }

    static toDegrees(rad) {
        return (rad * 180) / Math.PI;
    }

    static getOffsetKey(offset) {
        return `${offset.i},${offset.j}`;
    }

    static getHexDirections(offset) {
        const key = this.getOffsetKey(offset);
        const cached = this._directionCache.get(key);
        if (cached) {
            return cached;
        }
        const center = canvas.grid.getCenterPoint(canvas.grid.getTopLeftPoint(offset));
        const adjacentOffsets = canvas.grid.getAdjacentOffsets(offset);
        const planarOffsets = adjacentOffsets.filter((adjacent) => adjacent?.k == null || adjacent.k === 0);
        const offsetsToUse = planarOffsets.length ? planarOffsets : adjacentOffsets;
        const directions = offsetsToUse.map((adjacent) => {
            const adjCenter = canvas.grid.getCenterPoint(canvas.grid.getTopLeftPoint(adjacent));
            const angle = this.normalizeDegrees(
                this.toDegrees(Math.atan2(adjCenter.y - center.y, adjCenter.x - center.x))
            );
            return { offset: adjacent, angle };
        });
        directions.sort((a, b) => a.angle - b.angle);
        this._directionCache.set(key, directions);
        return directions;
    }

    static getFacingIndex(token, offset) {
        const rotation = this.normalizeDegrees(
            (token.document?.rotation ?? token.rotation ?? 0) + this.ROTATION_OFFSET_DEG
        );
        const directions = this.getHexDirections(offset);
        let bestIndex = 0;
        let bestDiff = Number.POSITIVE_INFINITY;
        directions.forEach((dir, index) => {
            const diff = this.smallestAngleDiff(rotation, dir.angle);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestIndex = index;
            }
        });
        return { facing: bestIndex, directions };
    }

    static getDirectionByAngle(offset, targetAngle) {
        const directions = this.getHexDirections(offset);
        let best = null;
        let bestDiff = Number.POSITIVE_INFINITY;
        directions.forEach((dir) => {
            const diff = this.smallestAngleDiff(targetAngle, dir.angle);
            if (diff < bestDiff) {
                bestDiff = diff;
                best = dir;
            }
        });
        return best;
    }

    static isHexGrid() {
        const type = canvas.grid?.type;
        return (
            type === CONST.GRID_TYPES.HEXODDR ||
            type === CONST.GRID_TYPES.HEXEVENR ||
            type === CONST.GRID_TYPES.HEXODDQ ||
            type === CONST.GRID_TYPES.HEXEVENQ
        );
    }

    static getHighlightLayer(layerName) {
        return (
            canvas.interface.grid.getHighlightLayer(layerName) ??
            canvas.interface.grid.addHighlightLayer(layerName)
        );
    }

    static clearHighlightLayer(layerName) {
        if (canvas?.interface?.grid?.destroyHighlightLayer) {
            canvas.interface.grid.destroyHighlightLayer(layerName);
            return;
        }
        if (canvas?.interface?.grid?.clearHighlightLayer) {
            canvas.interface.grid.clearHighlightLayer(layerName);
        }
    }

    static getPreviewLayerName(token) {
        return `${this.PREVIEW_LAYER_PREFIX}.${token.document?.id ?? token.id}`;
    }

    static getPreviewData(token) {
        return token?._voidshipMovementPreview;
    }

    static setPreviewData(token, data) {
        token._voidshipMovementPreview = data;
    }

    static clearPreviewData(token) {
        if (token?._voidshipMovementPreview) {
            delete token._voidshipMovementPreview;
        }
    }

    static getColorForLeg(legIndex) {
        const cappedIndex = Math.min(Math.max(legIndex, 0), this.PREVIEW_COLOR_STOPS.length - 1);
        return this.PREVIEW_COLOR_STOPS[cappedIndex];
    }

    static drawCell(layer, shape, { x, y }, style) {
        if (!layer.highlight(x, y)) return;
        const color = Number(Color.fromString(style.color));
        const lineColor = Number(Color.fromString(style.lineColor));
        layer.beginFill(color, style.alpha);
        layer.lineStyle(style.lineWidth, lineColor, style.lineAlpha);
        layer
            .drawShape(
                new PIXI.Polygon(
                    shape.map((point) => ({
                        x: point.x + x,
                        y: point.y + y
                    }))
                )
            )
            .endFill();
    }

    static computeMovementPreview({ actor, token }) {
        const originOffset = token.document?._positionToGridOffset() ?? token._positionToGridOffset();
        const { facing: startFacing } = this.getFacingIndex(token, originOffset);
        const remainingStart = Math.max(0, Math.floor(actor.system.movementPoints.value));
        const costPerHex = 1;
        const maxTurn = Math.max(1, Number(actor.system.turnRating.value ?? 1));
        const startStepsSinceTurn = Math.min(
            Math.max(0, Number(actor.system.turnRating.current ?? 0)),
            maxTurn
        );

        const reachable = new Map();
        const visited = new Map();
        const stateByKey = new Map();
        const prevByKey = new Map();
        const queue = [];
        const getStateKey = (state) =>
            `${state.offset.i},${state.offset.j},${state.facing},${state.stepsSinceTurn}`;

        const enqueue = (state) => {
            const key = getStateKey(state);
            const prevRemaining = visited.get(key);
            if (prevRemaining != null && prevRemaining >= state.remaining) {
                return;
            }
            visited.set(key, state.remaining);
            state.key = key;
            stateByKey.set(key, state);
            prevByKey.set(key, state.prevKey ?? null);
            queue.push(state);
        };

        enqueue({
            offset: originOffset,
            facing: startFacing,
            stepsSinceTurn: startStepsSinceTurn,
            remaining: remainingStart,
            movesMade: 0,
            prevKey: null
        });

        while (queue.length > 0) {
            const state = queue.shift();
            const { offset, facing, stepsSinceTurn, remaining, movesMade } = state;
            if (movesMade > 0) {
                const cellKey = this.getOffsetKey(offset);
                const prev = reachable.get(cellKey);
                if (!prev || movesMade < prev.movesMade) {
                    reachable.set(cellKey, { offset, movesMade, stateKey: state.key });
                }
            }

            if (remaining < costPerHex) {
                continue;
            }

            const canTurn = stepsSinceTurn >= maxTurn;
            const directionList = this.getHexDirections(offset);
            const forward = directionList[facing];
            if (forward) {
                enqueue({
                    offset: forward.offset,
                    facing,
                    stepsSinceTurn: stepsSinceTurn + 1,
                    remaining: remaining - costPerHex,
                    movesMade: movesMade + 1,
                    prevKey: state.key
                });
            }

            if (canTurn && remaining > 0) {
                const left = (facing + directionList.length - 1) % directionList.length;
                const right = (facing + 1) % directionList.length;
                enqueue({
                    offset,
                    facing: left,
                    stepsSinceTurn: 0,
                    remaining,
                    movesMade,
                    prevKey: state.key
                });
                enqueue({
                    offset,
                    facing: right,
                    stepsSinceTurn: 0,
                    remaining,
                    movesMade,
                    prevKey: state.key
                });
            }
        }

        return {
            reachable: Array.from(reachable.values()),
            maxTurn,
            stateByKey,
            prevByKey
        };
    }

    static drawMovementPreview(token, preview) {
        const layerName = this.getPreviewLayerName(token);
        const layer = this.getHighlightLayer(layerName);
        layer.clear();

        const gridShape = canvas.grid.getShape();
        gridShape.forEach((point) => {
            point.x = point.x * 0.88 + canvas.grid.sizeX / 2;
            point.y = point.y * 0.88 + canvas.grid.sizeY / 2;
        });

        preview.reachable.forEach(({ offset, movesMade }) => {
            const legIndex = preview.maxTurn > 0 ? Math.floor((movesMade - 1) / preview.maxTurn) : 0;
            const color = this.getColorForLeg(legIndex);
            const { x, y } = canvas.grid.getTopLeftPoint(offset);
            this.drawCell(layer, gridShape, { x, y }, {
                color,
                lineColor: color,
                alpha: 0.22,
                lineAlpha: 0.45,
                lineWidth: 2
            });
        });

        this.setPreviewData(token, { layerName });
    }

    static bindCanvasClick() {
        if (!canvas?.stage || this._clickHandler) {
            return;
        }
        this._clickHandler = (event) => {
            if (!this._moveMode) {
                return;
            }
            if (event.button !== 0) {
                this.clearMoveMode();
                return;
            }
            const { actorId, tokenId } = this._moveMode;
            const token = canvas.tokens?.get(tokenId);
            const actor = actorId ? game.actors?.get(actorId) : token?.actor;
            if (!token || !actor) {
                this.clearMoveMode();
                return;
            }
            this.handleMoveClick({ actor, token, event });
        };
        canvas.stage.on("pointerdown", this._clickHandler);

        if (!this._keyHandler) {
            this._keyHandler = (event) => {
                if (event.key === "Escape") {
                    this.clearMoveMode();
                }
            };
            window.addEventListener("keydown", this._keyHandler);
        }
    }

    static unbindCanvasClick() {
        if (!canvas?.stage || !this._clickHandler) {
            return;
        }
        canvas.stage.off("pointerdown", this._clickHandler);
        this._clickHandler = null;
        if (this._keyHandler) {
            window.removeEventListener("keydown", this._keyHandler);
            this._keyHandler = null;
        }
    }

    static clearMoveMode() {
        if (!this._moveMode) return;
        const token = canvas.tokens?.get(this._moveMode.tokenId);
        if (token) {
            this.clearMovementPreview(token);
        }
        this._moveMode = null;
    }

    static toggleClickMove({ actor, token }) {
        if (!token) {
            return;
        }
        if (this._moveMode?.tokenId === (token.document?.id ?? token.id)) {
            this.clearMoveMode();
            return;
        }
        if (!canvas?.grid) {
            ui.notifications.warn("No canvas grid available.");
            return;
        }
        if (!this.isHexGrid()) {
            ui.notifications.warn("Voidship preview requires a hex grid.");
            return;
        }
        if (actor.system.movementPoints.value <= 0) {
            ui.notifications.warn("No movement points available.");
            return;
        }

        const preview = this.computeMovementPreview({ actor, token });
        if (!preview.reachable.length) {
            ui.notifications.warn("No reachable hexes.");
            return;
        }

        const reachableByKey = new Map();
        const reachableStateByOffset = new Map();
        preview.reachable.forEach(({ offset, movesMade }) => {
            reachableByKey.set(this.getOffsetKey(offset), { offset, movesMade });
        });
        preview.reachable.forEach(({ offset, stateKey }) => {
            reachableStateByOffset.set(this.getOffsetKey(offset), stateKey);
        });
        
        this.clearMoveMode();
        this.drawMovementPreview(token, preview);
        this._moveMode = {
            actorId: actor.id,
            tokenId: token.document?.id ?? token.id,
            reachableByKey,
            reachableStateByOffset,
            stateByKey: preview.stateByKey,
            prevByKey: preview.prevByKey
        };
    }

    static buildOffsetPath(stateKey, previewState) {
        const offsets = [];
        let key = stateKey;
        let last = null;
        while (key) {
            const state = previewState.stateByKey.get(key);
            if (!state) {
                break;
            }
            const offset = state.offset;
            if (!last || offset.i !== last.i || offset.j !== last.j) {
                offsets.push(offset);
                last = offset;
            }
            key = previewState.prevByKey.get(key);
        }
        offsets.reverse();
        return offsets;
    }

    static async handleMoveClick({ actor, token, event }) {
        const local = event?.data?.getLocalPosition?.(canvas.stage);
        if (!local) {
            return;
        }
        const elevation = token.document?.elevation ?? token.elevation ?? 0;
        const { width, height, shape } = token.document;
        const pivot = token.document.getCenterPoint({ x: 0, y: 0, elevation, width, height, shape });
        const desired = { x: local.x - pivot.x, y: local.y - pivot.y, elevation, width, height, shape };
        const snapped = token.document.getSnappedPosition(desired);
        const offset = token.document._positionToGridOffset(snapped);
        if (!offset) {
            return;
        }

        const key = this.getOffsetKey(offset);
        const reachable = this._moveMode?.reachableByKey?.get(key);
        if (!reachable) {
            this.clearMoveMode();
            return;
        }
        if (reachable.movesMade > actor.system.movementPoints.value) {
            this.clearMoveMode();
            return;
        }

        const stateKey = this._moveMode?.reachableStateByOffset?.get(key);
        const endState = stateKey ? this._moveMode?.stateByKey?.get(stateKey) : null;
        const offsets = stateKey ? this.buildOffsetPath(stateKey, this._moveMode) : [reachable.offset];
        if (!offsets.length) {
            this.clearMoveMode();
            return;
        }
        const waypoints = offsets.slice(1).map((step) => {
            const { x, y } = canvas.grid.getTopLeftPoint(step);
            return {
                x,
                y,
                elevation,
                action: "freeMove"
            };
        });
        const destination = offsets.at(-1);
        const topLeft = canvas.grid.getTopLeftPoint(destination);
        const doc = token.document ?? token;
        const moveWaypoints = waypoints.length
            ? waypoints
            : [{
                x: topLeft.x,
                y: topLeft.y,
                elevation,
            }];
        if (actor.system?.autoCalc?.movementSound !== "")
        {
            AudioHelper.play({src: actor.system?.autoCalc?.movementSound, 
                volume: 1, autoplay: true, loop: false}, true);        
        }

        const moved = await doc.move(moveWaypoints, {
            autoRotate: true,
        });
        if (moved && endState) {
            const maxTurn = Math.max(1, Number(actor.system.turnRating.value ?? 1));
            const nextCurrent = Math.min(Math.max(0, Number(endState.stepsSinceTurn ?? 0)), maxTurn);
            await actor.update({ "system.turnRating.current": nextCurrent });
        }
        this.clearMoveMode();
    }

    static clearMovementPreview(token) {
        const data = this.getPreviewData(token);
        if (!data) {
            return;
        }
        this.clearHighlightLayer(data.layerName);
        this.clearPreviewData(token);
    }

    static toggleMovementPreview({ actor, token }) {
        if (!token) {
            return;
        }
        if (this.getPreviewData(token)) {
            this.clearMovementPreview(token);
            return;
        }
        if (!canvas?.grid) {
            ui.notifications.warn("No canvas grid available.");
            return;
        }
        if (!this.isHexGrid()) {
            ui.notifications.warn("Voidship preview requires a hex grid.");
            return;
        }

        const preview = this.computeMovementPreview({ actor, token });
        if (!preview.reachable.length) {
            ui.notifications.warn("No reachable hexes.");
            return;
        }
        this.drawMovementPreview(token, preview);
    }

    static drawArc(direction, angle, color, x, y, distance)
    {    
      let options = {}
      const templateShape = "cone";
      if ( !templateShape ) return null;

      // Prepare template data
      const templateData = foundry.utils.mergeObject({
        t: templateShape,
        user: game.user.id,
        distance: distance,
        direction: direction,
        x: x,
        y: y,
      angle: angle,
        fillColor: color,
        flags: {  }
      }, options);


      const cls = CONFIG.MeasuredTemplate.documentClass;
        const template = new cls(foundry.utils.deepClone(templateData), { parent: canvas.scene });
        const object = new AttackPreview(template);
        return object;    
    }
    
    static drawArcFromWeapon(token, weapon, useHalf) 
    {
        let location = weapon.system.weapon.location;
        if (!location){
            ui.notifications.warn("Location missing!");
            return;
        }

        let wideArc = weapon.system.weapon.wideArc;
        let distance = weapon.system.weapon.range;
        if (useHalf) distance = Math.floor(distance/2);
        let cone = game.impmal.config.RTIM.voidship.shipLocations[location].arc;
        if (wideArc && cone == 30) cone = 60;
        let color = game.impmal.config.RTIM.voidship.shipLocations[location].arcColor;
        let angle = game.impmal.config.RTIM.voidship.shipLocations[location].angle;
        let x = token.getCenterPoint().x;
        let y = token.getCenterPoint().y;
        let tokenAngle = token.rotation;
        if (!tokenAngle)
        {
            tokenAngle = token.document?.rotation ?? 0;
        }
        angle = tokenAngle - 270 + angle;
        
        let arc = this.drawArc(angle, cone, color, x, y, distance);
        arc.drawArcPreview();
        return arc;

    }
   
    static getTargetDistance(token, target)
    {        
        if (!target) return;

        let targetDoc = target.document ?? target;
        let tokenDoc = token.document ?? token;
        let targetElevation = targetDoc.elevation ?? 0;
        let tokenElevation = tokenDoc.elevation ?? 0;

        return Math.round(Math.hypot(canvas.grid.measurePath([tokenDoc, targetDoc]).distance, Math.abs(tokenElevation - targetElevation)));
    }        

    static getTokenOffset(token)
    {
        if (!token) return null;
        if (token.document?._positionToGridOffset) return token.document._positionToGridOffset();
        if (token._positionToGridOffset) return token._positionToGridOffset();
        return null;
    }

    static offsetToCube(offset)
    {
        if (!offset) return null;
        let row = offset.i;
        let col = offset.j;
        switch (canvas.grid?.type) {
            case CONST.GRID_TYPES.HEXODDR: {
                let x = col - (row - (row & 1)) / 2;
                let z = row;
                return { x, y: -x - z, z };
            }
            case CONST.GRID_TYPES.HEXEVENR: {
                let x = col - (row + (row & 1)) / 2;
                let z = row;
                return { x, y: -x - z, z };
            }
            case CONST.GRID_TYPES.HEXODDQ: {
                let x = col;
                let z = row - (col - (col & 1)) / 2;
                return { x, y: -x - z, z };
            }
            case CONST.GRID_TYPES.HEXEVENQ: {
                let x = col;
                let z = row - (col + (col & 1)) / 2;
                return { x, y: -x - z, z };
            }
            default:
        return null;
        }
    }

    static getSideMoveOffsets(token, side, end, distance) {
        if (!token) return null;
        const startOffset = this.getTokenOffset(token);
        if (!startOffset) return null;
        const steps = Math.max(1, Math.floor(distance));

        const facingData = this.getFacingIndex(token, startOffset);
        const facingAngle = facingData.directions[facingData.facing]?.angle ?? 0;
        const sideAngle = this.normalizeDegrees(
            facingAngle + (side === "left" ? -90 : 90)
        );

        const directions = this.getHexDirections(startOffset);
        let idx = directions.findIndex((dir) => dir.angle >= sideAngle);
        if (idx === -1) idx = 0;
        const dirA = directions[idx];
        const dirB = directions[(idx - 1 + directions.length) % directions.length];
        if (!dirA || !dirB) return null;

        const simulate = (firstAngle, secondAngle) => {
            const offsets = [];
            let current = startOffset;
            for (let i = 0; i < steps; i += 1) {
                const target = (i % 2 === 0) ? firstAngle : secondAngle;
                const dir = this.getDirectionByAngle(current, target);
                if (!dir) break;
                current = dir.offset;
                offsets.push(current);
            }
            return offsets;
        };

        const pathA = simulate(dirA.angle, dirB.angle);
        const pathB = simulate(dirB.angle, dirA.angle);
        if (!pathA.length) return null;
        if (!pathB.length) return pathA;
        if (steps % 2 === 0) return pathA;

        const endA = canvas.grid.getTopLeftPoint(pathA[pathA.length - 1]);
        const endB = canvas.grid.getTopLeftPoint(pathB[pathB.length - 1]);
        const wantUp = end === "up";
        if (wantUp) {
            return endA.y <= endB.y ? pathA : pathB;
        }
        return endA.y >= endB.y ? pathA : pathB;
    }

    static async moveTokenSide(token, side, end, distance, autoRotate = false) {
        if (!token) return null;
        const offsets = this.getSideMoveOffsets(token, side, end, distance);
        if (!offsets?.length) return null;

        const elevation = token.document?.elevation ?? token.elevation ?? 0;
        const waypoints = offsets.map((offset) => {
            const { x, y } = canvas.grid.getTopLeftPoint(offset);
            return { x, y, elevation, action: "freeMove" };
        });
        const doc = token.document ?? token;
        await doc.move(waypoints, { autoRotate, freeMove: true, showRuler: false });
        const lastOffset = offsets[offsets.length - 1];
        const topLeft = canvas.grid.getTopLeftPoint(lastOffset);
        return { x: topLeft.x, y: topLeft.y, elevation };    
    }

    static isTargetInHexLine(token, target)
    {
        if (!target) return { inLine: false, steps: 0 };
        if (!canvas.grid?.type || canvas.grid.type === CONST.GRID_TYPES.GRIDLESS) {
            return { inLine: false, steps: 0 };
        }

        if (!this.getTokenOffset(token) || !this.getTokenOffset(target)) {
            return { inLine: false, steps: 0 };
        }

        let originCube = this.offsetToCube(this.getTokenOffset(token));
        let goalCube = this.offsetToCube(this.getTokenOffset(target));
        if (!originCube || !goalCube) {
            return { inLine: false, steps: 0 };
        }
        let dx = goalCube.x - originCube.x;
        let dy = goalCube.y - originCube.y;
        let dz = goalCube.z - originCube.z;
        if (dx === 0 && dy === 0 && dz === 0) {
            return { inLine: false, steps: 0 };
        }
        let aligned = dx === 0 || dy === 0 || dz === 0;
        if (!aligned) return { inLine: false, steps: 0 };
        let steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
        return { inLine: steps > 0, steps };
    }

    static getTargetHitSide(token, target)
    {
        if (!target) return null;

        let start = token.document?.getCenterPoint() ?? token.getCenterPoint();
        let end = target.document?.getCenterPoint() ?? target.getCenterPoint();
        if (!start || !end)
        {
            return null;
        }

        let angleToTarget = Math.atan2(end.y - start.y, end.x - start.x);
        let baseOffset = game.canvas?.scene?.grid?.columns ? 90 : 0;
        let rotation = Number(target.document?.rotation ?? target.rotation ?? 0) + 180;
        let facingAngle = (rotation + baseOffset) * (Math.PI / 180);
        let twoPi = Math.PI * 2;
        let sectorSize = Math.PI / 3;
        let normalized = ((angleToTarget - facingAngle) % twoPi + twoPi) % twoPi;
        let sector = Math.floor((normalized + (sectorSize / 2)) / sectorSize) % 6;
        let boundary = (normalized + (sectorSize / 2)) % sectorSize;
        let epsilon = 2 * (Math.PI / 180);
        let sides = ["fore", "starboard", "starboard", "aft", "port", "port"];
        return {
            side: sides[sector],
            ambiguous: boundary <= epsilon || boundary >= (sectorSize - epsilon),
            sector
        };
    }

    static getNearestHexToTarget(originToken, targetToken) 
    {
        let originX = originToken.document?.x ?? originToken.x;
        let originY = originToken.document?.y ?? originToken.y;
        let adj = canvas.grid.getAdjacentOffsets(this.getTokenOffset(targetToken))
            .filter(o => o.k == null || o.k === 0);

        let best = null;
        let bestDist = Infinity;

        for (let o of adj) {
            let topLeft = canvas.grid.getTopLeftPoint(o);
            let dist = Math.hypot(topLeft.x - originX, topLeft.y - originY);
            if (dist < bestDist) { bestDist = dist; best = topLeft; }
        }

        return best;
    }

    static normalizeDegrees(deg)
    {
        if (foundry?.utils?.normalizeDegrees) return foundry.utils.normalizeDegrees(deg);
        let value = deg % 360;
        if (value < 0) value += 360;
        return value;
    }

    static smallestAngleDiff(a, b)
    {
        const diff = Math.abs(a - b) % 360;
        return diff > 180 ? 360 - diff : diff;
    }

    static toDegrees(rad)
    {
        return (rad * 180) / Math.PI;
    }

    static getHexDirections(offset)
    {
        const center = canvas.grid.getCenterPoint(canvas.grid.getTopLeftPoint(offset));
        const adjacentOffsets = canvas.grid.getAdjacentOffsets(offset);
        const planarOffsets = adjacentOffsets.filter((adjacent) => adjacent?.k == null || adjacent.k === 0);
        const offsetsToUse = planarOffsets.length ? planarOffsets : adjacentOffsets;
        const directions = offsetsToUse.map((adjacent) => {
            const adjCenter = canvas.grid.getCenterPoint(canvas.grid.getTopLeftPoint(adjacent));
            const angle = this.normalizeDegrees(
                this.toDegrees(Math.atan2(adjCenter.y - center.y, adjCenter.x - center.x))
            );
            return { offset: adjacent, angle };
        });
        directions.sort((a, b) => a.angle - b.angle);
        return directions;
    }

    static getMoveToByFacing(token, steps, rotationOffset = 90)
    {
        if (!token) return null;
        let currentOffset = this.getTokenOffset(token);
        if (!currentOffset) return null;

        const rotation = this.normalizeDegrees(
            (token.document?.rotation ?? token.rotation ?? 0) + rotationOffset
        );
        let remaining = Math.max(0, Math.floor(steps));
        while (remaining > 0) {
            const directions = this.getHexDirections(currentOffset);
            let best = null;
            let bestDiff = Number.POSITIVE_INFINITY;
            for (const dir of directions) {
                const diff = this.smallestAngleDiff(rotation, dir.angle);
                if (diff < bestDiff) {
                    bestDiff = diff;
                    best = dir;
                }
            }
            if (!best) break;
            currentOffset = best.offset;
            remaining -= 1;
        }

        const topLeft = canvas.grid.getTopLeftPoint(currentOffset);
        return {
            x: topLeft.x,
            y: topLeft.y,
            elevation: token.document?.elevation ?? token.elevation ?? 0
        };
    }

    static async moveTokenFoward(token, steps, autoRotate=true, blink=false)
    {
        if (!token) return null;
        const pos = this.getMoveToByFacing(token, steps);
        if (pos) {
            let doc = token.document ?? token;
            await doc.move([ { 
                x : pos.x, 
                y : pos.y, 
                action : blink ? "blink" : "freeMove" 
            } ], 
            {
                autoRotate : autoRotate,
                freeMove : true
            });
        }
    }
 
    static async rotateToken(token, rotation=60) //60 for one side hex, to the right
    {
        if (!token) return null;
        let doc = token.document ?? token;
        if (game.user?.isGM || doc.isOwner) {
            let update = doc.rotation + rotation;
            await doc.update({rotation : update});
            return;
        }
        game.socket?.emit("module.impmal-rtim", {
            type: "voidshipRotateToken",
            sceneId: doc.parent?.id ?? canvas?.scene?.id,
            tokenId: doc.id,
            rotation
        });
    }
}

class AttackPreview extends foundry.canvas.placeables.MeasuredTemplate 
{
    drawArcPreview() {
      this.draw();
      this.layer.activate();
      this.layer.preview.addChild(this);  
    }
}
