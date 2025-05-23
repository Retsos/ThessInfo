import React, { useState,useEffect } from 'react';
import Navbar from '../Navbars/Navbar'
import LearnMoreCss from './LearnMore.module.css'
import Footer from '../Navbars/Footer'
import Accordion from '../SmallComponents/Accordion'
import { FiBookOpen, FiCheckCircle, FiHelpCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';

const LearnMore = () => {
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);


      useEffect(() => {
        const handleScroll = () => {
          const initialPageHeight = window.innerHeight;
          const twentyPercentPoint = initialPageHeight * 0.20;
          const scrollPosition = window.scrollY;
    
          if (scrollPosition > twentyPercentPoint) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }
        };
    
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

    return (
        <div className={LearnMoreCss.pageContainer}>
                <div className={`${LearnMoreCss.FullContainer} ${isSticky ? LearnMoreCss.sticky : ''}`}   >
                    <Navbar></Navbar>
                </div>
            {/* Hero Section */}
            <div className={LearnMoreCss.heroSection}>
                <div className={LearnMoreCss.heroContent}>
                    <h1>Μάθετε Περισσότερα για την Εφαρμογή</h1>
                    <p className='mt-5'>Ανακαλύψτε πώς η εφαρμογή μας μπορεί να βελτιώσει την καθημερινότητά σας</p>
                </div>
            </div>

            {/* Main Content */}
            <div className={LearnMoreCss.contentWrapper}>
                {/* Features Grid */}
                <div className={LearnMoreCss.featuresSection}>
                    <div className={LearnMoreCss.featureCard}>
                        <FiBookOpen className={LearnMoreCss.featureIcon} />
                        <h3>Πώς Λειτουργεί</h3>
                        <ul className={LearnMoreCss.featureList}>
                            <li>Επιλέγετε δήμο ή ζώνη στον χάρτη για να δείτε άμεσα τα πρόσφατα δεδομένας</li>
                            <li>Οπτικοποίηση σε χρωματισμένα περιοχικά επίπεδα βάσει συμμόρφωσης</li>
                            <li>Δυναμικοί πίνακες με ταξινόμηση και φίλτρα</li>
                        </ul>
                    </div>

                    <div className={LearnMoreCss.featureCard}>
                        <FiCheckCircle className={LearnMoreCss.featureIcon} />
                        <h3>Βασικά Πλεονεκτήματα</h3>
                        <ul className={LearnMoreCss.featureList}>
                            <li>Αξιοπιστία Δεδομένων από επίσημους φορείς (ΔΕΥΑ, ΕΜΠ κ.λπ.)</li>
                            <li>ΑΕύχρηστη Διεπαφή σε υπολογιστή και κινητό</li>
                            <li>Δωρεάν Πρόσβαση σε όλα τα στοιχεία χωρίς συνδρομές</li>
                        </ul>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className={LearnMoreCss.faqSection}>
                    <h2><FiHelpCircle className={LearnMoreCss.sectionIcon} /> Συχνές Ερωτήσεις</h2>
                    <Accordion />
                </div>

                {/* Call to Action Section */}
                <div className={LearnMoreCss.ctaSection}>
                    <h3>Έχετε ακόμα απορίες;</h3>
                    <p>Η ομάδα μας είναι διαθέσιμη για να σας βοηθήσει 24/7</p>
                    <button
                        onClick={() => {
                            navigate('/Contact');
                        }}
                        className={LearnMoreCss.ctaButton}>
                        Επικοινωνήστε μαζί μας
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default LearnMore
