import {
    mainMenuScreenElement,
    mainMenuNameInput,
    mainMenuHelpButton,
    mainMenuStartButton,
} from "../elements.js";
import { Screen } from "./screen.js";
import * as Animations from "./animations.js";
import { gameScreen } from "./gameScreen.js";

mainMenuNameInput.addEventListener("input", updateName);

function updateName() {
    localStorage.name = mainMenuNameInput.value;
    if (mainMenuNameInput.value.length > 0) {
        mainMenuStartButton.disabled = false;
    } else {
        mainMenuStartButton.disabled = true;
    }
}

export const mainMenuScreen = new Screen(mainMenuScreenElement);
mainMenuScreen.onHide(elem => {
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
mainMenuScreen.onShow(async elem => {
    mainMenuNameInput.value = localStorage.name;
    updateName();

    let animEnd = Screen.currentScreen?.hide();
    await animEnd;
    Screen.currentScreen = mainMenuScreen;

    elem.classList.remove("hidden");
    elem.animate(Animations.fadeIn.keyframes, Animations.fadeIn.timing);

    return new Promise<void>(r => r());
});
mainMenuScreen.show();

mainMenuStartButton.addEventListener("click", () => {
    gameScreen.show();
});
