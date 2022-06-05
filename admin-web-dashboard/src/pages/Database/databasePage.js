import React, { Component } from 'react'
import { BrowserRouter as Route, Link } from 'react-router-dom';
import EnhancedTable from '../../components/Table/table'
import './styles.css'

class DatabasePage extends Component {
    render() {
        return (
            <div>
                <div id="route_container">
                    <Link to={'/Database'} class="database_route selected">All</Link>
                    <Link to={'/DatabasePending'} class="database_route">Pending</Link>
                    <Link to={'/DatabaseArchived'} class="database_route">Archived</Link>
                </div>
                <EnhancedTable status={[0,1,2,3,4]} />
            </div>
        )
    }
}

export default DatabasePage
