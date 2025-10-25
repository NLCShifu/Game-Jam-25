import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type PropTypes = {
    showPopup: boolean,
    closePopup: () => void
}

function JoinMenu({ showPopup, closePopup }: Readonly<PropTypes>) {
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [displayName, setDisplayName] = useState("");
    const updateCode = (e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)
    const updateName = (e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)

    if (!showPopup) return null;

    const handleJoin = async () => {
        if (!code || !displayName) {
            alert("Veuillez entrer le code et votre nom");
            return;
        }

        try {
            const resp = await axios.post(`http://localhost:8000/rooms/${code}/join`, {
                username: displayName
            });
            const sessionId = resp.data.session_id;
            closePopup();
            navigate(`/${code}/${sessionId}/waiting`);
        } catch (err) {
            console.error("Failed to join room", err);
            alert("Échec de la connexion à la room. Vérifie le code.");
        }
    }

    return (
        <div className="menuPanel">
            <p>Input code:</p>
            <input type="text" maxLength={36} placeholder="Room ID" value={code} onChange={updateCode} />

            <p>Display name:</p>
            <input type="text" maxLength={32} placeholder="Ton nom" value={displayName} onChange={updateName} />

            <button onClick={handleJoin} disabled={!code || !displayName}>JOIN</button>

            <button className="exitbutton" onClick={closePopup}>X</button>
        </div>
    )
}

export default JoinMenu