import { Route, Routes } from "react-router";
import Cursor from "./components/Cursor";
import MainMenu from "./screens/MainMenu/MainMenu";
import WaitingRoom from "./screens/WaitingRoom/WaitingRoom";
import Test from "./screens/test/test";
import GameRoom from "./screens/GameRoom/GameRoom";
import WebcamTest from "./screens/WebcamTest/WebcamTest";
import VideoProvider from "./contexts/VideoContext";

function App() {


    return (
        <VideoProvider>
            <Cursor rippleOffset={{ x: -9, y: -7 }} />
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/:room_id/:session_id/waiting" element={<WaitingRoom />} />
                <Route path="/test" element={<Test />} />
                <Route path="/gametest" element={<GameRoom />} />
                <Route path="/testwebcam" element={<WebcamTest />} />
            </Routes>
        </VideoProvider>
    )
}

export default App;