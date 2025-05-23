import React, { createContext, useState, useContext, useEffect, use } from 'react';
import api from '../endpoints/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [airData, setAirData] = useState(null);
  const [waterData, setWaterData] = useState(null);
  const [waterData2, setWaterData2] = useState(null);
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
        //fetchData('water/api/regions-latest-compliance/', setWaterData),   AN TO THES KAPOU VGALE TO COMMENT
        fetchData('water/MarginAreas/', setWaterData2),
        fetchData('recycle/top-recycling-per-person/', setRecyclingData),
      ]);
      setLoading(false);
    };
    loadAllData();
  }, []);


  return (
    <DataContext.Provider value={{ airData, waterData, recyclingData, waterData2,loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);