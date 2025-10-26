import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Howl } from 'howler';

interface ImagePopupProps {
    imageSrc: string;
    visible: boolean;          // control visibility from parent
    duration?: number;
    onClose?: () => void;       // callback when popup disappears
}

const ImagePopup: React.FC<ImagePopupProps> = ({ imageSrc, visible, duration = 3000, onClose }) => {
    // const [isVisible, setIsVisible] = useState(visible);
    const soundSrc = "/the-rock-sound-effect.mp3";
    const endSoundSrc = "/whoosh-sounds-effects-no-copyright_2vZLPrmm.mp3";

    // const startSound = useMemo(() => new Howl({
    //     src: [soundSrc],
    //     volume: 0.1,
    // }), []);
    // const endSound = useMemo(() => new Howl({
    //     src: [endSoundSrc],
    //     volume: 0.1,
    // }), []);

    useEffect(() => {

        if (visible) {
            new Howl({
                src: [soundSrc],
                volume: 0.1,
                autoplay: true
            });
        } else {
            new Howl({
                src: [endSoundSrc],
                volume: 0.1,
                autoplay: true
            });
        }
        // startSound.stop();
        // endSound.stop();

        // console.log(startSound.playing());

        // // let sound: Howl;
        // // startSound.off()

        // // if (visible) {
        // //     sound = startSound;
        // // } else {
        // //     sound = endSound;
        // // }

        // startSound.play();

        // return () => {
        //     startSound.stop();
        // }
    }, [visible]);

    // useEffect(() => {
    //     if (visible) {
    //         setIsVisible(true);

    //         console.log("SHOW POPUP");

    //         // Play appearance sound
            // const startSound = new Howl({
            //     src: [soundSrc],
            //     volume: 0.1,
            // });
            // startSound.play();

    //         // Auto-hide after duration
    //         const timer = setTimeout(() => {
    //             // const endSound = new Howl({
    //             //     src: [endSoundSrc],
    //             //     volume: 0.1,
    //             // });
    //             // endSound.play();

    //             setIsVisible(false);

    //             console.log("HIDE POPUP");

    //             onClose?.();
    //         }, duration);

    //         return () => clearTimeout(timer);
    //     }
    // }, [visible, duration, onClose]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key={imageSrc}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
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
