import React, { Component } from 'react';
import { Header, Item, Input, Icon, Button, Text, View } from 'native-base';
class SearchBar extends Component {
    render() {
        if (this.props.active) {
            return (
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-search" />
                            <Input style={{color: "black"}} onChange={this.props.search} placeholder="Search Bookings" />
                        </Item>
                    </Header>
            );
        }
        else {
            return (<View></View>)
        }
    }
}

export default SearchBar