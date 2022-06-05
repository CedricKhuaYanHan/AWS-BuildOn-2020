import React, {useEffect} from 'react';
import { useLocation, BrowserRouter as Route, Link } from 'react-router-dom';

import SidebarItem from './SidebarItem'
import SidebarItemSelected from './SidebarItemSelected'
import './Sidebar.css';
import farrer_park_logo from "assets/farrer_park_logo.png"

function Sidebar() {
  let location = useLocation();
  if (location.pathname.slice(1) == "Database") {
    return (
      <div id="sidebar">
        <div id="logo_div">
          <img id="logo" src={farrer_park_logo} alt=""/>
        </div>
        <Link to={'/Count'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Count"} />
        </Link>
        <Link to={'/Database'} style={{ textDecoration: 'none' }}>
          <SidebarItemSelected item_name={"Database"} />
        </Link>
        <Link to={'/Regulations'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Regulations"} />
        </Link>
        <Link to={'/Schedule_7'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Schedule"} />
        </Link>
      </div>
    );
  } else if (location.pathname.slice(1) == "Regulations") {
    return (
      <div id="sidebar">
        <div id="logo_div">
          <img id="logo" src={farrer_park_logo} alt="" />
        </div>
        <Link to={'/Count'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Count"} />
        </Link>
        <Link to={'/Database'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Database"} />
        </Link>
        <Link to={'/Regulations'} style={{ textDecoration: 'none' }}>
          <SidebarItemSelected item_name={"Regulations"} />
        </Link>
        <Link to={'/Schedule_7'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Schedule"} />
        </Link>
      </div>
    );
  }
  else if (location.pathname.slice(1) == "Schedule_7") {
    return (
      <div id="sidebar">
        <div id="logo_div">
          <img id="logo" src={farrer_park_logo} alt="" />
        </div>
        <Link to={'/Count'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Count"} />
        </Link>
        <Link to={'/Database'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Database"} />
        </Link>
        <Link to={'/Regulations'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Regulations"} />
        </Link>
        <Link to={'/Schedule_7'} style={{ textDecoration: 'none' }}>
          <SidebarItemSelected item_name={"Schedule"} />
        </Link>
      </div>
    );
  }
  else {
    return (
      <div id="sidebar">
        <div id="logo_div">
          <img id="logo" src={farrer_park_logo} alt="" />
        </div>
        {/* {['Count', 'Database', 'Regulations'].map((text, index) => (
          <Link to={'/' + text} style={{ textDecoration: 'none' }}>
            <SidebarItem item_name={text} />
          </Link>
        ))} */}
        <Link to={'/Count'} style={{ textDecoration: 'none' }}>
          <SidebarItemSelected item_name={"Count"} />
        </Link>
        <Link to={'/Database'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Database"} />
        </Link>
        <Link to={'/Regulations'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Regulations"} />
        </Link>
        <Link to={'/Schedule_7'} style={{ textDecoration: 'none' }}>
          <SidebarItem item_name={"Schedule"} />
        </Link>
      </div>
    );
  } 
}

export default Sidebar;
