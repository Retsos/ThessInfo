import React, { useState, useEffect } from 'react';
import Navbar from '../Navbars/Navbar';
import cloudImage from '../../assets/fog.png';
import HomeCss from './Home.module.css';
import Footer from '../Navbars/Footer';
import { FaArrowRight, FaQuestionCircle } from 'react-icons/fa';
import Accordion2 from '../SmallComponents/Accordion2';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={HomeCss.pageContainer}>
      <div className={`${HomeCss.headerWrapper} ${isSticky ? HomeCss.sticky : ''}`}>
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className={HomeCss.heroSection}>
        <div className={HomeCss.heroContent}>
          <h1>Περιβαλλοντική Πληροφόρηση Θεσσαλονίκης</h1>
          <p>Πραγματικές μετρήσεις - Άμεση ενημέρωση - Δράση αποτελεσματικότητας</p>
        </div>
      </div>

      {/* Main Content */}
      <main className={HomeCss.mainContent}>
        {/* Features Grid */}
        <div className={HomeCss.featuresGrid}>
          <div className={HomeCss.featureCard}>
            <h3>📊 Έλεγχος Ποιότητας Νερού</h3>
            <p>Συνεχής παρακολούθηση σε κρίσιμες υδάτινες περιοχές</p>
          </div>
          <div className={HomeCss.featureCard}>
            <h3><img src={cloudImage} alt="" className={HomeCss.cardimages}/> Ατμοσφαιρική Ρύπανση</h3>
            <p>Δείκτες PM2.5, NO2 και O3 σε πραγματικό χρόνο</p>
          </div>
          <div className={HomeCss.featureCard}>
            <h3>♻️ Διαχείριση Απορριμμάτων</h3>
            <p>Ευφυής διαχείριση και ανακύκλωση αποβλήτων</p>
          </div>
        </div>

        {/* Description Section */}
        <section className={HomeCss.descriptionSection}>
          <h2>Γιατί να μας επιλέξετε;</h2>
          <div className={HomeCss.benefitsList}>
            <div className={HomeCss.benefitItem}>
              <FaArrowRight className={HomeCss.benefitIcon} />
              <p>Συνεχής ενημέρωση μέσω ειδοποιήσεων</p>
            </div>
            <div className={HomeCss.benefitItem}>
              <FaArrowRight className={HomeCss.benefitIcon} />
              <p>Αξιόπιστες μετρήσεις από επίσημους φορείς</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={HomeCss.faqSection}>
          <h2><FaQuestionCircle className={HomeCss.sectionIcon} /> Συχνές Ερωτήσεις</h2>
          <div className={HomeCss.accordionContainer}>
            <Accordion2 />
          </div>
        </section>

        {/* CTA Section */}
        <div className={HomeCss.ctaSection}>
          <button
            className={HomeCss.ctaButton}
            onClick={() => navigate('/LearnMore')}
          >
            Μάθε Περισσότερα
            <FaArrowRight className={HomeCss.ctaIcon} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;