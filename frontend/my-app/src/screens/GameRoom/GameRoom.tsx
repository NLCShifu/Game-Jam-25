import { useRef, useState, useEffect } from "react";

import "./GameRoom.css";

import LivesDisplay from "./LivesDisplay";
import EffectsList from "./EffectsList/EffectsList";
import PopupWindow from "../../components/PopupWindow";
import Hearts, { type HeartsHandle } from "../../components/Hearts";
import ImagePopup from "../../components/ImagePopup";
import Ribbon from "../../components/Ribbon";
import ButtonSquare from "../../components/Buttons/ButtonSquare";
import { useNavigate } from "react-router";
import Confetti from "../../components/Confetti";

function GameRoom() {
    const navigate = useNavigate();
    const ownLivesRef = useRef<HeartsHandle>(null);
    const otherLivesRef = useRef<HeartsHandle>(null);

    const [popupVisible, setPopupVisible] = useState(false);
    const imgSrc = "/image.png";

    // Game end popup state
    const [gameEnded, setGameEnded] = useState(false);
    const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

    // Example: simulate API sending game-end info
    useEffect(() => {
        // This would be replaced by your actual API listener
        const timer = setTimeout(() => {
            const apiResult: "won" | "lost" = Math.random() > 0.5 ? "won" : "lost";
            setGameEnded(true);
            setGameResult(apiResult);
        }, 5000); // simulate game ending after 5s

        return () => clearTimeout(timer);
    }, []);

    const handlePlayAgain = () => {
        // Reset the game or call API to start again go back to waiting room
        setGameEnded(false);
        setGameResult(null);
    };

    const handleGoHome = () => {
        // Navigate home
        navigate("/");
    };

    return (
        <>
            {gameEnded && gameResult && (
                <>
                    {/* Dark overlay */}
                    <div className="overlay" />

                    <Confetti />
                    <PopupWindow color="basic blue" className="gameEndPopup" animated={true}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Ribbon
                                scale={0.52}
                                text={gameResult === "won" ? "You Won!" : "You Lost!"}
                                color="basic red"
                            />
                        </div>
                        <div style={{ marginTop: "60px", textAlign: "center", display: "flex", gap: "100px", justifyContent: "center" }}>
                            <ButtonSquare color="basic green" iconName="icons restart.png" onClick={handlePlayAgain} size={60} />
                            <ButtonSquare color="basic green" iconName="icons home.png" onClick={handleGoHome} size={60} />
                        </div>
                    </PopupWindow>
                </>
            )}

            <div className="layoutGap gameRoom gradientBackground">
                <ImagePopup
                    imageSrc={imgSrc}
                    visible={popupVisible}
                    duration={3000}
                    soundSrc="/whoosh-sounds-effects-no-copyright_2vZLPrmm.mp3"
                    onClose={() => setPopupVisible(false)}
                />

                {/* Left half */}
                <div className="layoutGap half left">
                    <PopupWindow color="basic pink" animated={false} className="container otherCameraContainer">
                        <div className="placeholder">other camera</div>
                    </PopupWindow>
                    <div className="container livesContainer">
                        <div className="livesDisplay otherLives">
                            <Hearts color="basic red" ref={otherLivesRef} size={80} />
                            <span>Their lives</span>
                        </div>
                        <div className="livesDisplay ownLives">
                            <span>Your lives</span>
                            <Hearts color="basic red" ref={ownLivesRef} size={80} />
                        </div>
                    </div>
                </div>

                {/* Right half */}
                <div className="layoutGap half right">
                    <div className="effectsContainer">
                        <EffectsList />
                    </div>
                    <PopupWindow color="basic pink" animated={false} className="container ownCameraContainer">
                        <div className="placeholder">your camera</div>
                    </PopupWindow>
                </div>

                {/* Game End Popup */}

            </div>
        </>
    );
}

export default GameRoom;
