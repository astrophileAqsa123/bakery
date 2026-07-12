import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Home/Hero/Hero'
import BelowHero from './components/Home/BelowHero/BelowHero'
import Categories from './components/Home/Categories/Categories'
import BestSelling from './components/Home/BestSellingProducts/BestSelling'
import AboutUs from './components/Home/AboutUs/AboutUs'
import Footer from './components/Footer/Footer'

function App() {
 

  return (
   <>
    <Navbar/>
    <Hero/>
       <BelowHero/>
    <Categories/>
    <BestSelling/>
     <AboutUs/>
       
    <Footer/>
   </>
  )
}

export default App
