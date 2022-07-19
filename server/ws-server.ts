import * as ws from "ws";
import { UserData } from "./serverData";
import { tankCreate, tankPos, gameData } from "./game";
import { Data as ClientGameData } from "../src/game/gameData";

const server = new ws.Server({ port: 3001 });

const userData: UserData = { users: [] };

const sockets: {
    id: string;
    socket: ws.WebSocket;
}[] = [];

server.on("connection", socket => {
    socket.on("close", () => {
        const id = sockets.find(s => s.socket === socket)!.id;

        const user = userData.users.find(u => u.id === id)!;

        user.numConnections--;

        sockets.splice(
            sockets.findIndex(s => s.id === id),
            1
        );
    });

    socket.on("message", packet => {
        let parsedPacket: { type: string; data: any; id: number };
        try {
            parsedPacket = JSON.parse(packet.toString());
        } catch (e) {
            console.error(e);
            return;
        }

        const packet_id = parsedPacket.id;

        switch (parsedPacket.type) {
            case "init": {
                const id: string = parsedPacket.data;
                sockets.push({ id, socket });

                if (!userData.users.find(u => u.id === id)) {
                    userData.users.push({
                        id,
                        name: "",
                        numConnections: 0,
                    });

                    tankCreate(id);
                } else {
                    userData.users.find(u => u.id === id)!.numConnections++;
                }

                break;
            }
            case "name": {
                const name: string = parsedPacket.data;
                const id = sockets.find(s => s.socket === socket)!.id;
                userData.users.find(u => u.id === id)!.name = name;

                break;
            }

            case "position": {
                const id = sockets.find(s => s.socket === socket)!.id;
                tankPos(id, parsedPacket.data.x, parsedPacket.data.y);
            }
            default: {
                console.error("Unknown packet type: " + parsedPacket.type);
                return;
            }
        }
    });
});

function message(type: string, data: any) {
    return JSON.stringify({ type, data });
}

function sendGameData(socket: ws.WebSocket) {
    socket.send(message("data", gameData));
}

export function sendGameDataToAll() {
    sockets.forEach(s => {
        const dataToSend: ClientGameData = {
            tanks: [],
            bullets: [],
        };

        gameData.tanks.forEach(t => {
            dataToSend.tanks.push({
                name: userData.users.find(u => u.id === t.owner)!.name,
                pos: { x: t.pos.x, y: t.pos.y },
                angle: t.angle,
                hits: t.hits,
            });
        });

        gameData.bullets.forEach(b => {
            dataToSend.bullets.push({
                pos: { x: b.pos.x, y: b.pos.y },
                angle: b.angle,
            });
        });
    });
}
