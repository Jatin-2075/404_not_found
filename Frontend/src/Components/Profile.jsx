import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Profile_Status = () => {
    const [completed, setCompleted] = useState(null);

    useEffect(() => {
        const checkStatus = async () => {
            const res = await fetch("http://localhost:8000/Status/", {
                credentials: "include",
            });
            const data = await res.json();
            setCompleted(data.status);
        };

        checkStatus();
    }, []);

    if (completed === null) return null;

    return (
        <NavLink to={completed ? "/Dashboard" : "/CreateProfile"}>
            {completed ? (
                <div title="Profile completed" style={iconStyle}>
                    ✅
                </div>
            ) : (
                <div title="Profile incomplete" style={iconStyle}>
                    ⚠️
                </div>
            )}
        </NavLink>
    );
};

const iconStyle = {
    fontSize: "22px",
    cursor: "pointer",
};

export default Profile_Status;
