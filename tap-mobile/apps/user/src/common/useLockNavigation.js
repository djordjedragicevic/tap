import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";

export function useLockNavigation(condition, navigation) {

	useEffect(() => {

		const unsubscribe = navigation.addListener('beforeRemove', (e) => {
			if (condition)
				e.preventDefault();
		});

		const onBack = () => {
			return !!condition;
		}

		const backHandler = Platform.OS === 'android' ? BackHandler.addEventListener('hardwareBackPress', onBack) : null;

		return () => {
			unsubscribe()
			if (Platform.OS === 'android')
				backHandler.remove();
		};

	}, [condition, navigation]);
};