import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
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
        previewItem: data[0]
    };

    contentItemWillExpand = (item) => {
        this.setState({
            previewMode: true,
            // previewItem: item
        })
    };

    contentItemDidCollapse = () => {
        this.setState({
            previewMode: false
        })
    };

    renderItem = ({item, index}) => {
        const width = screenWidth * 0.8;
        const height = 300;

        return (
            <CarouselItem
                id={index}
                data={{id: index, ...item}}
                width={width}
                height={height}
                enabled={this.state.previewItem === item}
                onPress={this.contentItemWillExpand}
            />
        );
    };

    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Carousel
                    slideStyle={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    ref={(ref) => this.carousel = ref}
                    useScrollView={true}
                    sliderWidth={screenWidth}
                    data={data}
                    renderItem={this.renderItem}
                    itemWidth={this.state.itemWidth}
                    onSnapToItem={(index) => this.setState({previewItem: data[index]})}
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