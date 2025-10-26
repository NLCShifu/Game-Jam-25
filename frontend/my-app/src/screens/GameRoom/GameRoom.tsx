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
import OtherCameraDisplay from "../../components/Webcam/OtherCameraDisplay";
import WebcamDisplay from "../../components/Webcam/WebcamDisplay";
import { useVideo } from "../../contexts/VideoContext";
import { useAudio } from "../../contexts/AudioContext";

function GameRoom() {
    const baseUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const ownLivesRef = useRef<HeartsHandle>(null);
    const otherLivesRef = useRef<HeartsHandle>(null);

    let { room_id, session_id } = useParams();

    const { sendVideoFrame } = useVideo();
    const { sendAudioFrame } = useAudio();
    const { roomState, memeState, resetMeme, soundState, resetSound } = useMeta();

    const [popupVisible, setPopupVisible] = useState(false);
    const imgSrc = "/image.png";

    // Game end popup state
    const [gameEnded, setGameEnded] = useState(false);
    const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

    const [fetchError, setFetchError] = useState<string | null>(null);
    const [memes, setMemes] = useState<{ name: string; url: string }[]>([]);
    const [sounds, setSounds] = useState<{ name: string; url: string }[]>([]);

    const handleFetchEffects = async () => {
        // Memes
        try {
            const response = await axios.get<string[]>('http://' + baseUrl + ':8000/images');
            const imgs = response.data;
            console.log("Fetched images:", imgs);
            const memePromises = imgs.map(async (image_name) => {
                const imgResponse = await axios.get(`http://${baseUrl}:8000/images/${image_name}`, {
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

        // Sounds
        try {
            const response = await axios.get<string[]>('http://' + baseUrl + ':8000/sounds');
            const sounds = response.data;
            console.log("Fetched sounds:", sounds);
            const soundPromises = sounds.map(async (sound_name) => {
                const soundResponse = await axios.get(`http://${baseUrl}:8000/sounds/${sound_name}`, {
                    responseType: "blob",
                });
                return { name: sound_name, url: URL.createObjectURL(soundResponse.data) };
            });
            const soundResults = await Promise.all(soundPromises);
            setSounds(soundResults);
            console.log("Loaded sounds:", soundResults);
        } catch (error) {
            console.error("Error fetching the sounds", error);
            setFetchError("could not load sounds from backend");
        }
    };

    // Example: simulate API sending game-end info
    useEffect(() => {
        handleFetchEffects();
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

                    onClose={() => setPopupVisible(false)}
                />

                {/* Left half */}
                <div className="layoutGap half left">
                    <PopupWindow color="basic pink" animated={false} className="container otherCameraContainer">
                        <OtherCameraDisplay />
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
                        <WebcamDisplay sendVideoData={sendVideoFrame} sendAudioData={sendAudioFrame} />
                    </PopupWindow>
                </div>

                {/* Game End Popup */}

            </div>
        </>
    );
}

export default GameRoom;
