import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

const NavBar = () => {

    return (
        <nav className="navbar fixed-top">
            <div className="container-fluid justify-content-end mx-4">
                <ul class="nav nav-underline">

                <li className="nav-item">
                        <NavLink 
                            to="/" 
                            className="nav-link" 
                            aria-current="page" 
                            activeClassName="active"
                        >
                            Home
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink 
                            to="/howto" 
                            className="nav-link" 
                            activeClassName="active" 
                        >
                            How to Use
                        </NavLink>
                    </li>


                </ul>
            </div>
        </nav>
    );

}

export default NavBar;