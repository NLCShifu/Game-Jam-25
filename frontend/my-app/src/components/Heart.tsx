import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Howl } from "howler";

type HeartProps = {
    color: string;
    initialFilled?: boolean;
    size?: number;
    unfillFinalSrc?: string; // optional different sound for last heart
};

export type HeartHandle = {
    unfill: (isFinal?: boolean) => boolean;
    fill: () => void;
    isFilled: () => boolean; // NEW
};

const Heart = forwardRef<HeartHandle, HeartProps>(
    ({ color, initialFilled = true, size = 180, unfillFinalSrc }, ref) => {
        const [filled, setFilled] = useState(initialFilled);

        const filledSrc = `/${color}/heart filled.png`;
        const unfilledSrc = `/${color}/heart empty.png`;

        // default unfill sound
        const unfillSound = new Howl({
            src: ["/pump-shotgun-fortnite-loud.mp3"],
            volume: 0.1,
        });

        // special last-heart sound (if provided)
        const unfillFinalSound = unfillFinalSrc
            ? new Howl({
                src: [unfillFinalSrc],
                volume: 0.1,
            })
            : null;

        const unfill = (isFinal = false) => {
            if (filled) {
                if (isFinal && unfillFinalSound) unfillFinalSound.play();
                else unfillSound.play();
                setFilled(false);
                return true;
            }
            return false;
        };

        const fill = () => {
            if (!filled) setFilled(true);
        };

        useImperativeHandle(ref, () => ({
            unfill,
            fill,
            isFilled: () => filled, // expose it
        }));

        return (
            <div
                style={{
                    width: size,
                    height: size,
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
    }
);

export default Heart;
