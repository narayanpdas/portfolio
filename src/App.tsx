import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import ThoughtProcesses from './pages/ThoughtProcesses';
import BlogPost from './pages/BlogPost';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/portfolio/" element={<Home />} />
            <Route path="/portfolio/projects" element={<Projects />} />
            <Route path="/portfolio/blog" element={<ThoughtProcesses />} />
            <Route path="/portfolio/blog/:slug" element={<BlogPost />} />
            <Route path="/portfolio/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
