import React, { useEffect, useState } from 'react';
import Navbar from '../Navbars/Navbar';
import ResultsCss from './Results.module.css';
import Footer from '../Navbars/Footer';
import Card from '../SmallComponents/Card';
import WaterPic from '../../assets/waterphoto.png';
import RecyclePic from '../../assets/recycle.png';
import api from '../../endpoints/api';



import { useLocation } from 'react-router-dom';

const Results = () => {
    const location = useLocation();
    const [dimosValue, setDimosValue] = useState(null);
    const [dimosLabel, setDimosLabel] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [waterDatalatest, setWaterDatalatest] = useState([]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const selectedDimosValue = queryParams.get('dimos');
        const selectedDimosLabel = queryParams.get('label');
        setDimosValue(selectedDimosValue);
        setDimosLabel(selectedDimosLabel);
        setExpandedCardId(null);
    }, [location.search]);

    useEffect(() => {
        if (!dimosLabel) return; // Δεν εκτελείται εάν δεν υπάρχει dimosLabel

        const fetchWaterData = async () => {
            try {
                console.log("dimosLabel:", dimosLabel);
                const responsewateryearly = await api.get(`water/api/group-by-year/?region=${encodeURIComponent(dimosLabel)}`);
                console.log("Response:", responsewateryearly.data);
                const responsewatelastmonth = await api.get(`water/api/latest-measurements/?region=${encodeURIComponent(dimosLabel)}`);
                setWaterDatalatest(responsewatelastmonth.data[0]);
                console.log("Response:", responsewatelastmonth.data[0]
                );
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchWaterData();
    }, [dimosLabel]);


    // Συνάρτηση για υπολογισμό της ποιότητας βάσει του compliantCount (π.χ. "5 of 6")
    const getQualityLevel = (compliantCount) => {
        // Ελέγχουμε αν δεν είναι string και προσπαθούμε να το μετατρέψουμε
        if (typeof compliantCount !== "string") {
            compliantCount = String(compliantCount);
        }
    
        // Τώρα συνεχίζουμε κανονικά
        const parts = compliantCount.split(" of ");
        if (parts.length !== 2) return "Unknown";
        const compliant = Number(parts[0]);
        const total = Number(parts[1]);
        if (!total) return "Unknown";
    
        const percentage = (compliant / total) * 100;
        if (percentage >= 90) return "Excellent";
        else if (percentage >= 75) return "Good";
        else if (percentage >= 50) return "Average";
        return "Poor";
    };

    const cardData = {
        
        thessaloniki: [
            {
                id: 1,
                title: 'Ποιότητα Νερού Θεσσαλονίκης',
                description:
                    'Πληροφορίες για την ποιότητα του νερού στην Θεσσαλονίκη.',
                imageUrl: WaterPic,
                details: "Oi metriseis eginan "+waterDatalatest.month+"/"+waterDatalatest.year+ "me poiothta nerou "+getQualityLevel(waterDatalatest.compliantCount)+"  jilo katalaves tvra kidooo",
                analysis: waterDatalatest,
            },
            {
                id: 2,
                title: 'Δήμος Θεσσαλονίκης',
                description: 'Πληροφορίες για τον Δήμο Θεσσαλονίκης.',
                imageUrl: RecyclePic
            },
        ],
        kalamaria: [
            {
                id: 1,
                title: 'Ποιότητα Νερού Καλαμαριάς',
                description: 'Πληροφορίες για την ποιότητα του νερού στην Καλαμαριά.',
                imageUrl: WaterPic,
            },
            {

                id: 2,
                title: 'Δήμος Καλαμαριάς',
                description: 'Πληροφορίες για τον Δήμο Καλαμαριάς.',
                imageUrl: RecyclePic

            },
        ],
        'pylaia-hortiati': [
            {
                id: 1,
                title: 'Ποιότητα Νερού Πυλαίας-Χορτιάτη',
                description:
                    'Πληροφορίες για την ποιότητα του νερού στην Πυλαία-Χορτιάτη.',
                imageUrl: WaterPic,
            },
            {
                id: 2,
                title: 'Δήμος Πυλαίας-Χορτιάτη',
                description: 'Πληροφορίες για τον Δήμο Πυλαίας-Χορτιάτη.',
                imageUrl: RecyclePic

            },
        ],
        'neapoli-sykies': [
            {
                id: 1,
                title: 'Ποιότητα Νερού Νεάπολης-Συκεών',
                description:
                    'Πληροφορίες για την ποιότητα του νερού στην Νεάπολη-Συκιές.',
                imageUrl: WaterPic,
            },
            {
                id: 2,
                title: 'Δήμος Νεάπολης-Συκεών',
                description: 'Πληροφορίες για τον Δήμο Νεάπολης-Συκεών.',
                imageUrl: RecyclePic
            },
        ],
    };




    const handleExpand = (cardId) => {
        setExpandedCardId((prevId) => (prevId === cardId ? null : cardId));
    };

    return (
        <div className={ResultsCss.pageContainer}>
            <Navbar />

            <div className="text-center mt-5">
                <h3>Όλα τα δεδομένα σχετικά με τον Δήμο: {dimosLabel}</h3>
            </div>

            <div className={ResultsCss.CardContainer}>
                {dimosValue && cardData[dimosValue].map((card) => (
                    <Card
                        key={card.id}
                        title={card.title}
                        description={card.description}
                        details={card.details}
                        imageUrl={card.imageUrl}
                        expanded={expandedCardId === card.id}
                        onExpand={() => handleExpand(card.id)}
                        waterData={waterDatalatest}
                    />
                    
                ))
                }
                
            </div>

            <Footer />
        </div>
    );
};

export default Results;
