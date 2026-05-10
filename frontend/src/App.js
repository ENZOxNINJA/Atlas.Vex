import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Portfolio from "./components/Portfolio";
import ProjectDetail from "./components/ProjectDetail";
import ChatBot from "./components/ChatBot";
import LogoIntro from "./components/LogoIntro";
import AdminInbox from "./components/AdminInbox";

function ChatBotMount() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return <ChatBot />;
}

function LogoIntroMount() {
  // Skip the boot animation on the admin route
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return null;
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
          </Routes>
          <ChatBotMount />
        </BrowserRouter>
      </div>
    </MotionConfig>
  );
}

export default App;
