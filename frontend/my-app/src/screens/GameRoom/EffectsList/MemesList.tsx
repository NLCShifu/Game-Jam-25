type PropTypes = {
    memes: string[]
};

function MemesList({ memes }: Readonly<PropTypes>) {
    return (
        <div className="memesList">
            {
                memes.map(link => (
                    <div key={link} className="meme">
                        <img src={link} alt="Meme" />
                    </div>
                ))
            }
        </div>
    )
}

export default MemesList