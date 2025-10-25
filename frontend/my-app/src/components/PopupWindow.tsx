import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupWindowProps {
    color: string;       // folder name (e.g. "Blue")
    width?: number;
    height?: number;
    show?: boolean;
    animated?: boolean;
    children?: React.ReactNode;
}

const PopupWindow: React.FC<PopupWindowProps> = ({
    color,
    width = 600,
    height = 400,
    show = true,
    animated = true,
    children,
}) => {
    const backgroundSrc = `/${color}/pop up window.png`;

    const variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
    };

    if (!animated) {
        return show ? (
            <div
                style={{
                    width,
                    height,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img
                    src={backgroundSrc}
                    alt="Popup Window"
                    style={{ width, height, position: "absolute", top: 0, left: 0 }}
                />
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        padding: 20,
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {children}
                </div>
            </div>
        ) : null;
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    style={{
                        width,
                        height,
                        position: "relative",
                        display: "inline-block",
                    }}
                >
                    <img
                        src={backgroundSrc}
                        alt="Popup Window"
                        style={{ width, height, position: "absolute", top: 0, left: 0 }}
                    />
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            padding: 20,
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopupWindow;
