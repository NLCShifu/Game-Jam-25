import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupWindowProps {
    color: string;       // folder name (e.g. "Blue")
    width?: number;
    height?: number;
    show?: boolean;
    animated?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const PopupWindow: React.FC<PopupWindowProps> = ({
    color,
    width = 600,
    height = 400,
    show = true,
    animated = true,
    className,
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
                // style={{
                //     // width: "100%",
                //     // height: "100%",
                //     // position: "relative",
                //     display: "flex",
                //     flexDirection: "column",
                //     justifyContent: "center",
                //     alignItems: "center"
                // }}
                style={{
                    borderImage: `url('${backgroundSrc}') 20 fill / 12px`
                }}
                className={className}
            >
                {/* <img
                    src={backgroundSrc}
                    alt="Popup Window"
                    style={{ width, height, position: "absolute", top: 0, left: 0 }}
                />*/}
                {/* <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        padding: 20,
                        boxSizing: "border-box",
                        // display: "flex",
                        // flexDirection: "column",
                        // justifyContent: "center",
                        // alignItems: "center",
                    }}
                > */}
                    {children}
                {/* </div> */}
                {/* <img src={backgroundSrc} alt="Popup Window" style={{
                    width: "100%",
                    height: "10%",
                    maxHeight: "100%"
                }} /> */}
                {/* <img src={backgroundSrc} alt="" style={{
                    // height: "10%",
                    // position: "relative",
                    // top: 0,
                    // left: 0,
                    // bottom: 0
                }} /> */}
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
                    // style={{
                    //     // width,
                    //     // height,
                    //     // position: "relative",
                    //     // display: "inline-block",
                    // }}
                    style={{
                    borderImage: `url('${backgroundSrc}') 20 fill / 12px`
                }}
                className={className}
                >
                    {/* <img
                        src={backgroundSrc}
                        alt="Popup Window"
                        style={{ width, height, position: "absolute", top: 0, left: 0 }}
                    /> */}
                    {/* <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            padding: 20,
                            boxSizing: "border-box",
                            // display: "flex",
                            // flexDirection: "column",
                            // justifyContent: "center",
                            // alignItems: "center",
                        }}
                    > */}
                        {children}
                    {/* </div> */}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopupWindow;
