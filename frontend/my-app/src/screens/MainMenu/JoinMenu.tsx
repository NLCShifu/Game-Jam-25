import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import PopupWindow from "../../components/PopupWindow";
import ButtonSquare from "../../components/Buttons/ButtonSquare";

type PropTypes = {
    showPopup: boolean,
    closePopup: () => void
}

function JoinMenu({ showPopup, closePopup }: Readonly<PropTypes>) {
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const updateCode = (e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)

    if (!showPopup) return null;

    return (
        // <div className="menuPanel">
        //     <p>Input code:</p>
            
        //     <input type="text" maxLength={6} onChange={updateCode} />
        //     <button onClick={() => navigate(`/${code}/waiting`)}>JOIN</button>

        //     <button className="exitbutton" onClick={closePopup}>X</button>
        // </div>
        <PopupWindow color="basic green" show={showPopup} className="menuPanel" >
            <div style={{ flex: "1" }} />
            <span>Input code:</span>
    
            <input type="text" maxLength={6} onChange={updateCode} />
            <button onClick={() => navigate(`/${code}/waiting`)}>JOIN</button>

            {/* <button className="exitbutton" onClick={closePopup}>X</button> */}
            
            <div style={{ flex: "1" }} />
        </PopupWindow>
    )
}

export default JoinMenu