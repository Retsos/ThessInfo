import React, { useState, useEffect } from 'react';
import Navbar from '../Navbars/Navbar';
import ServicesCss from './Services.module.css';
import Footer from '../Navbars/Footer';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaHandHoldingWater, FaTrophy } from "react-icons/fa";
import { FaRecycle } from "react-icons/fa";
import api from '../../endpoints/api';
import { MdAir, } from "react-icons/md";
import SelectRegion from '../SmallComponents/SelectRegion';

const Services = () => {
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);
    const location = useLocation();


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
        <>
            <div className={ServicesCss.pageContainer}>
                <div className={`${ServicesCss.FullContainer} ${isSticky ? ServicesCss.sticky : ''}`}>
                    <Navbar></Navbar>
                </div>


                <div className={ServicesCss.hero}>
                    <h2>Καλωσήρθες στην πλατφόρμα μας!</h2>
                    <p>Επέλεξε τον δήμο ή την περιοχή σου για να δεις στοιχεία ποιότητας νερού, ανακύκλωσης, καθαριότητας και αέρα.</p>
                </div>

                <div className={ServicesCss.wrapper} >
                    <h1 className={ServicesCss.title}>Αναζήτησε Πληροφορίες για την Περιοχή σου</h1>
                    <div className={ServicesCss.selectContainer}>

                        <SelectRegion></SelectRegion>

                        <p className={ServicesCss.hint}>
                            🔥 Η κορυφαία υπηρεσία μας:{' '}
                            <Link
                                to="/ArrayMapSection"
                                className={ServicesCss.link}
                            >
                                Δες όλα τα δεδομένα ανά δήμο!
                            </Link>
                        </p>
                    </div>

                    <section>

                        <h3 className={`text-center ${ServicesCss.sectionTitle}`}>Υπηρεσίες Περιβάλλοντος</h3>
                        <div className={ServicesCss.cards}>
                            <div className={ServicesCss.card}>
                                <FaHandHoldingWater color="#2196F3" size={32} />
                                <h4>Ποιότητα Νερού</h4>
                                <p>Μέτρηση θολότητας, pH, χλωρίου κ.λπ.</p>
                            </div>
                            <div className={ServicesCss.card}>
                                <FaRecycle color="#4CAF50" size={32} />
                                <h4>Ανακύκλωση</h4>
                                <p>Ποσοστά ανακύκλωσης ανά κάτοικο.</p>
                            </div>
                            <div className={ServicesCss.card}>
                                <MdAir color="#5dade2" size={32} />
                                <h4>Ποιότητα Αέρα</h4>
                                <p>PM2.5, CO, NO₂ κ.ά. ανά ζώνη.</p>
                            </div>
                        </div>

                    </section>

                    <section>

                        <h3 className={`text-center ${ServicesCss.sectionTitle}`}>Δες τις περιοχές με τα καλύτερα στατιστικά</h3>
                        <div className={ServicesCss.TopCards}>

                            <div className={ServicesCss.card} onClick={() => {
                                navigate('/BestRegions', {
                                    state: {
                                        type: 'water',
                                        title: 'Καλύτερη περιοχή νερού',
                                        description: 'Περιοχή με το πιο καθαρό νερό στην Θεσσαλονίκη',
                                        iconProps: { color: "#2196F3", size: 32 },
                                        color: "#2196F3",
                                    }
                                });
                            }}>
                                <FaTrophy color="#2196F3" size={32} />
                                <h4 className={ServicesCss.cardTitleSmall}>
                                    Καλύτερη περιοχή νερού
                                </h4>
                                <p className={ServicesCss.cardTextSmall}>
                                    Περιοχή με το πιο καθαρό νερό στη Θεσσαλονίκη
                                </p>
                            </div>

                            <div className={ServicesCss.card} onClick={async () => {
                                navigate('/BestRegions', {
                                    state: {
                                        type: 'recycling',
                                        title: 'Καλύτερη περιοχή ανακύκλωσης',
                                        description: 'Περιοχή με τα υψηλότερα kg/κάτοικο',
                                        iconProps: { color: "#4CAF50", size: 32 },
                                        color: "#4CAF50",
                                    }
                                });
                            }}>
                                <FaTrophy color="#4CAF50" size={32} />
                                <h4 className={ServicesCss.cardTitleSmall}>
                                    Καλύτερη περιοχή ανακύκλωσης
                                </h4>
                                <p className={ServicesCss.cardTextSmall}>
                                    Περιοχή με τα υψηλότερα kg/κάτοικο
                                </p>
                            </div>
                            <div
                                className={ServicesCss.card}
                                onClick={() => {
                                    navigate('/BestRegions', {
                                        state: {
                                            type: 'air',
                                            title: 'Καλύτερη περιοχή αέρα',
                                            description: 'Ζώνη με το χαμηλότερο ΝΟ₂',
                                            iconProps: { color: "#5dade2", size: 32 },
                                            color: "#5dade2",
                                        }
                                    });
                                }}
                            >
                                <FaTrophy color="#5dade2" size={32} />
                                <h4 className={ServicesCss.cardTitleSmall}>
                                    Καλύτερη περιοχή αέρα
                                </h4>
                                <p className={ServicesCss.cardTextSmall}>
                                    Ζώνη με το χαμηλότερο ΝΟ2
                                </p>
                            </div>

                        </div>

                    </section>

                </div>

                <Footer></Footer>
            </div>
        </>
    );
};

export default Services;