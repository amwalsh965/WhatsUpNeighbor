import { useNavigate } from "react";

function NavBar() {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <button onClick={() => navigate("/events")}>Icon</button>
            <button onClick={() => navigate("/saved")}>Icon</button>
            <button onClick={() => navigate("/messages")}>Icon</button>
            <button onClick={() => navigate("/profile")}>Icon</button>
        </div>
    )
}

export default Navbar;