import { useRef } from "react"
import ButtonSquare from "../../components/Buttons/ButtonSquare"
import ButtonWide from "../../components/Buttons/ButtonWide"
import ButtonWider from "../../components/Buttons/ButtonWider"
import Heart, { type HeartHandle } from "../../components/Heart"
import IconPanel from "../../components/IconPanel"
import PopupWindow from "../../components/PopupWindow"
import Ribbon from "../../components/Ribbon"
import Hearts, { type HeartsHandle } from "../../components/Hearts";
import Confetti from "../../components/Confetti"
import { Howl } from "howler"



function Test() {
    const heartRef = useRef<HeartHandle>(null);

    const handleUnfill = () => {
        heartRef.current?.unfill();
    };

    const heartsRef = useRef<HeartsHandle>(null);

    const loseLife = () => {
        heartsRef.current?.loseLife();
    };

    const resetHearts = () => {
        heartsRef.current?.reset();
    };

    return (
        <>

            <ButtonWide text="NIGGA" color="basic pink" size={0.5} onClick={() => {
                const sound = new Howl({
                    src: ["/MISTER V-LE POULET.mp3"],
                    volume: 0.5,
                })
                sound.play();
            }} />
            <ButtonSquare iconName="icons arrow right.png" color="basic blue" />
            <ButtonWider text="FRIED CHICKEN" color="basic green" />
            <PopupWindow color="basic yellow" show={true} animated={true}>
                <Ribbon text="AAatefaact dagdai" color="basic red" scale={0.5} />
            </PopupWindow>
            <IconPanel color="metal" />
            <Heart ref={heartRef} color="basic red" initialFilled={true} />
            <ButtonSquare iconName="icons cross.png" color="basic black" onClick={handleUnfill} />
            <Hearts ref={heartsRef} color="basic red" lives={3} size={80} direction="rtl" finalSound="/death_fortnite.mp3" />
            <button onClick={loseLife}>Lose Life</button>
            <button onClick={resetHearts}>Reset Hearts</button>
            <Confetti />
        </>
    )
}

export default Test