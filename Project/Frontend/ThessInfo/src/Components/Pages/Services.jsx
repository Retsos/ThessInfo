import React, { useState } from 'react';
import Navbar from '../Navbars/Navbar';
import ServicesCss from './Services.module.css';
import Footer from '../Navbars/Footer';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showMinLengthWarning, setShowMinLengthWarning] = useState(false);
    const navigate = useNavigate();

    const options = [
        { value: 'thessaloniki', label: 'Άνω Τούμπα' },
        { value: 'kalamaria', label: 'Καλαμαριά' },
        { value: 'pylaia-hortiati', label: 'Πυλαία-Χορτιάτης' },
        { value: 'neapoli-sykies', label: 'Νεάπολη-Συκιές' },
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
            "&:hover": state.isSelected
                ? {}
                : {
                    backgroundColor: "#e8f5e9"
                },
            transition: "background-color 0.2s ease-in-out"
        }),

        menu: (provided) => ({
            ...provided,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            overflow: "hidden"
        })
    };

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
                <Navbar></Navbar>
                <div className={ServicesCss.wrapper}>
                    <h1 className={ServicesCss.title}>Αναζήτησε Πληροφορίες για την Περιοχή σου</h1>
                    <div className={ServicesCss.selectContainer}>
                        <Select
                            options={options}
                            styles={CustomStyles}
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
