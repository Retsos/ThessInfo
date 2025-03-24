import React from 'react'
import Navbar from '../Navbars/Navbar'
import ResultsCss from './Results.module.css'
import Footer from '../Navbars/Footer'
import MultiActionAreaCard from '../SmallComponents/Card'

const Results = () => {
    return (
        <>
            <div className={ResultsCss.pageContainer}>
                <Navbar></Navbar>

                <div className='text-center mt-5'>
                    <h3>Όλα τα δεδομένα σχετικά με τον Δήμο: </h3>
                </div>

                <div className={ResultsCss.CardContainer}>
                    <MultiActionAreaCard></MultiActionAreaCard>
                    <MultiActionAreaCard></MultiActionAreaCard>
                    <MultiActionAreaCard></MultiActionAreaCard>
                    <MultiActionAreaCard></MultiActionAreaCard>
                </div>

                <Footer></Footer>
            </div>
        </>
    )
}

export default Results