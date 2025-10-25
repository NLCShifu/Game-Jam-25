// IconPanel.tsx
import React from "react";

// Props
interface IconPanelProps {
    color: string; // IconPanel folder
    width?: number; // optional width to scale
    height?: number; // optional height to scale
}

const IconPanel: React.FC<IconPanelProps> = ({
    color,
    width = 240, // default normal size
    height = 240,
}) => {
    const safeSrc = `/${color}/icon panel big.png`;

    return (
        <img src={safeSrc} alt="Icon Panel" style={{ width, height }} />
    );
};

export default IconPanel;
