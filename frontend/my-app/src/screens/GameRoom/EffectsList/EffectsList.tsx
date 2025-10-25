import { useState } from "react";

import "./EffectTabs.css"

import EffectTab from "./EffectTabContent";
import MemesList from "./MemesList";

import testImg from "../../../assets/cursor.png";

const Tab = {
    MEMES: 0,
    SFX: 1
} as const;

const TAB_COUNT = 2;

type Tab = (typeof Tab)[keyof typeof Tab];

function EffectsList() {
    const [tab, setTab] = useState<number>(Tab.MEMES);

    const prevTab = () => setTab(tab === 0 ? TAB_COUNT-1 : tab-1);
    const nextTab = () => setTab((tab + 1) % TAB_COUNT);

    const tabName = (tab: number) => {
        switch (tab) {
            case Tab.MEMES: return "MEMES";
            case Tab.SFX: return "SFX";
            default: return "ERROR";
        }
    }

    return (
        <div className="effectsList">
            <div className="header">
                <button onClick={prevTab}>{"<"}</button>
                <span>{tabName(tab)}</span>
                <button onClick={nextTab}>{">"}</button>
            </div>
            <div className="tabHolder">
                <EffectTab visible={tab === Tab.MEMES}>
                    <MemesList memes={[
                        testImg, testImg, testImg, testImg
                    ]}/>
                </EffectTab>
                <EffectTab visible={tab === Tab.SFX}>
                    SFX tab
                </EffectTab>
            </div>
        </div>
    )
}

export default EffectsList;