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
                )
                setWaterDatalatest(responsewatelastmonth.data[0]);
                setwaterDatalastyear(responsewaterlastyear.data[0]);
                console.log(responsewaterlastyear);

            } catch (error) {
                console.error("Error fetching water data:", error);
            }
        };
        fetchWaterData();
    }, [dimosLabel]);

    const getQualityLevel = (compliantCount) => {
        if (!compliantCount) return "Άγνωστη";

        const parts = String(compliantCount).split(" of ");
        if (parts.length !== 2) return "Άγνωστη";

        const compliant = Number(parts[0]);
        const total = Number(parts[1]);
        if (!total) return "Άγνωστη";

        const percentage = (compliant / total) * 100;

        if (percentage >= 90) return `Εξαιρετική με ποσοστό: ${percentage.toFixed(2)}%`;
        if (percentage >= 75) return `Καλή με ποσοστό: ${percentage.toFixed(2)}%`;
        if (percentage >= 50) return `Μέτρια με ποσοστό: ${percentage.toFixed(2)}%`;

        return `Κακή με ποσοστό: ${percentage.toFixed(2)}%`;
    };

    // Βασικά δεδομένα που είναι κοινά για όλους τους δήμους
    const baseCardData = [
        {
            id: 1,
            titleTemplate: 'Ποιότητα Νερού {dimos}',
            description: 'Πληροφορίες για την ποιότητα του νερού στον δήμο.',
            imageUrl: WaterPic,
            getDetails: (data) =>
                data ? `Οι μετρήσεις έγιναν ${data.month}/${data.year} με ποιότητα νερού "${getQualityLevel(data.compliantCount)}"`
                    : "Δεν υπαρχοθν ακομα μετρησεισ"
        },
        {
            id: 2,
            titleTemplate: 'Anakiklosh ston dhmo {dimos}',
            description: 'Πληροφορίες για τον δήμο.',
            imageUrl: RecyclePic,
            details: "Περισσότερες πληροφορίες σύντομα..."
        },
        {
            id: 2,
            titleTemplate: 'Anakiklosh ston dhmo {dimos}',
            description: 'Πληροφορίες για τον δήμο.',
            imageUrl: RecyclePic,
            details: "Περισσότερες πληροφορίες σύντομα..."
        },
        {
            id: 2,
            titleTemplate: 'Anakiklosh ston dhmo {dimos}',
            description: 'Πληροφορίες για τον δήμο.',
            imageUrl: RecyclePic,
            details: "Περισσότερες πληροφορίες σύντομα..."
        }
    ];

    // Δημιουργία δυναμικών card data βασισμένο στον επιλεγμένο δήμο
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