import React, { useState, useEffect } from 'react';
import NavbarCss from './Navbar.module.css';
import { Link, useLocation } from 'react-router-dom';
import { IoClose } from "react-icons/io5";

const Navbar = () => {
    const [isOffcanvasShown, setIsOffcanvasShown] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const location = useLocation();

    // Control body overflow when offcanvas is shown
    useEffect(() => {
        if (isOffcanvasShown) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOffcanvasShown]);

    const CustomLink = ({ to, children, ...props }) => {
        const isActive = location.pathname === to;
        return (
            <li className="nav-item">
                <Link className={`nav-link ${isActive ? 'active' : ''}`} to={to} {...props}>
                    {children}
                </Link>
            </li>
        );
    };

    const handleCloseOffcanvas = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOffcanvasShown(false);
            setIsClosing(false);
        }, 300);
    };

    return (
        <>
            <nav className={`navbar navbar-expand-lg ${NavbarCss.navbar}`}>
                <div className="container-fluid position-relative">
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-label="Toggle navigation"
                        onClick={() => setIsOffcanvasShown(true)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className={`collapse navbar-collapse ${NavbarCss.navbarnav}`} id="navbarNavDropdown">
                        <ul className="navbar-nav mx-auto">
                            <CustomLink to="/">Αρχική</CustomLink>
                            <CustomLink to="/Services">Υπηρεσίες</CustomLink>
                            <CustomLink to="/Contact">Επικοινωνία</CustomLink>
                        </ul>
                    </div>

                    <div className={`${NavbarCss.offcanvas} ${isOffcanvasShown ? NavbarCss.show : ''} ${isClosing ? NavbarCss.hide : ''}`}>
                        <div className={NavbarCss.offcanvasHeader}>
                            <button
                                type="button"
                                className={NavbarCss.btnCloseToggle}
                                onClick={handleCloseOffcanvas}
                                aria-label="Close"
                            >
                                <IoClose />
                            </button>
                        </div>
                        <div className={NavbarCss.offcanvasBody}>
                            <ul className={NavbarCss.ulMobile}>
                                <CustomLink to="/" onClick={handleCloseOffcanvas}>Αρχική</CustomLink>
                                <CustomLink to="/Services" onClick={handleCloseOffcanvas}>Υπηρεσίες</CustomLink>
                                <CustomLink to="/Contact" onClick={handleCloseOffcanvas}>Επικοινωνία</CustomLink>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;