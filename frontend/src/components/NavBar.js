import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

const NavBar = () => {

    return (
        <nav className="navbar fixed-top">
            <div className="container-fluid justify-content-end mx-4">
                <ul className="nav nav-underline">

                    <li className="nav-item">
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                isActive ? "nav-link active" : "nav-link"
                            }
                            aria-current="page"
                        >
                            Home
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink 
                            to="/howto" 
                            className={({ isActive }) => 
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            How to Use
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink 
                            to="/about" 
                            className={({ isActive }) => 
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            About Me
                        </NavLink>
                        
                    </li>
                    <li className="nav-item">
<<<<<<< HEAD
  <NavLink 
    to="/history" 
    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
  >
    History
  </NavLink>
</li>

=======
                        
                        <NavLink 
                            to="/history" 
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        >
                            History
                        </NavLink>
                    </li>
>>>>>>> origin/main

                </ul>
            </div>
        </nav>
    );

}

export default NavBar;
