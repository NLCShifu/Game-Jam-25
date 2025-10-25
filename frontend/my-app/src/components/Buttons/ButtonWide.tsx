import React, { useState } from "react";
import { motion } from "framer-motion";

// Map button states to images
type ButtonState = "idle" | "hover" | "pressed";

// Props
interface ButtonWideProps {
    text: string;
    color: string; // color folder name
    onClick?: () => void;
    size?: number; // new prop: scaling factor (1 = default size)
    colorText?: string;
}

// Component
const ButtonWide: React.FC<ButtonWideProps> = ({ text, color, onClick, size = 1, colorText = "white" }) => {
    const [state, setState] = useState<ButtonState>("idle");

    // default dimensions
    const baseWidth = 320;
    const baseHeight = 120;

    // apply scaling
    const width = baseWidth * size;
    const height = baseHeight * size;
    const fontSize = 60 * size;

    // dynamically build image paths
    const imageSources: Record<ButtonState, string> = {
        idle: `/${color}/button wide idle.png`,
        hover: `/${color}/button wide hover.png`,
        pressed: `/${color}/button wide clicked.png`,
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
                width,
                height,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <img
                src={safeSrc}
                alt="Animated Button"
                style={{
                    width,
                    height,
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            />
            <span
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: colorText,
                    fontSize,
                    fontWeight: "bold",
                    pointerEvents: "none",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </span>
        </motion.div>
    );
};

export default ButtonWide;
