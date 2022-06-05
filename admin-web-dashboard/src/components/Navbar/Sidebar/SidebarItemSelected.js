import React from 'react';
import './SidebarItemSelected.css';

function SidebarItemSelected(props) {
  return (
    <div id="sidebar_item_selected">
      <div id="item_name_selected" >{props.item_name}</div>
    </div>
  );
}

export default SidebarItemSelected;
