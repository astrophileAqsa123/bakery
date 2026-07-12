import React, { useRef } from "react";
import "./BelowHero.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);

const BelowHero = () => {
  const container = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.fromTo(
        ".below-line-top",
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          ".below-text",
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ".below-line-bottom",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power3.out" },
          "-=0.8"
        );
    },
    { scope: container }
  );

  return (
    <section ref={container} className="below-hero">
      <div className="below-text-wrapper">
        <div className="below-line below-line-top"></div>
        <p className="below-text">
          Freshly baked with finest ingredients.
          Every bite brings unforgettable flavor.
        </p>
        <div className="below-line below-line-bottom"></div>
      </div>
    </section>
  );
};

export default BelowHero;