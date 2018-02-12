import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {CarouselItemStyles as Styles} from "./Styles";
import ItemHeader from "./ItemHeader";

const CarouselItem = ({data, width, height, enabled, onPress}) => {
    return (
        <View style={[Styles.container, {
            width,
            height
        }]}>
            <TouchableOpacity
                style={Styles.contentWrapper}
                activeOpacity={1}
                onPress={() => enabled && onPress(data)}
            >
                <ItemHeader
                    width={width}
                    height={height}
                    image={data.image}
                    topText={data.text}
                    bottomText={data.text}
                />
            </TouchableOpacity>
        </View>
    );
};

CarouselItem.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.any.isRequired,
        image: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired,
    width: PropTypes.any,
    height: PropTypes.any,
    enabled: PropTypes.bool,
    onPress: PropTypes.func.isRequired
};

CarouselItem.defaultProps = {
    enabled: false
};

export default CarouselItem;