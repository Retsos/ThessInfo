import React, { useState } from 'react';
import ContactCss from './Contact.module.css'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlineTextsms } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm()
  const { register, reset, handleSubmit, formState, clearErrors } = form
  const { errors } = formState;

  //   const onSubmit = async (data) => {

  //     if (isLoading) return

  //     clearErrors()
  //     setIsLoading(true);

  //     try {
  //         await api.post("/api/Contactmessages/", data, { withCredentials: true });
  //         setshowSuccessModal(true);
  //         clearErrors();
  //         setTimeout(() => {
  //             window.scrollTo({ top: 0, behavior: 'smooth' }); // Κύλιση στην κορυφή της σελίδας
  //             setshowSuccessModal(false); // Hide the success message after 3 seconds
  //             reset();
  //           }, 3000);
  //     }
  //     catch (error) {
  //         console.log("Error response data:", error.response?.data); // Log the response data if it exists
  //     }
  // };

  return (
    <>
      <div className={ContactCss.pageContainer}>
        <Navbar></Navbar>
        <div className={ContactCss.ContactContainer}>
          <div className='text-center'>
            <h1>Επικοινωνήστε Μαζί Μας</h1>
          </div>
          <div className={ContactCss.formContainer}>
            <form id='formLogin'
              // onSubmit={handleSubmit(onSubmit)} 
              noValidate>
              <div className="form-floating my-4 position-relative"
              >
                <input
                  type="text"
                  className={`form-control ${ContactCss.contactinput}`}
                  id="name"
                  placeholder="Όνομα"
                  name="name"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Το όνομα είναι υποχρεωτικό",
                    }
                  })}
                />
                <p className={ContactCss.errors}>{errors.name?.message}</p>
                <label htmlFor="name">*Όνομα </label>
                <MdDriveFileRenameOutline
                  className={ContactCss.inputIcon}
                />
              </div>

              <div className="form-floating my-4 position-relative">
                <input
                  type="email"
                  className={`form-control ${ContactCss.contactinput}`}
                  id="loginEmail"
                  autoComplete='on'
                  placeholder="E-mail"
                  name="email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Το όνομα είναι υποχρεωτικό",
                    },
                    pattern: {  // Separate pattern validation
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Παρακαλώ εισάγεται ένα κανονικό email"
                    }
                  })}
                />
                <p className={ContactCss.errors}>{errors.email?.message}</p>
                <label htmlFor="loginEmail">*E-mail </label>

                <MdOutlineMailOutline
                  className={ContactCss.emailIcon}
                />
              </div>

              <div className="form-floating my-4 position-relative">
                <textarea
                  className={`form-control ${ContactCss.contactArea}`}
                  id="message"
                  placeholder="Μήνυμα"
                  name="message"
                  rows="5"  
                  style={{
                    resize: 'none',
                    overflow: 'hidden',
                    minHeight: '120px',
                    maxHeight: '120px'
                  }}
                  {...register("message", {
                    required: {
                      value: true,
                      message: "Το πεδίο μήνυμα είναι υποχρεωτικό",
                    }
                  })}
                  onWheel={(e) => e.preventDefault()} // Απενεργοποιεί scroll με τροχό
                />
                <p className={ContactCss.errors}>{errors.message?.message}</p>
                <label htmlFor="message">*Το Μήνυμα σας</label>
                <MdOutlineTextsms
                  className={ContactCss.TextIcon}
                />
              </div>

              <div className={ContactCss.btnContainer}>
                <button type="submit" disabled={isLoading}
                  onClick={handleSubmit}
                  className={`btn ${ContactCss.CotnactBtn}`} >Αποστολή</button>
              </div>
            </form>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  )
}

export default Contact