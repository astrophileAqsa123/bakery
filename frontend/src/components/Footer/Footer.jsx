// Footer.jsx
import React, { useRef } from "react";
import "./Footer.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from(footerRef.current.querySelectorAll(".footer-col, .footer-bottom"), {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 85%",
      },
    });
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-top">
        <div className="footer-col footer-brand">
          <h2>Cute Bakery</h2>
          <p>
            Freshly baked with love — handcrafted breads, delightful
            pastries, and custom cakes made from the finest ingredients,
            delivered straight to your table.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 17c1-3.5 1.5-6 1.5-7.5a2 2 0 1 1 4 .3c0 1.3-1 3.7-1 4.7 0 1 .7 1.5 1.5 1.5 1.7 0 3-2 3-4.7 0-2.5-1.8-4.8-5-4.8-3.4 0-5.3 2.4-5.3 5 0 1 .3 1.7.8 2.3" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Collection</a></li>
            <li><a href="#">Cakes</a></li>
            <li><a href="#">Desserts</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>123 Maple Street, Bakersfield</li>
            <li>hello@cutebakery.com</li>
            <li>(+1) 234 567 890</li>
            <li>Mon – Sat: 8am – 8pm</li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h4>Stay Sweet</h4>
          <p>Get fresh offers and new flavors in your inbox.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Cute Bakery. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;