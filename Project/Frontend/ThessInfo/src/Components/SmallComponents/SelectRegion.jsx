import React, { useState, useMemo } from 'react';
import Styles from './SelectRegion.module.css';
import { useNavigate } from 'react-router-dom';
import Select, { components } from 'react-select';
import {regions as rawOptions } from './../Regions.jsx'

const SelectRegion = () => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [showMinLengthWarning, setShowMinLengthWarning] = useState(false);
    const navigate = useNavigate();

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
                    Επιλέξτε τουλάχιστον 1 περιοχή.
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