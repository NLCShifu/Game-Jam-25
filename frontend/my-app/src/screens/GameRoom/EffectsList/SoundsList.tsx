import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import "./SoundsList.css";

type Sound = {
    name: string;
    url: string;
};

type Props = {
    sounds: Sound[];
    onSoundClick?: (sound_name: string) => void; // main click handler
    cooldownDuration?: number; // in ms, default 10s
};

function SoundsList({ sounds, onSoundClick, cooldownDuration = 10000 }: Readonly<Props>) {
    const [cooldown, setCooldown] = useState(false);
    const [remaining, setRemaining] = useState(0);

    

    // on stocke les Howl préchargés dans une ref (pas dans le state)
    // ref.current sera: { [soundName]: Howl }
    const howlsRef = useRef<Record<string, Howl>>({});

    // construire (ou mettre à jour) les Howl quand `sounds` change
    useEffect(() => {
        const map: Record<string, Howl> = {};

        sounds.forEach((sound) => {
            map[sound.name] = new Howl({
                src: [sound.url],
                volume: 1.0,
                format: ["mp3"],
            });
        });

        // assignation dans la ref
        howlsRef.current = map;

        // cleanup pour libérer l'audio en mémoire si le composant unmount
        return () => {
            Object.values(map).forEach((h) => h.unload());
        };
    }, [sounds]);

    // jouer l'aperçu au hover
    const handleHoverStart = (sound: Sound) => {
        // couper tous les autres sons en cours
        Object.entries(howlsRef.current).forEach(([name, howl]) => {
            if (name !== sound.name) {
                howl.stop();
            }
        });

        const howl = howlsRef.current[sound.name];
        if (howl) {
            howl.stop(); // repart du début à chaque hover
            howl.play();
        }
    };

    // stopper l'aperçu quand on sort le curseur
    const handleHoverEnd = (sound: Sound) => {
        const howl = howlsRef.current[sound.name];
        if (howl) {
            howl.stop();
        }
    };

    // main click handler (Use) + cooldown
    const handleClick = (sound: Sound) => {
        if (cooldown) return;

        onSoundClick?.(sound.name);

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
        <div className="soundsListContainer">
            <div className="soundsList">
                {sounds.map((sound) => (
                    <motion.div
                        key={sound.name}
                        className="soundRow"
                        whileHover={{
                            scale: cooldown ? 1 : 1.02,
                            boxShadow: cooldown
                                ? "none"
                                : "0 0 8px rgba(255,255,255,0.3)",
                        }}
                        whileTap={!cooldown ? { scale: 0.95 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{
                            opacity: cooldown ? 0.5 : 1,
                            pointerEvents: cooldown ? "none" : "auto",
                        }}
                        onMouseEnter={() => handleHoverStart(sound)}
                        onMouseLeave={() => handleHoverEnd(sound)}
                    >
                        <span className="soundName">{sound.name}</span>

                        <button
                            className="useButton"
                            onClick={(e) => {
                                e.stopPropagation();
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
