import React from 'react';
import './SidebarItem.css';

function SidebarItem(props) {
  return (
    <div id="sidebar_item">
      <div id="item_name" >{props.item_name}</div>
    </div>
  );
}

export default SidebarItem;
