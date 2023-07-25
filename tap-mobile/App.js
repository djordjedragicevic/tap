import 'react-native-gesture-handler';
import { Theme } from './src/style/themes';
import { languages } from './src/i18n/i18n';
import { DEFAULT_LANGUAGE } from './src/common/config';
import Main from './src/Main';
//import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import {
	useFonts,
	Roboto_100Thin,
	Roboto_100Thin_Italic,
	Roboto_300Light,
	Roboto_300Light_Italic,
	Roboto_400Regular,
	Roboto_400Regular_Italic,
	Roboto_500Medium,
	Roboto_500Medium_Italic,
	Roboto_700Bold,
	Roboto_700Bold_Italic,
	Roboto_900Black,
	Roboto_900Black_Italic
} from '@expo-google-fonts/roboto';

// import {
// 	useFonts,
// 	Inter_400Regular,
// 	Inter_500Medium,
// 	Inter_600SemiBold,
// 	Inter_700Bold,
// 	Inter_800ExtraBold,
// 	Inter_900Black
// } from '@expo-google-fonts/inter';
import { I18nContextProvider } from './src/i18n/I18nContext';
import { ThemeContextProvider } from './src/style/ThemeContext';
import { useEffect, useState } from 'react';
import { Http } from './src/common/Http';
import { storeDispatch, storeInit } from './src/store/store';
import { appStore, testStore, userStore } from './src/store/concreteStores';

storeInit(appStore());
storeInit(userStore());
storeInit(testStore());

export default App = () => {
	let [fontsLoaded] = useFonts({
		Roboto_100Thin,
		Roboto_100Thin_Italic,
		Roboto_300Light,
		Roboto_300Light_Italic,
		Roboto_400Regular,
		Roboto_400Regular_Italic,
		Roboto_500Medium,
		Roboto_500Medium_Italic,
		Roboto_700Bold,
		Roboto_700Bold_Italic,
		Roboto_900Black,
		Roboto_900Black_Italic
	});

	const [inited, setInited] = useState(false);

	useEffect(() => {
		const asyncWrap = async () => {


			const userData = await Http.get('/user/by-token');
			console.log("USER STATE", userData);
			if (userData) {
				storeDispatch('user.set_data', userData);
			}

			setInited(true);
		};

		asyncWrap();
	}, []);

	useEffect(() => {
		if (fontsLoaded)
			storeDispatch('app.set_font', 'Roboto_500Medium');
	}, [fontsLoaded]);

	if (!fontsLoaded || !inited)
		return null;

	return (
		<ThemeContextProvider initialTheme={Theme.Light}>
			<I18nContextProvider language={DEFAULT_LANGUAGE} languages={languages}>
				<Main />
			</I18nContextProvider>
		</ThemeContextProvider>
	)
};