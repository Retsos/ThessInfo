import React from 'react'
import CondactCss from './Contact.module.css'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'  

const Contact = () => {
  return (
    <>
        <div className={CondactCss.pageContainer}>
            <Navbar></Navbar>
            <div>


            </div>
            <Footer></Footer>
        </div>
    </>
  )
}

export default Contact