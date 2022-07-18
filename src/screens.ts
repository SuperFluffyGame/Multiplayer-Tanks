import {
    gameBackButton,
    gameScreen,
    mainMenuHelpButton,
    mainMenuNameInput,
    mainMenuScreen,
    mainMenuStartButton,
} from "./elements.js";
import { fadeIn, fadeOut } from "./animations.js";

gotoMainMenuScreen();

mainMenuStartButton.addEventListener("click", gotoGameScreen);
gameBackButton.addEventListener("click", () => {
    gotoMainMenuScreen();
});

function gotoMainMenuScreen() {
    const gameScreenFadeOutAnimation = gameScreen.animate(
        fadeOut.keyframes,
        fadeOut.timing
    );

    gameScreenFadeOutAnimation.addEventListener("finish", async () => {
        gameScreen.classList.add("hidden");
        mainMenuScreen.classList.remove("hidden");

        const mainMenuFadeInAnimation = mainMenuScreen.animate(
            fadeIn.keyframes,
            fadeIn.timing
        );
        mainMenuFadeInAnimation.addEventListener("finish", () => {});

        mainMenuStartButton.disabled = false;
        mainMenuHelpButton.disabled = false;

        mainMenuNameInput.value = localStorage.name ?? "";
    });
}

function gotoGameScreen() {
    mainMenuStartButton.disabled = true;
    mainMenuHelpButton.disabled = true;

    const mainMenuFadeOutAnimation = mainMenuScreen.animate(
        fadeOut.keyframes,
        fadeOut.timing
    );

    mainMenuFadeOutAnimation.addEventListener("finish", async () => {
        mainMenuScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");

        const gameScreenFadeInAnimation = gameScreen.animate(
            fadeIn.keyframes,
            fadeIn.timing
        );

        localStorage.name = mainMenuNameInput.value;

        const { init } = await import("./game.js");
        init(mainMenuNameInput.value);
        mainMenuNameInput.value = "";
    });
}
