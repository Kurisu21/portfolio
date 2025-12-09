import React from 'react';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Interests from './components/Interests';
import Songs from './components/Songs';
import Playground from './components/Playground';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <SideMenu />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Interests />
      <Songs />
      <Playground />
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
