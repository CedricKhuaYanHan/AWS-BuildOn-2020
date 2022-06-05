import React, { Component } from 'react'
import EnhancedTable from '../../components/Table/table'
import { BrowserRouter as Route, Link } from 'react-router-dom';

import './styles.css'

class DatabasePendingPage extends Component {
    render() {
        return (
            <div>
                <div id="route_container">
                    <Link to={'/Database'} class="database_route">All</Link>
                    <Link to={'/DatabasePending'} class="database_route selected">Pending</Link>
                    <Link to={'/DatabaseArchived'} class="database_route">Archived</Link>
                </div>
                <div id="level_container">
                    <Link to={'/Pending7'} class="level_route">Level 7</Link>
                    <Link to={'/Pending8'} class="level_route">Level 8</Link>
                    <Link to={'/Pending9'} class="level_route">Level 9</Link>
                    <Link to={'/Pending10'} class="level_route">Level 10</Link>
                </div>
            </div>
        )
    }
}

export default DatabasePendingPage
