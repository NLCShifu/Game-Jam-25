import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Howl } from "howler";

type HeartProps = {
    color: string; // folder for images
    initialFilled?: boolean;
};

export type HeartHandle = {
    unfill: () => void;
};

const Heart = forwardRef<HeartHandle, HeartProps>(({ color, initialFilled = true }, ref) => {
    const [filled, setFilled] = useState(initialFilled);

    const filledSrc = `/${color}/heart filled.png`; // filled heart
    const unfilledSrc = `/${color}/heart empty.png`; // unfilled heart

    // sound effect
    const unfillSound = new Howl({
        src: ["/sounds/unfill.mp3"], // adjust path to your sound
        volume: 0.5,
    });

    const unfill = () => {
        if (filled) {
            unfillSound.play();
            setFilled(false);
        }
    };

    // expose the unfill function to parent
    useImperativeHandle(ref, () => ({
        unfill,
    }));

    return (
        <div
            style={{
                width: 64,
                height: 64,
                display: "inline-block",
                filter: filled ? "drop-shadow(0 0 10px rgba(255,0,0,0.8))" : "none",
            }}
        >
            <img
                src={filled ? filledSrc : unfilledSrc}
                alt="heart"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
});

export default Heart;
