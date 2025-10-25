import { type ReactNode, type CSSProperties } from "react"
import { useRoomMedia } from "./RoomMediaContext"

type Props = {
  className?: string
  style?: CSSProperties
  imageStyle?: CSSProperties
  placeholder?: ReactNode
}

export default function PartnerCamera({ className, style, imageStyle, placeholder }: Props) {
  const { remoteFrameUrl, videoConnected, audioConnected } = useRoomMedia()

  return (
    <div className={className} style={style}>
      {remoteFrameUrl ? (
        <img
          src={remoteFrameUrl}
          alt="Remote participant"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 8,
            ...imageStyle,
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: 13,
            borderRadius: 8,
            ...imageStyle,
          }}
        >
          {placeholder ?? "En attente de son flux..."}
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 12, color: "#bbb", textAlign: "center" }}>
        Vidéo {videoConnected ? "connectée" : "en attente"} · Audio {audioConnected ? "ok" : "en attente"}
      </div>
    </div>
  )
}
