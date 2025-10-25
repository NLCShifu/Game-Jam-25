import type { PropsWithChildren } from "react";

type PropTypes = {
    visible: boolean
}

function EffectTabContent({ visible, children }: PropsWithChildren<PropTypes>) {
    if (!visible) return null;

    return (
        <div className="effectTab">
            {children}
        </div>
    )
}

export default EffectTabContent