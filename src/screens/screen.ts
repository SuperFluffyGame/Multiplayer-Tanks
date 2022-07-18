export class Screen {
    public static currentScreen: Screen | null = null;

    private hideFunction: (elem: HTMLDivElement) => Promise<void> = () =>
        new Promise(r => r());
    private showFunction: (elem: HTMLDivElement) => Promise<void> = () =>
        new Promise(r => r());

    constructor(public element: HTMLDivElement) {
        element.classList.add("hidden");
    }

    onHide(f: (elem: HTMLDivElement) => Promise<void>) {
        this.hideFunction = f;
    }

    hide() {
        return this.hideFunction(this.element);
    }

    onShow(f: (elem: HTMLDivElement) => Promise<void>) {
        this.showFunction = f;
    }

    show() {
        return this.showFunction(this.element);
    }
}
