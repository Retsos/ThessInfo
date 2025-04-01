import React, { useEffect, useState } from 'react';
import Navbar from '../Navbars/Navbar';
import ResultsCss from './Results.module.css';
import Footer from '../Navbars/Footer';
import api from '../../endpoints/api';
import { IoMdWater } from "react-icons/io";
import { GiRecycle } from "react-icons/gi";
import { MdAir, MdCleanHands } from "react-icons/md";
import { Tooltip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import WaterCard from '../SmallComponents/waterinfo';

const Results = () => {
    const location = useLocation();
    const [dimosValue, setDimosValue] = useState(null);
    const [dimosLabel, setDimosLabel] = useState(null);
    const [waterDataLatest, setWaterDataLatest] = useState(null);
    const [waterDataLastYear, setWaterDataLastYear] = useState(null);
    const [activeTab, setActiveTab] = useState('water');
    const [isSticky, setIsSticky] = useState(false);

    // Tabs configuration
    const tabs = [
        { id: 'water', label: 'Ποιότητα Νερού', icon: <IoMdWater /> },
        { id: 'recycle', label: 'Ανακύκλωση', icon: <GiRecycle /> },
        { id: 'cleanliness', label: 'Καθαριότητα', icon: <MdCleanHands /> },
        { id: 'air', label: 'Ποιότητα Αέρα', icon: <MdAir /> }
    ];

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const selectedDimosValue = queryParams.get('dimos');
        const selectedDimosLabel = queryParams.get('label');
        setDimosValue(selectedDimosValue);
        setDimosLabel(selectedDimosLabel);
    }, [location.search]);

    useEffect(() => {
        if (!dimosLabel) return;

        const fetchWaterData = async () => {
            try {
                const responseWaterLastMonth = await api.get(
                    `water/api/latest-measurements/?region=${encodeURIComponent(dimosLabel)}`
                );
                const responseWaterLastYear = await api.get(
                    `water/api/group-by-year/?region=${encodeURIComponent(dimosLabel)}`
                );

                setWaterDataLatest(responseWaterLastMonth.data[0] || null);
                setWaterDataLastYear(responseWaterLastYear.data[0] || null);

            } catch (error) {
                console.error("Error fetching water data:", error);
                setWaterDataLatest(null);
                setWaterDataLastYear(null);
            }
        };

        fetchWaterData();
    }, [dimosLabel]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsSticky(scrollPosition > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getQualityLevel = (compliantCount) => {
        const defaultResult = {
            color: "#cccccc",
            label: "Άγνωστη",
            tooltip: "Άγνωστη ποιότητα νερού",
            percentage: null
        };

        if (!compliantCount) return defaultResult;

        const parts = String(compliantCount).split(" of ");
        if (parts.length !== 2) return defaultResult;

        const compliant = Number(parts[0]);
        const total = Number(parts[1]);
        if (!total || isNaN(compliant) || isNaN(total)) return defaultResult;

        const percentage = (compliant / total) * 100;
        // const percentage = 40 //ΤΕΣΤΕΡ ΓΙΑ ΤΑ ΧΡΩΜΑΤΑ 
        const levels = [
            {
                min: 90,
                color: "#0000FF", //ΜΠΛΕ 
                label: "Εξαιρετική",
                tooltip: "Εξαιρετική ποιότητα νερού"
            },
            {
                min: 75,
                color: "#4f4fff", //ΜΠΛΕ ΘΩΛΟ
                label: "Καλή",
                tooltip: "Καλή ποιότητα νερού"
            },
            {
                min: 50,
                color: "#8888FF", //ΜΠΛΕ ΘΩΛΟ Χ2 
                label: "Μέτρια",
                tooltip: "Μέτρια ποιότητα νερού"
            },
            {
                min: 0,
                color: "#ccccff",//ΜΠΛΕ ΘΩΛΟ Χ5
                label: "Κακή",
                tooltip: "Κακή ποιότητα νερού"
            }
        ];

        const level = levels.find(l => percentage >= l.min) || defaultResult;

        return {
            ...level,
            percentage: Number(percentage.toFixed(2))
        };
    };


    const renderTabContent = () => {
        switch (activeTab) {
            case 'water':
                return (
                    <div className={ResultsCss.tabContent}>
                        <h3>Ποιότητα Νερού - {dimosLabel}</h3>
                        {waterDataLatest ? (
                            <div className={ResultsCss.waterQuality}>
                                <div className={ResultsCss.qualityInfo}>
                                    <div className={ResultsCss.qualityIndicator}>
                                        {getQualityLevel(waterDataLatest.compliantCount).percentage}%
                                        <IoMdWater style={{
                                            color: getQualityLevel(waterDataLatest.compliantCount).color,
                                            fontSize: '2rem'
                                        }} />
                                    </div>
                                    <p className={ResultsCss.qualityDescription}>
                                        {getQualityLevel(waterDataLatest.compliantCount).tooltip}
                                    </p>
                                    <div className={ResultsCss.waterinfo}>
                                        <p className={ResultsCss.waterinfoTitle}>Λεπτομέρειες</p>
                                        <WaterCard  waterData={waterDataLatest}></WaterCard>
                                    </div>
                                </div>
                                {/* Add charts/historical data here */}
                                <p className='text-end'>Τελευταία μέτρηση: {waterDataLatest.month}/{waterDataLatest.year}</p>

                            </div>
                        ) : <div className={ResultsCss.comingSoon}>
                            <IoMdWater className={ResultsCss.comingSoonIcon} />
                            <p>Δεν υπάρχουν διαθέσιμα δεδομένα για την ποιότητα νερού στον δήμο αυτήν τη στιγμή</p>
                        </div>}
                    </div>
                );

            case 'recycle':
                return (
                    <div className={ResultsCss.tabContent}>
                        <h3>Στοιχεία Ανακύκλωσης - {dimosLabel}</h3>
                        <div className={ResultsCss.comingSoon}>
                            <GiRecycle className={ResultsCss.comingSoonIcon} />
                            <p>Τα στοιχεία ανακύκλωσης θα είναι διαθέσιμα σύντομα</p>
                        </div>
                    </div>
                );

            case 'cleanliness':
                return (
                    <div className={ResultsCss.tabContent}>
                        <h3>Δείκτης Καθαριότητας - {dimosLabel}</h3>
                        <div className={ResultsCss.comingSoon}>
                            <MdCleanHands className={ResultsCss.comingSoonIcon} />
                            <p>Ο δείκτης καθαριότητας θα είναι διαθέσιμος σύντομα</p>
                        </div>
                    </div>
                );

            case 'air':
                return (
                    <div className={ResultsCss.tabContent}>
                        <h3>Ποιότητα Αέρα - {dimosLabel}</h3>
                        <div className={ResultsCss.comingSoon}>
                            <MdAir className={ResultsCss.comingSoonIcon} />
                            <p>Τα δεδομένα ποιότητας αέρα θα είναι διαθέσιμα σύντομα</p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={ResultsCss.pageContainer}>
            <div className={`${ResultsCss.headerWrapper} ${isSticky ? ResultsCss.sticky : ''}`}>
                <Navbar />
            </div>

            <div className={ResultsCss.contentWrapper}>
                <h2 className={ResultsCss.pageTitle}>Δεδομένα για τον Δήμο {dimosLabel}</h2>

                {/* Tab Navigation */}
                <nav className={ResultsCss.tabNavigation}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${ResultsCss.tabButton} ${activeTab === tab.id ? ResultsCss.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Tab Content */}
                {renderTabContent()}
            </div>

            <Footer />
        </div>
    );
};

export default Results;