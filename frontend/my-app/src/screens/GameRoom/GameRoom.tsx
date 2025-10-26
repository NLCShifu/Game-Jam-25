import { useRef, useState, useEffect } from "react";

import "./GameRoom.css";
import axios from "axios";
import EffectsList from "./EffectsList/EffectsList";
import PopupWindow from "../../components/PopupWindow";
import Hearts, { type HeartsHandle } from "../../components/Hearts";
import ImagePopup from "../../components/ImagePopup";
import Ribbon from "../../components/Ribbon";
import ButtonSquare from "../../components/Buttons/ButtonSquare";
import { useNavigate, useParams } from "react-router";
import Confetti from "../../components/Confetti";
import { useMeta } from "../../contexts/MetaContext";

function GameRoom() {
    const baseUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const ownLivesRef = useRef<HeartsHandle>(null);
    const otherLivesRef = useRef<HeartsHandle>(null);

    let { room_id, session_id } = useParams();

    const { roomState, memeState, resetMeme, soundState, resetSound } = useMeta();

    const [popupVisible, setPopupVisible] = useState(false);
    const imgSrc = "/image.png";

    // Game end popup state
    const [gameEnded, setGameEnded] = useState(false);
    const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

    const [images, setImages] = useState<string[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [memes, setMemes] = useState<{ name: string; url: string }[]>([]);


    const handleFetchImages = async () => {
        try {
            const response = await axios.get<string[]>(baseUrl + '/images');
            const imgs = response.data;
            console.log("Fetched images:", imgs);
            setImages(imgs);
            const memePromises = imgs.map(async (image_name) => {
                const imgResponse = await axios.get(`${baseUrl}/images/${image_name}`, {
                    responseType: "blob",
                });
                return { name: image_name, url: URL.createObjectURL(imgResponse.data) };
            });
            const memeResults = await Promise.all(memePromises);
            setMemes(memeResults);

        } catch (error) {
            console.error("Error fetching the images", error);
            setFetchError("could not load images from backend");
        }
    };

    // Example: simulate API sending game-end info
    useEffect(() => {
        handleFetchImages();
        // This would be replaced by your actual API listener
        // const timer = setTimeout(() => {
        //     const apiResult: "won" | "lost" = Math.random() > 0.5 ? "won" : "lost";
        //     setGameEnded(true);
        //     setGameResult(apiResult);
        // }, 5000); // simulate game ending after 5s

        // return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (memeState == null) return;

        // Show popup of the meme

        resetMeme();
    }, [memeState]);

    useEffect(() => {
        if (soundState == null) return;
        
        // Play sound effect

        resetSound();
    }, [soundState]);

    const handlePlayAgain = () => {
        // Reset the game or call API to start again go back to waiting room
        setGameEnded(false);
        setGameResult(null);
    };

    const handleGoHome = () => {
        // Navigate home
        navigate("/");
    };

    const sounds = [
        { name: "Whoosh", url: "/whoosh-sounds-effects-no-copyright_2vZLPrmm.mp3" }
    ];

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
                        <EffectsList memes={memes} sounds={sounds} />
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
