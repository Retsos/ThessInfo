// src/Components/Pages/ArrayMapSection.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import Styles from './ArrayMapSection.module.css';
import TabElements from '../SmallComponents/TabElement';
import { useParams } from 'react-router-dom';


export default function ArrayMapSection() {
  const [isSticky, setIsSticky] = useState(false);
  const { view, category } = useParams();
  const initialView     = Number(view) || 0;
  const initialCategory = category    || 'Water';

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
            <TabElements         
              initialView={initialView}
              initialCategory={initialCategory}
            />
          </div>

      <Footer />
    </div>
  );
}
