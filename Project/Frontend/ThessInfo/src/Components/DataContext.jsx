import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../endpoints/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [airData, setAirData] = useState(null);
  const [waterData, setWaterData] = useState(null);
  const [recyclingData, setRecyclingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await api.get(endpoint);
      setter(res.data);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchData('airquality/monthly-compliance/', setAirData),
        // fetchData('waterquality/monthly-compliance/', setWaterData),
        // fetchData('recycling/monthly-compliance/', setRecyclingData),
      ]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  return (
    <DataContext.Provider value={{ airData, waterData, recyclingData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);