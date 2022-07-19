export interface UserData {
    users: User[];
}

export interface User {
    name: string;
    id: string;
    numConnections: number;
}

export interface GameData {
    tanks: Tank[];
    bullets: Bullet[];
}

export interface Tank {
    owner: string;
    pos: {
        x: number;
        y: number;
    };
    angle: number;
    hits: number;
}

export interface Bullet {
    sender: string;
    pos: {
        x: number;
        y: number;
    };
    angle: number;
}
