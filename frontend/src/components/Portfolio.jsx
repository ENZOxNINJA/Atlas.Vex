import React from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Identity from "./Identity";
import Skills from "./Skills";
import Projects from "./Projects";
import Mission from "./Mission";
import Metrics from "./Metrics";
import Contact from "./Contact";
import Footer from "./Footer";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200" data-testid="portfolio-root">
      <Nav />
      <main>
        <Hero />
        <Identity />
        <Skills />
        <Projects />
        <Mission />
        <Metrics />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
