import React, {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import data from '../../data';
import CarouselItem from "./CarouselItem";
import ScreenItem from "./ScreenItem";

const {
    width: screenWidth,
    height: screenHeight
} = Dimensions.get("window");

class Home extends Component {
    state = {
        itemWidth: screenWidth * .8,
        previewMode: false,
        previewItem: null
    };

    contentItemWillExpand = (item) => {
        this.setState({
            previewMode: true,
            previewItem: item
        })
    };

    contentItemDidCollapse = () => {
        this.setState({
            previewMode: false
        })
    };

    renderItem = ({item, index}) => (
        <CarouselItem
            id={index}
            data={{id: index, ...item}}
            onPress={this.contentItemWillExpand}
        />
    );

    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Carousel
                    slideStyle={{
                        // flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    ref={(c) => {
                        this.carousel = c;
                    }}
                    useScrollView={true}
                    sliderWidth={screenWidth}
                    data={data}
                    renderItem={this.renderItem}
                    itemWidth={this.state.itemWidth}
                />
                {
                    this.state.previewMode &&
                    this.state.previewItem &&
                    <ScreenItem
                        data={this.state.previewItem}
                        onCollapsed={this.contentItemDidCollapse}
                    />
                }
            </View>
        );
    }

}

export default Home;