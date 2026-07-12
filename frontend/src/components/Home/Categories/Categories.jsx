import React, { useRef } from "react";
import "./Categories.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const categories = [
  { name: "Cupcakes", image: "/cupcake3.png" },
  { name: "Cakes", image: "/cake.png" },
  { name: "Sundaes", image: "/sundae4.png" },
  { name: "Cookies", image: "/cookies.png" },
  { name: "Donuts", image: "/donut.png" },
  { name: "Sundaes", image: "/sundae4.png" },
  { name: "Donuts", image: "/donut.png" },
  { name: "Cupcakes", image: "/cupcake3.png" },
];

const Categories = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(
    () => {
      // Heading Animation
      gsap.from(headingRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          once: true,
        },
      });


      
    },
    { scope: sectionRef }
  );

  return (
    <section className="categories" ref={sectionRef}>
      <div className="categories-heading" ref={headingRef}>
        <p className="heading">Our Categories</p>
        <p>
          Freshly baked treats crafted with love for every sweet craving.
        </p>
      </div>

      <div className="categories-grid" ref={gridRef}>
        {categories.map((item, index) => (
          <div className="category-card" key={index}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;