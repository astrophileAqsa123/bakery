// AboutUs.jsx
import React, { useRef } from "react";
import "./AboutUs.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 12, suffix: "+", label: "Years Baking" },
  { value: 500, suffix: "+", label: "Cakes Delivered" },
  { value: 98, suffix: "%", label: "Happy Customers" },
];

const AboutUs = () => {
  const sectionRef = useRef(null);
  const videoWrapRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const statRefs = useRef([]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    tl.from(videoWrapRef.current, {
      x: -120,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
      .from(
        textRef.current.querySelectorAll(
          ".about-eyebrow, h2, p, .about-stats"
        ),
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.6"
      );

    // Play video once it scrolls into view, pause when it leaves
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => videoRef.current?.play(),
      onEnterBack: () => videoRef.current?.play(),
      onLeave: () => videoRef.current?.pause(),
      onLeaveBack: () => videoRef.current?.pause(),
    });

    // Animate counters when stats row is in view
    statRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = stats[i].value;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 1.6,
        ease: "power1.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        onUpdate: () => {
          el.textContent = Math.floor(counter.val) + stats[i].suffix;
        },
      });
    });
  }, []);

  return (
    <section className="about" ref={sectionRef}>
      <div className="about-content">
        <div className="about-video" ref={videoWrapRef}>
          <video
            ref={videoRef}
            src="/video-3.mp4"
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="about-video-frame"></div>
        </div>

        <div className="about-text" ref={textRef}>
          <span className="about-eyebrow">Our Story</span>
          <p className='heading'>Bringing joy in every bite</p>
          <p>
            What started as a small kitchen dream has grown into a bakery
            loved by our community. Every cake, pastry, and cookie is
            handcrafted using traditional recipes and the finest
            ingredients, bringing warmth and sweetness to every table.
          </p>

          <div className="about-stats">
            {stats.map((stat, i) => (
              <div className="stat-item" key={stat.label}>
                <span
                  className="stat-number"
                  ref={(el) => (statRefs.current[i] = el)}
                >
                  0{stat.suffix}
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <button className="about-btn">Learn More About Us</button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;