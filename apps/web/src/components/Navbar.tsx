"use client"

import Link from 'next/link';
import styles from "../styles/Navbar.module.css";
import { useContext } from "react";
import { useAuth } from '@webSrc/context/Auth';
import Login from './Login';

// Once authentication is set up we can update the nav bar to show user links
const Navbar = () => {
  const { auth } = useAuth();

  return (
  <div className="navbar w-100 bg-[#067496] h-20" id="nav-bar">

    {auth?.authenticated ? (
      <div className={`${styles["links-container"]}`}>
          <Link href="/">Adjust Capacity</Link>
          <Link href="/upload">Upload Schedule</Link>
          <Link href="/" onClick={() => auth.logout()}>Sign Out</Link>
      </div>
    ) : ""}
  </div>
  );
}
export default Navbar