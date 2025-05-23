import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import Styles from './BestRegions.module.css';
import { FaTrophy } from 'react-icons/fa';
import api from '../../endpoints/api';
import Loadingcomp from '../SmallComponents/loadingcomp';
import WaterAlert from '../SmallComponents/BestRegionAlerts/WaterAlert';
import RecycleAlert from '../SmallComponents/BestRegionAlerts/RecycleAlert';
import AirAlert from '../SmallComponents/BestRegionAlerts/AirAlert';
import AirPic from '../../assets/airPic.png';
import WaterPic from '../../assets/waterPic.png';
import RecyclePic from '../../assets/recyclePic.png';

export default function BestRegions() {
    const { state } = useLocation();
    const { type, title, description, iconProps, color } = state || {};

    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsSticky(window.scrollY > window.innerHeight * 0.2);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!type) return;
        (async () => {
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
                        endpoint = 'recycle/top-recycling/';
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
        })();
    }, [type]);

    return (
        <div className={Styles.pageContainer}>
            <div className={`${Styles.FullContainer} ${isSticky ? Styles.sticky : ''}`}>
                <Navbar />
            </div>

            <div className={Styles.content} style={{ borderTop: `4px solid ${color}` }}>
                {/* Header */}
                <div className={Styles.cardHeader}>
                    <FaTrophy className={Styles.icon} color={iconProps?.color} size={iconProps?.size} />
                    <p>{title}</p>
                </div>
                <p className={Styles.cardDescription}>{description}</p>

                {loading
                    ? <Loadingcomp />
                    : apiData && (
                        <div className={Styles.dataContainer}>

                            {/* --- Εικόνα + Alert --- */}
                            <div className={Styles.mediaContainer}>
                                {type === 'air' && <>
                                    <img src={AirPic} alt="Air Quality" className={Styles.regionImage} />
                                    <AirAlert />
                                </>}
                                {type === 'water' && <>
                                    <img src={WaterPic} alt="Water Quality" className={Styles.regionImage} />
                                    <WaterAlert />
                                </>}
                                {type === 'recycling' && <>
                                    <img src={RecyclePic} alt="Recycling" className={Styles.regionImage} />
                                    <RecycleAlert />
                                </>}
                            </div>

                            {/* --- Τα δεδομένα --- */}
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

                            {type === 'water' && (
                                <>
                                    {apiData.best_regions?.[0] && (
                                        <p className={Styles.bestregion}>
                                            Καλύτερη περιοχή:&nbsp;
                                            <span style={{ color }}>
                                                {apiData.best_regions[0]}
                                                {apiData.best_regions[1] ? ` & ${apiData.best_regions[1]}` : ''}
                                            </span>
                                        </p>
                                    )}
                                    {apiData.best_regions?.[0] && apiData.details && (() => {
                                        const best = apiData.best_regions[0];
                                        const info = apiData.details[best] || {};
                                        const pct = info.rate_percent ?? Math.round((info.compliantCount / info.totalCount) * 100);
                                        return (
                                            <p className={Styles.dataValue}>
                                                Μετρήσεις συμμόρφωσης: {info.compliantCount ?? info.compliant_count} / {info.totalCount} ({pct}%)
                                            </p>
                                        );
                                    })()}
                                    <h4 className={Styles.subTitle}>Top Περιφέρειες</h4>
                                    <ul className={Styles.list}>
                                        {Array.isArray(apiData.best_regions) &&
                                            apiData.best_regions.map((region, idx) => {
                                                const info = apiData.details?.[region] || {};
                                                const pct = info.rate_percent ?? Math.round((info.compliantCount / info.totalCount) * 100);
                                                return (
                                                    <li key={region + idx}>
                                                        {region} — {info.compliantCount ?? info.compliant_count} / {info.totalCount} ({pct}%)
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </>
                            )}

                            {type === 'recycling' && (
                                <>
                                    <p className={Styles.bestregion}>
                                        Καλύτερη περιοχή:&nbsp;
                                        <span style={{ color }}>{apiData.region}</span>
                                    </p>
                                    <p className={Styles.dataValue}>
                                        Μέση Ανακύκλωση: {apiData.average} kg/κάτοικο
                                    </p>
                                </>
                            )}

                            {apiData.year && (
                                <p className={Styles.dataDetails}>Έτος: {apiData.year}</p>
                            )}
                        </div>
                    )}

                {/* Call-to-Action */}
                <p className="text-center" style={{ marginTop: '2rem' }}>
                    🔥 Η κορυφαία υπηρεσία μας:{' '}
                    <Link to="/ArrayMapSection" className={Styles.link}>
                        Δες όλα τα δεδομένα ανά δήμο!
                    </Link>
                </p>
            </div>

            <Footer />
        </div>
    );
}
