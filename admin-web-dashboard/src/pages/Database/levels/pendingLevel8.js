import React, { Component } from 'react'
import PendingTable from 'components/PendingTable/pendingTable';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import './styles.css'

class Pending8 extends Component {
    render() {
        return (
            <div>
                <div class="route_container">
                    <Link to={'/Database'} class="database_route">All</Link>
                    <Link to={'/DatabasePending'} class="database_route selected">Pending</Link>
                    <Link to={'/DatabaseArchived'} class="database_route">Archived</Link>
                </div>
                <div class="level_container">
                    <Link to={'/Pending7'} class="level_route">Level 7</Link>
                    <Link to={'/Pending8'} class="database_route selected">Level 8</Link>
                    <Link to={'/Pending9'} class="level_route">Level 9</Link>
                    <Link to={'/Pending10'} class="level_route">Level 10</Link>
                </div>
                <PendingTable level="B" />
            </div>
        )
    }
}

export default Pending8
