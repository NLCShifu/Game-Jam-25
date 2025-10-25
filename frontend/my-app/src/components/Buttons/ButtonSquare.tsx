// ButtonSquare.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

// Map button states to images
type ButtonState = "idle" | "hover" | "pressed";

// Props
interface ButtonSquareProps {
    iconName: string;   // new prop for icon file name, e.g., "play.png"
    color: string;      // button color folder
    size?: number;      // optional size
    onClick?: () => void;
}

// inside component
const ButtonSquare: React.FC<ButtonSquareProps> = ({ iconName, color, size = 90, onClick }) => {
    const [state, setState] = useState<ButtonState>("idle");

    // dynamically build image paths for button background
    const imageSources: Record<ButtonState, string> = {
        idle: `/${color}/button square idle.png`,
        hover: `/${color}/button square hover.png`,
        pressed: `/${color}/button square clicked.png`,
    };

    const safeSrc = imageSources[state] || imageSources.idle;

    // Event handlers
    const handleHoverStart = () => setState("hover");
    const handleHoverEnd = () => setState("idle");
    const handleTapStart = () => setState("pressed");
    const handleTapEnd = () => setState("hover");

    return (
        <motion.div
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            onMouseDown={handleTapStart}
            onMouseUp={handleTapEnd}
            onClick={onClick}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                width: `${size}px`,
                height: `${size}px`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Button background */}
            <img
                src={safeSrc}
                alt="Animated Button"
                style={{
                    width: "100%",
                    height: "100%",
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            />

            {/* Icon */}
            <img
                src={`/${color}/${iconName}`} // dynamic icon path
                alt="Button Icon"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",      // icon size relative to button
                    pointerEvents: "none",
                }}
            />
        </motion.div>
    );
};

export default ButtonSquare;
