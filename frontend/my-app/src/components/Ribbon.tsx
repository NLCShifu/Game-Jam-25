// Ribbon.tsx
import React from "react";

// Props
interface RibbonProps {
    text: string;
    color: string; // ribbon folder
    scale?: number; // overall scale factor (1 = normal, 0.5 = half size, 2 = double size)
}

const Ribbon: React.FC<RibbonProps> = ({
    text,
    color,
    scale = 1, // default normal size
}) => {
    const safeSrc = `/${color}/ribbon.png`;

    // Original design size of the ribbon (used for text positioning)
    const originalWidth = 760;
    const originalHeight = 150;

    // Fixed center position of text relative to original ribbon
    const textX = 375;
    const textY = 62;

    return (
        <div
            style={{
                display: "inline-block",
                transform: `scale(${scale})`,
                transformOrigin: "center center", // scale from the center
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: originalWidth,
                    height: originalHeight,
                }}
            >
                {/* Ribbon Image */}
                <img
                    src={safeSrc}
                    alt="Ribbon"
                    style={{
                        width: originalWidth,
                        height: originalHeight,
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />

                {/* Text centered at (textX, textY) */}
                <span
                    style={{
                        position: "absolute",
                        left: textX,
                        top: textY,
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: Math.min(originalHeight / 3, 50),
                        pointerEvents: "none",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                    }}
                >
                    {text}
                </span>
            </div>
        </div>
    );
};

export default Ribbon;
