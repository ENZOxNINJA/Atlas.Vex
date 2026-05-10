import React from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Identity from "./Identity";
import Skills from "./Skills";
import Stack from "./Stack";
import Experience from "./Experience";
import Projects from "./Projects";
import Services from "./Services";
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
        <Stack />
        <Experience />
        <Projects />
        <Services />
        <Mission />
        <Metrics />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
