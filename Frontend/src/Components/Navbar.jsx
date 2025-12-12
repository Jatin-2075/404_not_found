import { NavLink } from "react-router-dom";
import '../Style/navbar.css'
import useWindowWidth from "../Hooks/Width";
import { useState } from "react";

const Navbar = () => {

    const [Toggle, SetToggle] = useState(true);
    const [NavToggle, SetNavToggle] = useState(false);

    const width = useWindowWidth();
    console.log(width);

    if (width > 768) {
        SetToggle(true)
    }

    return (
        <aside className="sidebar">
            <div className="logo">
                <span>SmartZen</span>
            </div>

            {Toggle && <div>
                {!NavToggle && <div>
                    <button type="button" onClick={!SetNavToggle} >☰</button>
                </div>}

                { NavToggle && <div>
                        <button type="button" onClick={!SetNavToggle} >✖</button>

                        <div>
                            <nav className="menu">
                                <NavLink to="/Home" className="item">Home</NavLink>
                                <NavLink to="/Dashboard" className="item">Dashboard</NavLink>
                                <NavLink to="/Upload" className="item">Uploads</NavLink>
                                <NavLink to="/Reports" className="item">Medical Reports</NavLink>
                                <NavLink to="/SmartHelper" className="item">Smart Helper</NavLink>
                                <NavLink to="/Help" className="item">Help</NavLink>
                            </nav>
                        </div>
                    </div>
                }
            </div>}

            {!Toggle && <div>
                    <nav className="menu">
                        <NavLink to="/Home" className="item">Home</NavLink>
                        <NavLink to="/Dashboard" className="item">Dashboard</NavLink>
                        <NavLink to="/Upload" className="item">Uploads</NavLink>
                        <NavLink to="/Reports" className="item">Medical Reports</NavLink>
                        <NavLink to="/SmartHelper" className="item">Smart Helper</NavLink>
                        <NavLink to="/Help" className="item">Help</NavLink>
                    </nav>
                </div>
            }
        </aside>
    );
};

export default Navbar;
