import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Howl } from 'howler';

interface ImagePopupProps {
    imageSrc: string;
    visible: boolean;          // control visibility from parent
    duration?: number;
    onClose?: () => void;       // callback when popup disappears
    soundSrc?: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ imageSrc, visible, duration = 3000, onClose, soundSrc }) => {
    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        if (visible) {
            setIsVisible(true);

            // Play sound if provided
            if (soundSrc) {
                const sound = new Howl({
                    src: [soundSrc],
                    volume: 0.1
                });
                sound.play();
            }

            // Auto-hide after duration
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Play sound if provided
                if (soundSrc) {
                    const sound = new Howl({
                        src: [soundSrc],
                        volume: 0.1
                    });
                    sound.play();
                    onClose?.();
                }
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible, duration, onClose, soundSrc]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key={imageSrc}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{


                    }}
                >
                    <img
                        src={imageSrc}
                        alt="popup"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50%',
                            zIndex: 9999,
                            pointerEvents: 'none',

                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImagePopup;
