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
    const { type, title, description, iconProps, color } = state || {};

    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false);

    // Sticky navbar
    useEffect(() => {
        const onScroll = () => setIsSticky(window.scrollY > window.innerHeight * 0.2);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Fetch μόλις mountάρει η σελίδα
    useEffect(() => {
        if (!type) return;
        const fetchBest = async () => {
            setLoading(true);
            try {
                let endpoint;
                switch (type) {
                    case 'air':
                        endpoint = 'airquality/best-area-latest/';
                        break;
                    case 'water':
                        endpoint = 'water/BestRegionView/';
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
        fetchBest();
    }, [type]);

    return (
        <div className={Styles.pageContainer}>
            <div className={`${Styles.FullContainer} ${isSticky ? Styles.sticky : ''}`}>
                <Navbar />
            </div>

            {console.log(apiData)}

            <div className={Styles.content} style={{ borderTop: `4px solid ${color}` }}>
                <div className={Styles.cardHeader}>
                    <FaTrophy className={Styles.icon} color={iconProps?.color} size={iconProps?.size} />
                    <p>{title}</p>
                </div>
                <p className={Styles.cardDescription}>{description}</p>

                {loading ? (
                    <Loadingcomp />
                ) : apiData ? (
                    <div className={Styles.dataContainer}>

                        {/* Air branch */}
                        {type === 'air' && (
                            <>
                                <p className={Styles.bestregion}>
                                    Καλύτερη περιοχή:&nbsp;
                                    <span style={{ color }}>{apiData.area}</span>
                                </p>
                                <p className={Styles.dataValue}>
                                    NO₂ μέσος όρος: {apiData.no2_avg}
                                </p>
                            </>
                        )}

                        {/* Water branch */}
                        {type === 'water' && (
                            <>
                                {/* 1) Πρώτη (καλύτερη) περιοχή */}
                                {apiData.best_regions?.[0] && (
                                    <p className={Styles.bestregion}>
                                        Καλύτερη περιοχή:&nbsp;
                                        <span style={{ color }}>
                                            {apiData.best_regions[0]}
                                        </span>
                                    </p>
                                )}

                                {/* 2) Μετρήσεις για την πρώτη περιοχή */}
                                {apiData.best_regions?.[0] && apiData.details && (
                                    (() => {
                                        const best = apiData.best_regions[0];
                                        const info = apiData.details[best] || {};
                                        return (
                                            <p className={Styles.dataValue}>
                                                Μετρήσεις συμμόρφωσης: {info.compliantCount ?? info.compliant_count} / {info.totalCount} {' '}
                                                ({info.rate_percent ?? Math.round((info.compliantCount / info.totalCount) * 100)}%)
                                            </p>
                                        );
                                    })()
                                )}

                                {/* 3) Λίστα με Top Περιφέρειες και μετρήσεις */}
                                <h4 className={Styles.subTitle}>Top Περιφέρειες</h4>
                                <ul className={Styles.list}>
                                    {Array.isArray(apiData.best_regions) &&
                                        apiData.best_regions.map((region, idx) => {
                                            const info = apiData.details?.[region] || {};
                                            return (
                                                <li key={region + idx}>
                                                    {idx + 1}. {region} — {info.compliantCount ?? info.compliant_count} / {info.totalCount} (
                                                    {info.rate_percent ?? Math.round((info.compliantCount / info.totalCount) * 100)}%)
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </>
                        )}

                        {/* Recycling branch */}
                        {type === 'recycling' && (
                            <>
                                <p className={Styles.bestregion}>
                                    Καλύτερη περιοχή:&nbsp;
                                    <span style={{ color }}>{apiData.area}</span>
                                </p>
                                <p className={Styles.dataValue}>
                                    Ανακύκλωση: {apiData.compliant_count} kg/κάτοικο
                                </p>
                            </>
                        )}

                        {apiData.year && (
                            <p className={Styles.dataDetails}>Έτος: {apiData.year}</p>
                        )}
                    </div>
                ) : (
                    <p>Δεν βρέθηκαν δεδομένα.</p>
                )}

            </div>

            <Footer />
        </div>
    );
}
