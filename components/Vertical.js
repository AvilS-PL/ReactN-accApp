import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Vertical extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Text> Vertical </Text>
                <Text> Vertical </Text>
                <Text> Vertical </Text>
                <Text> Vertical </Text>
            </View>
        );
    }
}
