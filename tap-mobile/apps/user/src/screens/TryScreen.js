import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { XTabScreen, XTabView } from "xapp/src/components/tabview/XTabView";
import { View } from 'react-native';

const Screen1 = () => {
	return (
		<View>
			<XText>ET</XText>
		</View>
	)
}
const Screen2 = () => {
	return (
		<View>
			<XText>2</XText>
		</View>
	)
}

const TryScreen = (props) => {
	return (
		<View flex={1}>
			<XTabView onTabPress={(tabIndex) => { console.log("SELECT", tabIndex) }} flex={1}>
				<XTabScreen title='prvi' flex={1}>
					<XText>ET</XText>
				</XTabScreen>
				<XTabScreen title='drugi' >
					<XText>ET2</XText>
				</XTabScreen>
				<XTabScreen title='treci' >
					<XText>ET4</XText>
				</XTabScreen>
			</XTabView>
		</View>
	);
}

export default TryScreen;