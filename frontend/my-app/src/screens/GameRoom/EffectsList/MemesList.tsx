import { useState, } from "react";
import { motion } from "framer-motion";
import "./MemeList.css";
type Meme = {
    name: string;
    url: string;
};

type PropTypes = {
    memes: Meme[];
    onMemeClick?: (meme_name: string) => void;
    cooldownDuration?: number; // optional custom cooldown in ms
};

function MemesList({ memes, onMemeClick, cooldownDuration = 5000 }: Readonly<PropTypes>) {
    const [cooldown, setCooldown] = useState(false);
    const [remaining, setRemaining] = useState(0);

    const handleClick = (meme: Meme) => {
        if (cooldown) return; // prevent spam
        onMemeClick?.(meme.name);
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

    return (
        <div className="memesListContainer">
            <div className="memesList">
                {memes.map((meme) => (
                    <motion.div
                        key={meme.name}
                        className="meme"
                        onClick={() => handleClick(meme)}
                        whileHover={{
                            scale: cooldown ? 1 : 1.05,
                            boxShadow: cooldown ? "none" : "0 0 10px rgba(255,255,255,0.3)",
                        }}
                        whileTap={!cooldown ? { scale: 0.9 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{
                            opacity: cooldown ? 0.5 : 1,
                            pointerEvents: cooldown ? "none" : "auto",
                        }}
                    >
                        <img src={meme.url} alt={meme.name} />
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
                    <div className="cooldownText">
                        Cooldown... {remaining}s
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default MemesList;
