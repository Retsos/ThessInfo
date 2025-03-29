import React, { useEffect, useState } from 'react';
import Navbar from '../Navbars/Navbar';
import ResultsCss from './Results.module.css';
import Footer from '../Navbars/Footer';
import Card from '../SmallComponents/Card';
import WaterPic from '../../assets/waterphoto.png';
import RecyclePic from '../../assets/recycle.png';
import api from '../../endpoints/api';
import { IoMdWater } from "react-icons/io";
import { Tooltip } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Results = () => {
    const location = useLocation();
    const [dimosValue, setDimosValue] = useState(null);
    const [dimosLabel, setDimosLabel] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [waterDatalatest, setWaterDatalatest] = useState(null);
    const [waterDatalastyear, setwaterDatalastyear] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('last_month');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const selectedDimosValue = queryParams.get('dimos');
        const selectedDimosLabel = queryParams.get('label');
        setDimosValue(selectedDimosValue);
        setDimosLabel(selectedDimosLabel);
        setExpandedCardId(null);
    }, [location.search]);

    useEffect(() => {
        if (!dimosLabel) return;

        const fetchWaterData = async () => {
            try {
                const responsewatelastmonth = await api.get(
                    `water/api/latest-measurements/?region=${encodeURIComponent(dimosLabel)}`
                );
                const responsewaterlastyear = await api.get(
                    `water/api/group-by-year/?region=${encodeURIComponent(dimosLabel)}`
                );

                setWaterDatalatest(responsewatelastmonth.data[0] || null);
                setwaterDatalastyear(responsewaterlastyear.data[0] || null);

            } catch (error) {
                console.error("Error fetching water data:", error);
                setWaterDatalatest(null);
                setwaterDatalastyear(null);
            }
        };
        fetchWaterData();
    }, [dimosLabel]);

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

    // Διορθωμένα δεδομένα κάρτας με μοναδικά IDs
    const baseCardData = [
        {
            id: 1,
            titleTemplate: 'Ποιότητα Νερού {dimos}',
            description: 'Πληροφορίες για την ποιότητα του νερού στον δήμο.',
            imageUrl: WaterPic,
            getDetails: (data) => {
                if (!data) return "Δεν υπάρχουν ακόμα μετρήσεις";
                const quality = getQualityLevel(data.compliantCount);
                return (
                    <div className={ResultsCss.qualityDisplay}>
                        <div>
                            Οι μετρήσεις πραγματοποιήθηκαν κατά την περίοδο {data.month}/{data.year}, με ποιότητα νερού: 
                        </div>
                        <Tooltip title={quality.tooltip}>
                        {quality.percentage}% <IoMdWater style={{ color: quality.color }} />
                        </Tooltip>
                    </div>
                );
            }
        },
        {
            id: 2,
            titleTemplate: 'Ανακύκλωση στον δήμο {dimos}',
            description: 'Πληροφορίες για τον δήμο.',
            imageUrl: RecyclePic,
            details: "Περισσότερες πληροφορίες σύντομα..."
        },
        {
            id: 3,
            titleTemplate: 'Δείκτης Καθαριότητας {dimos}',
            description: 'Πληροφορίες για τον δήμο.',
            imageUrl: RecyclePic,
            details: "Περισσότερες πληροφορίες σύντομα..."
        },
        {
            id: 4,
            titleTemplate: 'Ποιότητα Αέρα {dimos}',
            description: 'Πληροφορίες για τον δήμο.',
            imageUrl: RecyclePic,
            details: "Περισσότερες πληροφορίες σύντομα..."
        }
    ];

    const getDynamicCardData = () => {
        if (!dimosLabel) return [];

        return baseCardData.map(card => ({
            ...card,
            title: card.titleTemplate.replace('{dimos}', dimosLabel),
            details: card.getDetails ? card.getDetails(waterDatalatest) : card.details
        }));
    };

    const handleExpand = (cardId) => {
        setExpandedCardId(prevId => (prevId === cardId ? null : cardId));
    };

    return (
        <div className={ResultsCss.pageContainer}>
            <Navbar />

            <div className="text-center mt-5">
                <h3>Όλα τα δεδομένα σχετικά με τον Δήμο: {dimosLabel}</h3>
            </div>

            <div className={ResultsCss.CardContainer}>
                {getDynamicCardData().map((card) => (
                    <Card
                        key={card.id}
                        title={card.title}
                        id={card.id}
                        description={card.description}
                        details={card.details}
                        imageUrl={card.imageUrl}
                        expanded={expandedCardId === card.id}
                        onExpand={() => handleExpand(card.id)}
                        waterData={waterDatalatest}
                    />
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default Results;