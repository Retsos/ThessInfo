import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../endpoints/api';
import ContactCss from './Contact.module.css';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import { MdOutlineMailOutline, MdOutlineTextsms, MdDriveFileRenameOutline } from "react-icons/md";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, reset, handleSubmit, formState, clearErrors } = useForm();
  const { errors } = formState;
  const [isSticky, setIsSticky] = useState(false);

  const onSubmit = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await api.post('contact/', data);
      // Εμφάνιση toast notification
      toast.success(
        <>
          <strong>❤️ Σας ευχαριστούμε θερμά!</strong><br />
          Το αίτημά σας ελήφθη επιτυχώς.<br />
        </>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      reset();
    } catch (error) {
      toast.error("Υπήρξε σφάλμα κατά την αποστολή. Προσπαθήστε πάλι.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > window.innerHeight * 0.20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={ContactCss.pageContainer}>
      <div className={`${ContactCss.FullContainer} ${isSticky ? ContactCss.sticky : ''}`}>
        <Navbar />
      </div>

      <div className={ContactCss.ContactContainer}>
        <h1 className="text-center">Επικοινωνήστε Μαζί Μας</h1>
        <div className={ContactCss.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Όνομα */}
            <div className="form-floating my-4 position-relative">
              <input
                type="text"
                className={`form-control ${ContactCss.contactinput}`}
                placeholder="Όνομα"
                {...register("name", { required: "Το όνομα είναι υποχρεωτικό" })}
              />
              <p className={ContactCss.errors}>{errors.name?.message}</p>
              <label>*Όνομα</label>
              <MdDriveFileRenameOutline className={ContactCss.inputIcon} />
            </div>

            {/* Email */}
            <div className="form-floating my-4 position-relative">
              <input
                type="email"
                className={`form-control ${ContactCss.contactinput}`}
                placeholder="E-mail"
                {...register("email", {
                  required: "Το email είναι υποχρεωτικό",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Παρακαλώ εισάγετε ένα έγκυρο email"
                  }
                })}
              />
              <p className={ContactCss.errors}>{errors.email?.message}</p>
              <label>*E-mail</label>
              <MdOutlineMailOutline className={ContactCss.emailIcon} />
            </div>

            {/* Μήνυμα */}
            <div className="form-floating my-4 position-relative">
              <textarea
                className={`form-control ${ContactCss.contactArea}`}
                placeholder="Μήνυμα"
                rows="5"
                style={{ resize: 'none', overflow: 'hidden', minHeight: '120px' }}
                {...register("message", { required: "Το πεδίο μήνυμα είναι υποχρεωτικό" })}
                onWheel={(e) => e.preventDefault()}
              />
              <p className={ContactCss.errors}>{errors.message?.message}</p>
              <label>*Το Μήνυμά σας</label>
              <MdOutlineTextsms className={ContactCss.TextIcon} />
            </div>

            {/* Κουμπί */}
            <div className={ContactCss.btnContainer}>
              <button type="submit" disabled={isLoading} className={`btn ${ContactCss.CotnactBtn}`}>
                {isLoading ? "Αποστολή..." : "Αποστολή"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      {/* ToastContainer για την εμφάνιση των notifications */}
      <ToastContainer />
    </div>
  );
};

export default Contact;
