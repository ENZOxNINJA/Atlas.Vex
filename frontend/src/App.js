import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import ProjectDetail from "./components/ProjectDetail";
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </div>
  );
}

export default App;
