// src/Components/Pages/ArrayMapSection.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import Styles from './ArrayMapSection.module.css';
import TabElements from '../SmallComponents/TabElement';


export default function ArrayMapSection() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > window.innerHeight * 0.2);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);



  return (
    <div className={Styles.pageContainer}>
      <div className={`${Styles.FullContainer} ${isSticky ? Styles.sticky : ''}`}>
        <Navbar />
      </div>

          <div>
            <TabElements/>

          </div>

      <Footer />
    </div>
  );
}
