import { pressedKeys } from "./controls.js";
import { message } from "./ws_utils.js";
import { gameCanvas } from "./elements.js";
import { socket } from "./game.js";

let prevTime = 0;

export function update(time = 0, socket: WebSocket) {
    requestAnimationFrame(t => update(t, socket));

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
        socket.send(message("move", normalized));
    }
}

// FIRING
gameCanvas.addEventListener("click", e => {
    socket.send(message("fire", { x: e.clientX, y: e.clientY }));
});
