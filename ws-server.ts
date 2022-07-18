import * as ws from "ws";
import { Tank, Data, Bullet, getTankFromId } from "./src/data";

const server = new ws.Server({ port: 3001 });

const data: Data = { BULLETS: [], TANKS: [] };

const sockets: {
    id: string;
    socket: ws.WebSocket;
}[] = [];

server.on("connection", socket => {
    console.log("connection");

    socket.on("close", () => {
        const index = sockets.findIndex(s => s.socket === socket);
        if (index !== -1) {
            const tank = getTankFromId(data, sockets[index].id);
            if (tank) {
                tank.status = "Offline";
            }
            sockets.splice(index, 1);
            sendDataAll();
        }
    });

    socket.on("message", msg => {
        let parsed: { type: string; data: any; id: number };
        try {
            parsed = JSON.parse(msg.toString());
        } catch (e) {
            console.error(e);
            return;
        }

        const msg_id = parsed.id;

        switch (parsed.type) {
            case "init": {
                const id = parsed.data;
                sockets.push({
                    id,
                    socket,
                });

                let tank = getTankFromId(data, parsed.data);
                if (tank) {
                    tank.status = "Online";
                } else {
                    tank = {
                        id,
                        name: id,
                        pos: {
                            x: 0,
                            y: 0,
                        },
                        angle: 0,
                        hits: 0,
                        status: "Online",
                    };
                    data.TANKS.push(tank);
                }

                sendDataAll();
                break;
            }
            case "move": {
                const id = sockets.find(s => s.socket === socket)?.id;
                if (!id) break;
                const tank = getTankFromId(data, id);
                if (!tank) break;
                let { x, y } = parsed.data;

                // not valid move
                if (tank.pos.x + x >= 800 - 25 || tank.pos.x + x <= 0) {
                    x = 0;
                }
                if (tank.pos.y + y >= 400 - 25 || tank.pos.y + y <= 0) {
                    y = 0;
                }

                tank.pos.x += x;
                tank.pos.y += y;
                tank.angle = Math.atan2(y, x) + Math.PI / 2;

                sendDataAll();
                break;
            }
            case "fire": {
                const id = sockets.find(s => s.socket === socket)?.id;
                if (!id) break;
                const tank = getTankFromId(data, id);
                if (!tank) break;

                const bullet: Bullet = {
                    sender: id,
                    pos: {
                        x:
                            tank.pos.x +
                            Math.cos(tank.angle + Math.PI / 2) * -25 +
                            25 / 2,
                        y:
                            tank.pos.y +
                            Math.sin(tank.angle + Math.PI / 2) * -25 +
                            25 / 2,
                    },
                    angle: tank.angle,
                };

                data.BULLETS.push(bullet);

                sendDataAll();

                break;
            }
            case "name": {
                const id = sockets.find(s => s.socket === socket)?.id;
                if (!id) break;
                const tank = getTankFromId(data, id);
                if (!tank) break;
                tank.name = parsed.data;
                sendDataAll();
                break;
            }
        }
    });
});

function message(type: string, data: any) {
    return JSON.stringify({ type, data });
}

function sendData(socket: ws.WebSocket) {
    socket.send(message("data", data));
}

function sendDataAll() {
    sockets.forEach(s => sendData(s.socket));
}

function update() {
    let changed = false;

    for (const bullet of data.BULLETS) {
        changed = true;
        bullet.pos.x -= Math.cos(bullet.angle + Math.PI / 2) * 5;
        bullet.pos.y -= Math.sin(bullet.angle + Math.PI / 2) * 5;

        for (const tank of data.TANKS) {
            if (
                bullet.pos.x >= tank.pos.x &&
                bullet.pos.x <= tank.pos.x + 25 &&
                bullet.pos.y >= tank.pos.y &&
                bullet.pos.y <= tank.pos.y + 25
            ) {
                const sending_tank = getTankFromId(data, bullet.sender);
                if (!sending_tank) continue;
                if (tank.status === "Offline") continue;
                sending_tank.hits++;
                data.BULLETS.splice(data.BULLETS.indexOf(bullet), 1);
                sendDataAll();
                break;
            }
        }

        // BULLET OUT OF BOUNDS
        if (
            bullet.pos.x < 0 ||
            bullet.pos.x > 800 ||
            bullet.pos.y < 0 ||
            bullet.pos.y > 400
        ) {
            data.BULLETS.splice(data.BULLETS.indexOf(bullet), 1);
        }
    }
    if (changed) sendDataAll();
}
setInterval(update, 1000 / 60);
