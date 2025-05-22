import React, { useState, useMemo } from 'react';
import Styles from './SelectRegion.module.css';
import { useNavigate } from 'react-router-dom';
import { FaHandHoldingWater } from "react-icons/fa";
import { FaRecycle } from "react-icons/fa";
import Select, { components } from 'react-select';
import { MdAir, } from "react-icons/md";

const SelectRegion = () => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [showMinLengthWarning, setShowMinLengthWarning] = useState(false);
    const navigate = useNavigate();
    const rawOptions = [
        {
            value: '40 Εκκλησιές',
            label: '40 Εκκλησιές',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Ανάληψη',
            label: 'Ανάληψη',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Αμπελόκηποι',
            label: 'Αμπελόκηποι',
            RecycleName: 'Αμπελόκηποι',
            airName: 'Ampelokipoi',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Δήμος Χαλκιδόνος',
            label: 'Δήμος Χαλκιδόνος',
            RecycleName: 'Chalkidonos',
            airName: 'Chalkidonos',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Δήμος Δέλτα',
            label: 'Δήμος Δέλτα',
            RecycleName: 'Delta',
            airName: 'Delta',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'thessaloniki',//???????????
            label: 'Άνω Τούμπα',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'ΔΕΘ-ΧΑΝΘ',
            label: 'ΔΕΘ-ΧΑΝΘ',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Κάτω Τούμπα',
            label: 'Κάτω Τούμπα',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Κέντρο πόλης',
            label: 'Κέντρο πόλης',
            RecycleName: 'a',
            airName: 'Thessaloniki',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Κέντρο Βόλβης',
            label: 'Δήμος Βόλβης',
            RecycleName: 'a',
            airName: 'Volvi',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Κωνσταντινουπολίτικα',
            label: 'Κωνσταντινουπολίτικα',
            RecycleName: 'kwnst',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Νέα Παραλία',
            label: 'Νέα Παραλία',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Ντεπώ',
            label: 'Ντεπώ',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Παναγία Φανερωμένη',
            label: 'Παναγία Φανερωμένη',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'ΘΕΡΜΑΪΚΟΣ',
            label: 'ΘΕΡΜΑΪΚΟΣ',
            RecycleName: 'ΘΕΡΜΑΪΚΟΣ',
            airName: 'Thermaikos',
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Θέρμη',
            label: 'Θέρμη',
            RecycleName: 'ΘΕΡΜΗ',
            airName: 'Thermi',
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Σχολή Τυφλών',
            label: 'Σχολή Τυφλών',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'kalamaria',
            label: 'Καλαμαριά',
            RecycleName: 'ΚΑΛΑΜΑΡΙΑ',
            airName: 'Kalamaria',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Oraiokastro',
            label: 'Ωραιόκαστρο',
            RecycleName: 'Ωραιόκαστρο',
            airName: 'Oraiokastro',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Κορδελιό',
            label: 'Κορδελιό',
            RecycleName: 'Κορδελιό',
            airName: 'Kordelio',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Λαγκαδάς',
            label: 'Λαγκαδάς',
            RecycleName: 'Λαγκαδάς',
            airName: 'Lagkadas',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Παύλου Μελά',
            label: 'Παύλου Μελά',
            RecycleName: 'Pavlou_Mela',
            airName: 'Lagkadas',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Πλατεία Δημοκρατίας',
            label: 'Πλατεία Δημοκρατίας',
            RecycleName: 'a',
            airName: 'Pulaia',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Πυλαία',
            label: 'Πυλαία',
            RecycleName: 'ΠΥΛΑΙΑ-ΧΟΡΤΙΑΤΗΣ',
            airName: 'Pulaia',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Πυλαία (ΙΚΕΑ)',
            label: 'Πυλαία (ΙΚΕΑ)',
            RecycleName: 'ΠΥΛΑΙΑ-ΧΟΡΤΙΑΤΗΣ',
            airName: 'Pulaia',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            icon2: <FaRecycle style={{ color: '#4CAF50', fontSize: '1.2rem', marginLeft: '8px' }} />,
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip1: "Δεδομένα νερού",
            tooltip2: "Δεδομένα ανακύκλωσης",
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'neapoli-sykies',
            label: 'Νεάπολη-Συκιές',
            RecycleName: 'a',
            airName: 'Neapoli',
            icon3: <MdAir style={{ color: '#2992a2', fontSize: '1.2rem', marginLeft: '8px' }} />,
            tooltip3: "Δεδομένα αέρα"
        },
        {
            value: 'Σφαγεία',
            label: 'Σφαγεία',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Τριανδρία',
            label: 'Τριανδρία',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Ξηροκρήνη',
            label: 'Ξηροκρήνη',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
        },
        {
            value: 'Χαριλάου',
            label: 'Χαριλάου',
            RecycleName: 'a',
            airName: 'a',
            icon: <FaHandHoldingWater style={{ color: '#2196F3', fontSize: '1.2rem' }} />,
            tooltip1: "Δεδομένα νερού",
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
                            className={Styles.tooltipContainer}
                            style={iconContainerStyle}
                            title={tooltip1}
                        >
                            {icon}
                        </div>
                    )}
                    {icon2 && (
                        <div
                            className={Styles.tooltipContainer}
                            style={iconContainerStyle}
                            title={tooltip2}
                        >
                            {icon2}
                        </div>
                    )}
                    {icon3 && (
                        <div
                            className={Styles.tooltipContainer}
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
                className={Styles.searchButton}
                type="button"
                onClick={handleSearchSubmit}
            >
                Αναζήτηση
            </button>
        </>
    )
}

export default SelectRegion