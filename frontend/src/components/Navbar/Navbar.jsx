
import React, { useRef } from "react";
import "./Navbar.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navRef = useRef(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ".hero",      // same trigger as Hero
      start: "top 10%",      // same start as Hero
      end: "+=500",          // same end as Hero
      pin: navRef.current,
      pinSpacing: false,     // prevents extra gap being added
    });
  }, []);

  return (
    <div className="navbar" ref={navRef}>
      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Collection</a>
        <a href="#">Cakes</a>
        <a href="#">Desserts</a>
        <a href="#">Cookies</a>
        <a href="#">Contact</a>
      </div>
      <div className="cart">
        <div></div>
      </div>
    </div>
  );
};

export default Navbar;