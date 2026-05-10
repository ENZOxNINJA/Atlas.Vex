import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Portfolio from "./components/Portfolio";
import ProjectDetail from "./components/ProjectDetail";
import ChatBot from "./components/ChatBot";
import LogoIntro from "./components/LogoIntro";
import AdminInbox from "./components/AdminInbox";
import Resume from "./components/Resume";

function ChatBotMount() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/resume")) return null;
  return <ChatBot />;
}

function LogoIntroMount() {
  // Skip the boot animation on admin / resume routes
  if (typeof window !== "undefined") {
    const p = window.location.pathname;
    if (p.startsWith("/admin") || p.startsWith("/resume")) return null;
  }
  return <LogoIntro />;
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="App">
        <LogoIntroMount />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/admin" element={<AdminInbox />} />
            <Route path="/resume" element={<Resume />} />
          </Routes>
          <ChatBotMount />
        </BrowserRouter>
      </div>
    </MotionConfig>
  );
}

export default App;
