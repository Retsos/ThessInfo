import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import Styles from './BestRegions.module.css';
import { FaTrophy } from 'react-icons/fa';
import api from '../../endpoints/api';
import Loadingcomp from '../SmallComponents/loadingcomp';

export default function BestRegions() {
    const { state } = useLocation();
    const {
        type,
        title,
        description,
        iconProps,
        color,
        apiData: initialData
    } = state || {};

    // Αν υπάρχει initialData, το βάζουμε απευθείας,
    // αλλιώς ξεκινάμε με null
    const [apiData, setApiData] = useState(initialData || null);

    // Αν έχουμε initialData, δεν είμαστε σε loading
    const [loading, setLoading] = useState(!initialData);

    const [isSticky, setIsSticky] = useState(false);

    // Sticky Navbar on scroll
    useEffect(() => {
        const handleScroll = () => {
            const threshold = window.innerHeight * 0.20;
            setIsSticky(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch data μόνο αν ΔΕΝ υπάρχει initialData
    useEffect(() => {
        if (!type || initialData) return;

        const fetchBestRegion = async () => {
            setLoading(true);
            try {
                let endpoint = '';
                switch (type) {
                    case 'air':
                        endpoint = 'airquality/best-area-latest/';
                        break;
                    case 'Water':
                        endpoint = 'Water/BestRegionView/';
                        break;
                    case 'recycling':
                        endpoint = 'recycling/monthly-compliance/';
                        break;
                    default:
                        return;
                }
                const res = await api.get(endpoint);
                setApiData(res.data);
            } catch (err) {
                console.error('Error fetching best region:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBestRegion();
    }, [type, initialData]);

    return (
        <div className={Styles.pageContainer}>
            <div className={`${Styles.FullContainer} ${isSticky ? Styles.sticky : ''}`}>
                <Navbar />
            </div>

            <div className={Styles.content} style={{ borderTop: `4px solid ${color}` }}>
                <div className={Styles.cardHeader}>
                    <FaTrophy
                        className={Styles.icon}
                        color={iconProps?.color}
                        size={iconProps?.size}
                    />
                    <p>{title}</p>
                </div>

                <p className={Styles.cardDescription}>{description}</p>

                {loading ? (
                    <Loadingcomp />
                ) : apiData ? (
                    <div className={Styles.dataContainer}>
                        <p className={Styles.bestregion}>
                            Καλύτερη περιοχή:{' '}
                            <span style={{ color }}>{apiData.area}</span>
                        </p>

                        <p className={Styles.dataValue}>
                            {type === 'air' &&
                                `NO₂ μέσος όρος: ${apiData.no2_avg}`}
                            {type === 'water' &&
                                `Συμμόρφωση: ${apiData.compliant_count}`}
                            {type === 'recycling' &&
                                `Ανακύκλωση: ${apiData.compliant_count}`}
                        </p>

                        <p className={Styles.dataDetails}>
                            Έτος: {apiData.year}
                        </p>
                    </div>
                ) : (
                    <p>Δεν βρέθηκαν δεδομένα.</p>
                )}
            </div>

            <Footer />
        </div>
    );
}
