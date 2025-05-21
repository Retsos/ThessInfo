import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function GeoJsonWithFit({ data }) {
  const map = useMap();
  const hasFitted = React.useRef(false);

  useEffect(() => {
    if (!data || hasFitted.current) return;

    const layer = new window.L.GeoJSON(data);
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    hasFitted.current = true;
  }, [data, map]);

  return (
    <GeoJSON
      data={data}
      onEachFeature={(feature, layer) => {
        if (feature.properties?.name) {
          layer.bindTooltip(feature.properties.name); // Βασικό tooltip
        }
      }}
    />
  );
}

export default function WaterQualityMap() {
  const [geoData, setGeoData] = useState(null);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  return (

    <>

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <div className='d-flex justify-content-center align-items-center'>
          <Tabs value={value}
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
          {geoData && <GeoJsonWithFit data={geoData} />}
        </MapContainer>
      </div>
    </>

  );
}