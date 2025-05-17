import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import chroma from 'chroma-js';
import Styles from './map.module.css';

// sample GeoJSON με λίγο πιο ρεαλιστικά όρια για Κέντρο & Καλαμαριά
const sampleGeoData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Κέντρο Θεσσαλονίκης', comp_rate: 90 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [22.9315, 40.6196],
          [22.9580, 40.6196],
          [22.9580, 40.6450],
          [22.9315, 40.6450],
          [22.9315, 40.6196]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Καλαμαριά', comp_rate: 75 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [22.953029, 40.582703],
          [22.953029, 40.582703],
          [23.0000, 40.6300],
          [22.9700, 40.6300],
          [22.953029, 40.582703]
        ]]
      }
    }
  ]
};

// component που προσθέτει το GeoJSON και κάνει fitBounds
function GeoJsonWithFit({ data, style }) {
  const map = useMap();

  useEffect(() => {
    const layer = new window.L.GeoJSON(data);
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
  }, [data, map]);

  return <GeoJSON data={data} style={style} />;
}

const WaterQualityMap = () => {
  const [geoData, setGeoData] = useState(sampleGeoData);

  useEffect(() => {
    // όταν έχεις το API, κάνεις fetch εδώ:
    /*
    fetch('/path/to/geojson')
      .then(r => r.json())
      .then(data => {
        // merge comp_rate κ.λπ.
        setGeoData(data);
      })
      .catch(() => setGeoData(sampleGeoData));
    */
  }, []);

  const getColor = rate => {
    const v = Math.max(0, Math.min(100, rate)) / 100;
    return chroma.scale(['green', 'blue'])(v).hex();
  };

  const styleFeature = f => ({
    fillColor: getColor(f.properties.comp_rate),
    weight: 2,
    color: 'white',
    fillOpacity: 0.7,
    dashArray: '3'
  });

  return (
    <div className={Styles.mapWrapper}>
      <MapContainer
        // απλώς ένα rough center για να φορτώσει, το GeoJsonWithFit θα κάνει το fit
        center={[40.63, 22.95]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJsonWithFit data={geoData} style={styleFeature} />
      </MapContainer>
    </div>
  );
};

export default WaterQualityMap;
