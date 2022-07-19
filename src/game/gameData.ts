export interface Data {
    tanks: Tank[];
    bullets: Bullet[];
}

export interface Tank {
    name: string;
    pos: {
        x: number;
        y: number;
    };
    angle: number;
    hits: number;
}

export interface Bullet {
    pos: {
        x: number;
        y: number;
    };
    angle: number;
}
