import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    PanResponder,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {ScreenItemStyles as Styles} from "./Styles";


const {
    width: screenWidth,
    height: screenHeight,
} = Dimensions.get("screen");

class ScreenItem extends Component {
    scrollPosition = 0;

    state = {
        animation: false,
        expanded: new Animated.Value(0),
        scrollable: true,
        interWidth: new Animated.Value(screenWidth * 0.8),
        interHeight: new Animated.Value(300)
    };

    animateCollapsing = () => {
        this.setState({
            animation: true
        });

        Animated.parallel([
            Animated.timing(this.state.expanded, {
                toValue: 0,
                duration: 300,
                easing: Easing.elastic(1)
            }),
            Animated.timing(this.state.interWidth, {
                toValue: screenWidth * 0.8,
                duration: 500,
                easing: Easing.elastic(1)
            }),
            Animated.timing(this.state.interHeight, {
                toValue: 300,
                duration: 500,
                easing: Easing.elastic(1)
            }),
        ]).start(() => {
            this.props.onCollapsed();
        });
    };

    onAutomaticClose = () => {
        if (!this.state.animation) {
            this.animateCollapsing();
        }
    };

    isAvailableToCollapse = () => {
        return (this.scrollPosition === 0);
    };

    componentWillMount() {
        this.scrollPanResponder = PanResponder.create({
            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!

                // gestureState.d{x,y} will be set to zero now
                // console.log('scroll onPanResponderGrant');

                if (this.scrollPosition === 0) {
                    // this.setState({scrollable: false});
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                // The most recent move distance is gestureState.move{X,Y}

                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
                console.log('scroll onPanResponderMove', this.scrollPosition, gestureState.dy);
                // evt.reject();

                if (this.scrollPosition <= 0 && gestureState.dy) {
                    this.setState({
                        scrollable: false,
                        collapsing: new Animated.Value(gestureState.dy)
                    });
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => {
                // console.log('scroll onPanResponderTerminationRequest');
                this.setState({scrollable: true});
                return true;
            },
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                this.setState({scrollable: true});
                // console.log('scroll onPanResponderRelease');
            }
        });
    }

    componentDidMount() {
        this.setState({
            animation: true
        });

        Animated.parallel([
            Animated.timing(this.state.expanded, {
                toValue: 1,
                duration: 500,
                easing: Easing.elastic(1)
            }),
            Animated.timing(this.state.interWidth, {
                toValue: screenWidth,
                duration: 500,
                easing: Easing.elastic(1)
            }),
            Animated.timing(this.state.interHeight, {
                toValue: screenHeight,
                duration: 500,
                easing: Easing.elastic(1)
            }),
        ]).start(() => {
            this.setState({
                animation: false
            });
        });
    }

    render() {
        const {data} = this.props;
        const {
            interWidth,
            interHeight
        } = this.state;

        // const interWidth = this.state.expanded.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: [screenWidth * 0.8, screenWidth]
        // });
        //
        // const interHeight = this.state.expanded.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: [300, screenHeight]
        // });

        const imageHeight = this.state.expanded.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 400]
        });

        const closeOpacity = this.state.expanded.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        const corners = this.state.expanded.interpolate({
            inputRange: [0, 1],
            outputRange: [5, 0]
        });

        return (
            <Animated.View
                style={[Styles.containerWrapper, {
                    width: screenWidth,
                    height: screenHeight
                }]}
                activeOpacity={1}
            >
                <Animated.View style={[Styles.contentContainer, {
                    width: interWidth,
                    height: interHeight,
                    borderRadius: corners
                }]}>
                    <ScrollView
                        {...this.scrollPanResponder.panHandlers}
                        scrollEventThrottle={5}
                        scrollEnabled={this.state.scrollable}
                        onScroll={({nativeEvent: {contentOffset: {y}}}) => {
                            this.scrollPosition = y
                        }}
                    >
                        <Animated.View contentContainerStyle={[Styles.imageBlockContainer, {
                            width: interWidth,
                            height: imageHeight
                        }]}>
                            <Animated.Image
                                style={[Styles.imageBlockImage, {
                                    height: imageHeight
                                }]}
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
                        </Animated.View>
                        <View style={Styles.content}>
                            <Text style={Styles.contentText}>{data.text}</Text>
                        </View>
                    </ScrollView>

                    <ScreenItemCloseButton
                        style={{
                            opacity: closeOpacity
                        }}
                        onPress={this.onAutomaticClose}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

ScreenItem.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.any.isRequired,
        image: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired,
    onCollapsed: PropTypes.func.isRequired
};

/**
 *
 * @param style
 * @param onPress
 * @constructor
 */
const ScreenItemCloseButton = ({style, onPress}) => (
    <View style={{
        position: 'absolute',
        top: 10,
        right: 10
    }}>
        <TouchableOpacity onPress={onPress}>
            <Animated.View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                width: 30,
                height: 30,
                backgroundColor: 'white',
                ...style
            }}>
                <Text>X</Text>
            </Animated.View>
        </TouchableOpacity>
    </View>
);

ScreenItemCloseButton.propTypes = {
    onPress: PropTypes.func.isRequired
};

export default ScreenItem;