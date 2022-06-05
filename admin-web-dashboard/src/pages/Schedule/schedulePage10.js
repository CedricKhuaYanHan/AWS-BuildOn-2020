import React, { Component } from 'react'
import './styles.css';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import TimelineResource from '../../components/Scheduler/scheduler'
class SchedulePage10 extends Component {
    render() {
        return (
            <div>
                <div id="route_container">
                    <Link to={'/Schedule_7'} class="database_route">Level 7</Link>
                    <Link to={'/Schedule_8'} class="database_route">Level 8</Link>
                    <Link to={'/Schedule_9'} class="database_route">Level 9</Link>
                    <Link to={'/Schedule_10'} class="database_route selected">Level 10</Link>
                </div>
                <TimelineResource level="D" />
            </div>
        )
    }
}

export default SchedulePage10