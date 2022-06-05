import React, { Component } from 'react'
import { BrowserRouter as Route, Link } from 'react-router-dom';
import EnhancedTable from '../../components/Table/table'
import './styles.css'

class DatabaseArchivedPage extends Component {
    render() {
        return (
            <div>
                <div id="route_container">
                    <Link to={'/Database'} class="database_route">All</Link>
                    <Link to={'/DatabasePending'} class="database_route">Pending</Link>
                    <Link to={'/DatabaseArchived'} class="database_route selected">Archived</Link>
                </div>
                <EnhancedTable status={[4]} />
            </div>
        )
    }
}

export default DatabaseArchivedPage
