import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

// Layout
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { ParticleField } from './components/ui/ParticleField';

// Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { CaseStudies } from './pages/CaseStudies';
import { Founded } from './pages/Founded';
import { LayananWebsite } from './pages/LayananWebsite';
import { LayananVideoAI } from './pages/LayananVideoAI';
import { Packages } from './pages/Packages';
import { NotFound } from './pages/NotFound';

function App() {
  const location = useLocation();

  return (
    <HelmetProvider>
      <ThemeProvider>
        {/* Global UI Elements */}
        <ParticleField />
        <ScrollProgress />
        
        {/* Navigation */}
        <Navbar />

        {/* Page Routing with Transitions */}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/founded" element={<Founded />} />
            <Route path="/layanan-website" element={<LayananWebsite />} />
            <Route path="/layanan-video-ai" element={<LayananVideoAI />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>

        {/* Footer */}
        <Footer />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
