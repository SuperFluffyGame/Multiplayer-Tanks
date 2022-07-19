import { pressedKeys } from "./controls.js";
import { gameCanvas } from "../elements.js";
import { sendFirePacket, sendMovePacket } from "./packets.js";

let prevTime = 0;

export function update(time = 0) {
    requestAnimationFrame(update);

    const dt = time - prevTime;
    prevTime = time;

    const movement = { x: 0, y: 0 };

    if (pressedKeys.KeyA) {
        movement.x -= 1;
    }
    if (pressedKeys.KeyD) {
        movement.x += 1;
    }
    if (pressedKeys.KeyW) {
        movement.y -= 1;
    }
    if (pressedKeys.KeyS) {
        movement.y += 1;
    }

    let len = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
    let normalized = {
        x: ((movement.x / len) * dt) / 10,
        y: ((movement.y / len) * dt) / 10,
    };
    if (isNaN(normalized.x)) {
        normalized.x = 0;
    }
    if (isNaN(normalized.y)) {
        normalized.y = 0;
    }

    if (len > 0) {
        sendMovePacket(normalized);
    }
}

// FIRING
gameCanvas.addEventListener("click", e => {
    sendFirePacket({ x: e.offsetX, y: e.offsetY });
});
