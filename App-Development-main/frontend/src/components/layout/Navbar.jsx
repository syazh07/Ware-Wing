// src/components/layout/Navbar.jsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role, username } = useSelector(
    (state) => state.auth || {}
  );

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      roles: ["ADMIN", "MANAGER", "VIEWER"],
    },
    {
      name: "Inventory",
      path: "/stock-items",
      roles: ["ADMIN", "MANAGER", "VIEWER"],
    },
    {
      name: "Movements",
      path: "/stock-movements",
      roles: ["ADMIN", "MANAGER", "VIEWER"],
    },
    {
      name: "Orders",
      path: "/purchase-orders",
      roles: ["ADMIN", "MANAGER", "VIEWER"],
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      roles: ["ADMIN", "MANAGER"],
    },
  ];

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <nav
      className="navbar"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="navbar-brand">
        WareWing
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        {navLinks
          .filter((link) => link.roles.includes(role))
          .map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {link.name}
            </NavLink>
          ))}
      </div>

      {/* User Section */}
      <div className="navbar-right">
        {username && (
          <span className="navbar-username">
            {username}
          </span>
        )}

        {role && (
          <span className="navbar-role">
            {role}
          </span>
        )}

        <button
          type="button"
          className="btn-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;