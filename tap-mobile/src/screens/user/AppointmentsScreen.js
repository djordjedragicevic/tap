import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AppointmentsScreen = () => {
	return (
		<View style={styles.screen}>
			<Text>Appointments screen</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default AppointmentsScreen;
