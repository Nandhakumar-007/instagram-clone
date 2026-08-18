import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Services/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <h2 className="logo">
        <i className="fa-brands fa-instagram"></i>
      </h2>

      <Link to="/">
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </Link>

      <Link to="/search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>Search</span>
      </Link>

      <Link to="/reels">
        <i className="fa-solid fa-video"></i>
        <span>Reels</span>
      </Link>

      <Link to="/messages">
        <i className="fa-brands fa-facebook-messenger"></i>
        <span>Messages</span>
      </Link>

      <Link to="/notifications">
        <i className="fa-regular fa-heart"></i>
        <span>Notifications</span>
      </Link>

      <Link to="/create">
        <i className="fa-solid fa-plus"></i>
        <span>Create</span>
      </Link>

      <Link to="/profile">
        <i className="fa-solid fa-user"></i>
        <span>Profile</span>
      </Link>

      <button className="sidebar-logout" onClick={handleLogout}>
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;