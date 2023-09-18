import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import XText from '../components/basic/XText';
import { Animated, ScrollView, View } from "react-native";
import { useRef } from "react";
import { useHeaderHeight } from "@react-navigation/elements";

const H_MAX_HEIGHT = 300;

const genData = function () {
	let d = [];
	for (let i = 1; i < 50; i++)
		d.push({
			id: i,
			text: 'Item ' + i
		});

	return d;
};

const DATA = genData();

const TryAH = () => {
	const offset = useRef(new Animated.Value(0)).current;
	const insets = useSafeAreaInsets();
	const rnHH = useHeaderHeight();

	console.log(insets.top)
	const headerHeight = offset.interpolate({
		inputRange: [0, H_MAX_HEIGHT],
		outputRange: [H_MAX_HEIGHT, 0 + rnHH],
		extrapolate: 'clamp'
	});

	const opacity = offset.interpolate({
		inputRange: [0, H_MAX_HEIGHT],
		outputRange: [1, 0],
	})

	console.log(headerHeight);
	return (
		<SafeAreaView style={{ flex: 1, borderWidth: 1 }}>
			<Animated.View
				style={{
					backgroundColor: 'cyan',
					height: headerHeight,
					width: '100%',
					top: 0,
					left: 0,
					//opacity: opacity,
					position: 'absolute',
					zIndex: 2,
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				{/* <XText style={{ fontSize: 40 }}>HEADER</XText> */}
			</Animated.View>

			<ScrollView
				style={{
					backgroundColor: 'red',
					flex: 1,
					zIndex: 1,
				}}
				contentContainerStyle={{
					paddingTop: H_MAX_HEIGHT
				}}
				showsVerticalScrollIndicator={true}
				scrollEventThrottle={1}
				// onScroll={({ nativeEvent: { contentOffset: { x, y } } }) => {
				// 	console.log(y);
				// 	offset -= y
				// }}
				onScroll={Animated.event([
					{
						nativeEvent: {
							contentOffset: {
								y: offset,
							},
						},
					},
				], { useNativeDriver: false })}
			>
				{DATA.map((i, idx) => (
					<View key={idx} style={{ borderWidth: 1, height: 50, marginBottom: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'gray' }}>
						<XText light>{i.text}</XText>
					</View>
				))}
			</ScrollView>
		</SafeAreaView >
	);
}

export default TryAH;