import React from 'react';
import Navbar from '../Navbars/Navbar';
import photo from '../../assets/menu-photo.jpg';
import HomeCss from './Home.module.css';
import Footer from '../Navbars/Footer';
import { FaArrowRight } from 'react-icons/fa6';
import Accordion from '../SmallComponents/Accordion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={HomeCss.pageContainer}>
      <Navbar />
      <div>
        <div className={HomeCss.imgContainer}>
          <img src={photo} alt="Περιγραφή εικόνας" />
          <p className={HomeCss.overlayText}>
            "Η ποιότητα ζωής ξεκινά από την ενημέρωση"💡
          </p>
        </div>

        <p className={HomeCss.description}>
          Η εφαρμογή μας σου δίνει τη δυνατότητα να ενημερώνεσαι άμεσα για
          κρίσιμα περιβαλλοντικά δεδομένα στη Θεσσαλονίκη. Μάθε για την
          ποιότητα του νερού, την ατμοσφαιρική ρύπανση και τη διαχείριση
          απορριμμάτων στη γειτονιά σου. Δράσε προληπτικά, προστάτευσε την
          υγεία σου και βοήθησε στη βελτίωση της ποιότητας ζωής στην πόλη
          μας. 🌍
        </p>

        <div className={`mb-3 ${HomeCss.BtnContainer}`}>
          <button
            className={`btn ${HomeCss.LearnMoreBtn}`}
            onClick={() => {
              navigate('/LearnMore');
            }}
          >
            Μάθε Περισσότερα
            <FaArrowRight className={HomeCss.LearnMoreBtnArrow} />
          </button>
        </div>

        <div className="text-center mt-5">
          <h3>Συχνές Ερωτήσεις και Απαντήσεις</h3>
        </div>

        <div className={HomeCss.accordionContainer}>
            <Accordion></Accordion>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
