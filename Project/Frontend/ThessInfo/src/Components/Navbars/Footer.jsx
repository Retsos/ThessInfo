import React from 'react'
import FooterCss from './Footer.module.css'

const Footer = () => {
    return (
        <>
            <footer className={FooterCss.footer}>
                <div className={FooterCss.container}>
                    <div className={FooterCss.footercontent}>
                        <p>© ThessInfo Team. All rights reserved.</p>
                    </div>
                </div>

            </footer>
        </>
    )
}

export default Footer