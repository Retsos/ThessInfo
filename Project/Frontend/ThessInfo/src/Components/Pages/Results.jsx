import React, { useEffect, useState } from 'react';
import Navbar from '../Navbars/Navbar';
import ResultsCss from './Results.module.css';
import Footer from '../Navbars/Footer';
import api from '../../endpoints/api';
import { IoMdWater } from "react-icons/io";
import { GiRecycle } from "react-icons/gi";
import { MdAir, MdCleanHands } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import WaterInfo from '../SmallComponents/waterinfo';
import MonthlyChart from '../SmallComponents/WaterCharts/MonthlyChart';
import YearlyChart from '../SmallComponents/WaterCharts/YearlyChart';
import ConclusionChart from '../SmallComponents/WaterCharts/PieChart';

const Results = () => {
    const location = useLocation();
    const [dimosValue, setDimosValue] = useState(null);
    const [dimosLabel, setDimosLabel] = useState(null);
    const [dimosLabel2, setDimosLabel2] = useState(null);
    const [dimosLabel3, setDimosLabel3] = useState(null);


    const [waterDataLatest, setWaterDataLatest] = useState(null);
    const [waterDataLastYear, setWaterDataLastYear] = useState(null);

    const [RecycleDataLatest, setRecycleDataLatest] = useState(null);
    const [RecycleDataLatestperperson, setRecycleDataLatest2] = useState(null);
    const [RecycleUsableGeneral, setRecycleUsableGeneral] = useState(null);

    const [AirDataLatest, setAirDataLatest] = useState(null);
    const [AirDataYear, setAirDataYear] = useState(null);

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
        const selectedDimosLabel2 = queryParams.get('Recycle');
        const selectedDimosLabel3 = queryParams.get('Air');

        setDimosLabel3(selectedDimosLabel3);
        setDimosLabel2(selectedDimosLabel2);
        setDimosValue(selectedDimosValue);
        setDimosLabel(selectedDimosLabel);
    }, [location.search]);


    useEffect(() => {
        if (!dimosLabel || !dimosLabel2) return;

        const fetchWaterData = async () => {
            try {
                const [responseWaterLastMonth, responseWaterLastYear] = await Promise.all([
                    api.get(`water/api/latest-measurements/?region=${encodeURIComponent(dimosLabel)}`),
                    api.get(`water/api/group-by-year/?region=${encodeURIComponent(dimosLabel)}`)
                ]);
                setWaterDataLastYear(responseWaterLastYear.data || {});
                setWaterDataLatest(responseWaterLastMonth.data || null);
            } catch (error) {
                console.error("Error fetching water data:", error);
                setWaterDataLatest(null);
                setWaterDataLastYear(null);
            }
        };

        const fetchRecycleData = async () => {
            try {
                const [responseRecycleLastMonth, responseRecycleLastMonthperrerson, responseUsableRecycle] = await Promise.all([
                    api.get(`recycle/recycling/?region=${encodeURIComponent(dimosLabel2)}&year=24`),
                    api.get(`recycle/recycling2/?region=${encodeURIComponent(dimosLabel2)}&year=24`),
                    api.get(`recycle/recycling-good/`),
                ]);
                setRecycleDataLatest(responseRecycleLastMonth.data);
                setRecycleDataLatest2(responseRecycleLastMonthperrerson.data);
                console.log(responseUsableRecycle);

                setRecycleUsableGeneral(responseUsableRecycle.data.results["24"]);
            } catch (error) {
                console.error("Error fetching recycle data:", error);
            }
        };

        const fetchAirData = async () => {
            try {
                const [responseAirLastMonth, responseAirYear] = await Promise.all([
                    api.get(`airquality/area/${encodeURIComponent(dimosLabel3)}/latest-measurements/`),
                    api.get(`airquality/area/${encodeURIComponent(dimosLabel3)}/group-by-year/`),
                ]);

                console.log("Air" + dimosLabel3, responseAirLastMonth, responseAirYear);

                setAirDataLatest(responseAirLastMonth.data);
                setAirDataYear(responseAirYear.data);

            } catch (error) {
                console.error("Error fetching recycle data:", error);
            }
        };

        fetchAirData();
        fetchWaterData();
        fetchRecycleData();

    }, [dimosLabel, dimosLabel2, dimosLabel3]);


    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsSticky(scrollPosition > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        console.log("Updated Water Data Last Year:", waterDataLastYear);
        console.log("recycleeeee:", RecycleUsableGeneral);

    }, [waterDataLastYear, RecycleDataLatest]);


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
                                    
                                    {/* Olo to segment */}
                                    <div className={ResultsCss.SegmentSection}> 

                                        <div className={ResultsCss.waterinfo}> {/* Panw Aristera */}
                                            <p className={ResultsCss.waterinfoTitle}>Λεπτομέρειες</p>
                                            <WaterInfo waterData={waterDataLatest}></WaterInfo>
                                        </div>

                                        <div className={ResultsCss.waterinfo}> {/* Panw Deksia */}
                                            <p className={ResultsCss.waterinfoTitle}>{ waterDataLatest.latest_data[0]?.Month || '' }</p>
                                            <MonthlyChart waterData={waterDataLatest}></MonthlyChart>
                                        </div>   

                                        <div className={ResultsCss.waterinfo}>
                                        <p className={ResultsCss.waterinfoTitle}>Εξέλιξη Παραμέτρων ανά Έτος</p>
                                        <YearlyChart yearlyData={waterDataLastYear} />
                                        </div>

                                        <div className={ResultsCss.waterinfo}>
                                            <ConclusionChart yearlyData={waterDataLastYear} />
                                        </div>

                                    </div>

                                </div>        
                                
                                <p className='text-end' style={{backgroundColor: "Red"}}>Τελευταία μέτρηση: {waterDataLatest.month}/{waterDataLatest.year}</p>
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
                        {RecycleDataLatest ? (
                            <div>
                                {RecycleDataLatest.TYPE}
                                {RecycleDataLatest.Value_for_the_Most_Recent_Month}
                                <div>
                                    {RecycleDataLatestperperson.TYPE}
                                </div>
                                <div>
                                    {RecycleUsableGeneral.Ανακυκλώσιμα}
                                    {RecycleUsableGeneral["Ανάκτηση Ογκωδών"]}


                                </div>
                            </div>


                        ) : <div className={ResultsCss.comingSoon}>
                            <IoMdWater className={ResultsCss.comingSoonIcon} />
                            <p>Δεν υπάρχουν διαθέσιμα δεδομένα για την ποιότητα νερού στον δήμο αυτήν τη στιγμή</p>
                        </div>}
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
                        {AirDataLatest ? (
                            <div>
                                {AirDataLatest.area}

                                <div>
                                    {AirDataLatest.averages.co_conc}
                                </div>
                                <div>
                                    {AirDataYear.monthly_averages.April.co_conc}
                                </div>
                            </div>


                        ) : <div className={ResultsCss.comingSoon}>
                            <IoMdWater className={ResultsCss.comingSoonIcon} />
                            <p>Δεν υπάρχουν διαθέσιμα δεδομένα για την ποιότητα νερού στον δήμο αυτήν τη στιγμή</p>
                        </div>}
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