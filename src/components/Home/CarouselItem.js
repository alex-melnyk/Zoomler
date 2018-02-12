import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {ScreenItemStyles as Styles} from "./Styles";
import ItemHeader from "./ItemHeader";


const {
    width: screenWidth,
    height: screenHeight
} = Dimensions.get("window");

class CarouselItem extends Component {
    state = {
        animation: false,
        expanded: false
    };

    render() {
        const commonWidth = screenWidth * 0.8;
        const commonHeight = 300;

        const {data} = this.props;

        return (
            <View style={{
                width: commonWidth,
                height: commonHeight,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: 'red'
            }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        position: 'absolute'
                    }}
                    activeOpacity={1}
                    onPress={() => this.props.onPress(data)}
                >
                    <ItemHeader
                        width={commonWidth}
                        height={commonHeight}
                        image={data.image}
                        topText={data.text}
                        bottomText={data.text}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

CarouselItem.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.any.isRequired,
        image: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired,
    onPress: PropTypes.func.isRequired
};

export default CarouselItem;