import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";

const HomeScreen = () => {
	console.log('HOEM SCREEN RENDER');
	return (
		<XScreen center>
			<XText>HOME SCREEN</XText>
		</XScreen>
	);
}

export default HomeScreen;