// src/Components/Pages/ArrayMapSection.jsx
import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import Styles from './ArrayMapSection.module.css';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import Map from '../SmallComponents/map';
import api from '../../endpoints/api';

export default function ArrayMapSection() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {

    
  }, []);


  useEffect(() => {
    const handler = () => setIsSticky(window.scrollY > window.innerHeight * 0.2);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className={Styles.pageContainer}>
      <div className={`${Styles.FullContainer} ${isSticky ? Styles.sticky : ''}`}>
        <Navbar />
      </div>

      <Map/>

      <Footer />
    </div>
  );
}
