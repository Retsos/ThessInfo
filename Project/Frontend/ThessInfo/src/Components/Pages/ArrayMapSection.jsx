import React, { useState, useEffect } from 'react';
import Styles from './ArrayMapSection'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'

export default function ArrayMapSection() {

  const [isSticky, setIsSticky] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const initialPageHeight = window.innerHeight;
      const twentyPercentPoint = initialPageHeight * 0.20;
      const scrollPosition = window.scrollY;

      if (scrollPosition > twentyPercentPoint) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={Styles.pageContainer}>
      <div className={`${Styles.FullContainer} ${isSticky ? Styles.sticky : ''}`}   >
        <Navbar></Navbar>
      </div>


      <Footer></Footer>
    </div>
  )
}
