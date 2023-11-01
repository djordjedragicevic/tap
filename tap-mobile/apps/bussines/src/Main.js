import { StatusBar } from "expo-status-bar";
import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";

const Main = () => {
	return (
		<>
			<XScreen center>
				<XText>HAJMO DALJE !</XText>
			</XScreen>
			<StatusBar style="auto" />
		</>
	);
}

export default Main;