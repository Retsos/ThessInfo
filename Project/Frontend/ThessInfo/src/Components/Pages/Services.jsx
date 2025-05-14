import React, { useState, useEffect,useMemo } from 'react';
import Navbar from '../Navbars/Navbar';
import ServicesCss from './Services.module.css';
import Footer from '../Navbars/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { FaHandHoldingWater } from "react-icons/fa";
import { FaRecycle } from "react-icons/fa";
import noise from "../../assets/noise.png";
import Select, { components } from 'react-select';
import { MdAir, MdCleanHands } from "react-icons/md";

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

    const rawOptions = [
        {
            value: '40 Εκκλησιές',
            label: '40 Εκκλησιές',
            RecycleName: '',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Ανάληψη',
            label: 'Ανάληψη',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },

        {
            value: 'thessaloniki',//???????????
            label: 'Άνω Τούμπα',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'ΔΕΘ-ΧΑΝΘ',
            label: 'ΔΕΘ-ΧΑΝΘ',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Κάτω Τούμπα',
            label: 'Κάτω Τούμπα',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Κέντρο πόλης',
            label: 'Κέντρο πόλης',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Κωνσταντινουπολίτικα',
            label: 'Κωνσταντινουπολίτικα',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Νέα Παραλία',
            label: 'Νέα Παραλία',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Ντεπώ',
            label: 'Ντεπώ',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Παναγία Φανερωμένη',
            label: 'Παναγία Φανερωμένη',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'ΘΕΡΜΑΪΚΟΣ',
            label: 'ΘΕΡΜΑΪΚΟΣ',
            RecycleName: 'ΘΕΡΜΑΪΚΟΣ',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Θέρμη',
            label: 'Θέρμη',
            RecycleName: 'ΘΕΡΜΗ',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Σχολή Τυφλών',
            label: 'Σχολή Τυφλών',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'kalamaria',
            label: 'Καλαμαριά',
            RecycleName: 'ΚΑΛΑΜΑΡΙΑ',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης"
        },
        {
            value: 'Πλατεία Δημοκρατίας',
            label: 'Πλατεία Δημοκρατίας',
            RecycleName: 'a',
            airName: 'Pulaia',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης"
        },
        {
            value: 'Πυλαία',
            label: 'Πυλαία',
            RecycleName: 'ΠΥΛΑΙΑ-ΧΟΡΤΙΑΤΗΣ',
            airName: 'Pulaia',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης"
        },
        {
            value: 'Πυλαία (ΙΚΕΑ)',
            label: 'Πυλαία (ΙΚΕΑ)',
            RecycleName: 'ΠΥΛΑΙΑ-ΧΟΡΤΙΑΤΗΣ',
            airName: 'Pulaia',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης"
        },
        {
            value: 'neapoli-sykies',
            label: 'Νεάπολη-Συκιές',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης"
        },
        {
            value: 'Σφαγεία',
            label: 'Σφαγεία',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Τριανδρία',
            label: 'Τριανδρία',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Ξηροκρήνη',
            label: 'Ξηροκρήνη',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <img src={noise} alt="Noise" className={ServicesCss.noiseIcon} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα θορύβου"
        },
        {
            value: 'Χαριλάου',
            label: 'Χαριλάου',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης"
        },
    ];

    // 2) useMemo για αλφαβητική ταξινόμηση ανά label
    const options = useMemo(
        () => [...rawOptions].sort((a, b) =>
            a.label.localeCompare(b.label, 'el', { sensitivity: 'base' })
        ),
        [rawOptions]
    );

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
            pointerEvents: 'auto',
            transition: "all 0.3s ease-in-out"
        }),

        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "#ffffff" : "#333",
            backgroundColor: state.isSelected ? "#1e8449" : state.isFocused ? "#f4f4f4" : "#ffffff",
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'auto',
            justifyContent: 'space-between',
            padding: '8px 16px',
            "&:hover": state.isSelected ? {} : { backgroundColor: "#e8f5e9" },
            transition: "background-color 0.2s ease-in-out"
        }),

        valueContainer: (provided) => ({
            ...provided,
            pointerEvents: 'all'
        }),

        singleValue: (provided) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            pointerEvents: 'auto',
        }),

        menu: (provided) => ({
            ...provided,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            overflow: "hidden",
            pointerEvents: 'auto',
        })
    };

    const formatOptionLabel = ({ label, icon, icon2, icon3, tooltip1, tooltip2, tooltip3 }) => {
        // Common style for the tooltip containers
        const iconContainerStyle = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '4px',
            position: 'relative',
            cursor: 'help'
        };

        return (
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
                }}>
                    {icon && (
                        <div
                            className={ServicesCss.tooltipContainer}
                            style={iconContainerStyle}
                            title={tooltip1}
                        >
                            {icon}
                        </div>
                    )}
                    {icon2 && (
                        <div
                            className={ServicesCss.tooltipContainer}
                            style={iconContainerStyle}
                            title={tooltip2}
                        >
                            {icon2}
                        </div>
                    )}
                    {icon3 && (
                        <div
                            className={ServicesCss.tooltipContainer}
                            style={iconContainerStyle}
                            title={tooltip3}
                        >
                            {icon3}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const CustomSingleValue = props => {
        return (
            <components.SingleValue
                {...props}
                innerProps={{
                    ...props.innerProps,
                    style: {
                        ...(props.innerProps?.style || {}),
                        pointerEvents: 'auto'
                    }
                }}
            >
                {formatOptionLabel(props.data)}
            </components.SingleValue>
        );
    };

    const CustomOption = props => {
        return (
            <components.Option {...props}>
                {formatOptionLabel(props.data)}
            </components.Option>
        );
    };

    const handleChange = opt => setSelectedOption(opt);

    const handleSearchSubmit = () => {
        if (!selectedOption || selectedOption.label.trim().length < 3) {
            setShowMinLengthWarning(true);
            return;
        }
        // Pass both value and label as query parameters
        navigate(`/Results?dimos=${encodeURIComponent(selectedOption.value)}&label=${encodeURIComponent(selectedOption.label)}&Recycle=${encodeURIComponent(selectedOption.RecycleName)}&Air=${encodeURIComponent(selectedOption.airName)}`);
        setSelectedOption(null);
    };

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
                        <Select
                            options={options}
                            styles={CustomStyles}
                            components={{
                                SingleValue: CustomSingleValue,
                                Option: CustomOption
                            }}
                            isClearable
                            placeholder="Αναζήτηση Δήμου/Περιοχής"
                            value={selectedOption}
                            onChange={handleChange}
                        />
                        {showMinLengthWarning && (
                            <div style={{ color: "rgba(211, 46, 46, 0.88)", marginTop: "5px" }}>
                                Επιλέξτε τουλάχιστον 1.
                            </div>
                        )}
                        <button
                            className={ServicesCss.searchButton}
                            type="button"
                            onClick={handleSearchSubmit}
                        >
                            Αναζήτηση
                        </button>
                        <p className={ServicesCss.hint}>
                            Δεν βρίσκεις τον δήμο σου; Δες τον <Link to="/ArrayMapSection">οδηγό περιοχών</Link>.
                        </p>

                    </div>

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
                            <MdCleanHands color="#f39c12" size={32} />
                            <h4>Καθαριότητα</h4>
                            <p>Δείκτες καθαριότητας σε δημόσιους χώρους.</p>
                        </div>
                        <div className={ServicesCss.card}>
                            <MdAir color="#5dade2" size={32} />
                            <h4>Ποιότητα Αέρα</h4>
                            <p>PM2.5, CO, NO₂ κ.ά. ανά ζώνη.</p>
                        </div>
                    </div>


                </div>

                <Footer></Footer>
            </div>
        </>
    );
};

export default Services;