export let id = -1;

export function message(type: string, data: any) {
    id++;
    return JSON.stringify({ type, data, id });
}
