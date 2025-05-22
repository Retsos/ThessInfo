import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useData } from '../DataContext';

function GeoJsonWithStyle({ data, tabValue, contextData }) {
  const map = useMap();
  const hasFitted = React.useRef(false);

  // Συνάρτηση για τον χρωματισμό των περιοχών
  const getStyle = ((feature) => {
    const areaName = feature.properties.name;
    let fillColor;
    console.log('Current area name:', areaName); // Debug
    console.log('Current context data:', contextData);

    // Βρίσκουμε τα δεδομένα για την τρέχουσα περιοχή
    const areaData = contextData?.[tabValue === 0 ? 'waterData' :
      tabValue === 1 ? 'recyclingData' : 'airData'];
    const areaEntry = areaData?.find(item => item.area === areaName);
    const value = areaEntry?.value || 0;
    const areaValue = areaData?.[areaName]?.compliant_count || 0;

    // Εφαρμόζουμε τα χρώματα ανάλογα με την καρτέλα
    switch (tabValue) {
      case 0: // Νερό
        fillColor = getColorForWater(parseFloat(areaValue));
        value = areaValue;
        break;
      case 1: // Ανακύκλωση
        fillColor = getColorForRecycling(parseFloat(areaValue));
        value = areaValue;
        break;
      case 2: // Αέρας
        fillColor = getColorForAir(parseFloat(areaValue));
        value = areaValue;
        break;
      default:
        fillColor = '#cccccc';
    }

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }, [tabValue, contextData]);

  useEffect(() => {
    if (!data || hasFitted.current) return;

    const layer = new window.L.GeoJSON(data);
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    hasFitted.current = true;
  }, [data, map]);

  // Βοηθητικές συναρτήσεις για χρωματισμό
  const getColorForWater = (value) => {
    if (value >= 90) return '#1a75ff'; // Πολύ καλό - σκούρο μπλε
    if (value >= 80) return '#4d94ff'; // Καλό - μπλε
    if (value >= 70) return '#80b3ff'; // Μέτριο - ανοιχτό μπλε
    if (value >= 60) return '#b3d1ff'; // Κατώτερο του μετρίου
    return '#e6f0ff'; // Χαμηλό - πολύ ανοιχτό μπλε
  };

  const getColorForRecycling = (value) => {
    if (value >= 150) return '#2e7d32'; // Πολύ καλό - σκούρο πράσινο
    if (value >= 100) return '#4caf50'; // Καλό - πράσινο
    if (value >= 50) return '#81c784'; // Μέτριο - ανοιχτό πράσινο
    if (value >= 20) return '#a5d6a7'; // Κατώτερο του μετρίου
    return '#c8e6c9'; // Χαμηλό - πολύ ανοιχτό πράσινο
  };

  const getColorForAir = (value) => {
    if (value <= 5) return '#00e676'; // Πολύ καλό - πράσινο
    if (value <= 10) return '#ffeb3b'; // Καλό - κίτρινο
    if (value <= 20) return '#ff9800'; // Μέτριο - πορτοκαλί
    if (value <= 30) return '#ff5722'; // Κακό - κόκκινο
    return '#d50000'; // Πολύ κακό - σκούρο κόκκινο
  };

  return (
    <GeoJSON
      data={data}
      style={getStyle}
      onEachFeature={(feature, layer) => {
        const areaName = feature.properties.name;
        const areaData = contextData?.[tabValue === 0 ? 'waterData' :
          tabValue === 1 ? 'recyclingData' : 'airData'];
        const value = areaData?.[areaName]?.compliant_count || 'N/A';

        let tooltipContent = `<strong>${areaName}</strong><br/>`;

        switch (tabValue) {
          case 0:
            tooltipContent += `Ποιότητα Νερού: ${value}`;
            break;
          case 1:
            tooltipContent += `Ανακύκλωση: ${value} kg/κάτοικο`;
            break;
          case 2:
            tooltipContent += `Ποιότητα Αέρα: ${value}`;
            break;
        }

        layer.bindTooltip(tooltipContent);

        layer.on({
          mouseover: (e) => {
            e.target.setStyle({
              weight: 3,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7
            });
            e.target.bringToFront();
          },
          mouseout: (e) => {
            // Χρησιμοποιούμε το current style
            e.target.setStyle(getStyle(e.target.feature));
          }
        });
      }}
    />
  );
}

export default function QualityMap() {
  const [geoData, setGeoData] = useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const { airData, waterData, recyclingData, loading } = useData();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetch('/data/thessBounds.geojson')
      .then(res => {
        if (!res.ok) throw new Error('GeoJSON not found');
        return res.json();
      })
      .then(data => {
        setGeoData(data);
      })
      .catch(err => {
        console.error('GeoJSON error:', err);
        setGeoData(null);
      });
  }, []);

  // Δημιουργούμε ένα legend ανάλογα με την καρτέλα
  const renderLegend = () => {
    const legendItems = [];

    switch (tabValue) {
      case 0: // Νερό
        legendItems.push(
          { color: '#1a75ff', text: '≥ 90% - Πολύ καλό' },
          { color: '#4d94ff', text: '80-89% - Καλό' },
          { color: '#80b3ff', text: '70-79% - Μέτριο' },
          { color: '#b3d1ff', text: '60-69% - Κατώτερο' },
          { color: '#e6f0ff', text: '< 60% - Χαμηλό' }
        );
        break;
      case 1: // Ανακύκλωση
        legendItems.push(
          { color: '#2e7d32', text: '≥ 150kg - Πολύ καλό' },
          { color: '#4caf50', text: '100-149kg - Καλό' },
          { color: '#81c784', text: '50-99kg - Μέτριο' },
          { color: '#a5d6a7', text: '20-49kg - Κατώτερο' },
          { color: '#c8e6c9', text: '< 20kg - Χαμηλό' }
        );
        break;
      case 2: // Αέρας
        legendItems.push(
          { color: '#00e676', text: '≤ 5 - Πολύ καλό' },
          { color: '#ffeb3b', text: '6-10 - Καλό' },
          { color: '#ff9800', text: '11-20 - Μέτριο' },
          { color: '#ff5722', text: '21-30 - Κακό' },
          { color: '#d50000', text: '> 30 - Πολύ κακό' }
        );
        break;
    }

    return (
      <div className={styles.legend}>
        <h4>Υπόμνημα</h4>
        {legendItems.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <div className='d-flex justify-content-center align-items-center'>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="scrollable prevent tabs example"
          >
            <Tab label="Ποιότητα Νερού" />
            <Tab label="Ανακύκλωσιμα σε kg/Κάτοικο" />
            <Tab label="Ποιότητα Αέρα" />
          </Tabs>
        </div>
      </Box>

      <div className={styles.mapWrapper}>
        <MapContainer
          center={[40.63, 22.95]}
          zoom={12}
          scrollWheelZoom={true}
          className={styles.leafletContainer}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData && (
            <GeoJsonWithStyle
              data={geoData}
              tabValue={tabValue}
              contextData={{ airData, waterData, recyclingData }}
            />
          )}
        </MapContainer>
        {renderLegend()}
      </div>
    </>
  );
}