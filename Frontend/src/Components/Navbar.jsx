import { NavLink } from "react-router-dom";
<<<<<<< HEAD
import "../Style/navbar.css";

const Navbar = () => {
    return (
        <header className="topbar">
            <div className="logo">SmartZen</div>

            <nav className="menu">
                <NavLink to="/Home" className="item">Home</NavLink>
                <NavLink to="/Dashboard" className="item">Dashboard</NavLink>
                <NavLink to="/Upload" className="item">Uploads</NavLink>
                <NavLink to="/Reports" className="item">Reports</NavLink>
                <NavLink to="/SmartHelper" className="item">Smart Helper</NavLink>
                <NavLink to="/Help" className="item">Help</NavLink>
            </nav>
        </header>
    );
=======
import { useState } from "react";
import "../Style/Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="top-navbar">
      <div className="nav-left">
        <span className="logo">HealthApp</span>
      </div>

      <nav className={`nav-center ${open ? "open" : ""}`}>
        <NavLink to="/Home" className="nav-item">
          Home
        </NavLink>
        <NavLink to="/Dashboard" className="nav-item">
          Dashboard
        </NavLink>
        <NavLink to="/Upload" className="nav-item">
          Upload
        </NavLink>
        <NavLink to="/Reports" className="nav-item">
          Reports
        </NavLink>
        <NavLink to="/SmartHelper" className="nav-item">
          Smart Helper
        </NavLink>
        <NavLink to="/Help" className="nav-item">
          Help
        </NavLink>
      </nav>

      <div className="nav-right">
        <button className="icon-btn">⚙</button>
        <div className="avatar">👤</div>

        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>
    </header>
  );
>>>>>>> 480e75cdc390f9a081522a516ddf8128cc56b65a
};

export default Navbar;
