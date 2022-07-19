import { GameData, Tank, Bullet } from "./serverData";
import { sendGameDataToAll } from "./ws-server";

export const gameData: GameData = { bullets: [], tanks: [] };

let tankPositionQueue: { id: string; x: number; y: number }[] = [];
export function tankPos(id: string, x: number, y: number) {
    tankPositionQueue.push({ id, x, y });
}

let tankCreateQueue: { id: string }[] = [];
export function tankCreate(id: string) {
    tankCreateQueue.push({ id });
}

function update() {
    let changed = false;

    while (tankCreateQueue.length > 0) {
        const { id } = tankCreateQueue.pop()!;

        gameData.tanks.push({
            owner: id,
            pos: { x: 0, y: 0 },
            angle: 0,
            hits: 0,
        });
    }

    while (tankPositionQueue.length > 0) {
        const { id, x, y } = tankPositionQueue.pop()!;
        const tank = gameData.tanks.find(t => t.owner === id);
        if (tank) {
            tank.pos.x = x;
            tank.pos.y = y;
            changed = true;
        }
    }

    if (changed) sendGameDataToAll();
}
setInterval(update, 1000 / 60);
