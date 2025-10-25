import React, { useRef, forwardRef, useImperativeHandle } from "react";
import Heart, { type HeartHandle } from "./Heart";

type HeartsProps = {
    color: string;
    lives?: number;
    size?: number;
    direction?: "ltr" | "rtl";
    finalSound?: string; // sound when the last heart is emptied
};

export type HeartsHandle = {
    loseLife: () => void;
    reset: () => void;
};

const Hearts = forwardRef<HeartsHandle, HeartsProps>(
    ({ color, lives = 3, size = 64, direction = "ltr", finalSound }, ref) => {
        const heartRefs = useRef<Array<HeartHandle | null>>(Array(lives).fill(null));

        const loseLife = () => {
            const heartsInOrder =
                direction === "ltr" ? heartRefs.current : [...heartRefs.current].reverse();

            // Count how many hearts are still filled
            const filledCount = heartsInOrder.filter((heart) => heart?.isFilled()).length;

            // The next one to unfill is the last one if only one remains filled
            const isFinal = filledCount === 1;

            for (const heart of heartsInOrder) {
                if (heart) {
                    const success = heart.unfill(isFinal);
                    if (success) break;
                }
            }
        };

        const reset = () => {
            heartRefs.current.forEach((heart) => heart?.fill());
        };

        useImperativeHandle(ref, () => ({
            loseLife,
            reset,
        }));

        return (
            <div style={{ display: "flex", gap: 8 }}>
                {Array.from({ length: lives }).map((_, i) => (
                    <Heart
                        key={i}
                        ref={(el) => {
                            heartRefs.current[i] = el;
                        }}
                        color={color}
                        initialFilled={true}
                        size={size}
                        unfillFinalSrc={finalSound}
                    />
                ))}
            </div>
        );
    }
);

export default Hearts;
