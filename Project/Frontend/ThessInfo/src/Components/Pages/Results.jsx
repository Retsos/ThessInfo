import React, { useEffect, useState,useMemo } from 'react';
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
                setWaterDataLatest(null);
                setWaterDataLastYear(null);
            }
        };

        const fetchRecycleData = async () => {
            try {
                const [responseRecycleLastMonth, responseRecycleLastMonthperrerson, responseUsableRecycle] = await Promise.all([
                    api.get(`recycle/recycling-ota/?region=${encodeURIComponent(dimosLabel2)}`),
                    api.get(`recycle/recycling-perperson/?region=${encodeURIComponent(dimosLabel2)}&year=24`),
                    api.get(`recycle/recycling-good/`),
                ]);
                setRecycleDataLatest(responseRecycleLastMonth.data);
                setRecycleDataLatest2(responseRecycleLastMonthperrerson.data);
                setRecycleUsableGeneral(responseUsableRecycle.data.results["24"]); //ΘΕΛΟΥΜΕ ΚΑΙ 23?????? ΥΠΑΡΧΕΙ!!!    NAI YPARXEI 

            } catch (error) {
                // console.error("Error fetching recycle data:", error);
            }

        };

        const fetchAirData = async () => {
            try {
                const [responseAirLastMonth, responseAirYear] = await Promise.all([
                    api.get(`airquality/area/${encodeURIComponent(dimosLabel3)}/latest-measurements/`),
                    api.get(`airquality/area/${encodeURIComponent(dimosLabel3)}/group-by-year/`),
                ]);

                setAirDataLatest(responseAirLastMonth.data);
                setAirDataYear(responseAirYear.data);

            } catch (error) {
                //  console.error("Error fetching recycle data:", error);
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
        console.log("Aeraaaa ola:", AirDataYear);
        console.log("AERA SINOPTIKA", AirDataLatest);
         console.log("ASDADAD", RecycleDataLatestperperson);
         console.log(RecycleDataLatest)



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

    const latestYear = useMemo(() => {
        if (!waterDataLastYear) return null;
        const ks = Object.keys(waterDataLastYear)
            .filter(k => /^\d{4}$/.test(k))
            .map(Number);
        return ks.length ? String(Math.max(...ks)) : null;
    }, [waterDataLastYear]);

    const lastyearRecycle = useMemo(()=>{
        if (!RecycleDataLatest) return null;
        const years = Object.keys(RecycleDataLatest.Yearly_Stats);       // ['2023','2024']
        const numericYears = years.map(y => parseInt(y, 10));          // [2023, 2024]
        return  Math.max(...numericYears); 
    },[RecycleDataLatest]);

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

                                        <div className={`shadow ${ResultsCss.info}`}>
                                            <p className={ResultsCss.infoTitle}>Λεπτομέρειες</p>
                                            <WaterInfo waterData={waterDataLatest}></WaterInfo>
                                        </div>

                                        <div className={`shadow ${ResultsCss.info}`}> {/* Panw Deksia */}
                                            <p className={ResultsCss.infoTitle}>{waterDataLatest.latest_data[0]?.Month || ''}</p>
                                            <MonthlyChart waterData={waterDataLatest}></MonthlyChart>
                                        </div>

                                        <div className={`shadow ${ResultsCss.info}`}>
                                            <p className={ResultsCss.infoTitle}>Εξέλιξη Παραμέτρων ανά Έτος</p>
                                            <YearlyChart yearlyData={waterDataLastYear} />
                                        </div>

                                        <div className={`shadow ${ResultsCss.info}`}>
                                            <p className={ResultsCss.infoTitle}>Εξέλιξη Παραμέτρων {latestYear}</p>

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
                                    {/* Posa skoupidia phgan sto kentro dialogis ton teleutaio mhna
                                    <br />
                                    {RecycleDataLatest.Yearly_Stats[2024].Value_for_the_Most_Recent_Month}

                                    <br />
                                    o mesos oros mexri ton teleutaio mhna = {RecycleDataLatest.Yearly_Stats[2024].Average_RECYCLING_for_year}
                                    <br />
                                    <div>
                                        Posa skoupidia phgan sto kentro dialogis ton teleutaio mhna apo kathe katoiko
                                    </div>
                                    {RecycleDataLatestperperson.Yearly_Stats[2024].Average_RECYCLING_per_person_year}
                                    <br />
                                    pios einai o teleutaios mhnas = {RecycleDataLatestperperson.Yearly_Stats[2024].Most_Recent_Month}
                                    <br />

                                    {/* WORKS{console.log("what is this shit",RecycleDataLatestperperson)} */}

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
                            <IoMdWater className={ResultsCss.comingSoonIcon} />
                            <p>Δεν υπάρχουν διαθέσιμα δεδομένα για την ποιότητα νερού στον δήμο αυτήν τη στιγμή</p>
                        </div>}
                    </div>
                );

            case 'air':
                return (
                    <div className={ResultsCss.tabContent}>
                        <h3>Ποιότητα Αέρα - {dimosLabel}</h3>
                        {AirDataLatest ? (
                            <div>
                                SYNOPTIKA TOU XRONOU ME MO {AirDataLatest[2024].averages.no2_conc}
                                <br />
                                ANALITIKA GIA KATHE MHNA  {AirDataYear[2023].monthly_averages.April.averages.no2_conc}
                                <br />
                                POLI KALO PARA POLU {AirDataYear[2024].monthly_averages.April.compliant_count}
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