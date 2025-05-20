// src/Components/Pages/ArrayMapSection.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import Map from '../SmallComponents/map';
import api from '../../endpoints/api';
import LoadingInd from '../SmallComponents/loadingcomp';
import Styles from './ArrayMapSection.module.css';
import TabElements from '../SmallComponents/TabElement';


export default function ArrayMapSection() {
  const [isSticky, setIsSticky] = useState(false);
  const [loading, setLoading] = useState(true);
  const [airData, setAirData] = useState(null);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > window.innerHeight * 0.2);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchAir = async () => {
      setLoading(true);
      try {
        const res = await api.get('airquality/monthly-compliance/');
        setAirData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAir();
  }, []);

  return (
    <div className={Styles.pageContainer}>
      <div className={`${Styles.FullContainer} ${isSticky ? Styles.sticky : ''}`}>
        <Navbar />
      </div>

      {loading ? <LoadingInd /> :

        <>        
          <div>
            <TabElements/>

          </div>
        </>


        // <div className={Styles.mapContainer}>
        //   <Map /> 
        // </div>
      }




      <Footer />
    </div>
  );
}
