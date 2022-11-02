/**
 * @author Djordje Dragicevic <djordje.dragicevic@yahoo.com>
 */
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { USER_APPINTMENTS_SCREEN } from '../navigators/routes';

const HomeScreen = ({ navigation }) => {
	return (
		<View style={styles.screen}>
			<Text>HOME SCREEN</Text>
			<Button
				title="Go to Details"
				onPress={() => navigation.navigate(USER_APPINTMENTS_SCREEN)}
			/>
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

export default HomeScreen;
