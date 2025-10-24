// ButtonWide.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";

// Import images
import idleImage from "../../assets/Buttons/wide_idle.png";
import hoverImage from "../../assets/Buttons/wide_hover.png";
import clickImage from "../../assets/Buttons/wide_click.png";

// Map button states to images
type ButtonState = "idle" | "hover" | "pressed";
const imageSources: Record<ButtonState, string> = {
    idle: idleImage,
    hover: hoverImage,
    pressed: clickImage,
};

// Props
interface ButtonWideProps {
    onClick?: () => void;
}

const ButtonWide: React.FC<ButtonWideProps> = ({ onClick }) => {
    const [currentImageSrc, setCurrentImageSrc] = useState<string>(imageSources.idle);

    // Framer Motion animations
    const buttonAnimations = {
        whileHover: { scale: 1.05, transition: { duration: 0.15 } },
        whileTap: { scale: 0.95, transition: { duration: 0.05 } },
    };

    // Event handlers
    const handleHoverStart = () => setCurrentImageSrc(imageSources.hover);
    const handleHoverEnd = () => setCurrentImageSrc(imageSources.idle);
    const handleTapStart = () => setCurrentImageSrc(imageSources.pressed);
    const handleTapEnd = () => setCurrentImageSrc(imageSources.hover);

    // Fallback image if import fails
    const safeSrc = currentImageSrc || "";

    return (
        <button
            onClick={onClick}
            style={{
                border: "none",
                padding: 0,
                background: "none",
                cursor: "pointer",
            }}
        >
            <motion.img
                src={safeSrc}
                alt="Animated Button"
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onTapStart={handleTapStart}
                onTap={handleTapEnd}
                {...buttonAnimations}
                initial={{ scale: 1.0 }}
                style={{
                    width: "300px", // ensures visible size
                    height: "auto",
                }}
                onError={(e) => {
                    console.warn("Button image failed to load:", e);
                }}
            />
        </button>
    );
};

export default ButtonWide;
