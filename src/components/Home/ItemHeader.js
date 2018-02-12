import React from "react";
import {Animated, Image, Text, View} from "react-native";
import PropTypes from "prop-types";
import {ScreenItemStyles as Styles} from "./Styles";

const ItemHeader = ({height, width, image, topText, bottomText}) => (
    <Animated.View contentContainerStyle={[Styles.imageBlockContainer, {
        width: width,
        height: height
    }]}>
        <Animated.Image
            style={[Styles.imageBlockImage, {
                width: width,
                height: height
            }]}
            source={image}
            resizeMode={Image.resizeMode.cover}
        />
        <View style={Styles.imageBlockTopTextWrapper}>
            <Text
                style={Styles.imageBlockTopText}
                ellipsizeMode="tail"
                numberOfLines={1}
            >{topText}</Text>
        </View>
        <View style={Styles.imageBlockBottomTextWrapper}>
            <Text
                style={Styles.imageBlockBottomText}
                ellipsizeMode="tail"
                numberOfLines={2}
            >{bottomText}</Text>
        </View>
    </Animated.View>
);

ItemHeader.propTypes = {
    height: PropTypes.any,
    width: PropTypes.any,
    image: Image.propTypes.source,
    topText: PropTypes.string,
    bottomText: PropTypes.string
};

export default ItemHeader;