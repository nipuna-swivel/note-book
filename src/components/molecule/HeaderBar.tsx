"use client";
import React, { useState } from "react";
import { LogIn, LogOut, User, Menu } from "lucide-react";

function HeaderBar({ user, setUser, toggleSidebar }:any) {
  const handleLogin = () => setUser({ name: "Nipuna" });
  const handleLogout = () => setUser(null);

  return (
    <header className="flex justify-between items-center bg-white shadow px-4 py-3 border-b border-gray-200 sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg sm:text-xl font-semibold text-gray-700">NoteBook</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-2 text-gray-600">
              <User size={18} />
              <span className="text-sm sm:text-base">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 text-white px-2 sm:px-3 py-1.5 rounded hover:bg-red-600 transition text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 bg-blue-500 text-white px-2 sm:px-3 py-1.5 rounded hover:bg-blue-600 transition text-sm"
          >
            <LogIn size={16} />
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default HeaderBar;
