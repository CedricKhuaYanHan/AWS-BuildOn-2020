import React, { Component, useState } from 'react'
import './countPage.css';
import { BrowserRouter as Route, Link } from 'react-router-dom';


class CountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lvl7: 0,
            lvl8: 0,
            lvl9: 0,
            lvl10: 0,
            totalCount: 0
        };
    }

    componentDidMount() {
        fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/beds')
            .then(resp => resp.json())
            .then(resJson => {
                resJson = resJson.Items
                for (let i = 0; i < resJson.length; i++) {
                    if (resJson[i]['ID'].slice(0,1) == 'A') {
                        let l7Count = this.state.lvl7
                        console.log(resJson[i])
                        l7Count += resJson[i]['VisitorCount']
                        this.setState({ lvl7: l7Count })
                    }
                    else if (resJson[i]['ID'].slice(0, 1) == 'B') {
                        let l8Count = this.state.lvl8
                        l8Count += resJson[i]['VisitorCount']
                        this.setState({ lvl8: l8Count })
                    }
                    else if (resJson[i]['ID'].slice(0, 1) == 'C') {
                        let l9Count = this.state.lvl9
                        l9Count += resJson[i]['VisitorCount']
                        this.setState({ lvl9: l9Count })
                    }
                    else if (resJson[i]['ID'].slice(0, 1) == 'D') {
                        let l10Count = this.state.lvl10
                        l10Count += resJson[i]['VisitorCount']
                        this.setState({ lvl10: l10Count })
                    }
                    let totalCount = this.state.totalCount
                    totalCount += resJson[i]['VisitorCount']
                    this.setState({ totalCount: totalCount })
                }
            })
    }

    render() {

        return (
            <div id="count_page_container">
                <div id="count_div">
                    <div id="count">
                        Live Visitor Count: <span id="count_edit">{this.state.totalCount}</span>
                    </div>
                </div>
                <div id="levels_div">
                    <Link to={'/Count10'} class="level" id="level10">L10 - <span class="level_edit" id="level10_edit">{this.state.lvl10}</span></Link>
                    <Link to={'/Count9'} class="level" id="level9">L9 - <span class="level_edit" id="level9_edit">{this.state.lvl9}</span></Link>
                    <Link to={'/Count8'} class="level" id="level8">L8 - <span class="level_edit" id="level8_edit">{this.state.lvl8}</span></Link>
                    <Link to={'/Count7'} class="level" id="level7">L7 - <span class="level_edit" id="level7_edit" count='0'>{this.state.lvl7}</span></Link>
                </div>
            </div >
        )
    }
}

export default CountPage
