import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {ScreenItemStyles as Styles} from "./Styles";


const {
    width: screenWidth,
    height: screenHeight,
} = Dimensions.get("screen");

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
                borderRadius: 5,
                overflow: 'hidden'
            }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        position: 'absolute'
                    }}
                    activeOpacity={1}
                    onPress={() => this.props.onPress(data)}
                >
                    <Image
                        style={{
                            width: commonWidth,
                            height: commonHeight
                        }}
                        source={data.image}
                        resizeMode={Image.resizeMode.cover}
                    />
                    <View style={Styles.imageBlockBottomTextWrapper}>
                        <Text
                            style={Styles.imageBlockBottomText}
                            ellipsizeMode="tail"
                            numberOfLines={2}
                        >{data.text}</Text>
                    </View>
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