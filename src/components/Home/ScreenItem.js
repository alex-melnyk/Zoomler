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
import { BlurView } from 'expo';
import {ScreenItemStyles as Styles} from "./Styles";
import ItemHeader from "./ItemHeader";


const {
    width: screenWidth,
    height: screenHeight,
} = Dimensions.get("window");

class ScreenItem extends Component {
    scrollPosition = 0;
    scrollOffset = 0;

    state = {
        animation: false,
        scrollable: true,
        bound: new Animated.Value(0)
    };

    animateCollapsing = (time = 300) => {
        this.setState({
            animation: true
        });

        Animated.timing(this.state.bound, {
            toValue: 0,
            duration: time
        }).start(() => {
            this.setState({
                animation: false
            });

            this.props.onCollapsed();
        });
    };

    animateExanding = (time = 500) => {
        this.setState({
            animation: true
        });

        Animated.spring(this.state.bound, {
            toValue: 1,
            duration: time
        }).start(() => {
            this.setState({
                animation: false
            });
        });
    };

    continueClosing = () => {
        this.scrollOffset = 0;
        this.setState({scrollable: true});

        if (this.state.bound._value >= .75) {
            this.animateExanding(150);
        } else {
            this.animateCollapsing();
        }
    };

    automaticClose = () => {
        if (!this.state.animation) {
            this.animateCollapsing();
        }
    };

    normalizeAnimationValue = (value) => {
        if (value < 0) {
            return 0;
        } else if (value > 1) {
            return 1;
        }

        return value;
    };

    componentWillMount() {
        this.scrollPanResponder = PanResponder.create({
            // onStartShouldSetPanResponder: (evt, gestureState) => {
            //     console.log('PRE', gestureState.dy, this.scrollPosition);
            //
            //     return !this.scrollPosition && gestureState.dy >= 0;
            // },
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => {
            //     console.log('PRE CAPTURE', gestureState.dy, this.scrollPosition);
            //     return !this.scrollPosition && gestureState.dy >= 0;
            // },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // console.log('GESTURE', gestureState.dy, this.scrollPosition);
                this.scrollOffset = this.scrollPosition;
                return false;
            },
            // onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
            //     console.log('GESTURE CAPTURE', gestureState.dy, this.scrollPosition);
            //     return !this.scrollPosition && gestureState.dy >= 0;
            // },
            onPanResponderMove: (evt, gestureState) => {
                if (this.scrollPosition <= 0) {
                    if (this.state.scrollable) {
                        this.setState({
                            scrollable: false
                        });
                    }
                    const delta = this.normalizeAnimationValue(1 - (gestureState.dy - this.scrollOffset) / 200);
                    this.state.bound.setValue(delta);
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => {
                console.log('TERMINATION');
                this.continueClosing();
            },
            onPanResponderRelease: (evt, gestureState) => {
                console.log("RELEASING");
                this.continueClosing();
            },
            // onShouldBlockNativeResponder: (evt, gestureState) => false
        });
    }

    componentDidMount() {
        this.animateExanding();
    }

    render() {
        const {data} = this.props;
        const {bound} = this.state;

        const interWidth = bound.interpolate({
            inputRange: [0, 1],
            outputRange: [screenWidth * 0.8, screenWidth]
        });

        const interHeight = bound.interpolate({
            inputRange: [0, 1],
            outputRange: [300, screenHeight]
        });

        const imageHeight = bound.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 400]
        });

        const closeOpacity = this.state.bound.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        const blurOpacity = this.state.bound.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        const corners = this.state.bound.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0]
        });

        return (
            <Animated.View
                style={[Styles.containerWrapper, {
                    width: screenWidth,
                    height: screenHeight
                }]}
                activeOpacity={1}
            >
                <Animated.View style={{
                    position: 'absolute',
                    width: screenWidth,
                    height: screenHeight,
                    opacity: blurOpacity
                }}>
                    <BlurView
                        style={{flex:1}}
                        tint="dark"
                        intensity={32}
                    />
                </Animated.View>
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
                        <ItemHeader
                            width={interWidth}
                            height={imageHeight}
                            image={data.image}
                            topText={data.text}
                            bottomText={data.text}
                        />
                        <Animated.View style={[Styles.content, {
                            opacity: closeOpacity
                        }]}>
                            <Text style={Styles.contentText}>{data.text}</Text>
                        </Animated.View>
                    </ScrollView>

                    <ScreenItemCloseButton
                        style={{
                            opacity: closeOpacity
                        }}
                        onPress={this.automaticClose}
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