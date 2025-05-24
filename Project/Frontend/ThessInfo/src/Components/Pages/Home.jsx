import React, { useState, useEffect } from 'react';
import Navbar from '../Navbars/Navbar';
import cloudImage from '../../assets/fog.png';
import HomeCss from './Home.module.css';
import Footer from '../Navbars/Footer';
import { FaArrowRight, FaQuestionCircle } from 'react-icons/fa';
import Accordion2 from '../SmallComponents/Accordion2';
import { useNavigate, Link } from 'react-router-dom';

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
          <h1 className={HomeCss.title}>ThessInfo</h1>
          <h2 className={HomeCss.subtitle}>Περιβαλλοντική Πληροφόρηση Θεσσαλονίκης</h2>
          <p className={HomeCss.tagline}>
            Πραγματικές μετρήσεις — Άμεση ενημέρωση — Δράση αποτελεσματικότητας
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className={HomeCss.mainContent}>
        {/* Features Grid */}
        <div className={HomeCss.featuresGrid}>
          <div className={HomeCss.featureCard}>
            <Link to="/ArrayMapSection/2/Water" className={HomeCss.featureLink}>
              <h3>📊 Έλεγχος Ποιότητας Νερού</h3>
              <p>Άμεση ενημέρωση για pH & χλώριο κα. — εξασφαλίζοντας καθαρό και ασφαλές νερό.</p>
            </Link>
          </div>
          <div className={HomeCss.featureCard}>
            <Link to="/ArrayMapSection/2/Recycle" className={HomeCss.featureLink}>
              <h3>♻️ Διαχείριση Απορριμμάτων</h3>
              <p>Ανακύκλωση & αξιοποίηση: βελτιστοποιημένες λύσεις για καθαρό περιβάλλον.</p>
            </Link>
          </div>
          <div className={HomeCss.featureCard}>
            <Link to="/ArrayMapSection/2/Air" className={HomeCss.featureLink}>
              <h3><img src={cloudImage} alt="" className={HomeCss.cardimages} /> Ατμοσφαιρική Ρύπανση</h3>
              <p>Δείκτες PM2.5, NO2 και O3 — προστατεύοντας την υγεία σου.</p>
            </Link>
          </div>
        </div>

        {/* Description Section */}
        <section className={HomeCss.descriptionSection}>
          <h2 className={HomeCss.sectionTitle}>Τι μας ξεχωρίζει;</h2>
          <div className={HomeCss.benefitsList}>
            <div className={HomeCss.benefitItem}>
              <FaArrowRight className={HomeCss.benefitIcon} />
              <p>Συνεχής ενημέρωση των δεδομένων μας</p>
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