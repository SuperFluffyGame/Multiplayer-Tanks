import { toastContainer } from "./elements.js";
import { Animation } from "./screens/animations.js";

export function toast(
    title: string,
    message: string,
    duration = 5000,
    className: string = "error"
) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.classList.add(className);
    const titleElement = document.createElement("h1");
    titleElement.innerText = title;
    const messageElement = document.createElement("p");
    messageElement.innerText = message;

    const divider = document.createElement("hr");

    toast.appendChild(titleElement);
    toast.appendChild(divider);
    toast.appendChild(messageElement);

    toastContainer.insertBefore(toast, toastContainer.firstChild);

    const creationAnim = toast.animate(
        createAnimation.keyframes,
        createAnimation.timing
    );

    creationAnim.addEventListener("finish", () => {
        setTimeout(() => {
            const removalAnim = toast.animate(
                removeAnimation.keyframes,
                removeAnimation.timing
            );
            removalAnim.addEventListener("finish", () => {
                toastContainer.removeChild(toast);
            });
        }, duration);
    });
}

const createAnimation = {
    keyframes: [
        { transform: "translateX(120%)" },
        { transform: "translateX(0)" },
    ],
    timing: {
        duration: 500,
        easing: "ease-in-out",
    },
};

const removeAnimation = {
    keyframes: [{ transform: "translateX(120%)" }],
    timing: {
        duration: 500,
        easing: "ease-in-out",
    },
};
