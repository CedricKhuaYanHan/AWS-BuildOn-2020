import React from 'react';
import './Headerbar.css';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

function Headerbar() {
  return (
    <div id="headerbar">
      <div id="searchbar">
        <SearchIcon id="search_icon" />
        <input type="text" id="search_input" placeholder="Search for visitor..."/>
      </div>
      <div id="notifications_div">
        <NotificationsIcon id="notifications_icon" />
      </div>
      <div id="profile_div">
        <AccountBoxIcon id="profile_icon" />
        <div id="profile_name">Admin</div>
        <ArrowDropDownIcon id="dropdown_icon" />
      </div>
    </div>
  );
}

export default Headerbar;
