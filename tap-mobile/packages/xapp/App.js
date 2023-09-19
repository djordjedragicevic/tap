import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import XText from './src/components/basic/XText';

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.container}>
				<XText size={24} weight={700}>XApp</XText>
				<StatusBar style="auto" />
			</View>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});
