import React, { useState, useEffect } from 'react';
import Navbar from '../Navbars/Navbar';
import ServicesCss from './Services.module.css';
import Footer from '../Navbars/Footer';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { FaHandHoldingWater } from "react-icons/fa";
import { FaRecycle } from "react-icons/fa";
import noise from "../../assets/noise.png"; // Corrected import

const Services = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showMinLengthWarning, setShowMinLengthWarning] = useState(false);
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);

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

    const options = [
        {
            value: 'thessaloniki',
            label: 'Άνω Τούμπα',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,

        },
        {
            value: 'kalamaria',
            label: 'Καλαμαριά',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />
        },
        {
            value: 'pylaia-hortiati',
            label: 'Πυλαία-Χορτιάτης',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />
        },
        {
            value: 'neapoli-sykies',
            label: 'Νεάπολη-Συκιές',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />
        },
    ];

    const CustomStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: "12px",
            boxShadow: state.isFocused ? "0 0 8px rgba(0, 128, 0, 0.3)" : "none",
            borderColor: state.isFocused ? "#4CAF50" : "#ccc",
            width: "100%",
            "&:hover": {
                borderColor: "#4CAF50"
            },
            padding: "4px 8px",
            transition: "all 0.3s ease-in-out"
        }),

        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "#ffffff" : "#333",
            backgroundColor: state.isSelected ? "#1e8449" : state.isFocused ? "#f4f4f4" : "#ffffff",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            "&:hover": state.isSelected ? {} : { backgroundColor: "#e8f5e9" },
            transition: "background-color 0.2s ease-in-out"
        }),

        singleValue: (provided) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }),

        menu: (provided) => ({
            ...provided,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            overflow: "hidden"
        })
    };
    //gia icon3 edw panw SOS
    const formatOptionLabel = ({ label, icon, icon2, icon3 }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }}>
            <span>{label}</span>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 'auto',
                paddingRight: '12px',
                gap: '8px'
            }}>
                <div title="Δεδομένα νερού">{icon}</div>
                <div title="Δεδομένα ανακύκλωσης">{icon2}</div>
                {icon3 && <div title="Δεδομένα θορύβου">{icon3}</div>}
            </div>
        </div>
    );

    const handleChange = (selected) => {
        setSelectedOption(selected);
        setShowMinLengthWarning(false);
    };

    // In Services.js, modify the handleSearchSubmit function
    const handleSearchSubmit = () => {
        if (!selectedOption || selectedOption.label.trim().length < 3) {
            setShowMinLengthWarning(true);
            return;
        }
        // Pass both value and label as query parameters
        navigate(`/Results?dimos=${encodeURIComponent(selectedOption.value)}&label=${encodeURIComponent(selectedOption.label)}`);
        setSelectedOption(null);
    };

    return (
        <>
            <div className={ServicesCss.pageContainer}>
                <div className={`${ServicesCss.FullContainer} ${isSticky ? ServicesCss.sticky : ''}`}   >
                    <Navbar></Navbar>
                </div>
                <div className={ServicesCss.wrapper}>
                    <h1 className={ServicesCss.title}>Αναζήτησε Πληροφορίες για την Περιοχή σου</h1>
                    <div className={ServicesCss.selectContainer}>
                        <Select
                            options={options}
                            styles={CustomStyles}
                            formatOptionLabel={formatOptionLabel}
                            isClearable
                            placeholder="Αναζήτηση Δήμου/Περιοχής"
                            value={selectedOption}
                            onChange={handleChange}
                        />
                        {showMinLengthWarning && (
                            <div style={{ color: "rgba(211, 46, 46, 0.88)", marginTop: "5px" }}>
                                Επιλέξτε τουλάχιστον 3 χαρακτήρες.
                            </div>
                        )}
                        <button
                            className={ServicesCss.searchButton}
                            type="button"
                            onClick={handleSearchSubmit}
                        >
                            Αναζήτηση
                        </button>
                    </div>
                </div>

                <Footer></Footer>
            </div>
        </>
    );
};

export default Services;
