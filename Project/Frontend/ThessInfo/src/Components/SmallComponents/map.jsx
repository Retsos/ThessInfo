import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import chroma from 'chroma-js';
import styles from './map.module.css'

function GeoJsonWithFit({ data, style }) {
  const map = useMap();
  const hasFitted = React.useRef(false);

  useEffect(() => {
    if (!data || hasFitted.current) return;

    const layer = new window.L.GeoJSON(data);
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    hasFitted.current = true;
  }, [data, map]);

  return <GeoJSON data={data} style={style} />;
}


export default function WaterQualityMap({ rates = [] }) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const geoJsonUrl = '/data/thessBounds.geojson';

    fetch(geoJsonUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch geojson');
        return res.json();
      })
      .then(osmGeo => {
        // Merge comp_rate
        const features = osmGeo.features.map(f => {
          const match = rates.find(r => r.name === f.properties.name);
          return {
            ...f,
            properties: {
              ...f.properties,
              comp_rate: match ? match.comp_rate : 0
            }
          };
        });
        setGeoData({ type: 'FeatureCollection', features });
      })
      .catch(err => {
        console.error('GeoJSON fetch error:', err);
        setGeoData(null);
      });
  }, [rates]);

  // 3) Χρωματική κλίμακα 0–100
  const getColor = rate =>
    chroma
      .scale(['#ff4c4c', '#ffee4c', '#4cff4c'])(Math.max(0, Math.min(100, rate)) / 100)
      .hex();

  // 4) Style function
  const styleFeature = feature => ({
    fillColor: getColor(feature.properties.comp_rate),
    color: '#555',
    weight: 1,
    fillOpacity: 0.7
  });

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        // αρχικό center/zoom θα διορθωθεί απ' το fitBounds
        center={[40.63, 22.95]}
        zoom={12}
        scrollWheelZoom={true}    // με το scrolldown/up
        doubleClickZoom={true}    // με διπλό κλικ
        touchZoom={true}          // σε κινητό με pinch
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJsonWithFit data={geoData} style={styleFeature} />
        )}
      </MapContainer>
    </div>
  );
}
