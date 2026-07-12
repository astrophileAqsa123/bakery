import React, { useRef } from "react";
import "./BestSelling.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const products = [
  {
    name: "Chocolate Cookies",
    price: "$12.99",
    image: "/cookies.png",
  },
  {
    name: "Double Choco Cookies",
    price: "$14.99",
    image: "/cookies.png",
  },
  {
    name: "Butter Cookies",
    price: "$10.99",
    image: "/cookies.png",
  },
  {
    name: "Oatmeal Cookies",
    price: "$13.99",
    image: "/cookies.png",
  },
  {
    name: "Classic Cookies",
    price: "$11.99",
    image: "/cookies.png",
  },
  {
    name: "Choco Chip Cookies",
    price: "$15.99",
    image: "/cookies.png",
  },
  {
    name: "Vanilla Cookies",
    price: "$9.99",
    image: "/cookies.png",
  },
  {
    name: "Premium Cookies",
    price: "$16.99",
    image: "/cookies.png",
  },
];

const BestSelling = () => {
  const headingRef = useRef(null);

  useGSAP(() => {
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
  });

  return (
    <section className="best-selling">
      <div className="best-selling-heading" ref={headingRef}>
        <p className="heading">Best Selling Products</p>
        <p>
          Discover our most loved treats, freshly baked to delight every bite.
        </p>
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <img src={product.image} alt={product.name} />

            <h3>{product.name}</h3>

            <span>{product.price}</span>

            <button>Order Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSelling;