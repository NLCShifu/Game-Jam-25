import { useState } from "react";

import "./EffectTabs.css"

import EffectTab from "./EffectTabContent";
import MemesList from "./MemesList";

import ButtonSquare from "../../../components/Buttons/ButtonSquare";
import PopupWindow from "../../../components/PopupWindow";
import SoundsList from "./SoundsList";

const Tab = {
    MEMES: 0,
    SFX: 1
} as const;

const TAB_COUNT = 2;

type Tab = (typeof Tab)[keyof typeof Tab];

type Meme = {
    name: string;
    url: string;
};


type Sound = {
    name: string;
    url: string;
};

type EffectsListProps = {
    memes: Meme[];
    sounds: Sound[];
    onclickMemeFunc?: (meme_name: string) => void;
    onclickSoundFunc?: (sound_name: string) => void;
};

function EffectsList({ memes, sounds, onclickMemeFunc, onclickSoundFunc }: EffectsListProps) {
    const [tab, setTab] = useState<number>(Tab.MEMES);

    const prevTab = () => setTab(tab === 0 ? TAB_COUNT - 1 : tab - 1);
    const nextTab = () => setTab((tab + 1) % TAB_COUNT);

    const tabName = (tab: number) => {
        switch (tab) {
            case Tab.MEMES: return "MEMES";
            case Tab.SFX: return "SFX";
            default: return "ERROR";
        }
    };

    return (
        <PopupWindow color="basic orange" animated={false} className="container effectsList">
            <div className="header">
                <ButtonSquare iconName="icons arrow left.png" color="basic yellow" size={50} onClick={prevTab} />
                <span>{tabName(tab)}</span>
                <ButtonSquare iconName="icons arrow right.png" color="basic yellow" size={50} onClick={nextTab} />
            </div>
            <div className="tabHolder">
                <EffectTab visible={tab === Tab.MEMES}>
                    <MemesList memes={memes} onMemeClick={onclickMemeFunc} />
                </EffectTab>
                <EffectTab visible={tab === Tab.SFX}>
                    <SoundsList
                        sounds={sounds} // array of { name, url }
                        onSoundClick={onclickSoundFunc}
                        cooldownDuration={10000}
                    />
                </EffectTab>

            </div>
        </PopupWindow>
    );
}

export default EffectsList;
