import { id } from "./game.js";
import { Data, Tank } from "./gameData.js";
import { gameCanvas as canvas, gameLB as leaderboard } from "../elements.js";

const context = canvas.getContext("2d")!;

let renderData: Data = {
    TANKS: [],
    BULLETS: [],
};

export function render() {
    setLeaderBoardData(renderData.TANKS);

    requestAnimationFrame(render.bind(globalThis, renderData));
    context.fillStyle = "#888";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // DRAW TANKS
    context.fillStyle = "#0f0";
    context.font = "12px Arial";
    for (let tank of renderData.TANKS) {
        if (tank.id !== id) {
            context.fillStyle = "#f00";
        } else {
            context.fillStyle = "#0f0";
        }
        if (tank.status === "Offline") {
            context.fillStyle = "#bbb";
        }

        const x = Math.floor(tank.pos.x);
        const y = Math.floor(tank.pos.y);

        let color = "#f00";
        if (tank.id === id) {
            color = "#0f0";
        }
        if (tank.status === "Offline") {
            color = "#bbb";
        }

        drawTank(x, y, tank.angle, color);

        // DRAW NAME
        context.textAlign = "center";
        context.fillStyle = "#fff";
        context.fillText(tank.name, x + 12, y - 4);

        // DRAW HITS
        context.fillStyle = "#fff";
        context.fillText(tank.hits.toString(), x + 12, y + 12);
    }

    // DRAW BULLETS
    context.fillStyle = "#f00";
    for (let bullet of renderData.BULLETS) {
        drawBullet(bullet.pos.x, bullet.pos.y, bullet.angle);
    }
}

export function setData(data: Data) {
    renderData = data;
}

function drawTank(x: number, y: number, angle: number, color: string = "#fff") {
    context.save();

    context.translate(x, y);
    context.translate(12.5, 12.5);
    context.rotate(angle);
    context.translate(-12.5, -12.5);

    context.fillStyle = color;
    context.fillRect(0, 0, 25, 25);

    context.fillStyle = "#000";
    context.fillRect(10, -10, 5, 15);

    context.restore();
}

function drawBullet(x: number, y: number, angle: number) {
    context.save();

    context.translate(x, y);
    context.rotate(angle);
    context.translate(-2.5, 0);

    context.fillStyle = "#f00";
    context.fillRect(0, 0, 5, 10);

    context.restore();
}

function setLeaderBoardData(tanks: Tank[]) {
    tanks = tanks.sort((a, b) => b.hits - a.hits);
    for (let i = 0; i < tanks.length; i++) {
        const tank = tanks[i];

        let row = leaderboard.rows[i + 1];
        if (!row) {
            row = leaderboard.insertRow(i + 1);
        }

        let nameCell = row.cells[0];
        if (!nameCell) {
            nameCell = row.insertCell(0);
        }
        nameCell.innerText = tank.name;

        let hitsCell = row.cells[1];
        if (!hitsCell) {
            hitsCell = row.insertCell(1);
        }
        hitsCell.innerText = tank.hits.toString();
    }
}
