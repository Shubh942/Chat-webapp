import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="" element={<Homepage />} />
          <Route path="chats" element={<Chatpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
