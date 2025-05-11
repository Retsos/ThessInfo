import React, { useState } from 'react';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import HelpCss from './OdigosPerioxwn.module.css';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const AREAS = [
  { value: 'thessaloniki',      label: 'Άνω Τούμπα' },
  { value: 'kalamaria',         label: 'Καλαμαριά' },
  { value: 'pylaia-hortiati',   label: 'Πυλαία-Χορτιάτης' },
  { value: 'neapoli-sykies',    label: 'Νεάπολη-Συκιές' },
    //αλλες περιοχες
];

// Βοηθητική συναρτηση για αφαίρεση τόνων & μετατροπη σε  lowercase letters
const normalizeString = str =>
  str
    .normalize('NFD')                    // ξεδιαλέγει τα γράμματα + τόνους
    .replace(/[\u0300-\u036f]/g, '')     // αφαιρεί τους combining marks
    .toLowerCase();

export default function OdigosPerioxwn() {
  const [filter, setFilter] = useState('');

  const normalizedFilter = normalizeString(filter.trim());

  const filtered = AREAS.filter(area => {
    const normLabel = normalizeString(area.label);
    return normLabel.includes(normalizedFilter);
  });

  return (
    <div className={HelpCss.pageContainer}>
      <Navbar />
      <div className={HelpCss.wrapper}>
        <h1 className={HelpCss.title}>Οδηγός Περιοχών</h1>
        <div className={HelpCss.searchBox}>
          <FaSearch className={HelpCss.searchIcon} />
          <input
            type="text"
            placeholder="Φίλτρο περιοχής..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className={HelpCss.searchInput}
          />
        </div>
        {filtered.length ? (
          <div className={HelpCss.grid}>
            {filtered.map(area => (
              <Link
                key={area.value}
                to={`/Results?dimos=${encodeURIComponent(area.value)}&label=${encodeURIComponent(area.label)}`}
                className={HelpCss.card}
              >
                <h3>{area.label}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className={HelpCss.noResults}>Δεν βρέθηκε καμία περιοχή.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
