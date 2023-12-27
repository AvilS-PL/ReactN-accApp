import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Horizontal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Text> Horizontal </Text>
                <Text> Horizontal </Text>
                <Text> Horizontal </Text>
                <Text> Horizontal </Text>
                <Text> Horizontal </Text>
            </View>
        );
    }
}
