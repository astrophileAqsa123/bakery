import React, { useRef, useState } from "react";
import "./Hero.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const circleRef = useRef(null);
  const imgRef = useRef(null);
  const [image, setImage] = useState("/cake-2-removebg-preview.png");
  const [button, setButton] = useState("Explore our cakes");

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 10%",
        end: "+=500",
        pin: true,
        scrub: 2,
        markers: true,
        onUpdate: (self) => {
          if (self.progress < 0.33) {
            setImage("/cake.png");
            setButton("Explore our cakes");
          } else if (self.progress < 0.66) {
            setImage("/cupcake3.png");
            setButton("Explore our cupcakes");
          } else {
            setImage("/sundae4.png");
            setButton("Explore our sundaes");
          }
        },
      },
    });
    tl.to(circleRef.current, {
      y: 80,
      ease: "none",
      duration: 1,
    });
    tl.to(circleRef.current, {
      y: 160,
      ease: "none",
      duration: 1,
    });
  }, []);

  // Runs every time `image` changes, sliding the new image in from the right
  useGSAP(() => {
    if (!imgRef.current) return;
    gsap.fromTo(
      imgRef.current,
      { x: 300, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.4, ease: "power3.out" }
    );
  }, [image]);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-content">
        <div className="hero-left">
          <h1>Cute Bakery</h1>
          <p>
            Freshly baked with love, our bakery brings you handcrafted breads,
            delightful pastries, and custom cakes made from the finest
            ingredients. Freshly baked with love, our bakery brings you
            handcrafted breads, delightful pastries, and custom cakes made
            from the finest ingredients.
          </p>
          <button>{button}</button>
          &nbsp;&nbsp;&nbsp;
          <button>Order Now</button>
        </div>
        <div className="divider">
          <div className="divider-circle" ref={circleRef}></div>
        </div>
        <div className="hero-right">
          <img ref={imgRef} src={image} alt="Bakery Item" />
        </div>
      </div>
    </section>
  );
};

export default Hero;