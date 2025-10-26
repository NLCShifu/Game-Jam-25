type Meme = {
    name: string;
    url: string;
};

type PropTypes = {
    memes: Meme[];
};

function MemesList({ memes }: Readonly<PropTypes>) {
    return (
        <div className="memesList">
            {memes.map((meme) => (
                <div key={meme.name} className="meme">
                    <img src={meme.url} alt={meme.name} />
                </div>
            ))}
        </div>
    );
}

export default MemesList;
