import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../Navbars/Navbar';
import ResultsCss from './Results.module.css';
import Footer from '../Navbars/Footer';
import api from '../../endpoints/api';
import { IoMdWater } from "react-icons/io";
import { GiRecycle } from "react-icons/gi";
import { MdAir } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import WaterInfo from '../SmallComponents/WaterCharts/waterinfo';
import MonthlyChart from '../SmallComponents/WaterCharts/MonthlyChart';
import YearlyChart from '../SmallComponents/WaterCharts/YearlyChart';
import ConclusionChart from '../SmallComponents/WaterCharts/PieChart';
import RecycleCard from '../SmallComponents/RecycleCharts/recycleinfo';
import RecycleYearly from '../SmallComponents/RecycleCharts/RecycleYearly';
import PersonYearlyChart from '../SmallComponents/RecycleCharts/personyearlychart';
import OtaYearlyChart from '../SmallComponents/RecycleCharts/OtaYearlyChart';
import PersonOTAChart from '../SmallComponents/RecycleCharts/PersonOTAChart';
import AirLatest from '../SmallComponents/AirQualityCharts/airinfo';
import AirYearlyChart from '../SmallComponents/AirQualityCharts/YearlyChart';
import MonthlyStackedBar from '../SmallComponents/AirQualityCharts/MonthlyStackedBar';
import MonthlyComplianceChart from '../SmallComponents/AirQualityCharts/MonthlyComplianceChart';
import LoadingIndicator from '../SmallComponents/loadingcomp';

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


    const [loading, setLoading] = useState(true);

    // Tabs configuration
    const tabs = [
        { id: 'water', label: 'Ποιότητα Νερού', icon: <IoMdWater /> },
        { id: 'recycle', label: 'Ανακύκλωση', icon: <GiRecycle /> },
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
        if (!dimosLabel || !dimosLabel2 || !dimosLabel3) return;

        const fetchAll = async () => {
            setLoading(true);
            // ετοιμάζουμε όλα τα αιτήματα
            const calls = [
                api.get(`airquality/area/${encodeURIComponent(dimosLabel3)}/latest-measurements/`),
                api.get(`airquality/area/${encodeURIComponent(dimosLabel3)}/group-by-year/`),
                api.get(`water/api/latest-measurements/?region=${encodeURIComponent(dimosLabel)}`),
                api.get(`water/api/group-by-year/?region=${encodeURIComponent(dimosLabel)}`),
                api.get(`recycle/recycling-ota/?region=${encodeURIComponent(dimosLabel2)}`),
                api.get(`recycle/recycling-perperson/?region=${encodeURIComponent(dimosLabel2)}&year=24`),
                api.get(`recycle/recycling-good/`)
            ];

            // περιμένουμε όλα να ολοκληρωθούν, είτε με success είτε με failure
            const results = await Promise.allSettled(calls);

            // 0: air latest
            if (results[0].status === 'fulfilled') {
                setAirDataLatest(results[0].value.data);
            } else {
                setAirDataLatest(null);
            }
            // 1: air by year
            if (results[1].status === 'fulfilled') {
                setAirDataYear(results[1].value.data);
            } else {
                setAirDataYear(null);
            }
            // 2: water latest
            if (results[2].status === 'fulfilled') {
                setWaterDataLatest(results[2].value.data);
            } else {
                setWaterDataLatest(null);
            }
            // 3: water by year
            if (results[3].status === 'fulfilled') {
                setWaterDataLastYear(results[3].value.data);
            } else {
                setWaterDataLastYear(null);
            }
            // 4: recycle ota
            if (results[4].status === 'fulfilled') {
                setRecycleDataLatest(results[4].value.data);
            } else {
                setRecycleDataLatest(null);
            }
            // 5: recycle per person
            if (results[5].status === 'fulfilled') {
                setRecycleDataLatest2(results[5].value.data);
            } else {
                setRecycleDataLatest2(null);
            }
            // 6: recycle good (usable general)
            if (results[6].status === 'fulfilled') {
                const allGood = results[6].value.data.results || {};
                // βρίσκουμε το μεγαλύτερο έτος μέσα στο results object
                const yearKeys = Object.keys(allGood).filter(k => /^\d+$/.test(k));
                if (yearKeys.length) {
                    const latestYearKey = yearKeys
                        .map(k => parseInt(k, 10))
                        .sort((a, b) => b - a)[0]
                        .toString();
                    setRecycleUsableGeneral(allGood[latestYearKey]);
                } else {
                    setRecycleUsableGeneral(null);
                }
            } else {
                setRecycleUsableGeneral(null);
            }

            setLoading(false);
        };

        fetchAll();
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
        // console.log("Aeraaaa ola:", AirDataYear);
        // console.log("AERA SINOPTIKA", AirDataLatest);
        //  console.log("ASDADAD", RecycleDataLatestperperson);
        //  console.log(RecycleDataLatest)

    }, [AirDataLatest, AirDataYear, RecycleDataLatestperperson]);


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

    const ENGLISH_MONTH_ORDER = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
    };

    const lastyearRecycle = useMemo(() => {
        if (!RecycleDataLatest) return null;
        const years = Object.keys(RecycleDataLatest.Yearly_Stats);     
        const numericYears = years.map(y => parseInt(y, 10));          
        return Math.max(...numericYears);
    }, [RecycleDataLatest]);



    const lastYearAir = useMemo(() => {
        if (!AirDataYear) return null;

        // 1) find the latest year
        const years = Object.keys(AirDataYear)
            .filter(k => /^\d{4}$/.test(k))
            .map(y => parseInt(y, 10));
        if (!years.length) return null;
        const latestYear = String(Math.max(...years));

        // 2) grab its monthly_averages
        const monthObj = AirDataYear[latestYear].monthly_averages;
        if (!monthObj) return null;

        // 3) sort months by Greek order
        const monthNames = Object.keys(monthObj);
        monthNames.sort((a, b) => ENGLISH_MONTH_ORDER[a] - ENGLISH_MONTH_ORDER[b]);

        // 4) pick the last one
        const latestMonthName = monthNames[monthNames.length - 1];
        const monthNumber = ENGLISH_MONTH_ORDER[latestMonthName];  // τώρα 12 αντί "Δεκ"

        return {
            year: latestYear,
            month: monthNumber,         // αριθμητικό μήνα
            data: monthObj[latestMonthName]
        };
    }, [AirDataYear]);

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

                                    <div className={ResultsCss.SegmentSection}>

                                        <div className={`shadow ${ResultsCss.info}`}>
                                            <WaterInfo waterData={waterDataLatest}></WaterInfo>

                                        </div>

                                        <div className={`shadow ${ResultsCss.info}`}> {/* Panw Deksia */}
                                            <MonthlyChart waterData={waterDataLatest}></MonthlyChart>
                                        </div>

                                        <div className={`shadow ${ResultsCss.info}`}>
                                            <YearlyChart yearlyData={waterDataLastYear} />
                                        </div>

                                        <div className={`shadow ${ResultsCss.info}`}>

                                            <ConclusionChart yearlyData={waterDataLastYear} />
                                        </div>

                                    </div>

                                </div>

                                <p className='text-end pt-5'>Τελευταία μέτρηση: {waterDataLatest.month}/{waterDataLatest.year}</p>
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
                            <div className='pt-5'>
                                <div className={ResultsCss.SegmentSection}>
                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <RecycleCard recycleData={RecycleUsableGeneral}></RecycleCard>
                                    </div>
                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <RecycleYearly recycleData={RecycleUsableGeneral}></RecycleYearly>
                                    </div>
                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <PersonYearlyChart data={RecycleDataLatestperperson}></PersonYearlyChart>
                                    </div>
                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <OtaYearlyChart data={RecycleDataLatest} />
                                    </div>
                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <PersonOTAChart
                                            personData={RecycleDataLatestperperson}
                                            otaData={RecycleDataLatest}
                                        />
                                    </div>

                                </div>
                                <p className='text-end pt-5'>Τελευταία μέτρηση: {RecycleDataLatest.Yearly_Stats[2024].Most_Recent_Month}/{lastyearRecycle}</p>

                            </div>

                        ) : <div className={ResultsCss.comingSoon}>
                            <GiRecycle className={ResultsCss.comingSoonIcon} />
                            <p>Δεν υπάρχουν διαθέσιμα δεδομένα για την ανακύκλωση στον δήμο αυτήν τη στιγμή</p>
                        </div>}
                    </div>
                );

            case 'air':
                return (
                    <div className={ResultsCss.tabContent}>
                        <h3>Ποιότητα Αέρα - {dimosLabel}</h3>
                        {AirDataLatest ? (
                            <div className='pt-5'>
                                <div className={ResultsCss.SegmentSection}>

                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <AirLatest airData={AirDataYear}></AirLatest>
                                    </div>

                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <AirYearlyChart yearlyData={AirDataLatest}></AirYearlyChart>
                                    </div>

                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <MonthlyStackedBar airData={AirDataYear}></MonthlyStackedBar>
                                    </div>

                                    <div className={`shadow ${ResultsCss.info}`}>
                                        <MonthlyComplianceChart airData={AirDataYear}></MonthlyComplianceChart>
                                    </div>


                                </div>
                                <p className='text-end pt-5'>    Τελευταία μέτρηση: {lastYearAir.month}/{lastYearAir.year}</p>
                            </div>
                        ) : <div className={ResultsCss.comingSoon}>
                            <MdAir className={ResultsCss.comingSoonIcon} />
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

                {loading ?

                    <LoadingIndicator /> : <>

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
                    </>}

            </div>

            <Footer />
        </div>
    );
};

export default Results;