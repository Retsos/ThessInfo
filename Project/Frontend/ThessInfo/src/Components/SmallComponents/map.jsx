import React, { useState, useEffect, useCallback, useRef, } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useData } from '../DataContext';

function GeoJsonWithStyle({ data, tabValue, contextData }) {
  const map = useMap();
  const hasFitted = useRef(false);
  const geoJsonRef = useRef(null);

  // 1) Ορίζουμε σωστά τη συνάρτηση style
  // …πάνω στο component…
  const getStyle = useCallback(feature => {
    const areaName = feature.properties.name;
    // Επίλεξε το raw data object για την τρέχουσα καρτέλα
    const raw =
      tabValue === 0 ? contextData.waterData2 :
        tabValue === 1 ? contextData.recyclingData :
          contextData.airData || {};

    const count = raw[areaName]?.compliant_count ?? 0;
    const no2 = raw[areaName]?.no2_avg ?? 0;

    // Υπολόγισε το fillColor ανά καρτέλα
    let fillColor = '#ccc';
    if (tabValue === 0) {
      // Νερό
      fillColor =
        count >= 90 ? '#1a75ff' :
          count >= 80 ? '#4d94ff' :
            count >= 70 ? '#80b3ff' :
              count >= 60 ? '#b3d1ff' :
                '#e6f0ff';
    } else if (tabValue === 1) {
      // Ανακύκλωση
      fillColor =
        count >= 10 ? '#2e7d32' :
          count >= 5 ? '#4caf50' :
            count >= 2 ? '#81c784' :
              count >= 1 ? '#a5d6a7' :
                '#c8e6c9';
    } else {
      // Αέρας
      fillColor =
        no2 <= 5 ? '#00e676' :
          no2 <= 10 ? '#ffeb3b' :
            no2 <= 20 ? '#ff9800' :
              no2 <= 30 ? '#ff5722' :
                '#d50000';
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


  // FitBounds μία φορά
  useEffect(() => {
    console.log(contextData);
    if (data && !hasFitted.current) {
      const layer = new window.L.GeoJSON(data);
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
      hasFitted.current = true;
    }
  }, [data, map]);

  return (
    <GeoJSON
      data={data}
      ref={geoJsonRef}
      style={getStyle}
      onEachFeature={(feature, layer) => {
        // Tooltip
        layer.bindTooltip(
          `<strong>${feature.properties.name}</strong><br/>` +
          (tabValue === 0
            ? `Νερό: ${contextData.waterData2[feature.properties.name]?.compliant_count ?? 'N/A'}`
            : tabValue === 1
              ? `Ανακύκλωση: ${contextData.recyclingData[feature.properties.name]?.compliant_count ?? 'N/A'}`
              : `Αέρας: ${contextData.airData[feature.properties.name]?.compliant_count ?? 'N/A'}`
          )
        );

        layer.on({
          mouseover: e => {
            e.target.setStyle({
              weight: 3,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7
            });
            e.target.bringToFront();
          },
          mouseout: e => {
            // 2) Επαναφέρουμε το αρχικό style
            if (geoJsonRef.current) {
              geoJsonRef.current.resetStyle(e.target);
            } else {
              // fallback
              e.target.setStyle(getStyle(feature));
            }
          }
        });
      }}
    />
  );
}

export default function QualityMap() {
  const [geoData, setGeoData] = useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const { airData, recyclingData, waterData2, loading } = useData();

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
          { color: '#2e7d32', text: '≥ 11kg - Πολύ καλό' },
          { color: '#4caf50', text: '6-10kg - Καλό' },
          { color: '#81c784', text: '3-5kg - Μέτριο' },
          { color: '#a5d6a7', text: '1-2kg - Κατώτερο' },
          { color: '#c8e6c9', text: '< 1kg - Χαμηλό' }
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
        <p>Υπόμνημα</p>
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
              key={tabValue}
              data={geoData}
              tabValue={tabValue}
              contextData={{
                airData,
                recyclingData,
                waterData2 // πλέον object, όχι array
              }}
            />
          )}
        </MapContainer>
        {renderLegend()}
      </div>
    </>
  );
}