import React from 'react'
import Navbar from '../Navbars/Navbar'
import ContactCss from './Contact.module.css'
import Footer from '../Navbars/Footer'
import LearnMoreCss from './LearnMore.module.css'


const LearnMore = () => {
    return (
        <>
            <div className={LearnMoreCss.pageContainer}>
                <Navbar></Navbar>
                <div>

                </div>
                <Footer></Footer>
            </div>
        </>
    )
}

export default LearnMore