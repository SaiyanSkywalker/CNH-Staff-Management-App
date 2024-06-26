/**
 * File: Navbar.tsx
 * Purpose: Navbar for application, contains links to other pages
 */
"use client";

import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { useAuth } from "@webSrc/contexts/AuthContext";

const Navbar = () => {
  const { auth } = useAuth();

  return (
    <nav className="navbar w-100 bg-[#067496] py-8 relative z-50" id="nav-bar">
      <div className="px-6 flex flex-col">
        {auth?.authenticated ? (
          <div className="flex d-block justify-end text-white mb-4">
            Welcome, {auth?.user?.username}
          </div>
        ) : (
          ""
        )}
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-lg">
            Staffing for Nurses
          </Link>
          {auth?.authenticated ? (
            <div className={`${styles["links-container"]}`}>
              <Link href="/schedule">Shift Schedule</Link>
              <Link href="/shift-capacity">Adjust Staff Capacity</Link>
              {auth.user?.roleId === 2 ? <Link href="/upload">Upload Schedule</Link> : undefined }
              <Link href="/shift-history">Shift History</Link>
              <Link href="/chat">Chat</Link>
              <Link href="/" onClick={() => auth.logout()}>
                Sign Out
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
