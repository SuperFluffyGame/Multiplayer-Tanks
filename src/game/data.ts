export interface Data {
    TANKS: Tank[];
    BULLETS: Bullet[];
}

export interface Tank {
    id: string;
    name: string;
    pos: {
        x: number;
        y: number;
    };
    angle: number;
    hits: number;
    status: "Online" | "Offline";
}

export interface Bullet {
    sender: string;
    pos: {
        x: number;
        y: number;
    };
    angle: number;
}

export function getTankFromId(data: Data, id: string) {
    return data.TANKS.find(t => t.id === id);
}
