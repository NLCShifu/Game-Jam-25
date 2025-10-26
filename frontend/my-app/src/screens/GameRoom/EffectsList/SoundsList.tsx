import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import "./SoundsList.css";

type Sound = {
    name: string;
    url: string;
};

type Props = {
    sounds: Sound[];
    onSoundClick?: (sound: Sound) => void; // main click handler
    cooldownDuration?: number; // in ms, default 10s
};

function SoundsList({ sounds, onSoundClick, cooldownDuration = 10000 }: Readonly<Props>) {
    const [cooldown, setCooldown] = useState(false);
    const [remaining, setRemaining] = useState(0);

    // main click handler (triggers cooldown)
    const handleClick = (sound: Sound) => {
        if (cooldown) return;

        onSoundClick?.(sound);

        setCooldown(true);
        setRemaining(cooldownDuration / 1000);

        const interval = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimeout(() => setCooldown(false), cooldownDuration);
    };

    // preview button (plays sound without cooldown)
    const handlePreview = (sound: Sound) => {
        const howl = new Howl({ src: [sound.url] });
        howl.play();
    };

    return (
        <div className="soundsListContainer">
            <div className="soundsList">
                {sounds.map((sound) => (
                    <motion.div
                        key={sound.name}
                        className="soundRow"
                        whileHover={{
                            scale: cooldown ? 1 : 1.02,
                            boxShadow: cooldown ? "none" : "0 0 8px rgba(255,255,255,0.3)",
                        }}
                        whileTap={!cooldown ? { scale: 0.95 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{
                            opacity: cooldown ? 0.5 : 1,
                            pointerEvents: cooldown ? "none" : "auto",
                        }}
                    >
                        <span className="soundName">{sound.name}</span>
                        <button
                            className="previewButton"
                            onClick={(e) => {
                                e.stopPropagation(); // prevent parent click
                                handlePreview(sound);
                            }}
                        >
                            Preview
                        </button>
                        <button
                            className="useButton"
                            onClick={(e) => {
                                e.stopPropagation(); // also stop propagation
                                handleClick(sound);
                            }}
                        >
                            Use
                        </button>
                    </motion.div>
                ))}
            </div>

            {cooldown && (
                <motion.div
                    className="cooldownOverlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="cooldownText">Cooldown... {remaining}s</div>
                </motion.div>
            )}
        </div>
    );
}

export default SoundsList;
