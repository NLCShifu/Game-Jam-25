import { useState } from "react"

import "./GameRoom.css"

import LivesDisplay from "./LivesDisplay"
import EffectsList from "./EffectsList/EffectsList";

function GameRoom() {
    const [ownLives, setOwnLives] = useState(2);
    const [otherLives, setOtherLives] = useState(3);

    return (
        <div className="layoutGap gameRoom">
            <div className="layoutGap half left">
                <div className="container otherCameraContainer">
                    <div className="placeholder">other camera</div>
                </div>
                <div className="container livesContainer">
                    <div className="livesDisplay otherLives">
                        <LivesDisplay lives={otherLives} />
                        Their lives
                    </div>
                    <div className="livesDisplay ownLives">
                        Your lives
                        <LivesDisplay lives={ownLives} />
                    </div>
                </div>
            </div>
            <div className="layoutGap half right">
                <div className="container effectsContainer">
                    <EffectsList />
                </div>
                <div className="container ownCameraContainer">
                    <div className="placeholder">your camera</div>
                </div>
            </div>
        </div>
    )
}

export default GameRoom