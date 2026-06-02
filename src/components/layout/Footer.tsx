import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { SectionReveal } from '../ui/SectionReveal';
import { GradientText } from '../ui/GradientText';
import { MagneticButton } from '../ui/MagneticButton';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <SectionReveal direction="up" className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">
              <GradientText>Naufal Nabila</GradientText>
            </h3>
            <p className="footer-desc">
              System Builder & Full-Stack Developer based in Indonesia, helping businesses build dashboards, ERP systems, client portals, internal tools, and AI workflows — from process diagnosis to live systems your team uses daily.
            </p>
            <div className="footer-social">
              {/* Replace # with actual links */}
              <a href="#" className="social-link" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li><NavLink to="/layanan-website">Website Development</NavLink></li>
              <li><NavLink to="/layanan-video-ai">AI Video Production</NavLink></li>
              <li><NavLink to="/packages">Premium Packages</NavLink></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-title">Portfolio</h4>
            <ul className="footer-links">
              <li><NavLink to="/case-studies">Case Studies</NavLink></li>
              <li><NavLink to="/founded">Projects Founded</NavLink></li>
              <li><NavLink to="/services">All Services</NavLink></li>
            </ul>
          </div>

          <div className="footer-cta">
            <h4 className="footer-title">Start a Project</h4>
            <p className="footer-desc-small">Available for new opportunities.</p>
            <MagneticButton href="mailto:hello@naufalnabila.my.id" primary={true} className="mt-4">
              Diskusi Proyek
            </MagneticButton>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Naufal Nabila. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </SectionReveal>
    </footer>
  );
}
