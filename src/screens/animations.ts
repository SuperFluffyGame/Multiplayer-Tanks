export const fadeOut: Animation = {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    timing: {
        duration: 250,
    },
};

export const fadeIn: Animation = {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    timing: {
        duration: 250,
    },
};

export interface Animation {
    keyframes: Keyframe[];
    timing: KeyframeAnimationOptions;
}
