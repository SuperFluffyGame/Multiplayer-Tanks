import { socket } from "./game.js";

export function sendInitPacket(id: string) {
    socket.send(message("init", id));
}
export function sendNamePacket(name: string) {
    socket.send(message("name", name));
}
export function sendMovePacket(movement: { x: number; y: number }) {
    socket.send(message("move", movement));
}
export function sendFirePacket(fire: { x: number; y: number }) {
    socket.send(message("fire", fire));
}

let id = -1;
export function message(type: string, data: any) {
    id++;
    return JSON.stringify({ type, data, id });
}
