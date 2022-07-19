import {
    mainMenuStartButton,
    gameScreenElement,
    gameBackButton,
} from "../elements.js";
import { Screen } from "./screen.js";
import * as Animations from "./animations.js";
import { mainMenuScreen } from "./mainMenuScreen.js";

export const gameScreen = new Screen(gameScreenElement);
gameScreen.onHide(elem => {
    let animation = elem.animate(
        Animations.fadeOut.keyframes,
        Animations.fadeOut.timing
    );
    return new Promise<void>(resolve => {
        animation.addEventListener("finish", () => {
            elem.classList.add("hidden");
            resolve();
        });
    });
});
gameScreen.onShow(async elem => {
    let animEnd = Screen.currentScreen?.hide();
    await animEnd;

    Screen.currentScreen = gameScreen;
    elem.classList.remove("hidden");
    elem.animate(Animations.fadeIn.keyframes, Animations.fadeIn.timing);

    const { setName } = await import("../game/game.js");
});

gameBackButton.addEventListener("click", () => {
    mainMenuScreen.show();
});
