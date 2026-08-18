import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Services/AuthContext";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="logo">Instagram</div>

      <div className="search-box">
        <input type="text" placeholder="Search" />
      </div>

      <div className="nav-icons">
        <Link to="/">
          <i className="fa-solid fa-house"></i>
        </Link>

        <Link to="/messages">
          <i className="fa-brands fa-facebook-messenger"></i>
        </Link>

        <Link to="/profile">
          <i className="fa-solid fa-user"></i>
        </Link>

        <button className="nav-logout-btn" onClick={handleLogout} title="Log out">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;