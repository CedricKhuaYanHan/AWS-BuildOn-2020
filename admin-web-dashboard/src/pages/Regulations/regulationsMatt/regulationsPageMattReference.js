import React, { Component } from 'react'
import './regulationsPage.css'
import EditIcon from '@material-ui/icons/Edit';

class RegulationsPage extends Component {
    render() {
        function visitorCountClick(e){
            let edit = document.getElementById("visitor_count_edit")
            edit.readOnly = false;
            edit.addEventListener("focusout", () => {
                edit.readOnly = true;
            })
        }

        function ageLimitClick(e){
            let edit = document.getElementById("age_limit_edit")
            edit.readOnly = false;
            edit.addEventListener("focusout", () => {
                edit.readOnly = true;
            })
        }

        function visitationTimingClick(e){
            let edit = document.getElementById("visitation_timing_edit")
            edit.readOnly = false;
            edit.addEventListener("focusout", () => {
                edit.readOnly = true;
            })
        }

        return (
            <div id="regulations_page_container">
                <div id="regulations_container">
                    <div id="visitor_count" className="regulation">
                        <div className="text">
                            <div className="fixed">Visitor count limit per level (ward):&nbsp;</div>
                            <input readOnly="true" className="edit" id="visitor_count_edit" defaultValue="35" />
                        </div>
                        <EditIcon id="visitor_count_button" onClick={visitorCountClick} />
                    </div>
                    <div id="age_limit" className="regulation">
                        <div className="text">
                            <div className="fixed">Age limit:&nbsp;</div>
                            <input readOnly="true" className="edit" id="age_limit_edit" defaultValue="18" />
                        </div>
                        <EditIcon id="age_limit_button" onClick={ageLimitClick} />
                    </div>
                    <div id="visitation_timing" className="regulation">
                        <div className="text">
                            <div className="fixed">Visitation timing:&nbsp;</div>
                            <input readOnly="true" className="edit" id="visitation_timing_edit" defaultValue="0900 - 1700"/>
                        </div>
                        <EditIcon id="visitation_timing_button" onClick={visitationTimingClick} />
                    </div>
                </div>
            </div>
        )
    }
}

export default RegulationsPage
