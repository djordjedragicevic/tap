import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initLangs, LANGS } from 'xapp/src/i18n/i18n';
import { API_URL, DEFAULT_LANGUAGE, HTTP_TIMEOUT } from './src/common/config';
import Main from './src/Main';
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
import { ThemeContextProvider } from 'xapp/src/style/ThemeContext';
import { useEffect, useState } from 'react';
import { Http } from 'xapp/src/common/Http';
import { storeDispatch, storeInit } from 'xapp/src/store/store';
import { appStore, testStore, userStore } from './src/store/concreteStores';
import en_US from './src/languages/en_US';
import sr_SP from './src/languages/sr_SP';
import { I18nContextProvider } from 'xapp/src/i18n/I18nContext';
import { Theme } from 'xapp/src/style/themes';
import { Storage } from 'xapp/src/store/deviceStorage';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

storeInit(appStore());
storeInit(userStore());
storeInit(testStore());

Http.init(API_URL, HTTP_TIMEOUT);

// Theme.initThemes({
// 	[Theme.LIGHT]: {
// 		background: '#f0f0f5',
// 		backgroundElement: DefaultTheme.colors.card
// 	},
// 	[Theme.LIGHT]: {
// 		background: DarkTheme.colors.background,
// 		backgroundElement: DarkTheme.colors.card
// 	}
// });

const languages = initLangs({
	[LANGS.en_US]: {
		id: 'en_US',
		code: 'en-US',
		name: 'English',
		dateCode: 'en',
		strings: en_US
	},
	[LANGS.sr_SP]: {
		id: 'sr_SP',
		code: 'sr-SP',
		name: 'Serbian',
		dateCode: 'sr-Latn-ba',
		strings: sr_SP
	}
});

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


	const [initialTheme, setInitialTheme] = useState(null);

	useEffect(() => {

		async function wrap() {
			const token = await Http.getToken();

			Promise.all([
				Storage.get(Theme.STORAGE_HEY, Theme.SYSETM),
				Http.get('/user/by-token', token, false, true)
			])
				.then(([themeId, userData]) => {
					if (userData)
						storeDispatch('user.set_data', userData);

					setInitialTheme(themeId);

				})
				.catch(e => console.log("ERR", e))
		}

		wrap();

	}, []);


	useEffect(() => {
		if (fontsLoaded)
			storeDispatch('app.set_font', 'Roboto_500Medium');
	}, [fontsLoaded]);

	if (!fontsLoaded || !initialTheme)
		return null;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeContextProvider initialTheme={initialTheme}>
				<I18nContextProvider language={DEFAULT_LANGUAGE} languages={languages}>
					<Main />
				</I18nContextProvider>
			</ThemeContextProvider>
		</GestureHandlerRootView>
	)
};