import React, { useEffect, useState } from "react";
import { Howl } from "howler";
import cursorImg from "../assets/cursor.png";
import clickSound from "../assets/zapsplat_multimedia_button_click_fast_short_003_79287.mp3";

interface Ripple {
    x: number;
    y: number;
    id: number;
}

interface RippleOffset {
    x: number;
    y: number;
}

interface CursorProps {
    /** Offset applied to ripple position relative to the cursor (in px) */
    rippleOffset?: RippleOffset;
}

const Cursor: React.FC<CursorProps> = ({ rippleOffset = { x: 0, y: 0 } }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        const click = new Howl({
            src: [clickSound],
            volume: 0.5,
        });

        const moveCursor = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleClick = (e: MouseEvent) => {
            click.play();
            // apply the optional ripple offset so the ripple can be positioned
            // relative to the cursor image (for example, in front of it)
            const newRipple: Ripple = {
                x: e.clientX + (rippleOffset?.x ?? 0),
                y: e.clientY + (rippleOffset?.y ?? 0),
                id: Date.now(),
            };
            setRipples((prev) => [...prev, newRipple]);

            setTimeout(() => {
                setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
            }, 300); // ripple duration
        };

        document.addEventListener("mousemove", moveCursor);
        document.addEventListener("click", handleClick);

        document.body.style.cursor = "none";

        return () => {
            document.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("click", handleClick);
            document.body.style.cursor = "auto";
        };
    }, []);

    return (
        <>
            <img
                src={cursorImg}
                alt="cursor"
                style={{
                    position: "fixed",
                    left: position.x,
                    top: position.y,
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 9999,
                    width: "32px",
                    height: "32px",
                }}
            />

            {ripples.map((r) => (
                <span
                    key={r.id}
                    style={{
                        position: "fixed",
                        left: r.x,
                        top: r.y,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.5)",
                        transform: "translate(-50%, -50%) scale(0)",
                        animation: "ripple 0.3s forwards",
                        pointerEvents: "none",
                        zIndex: 9998,
                    }}
                />
            ))}

            <style>
                {`
          @keyframes ripple {
            to {
              transform: translate(-50%, -50%) scale(4);
              opacity: 0;
            }
          }
        `}
            </style>
        </>
    );
};

export default Cursor;
