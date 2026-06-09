import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyChooseUs from './components/WhyChooseUs'
import ProductCategories from './components/ProductCategories'
import CallToAction from './components/CallToAction'
import ProductsSection from './components/ProductsSection'
import Footer from './components/Footer'

function page() {
  return (
    <div>
      <Navbar />
      <Hero/>
       <WhyChooseUs />
      <ProductsSection />
      <ProductCategories />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default page