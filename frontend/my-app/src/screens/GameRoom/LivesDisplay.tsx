type PropTypes = {
    lives: number
}

function PlaceholderHeart({ active }: Readonly<{ active: boolean }>) {
    return (
        <div className="placeholderHeart">
            { active ? "O" : "X" }
        </div>
    )
}

function LivesDisplay({ lives }: Readonly<PropTypes>) {
    return (
        <div className="livesDisplayContainer">
            <PlaceholderHeart active={lives >= 1} />
            <PlaceholderHeart active={lives >= 2} />
            <PlaceholderHeart active={lives >= 3} />
        </div>
    )
}

export default LivesDisplay