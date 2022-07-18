import { render, setData } from "./render.js";
import { update } from "./update.js";
import { message } from "./ws_utils.js";

const url = new URL(window.location.href);
// const ws_url = (url.protocol = "ws");
url.protocol = "ws";
url.port = "3001";
export const socket = new WebSocket(url.href);

export let id: string;

export function init(name: string) {
    socket.addEventListener("open", async () => {
        id = localStorage.id;
        if (!id) {
            id = await (
                await fetch("https://www.uuidgenerator.net/api/version4")
            ).text();
        }
        localStorage.id = id;
        socket.send(message("init", id));
        socket.send(message("name", name));

        // RENDER
        render();
        // UPDATE
        update();
        console.log("connected");
    });

    socket.addEventListener("message", async msg => {
        let parsed: { type: string; data: any };
        try {
            parsed = JSON.parse(msg.data.toString());
        } catch (e) {
            console.error(e);
            return;
        }

        switch (parsed.type) {
            case "data": {
                setData(parsed.data);
                break;
            }
        }
    });
}
