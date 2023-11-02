import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { API_URL, DEFAULT_LANGUAGE, HOST, HTTP_TIMEOUT } from './src/common/config';
import Main from './src/Main';

import {
	useFonts,
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	Inter_800ExtraBold,
	Inter_900Black
} from '@expo-google-fonts/inter';
import { ThemeContextProvider } from 'xapp/src/style/ThemeContext';
import { useEffect, useState } from 'react';
import { Http } from 'xapp/src/common/Http';
import { storeDispatch, storeInit } from 'xapp/src/store/store';
import { appStore, providerStore, userStore } from './src/store/concreteStores';
import { I18nContextProvider } from 'xapp/src/i18n/I18nContext';
import { Theme } from 'xapp/src/style/themes';
import { Storage } from 'xapp/src/store/deviceStorage';
import { strings as en_US_str } from './src/languages/en_US/strings';
import { errors as en_US_err } from './src/languages/en_US/errors';
import { strings as sr_SP_str } from './src/languages/sr_SP/strings';
import { errors as sr_SP_err } from './src/languages/sr_SP/errors';
import I18n from 'xapp/src/i18n/I18n';
import { emptyFn } from 'xapp/src/common/utils';

storeInit(appStore());
storeInit(userStore());
storeInit(providerStore());

Http.init(HOST, API_URL, HTTP_TIMEOUT);
I18n.init({
	langs: {
		en_US: {
			id: 'en_US',
			code: 'en-US',
			name: 'English',
			dateCode: 'en',
			strings: en_US_str,
			errors: en_US_err
		},
		sr_SP: {
			id: 'sr_SP',
			code: 'sr-SP',
			name: 'Serbian',
			dateCode: 'sr-Latn-ba',
			strings: sr_SP_str,
			errors: sr_SP_err
		}
	},
	defautlLng: DEFAULT_LANGUAGE,
	fallbackLng: false,
	fallbackError: 'TAP_0'
});

export default App = () => {
	let [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		Inter_800ExtraBold,
		Inter_900Black
	});

	const [initialTheme, setInitialTheme] = useState(null);
	const [initialLanguage, setInitialLanguage] = useState(null);
	const [userChecked, setUserChecked] = useState(false);

	//Set language and theme from storage
	useEffect(() => {
		Promise.all([
			Storage.get(Theme.STORAGE_HEY, Theme.SYSETM),
			Storage.get(I18n.STORAGE_HEY, DEFAULT_LANGUAGE)
		]).then(([themeId, langId]) => {
			setInitialTheme(themeId);
			if (I18n.getLanguage().id !== langId)
				I18n.changeLanguageById(langId)
			setInitialLanguage(langId);
		});
	}, []);

	//Set font
	useEffect(() => {
		if (fontsLoaded)
			storeDispatch('app.set_font', 'Inter_400Regular');
	}, [fontsLoaded]);


	//Check user token
	useEffect(() => {
		if (initialLanguage && initialTheme) {
			// Http.getToken().then(t => {
			// 	Http.get('/user/profile', t, false, true)
			// 		.then(userData => {
			// 			if (userData)
			// 				storeDispatch('user.set_data', userData);
			// 		})
			// 		.catch(emptyFn)
			// 		.finally(() => {
			// 			setUserChecked(true);
			// 		})
			// });
			setUserChecked(true)
		}
	}, [initialLanguage, initialTheme]);


	if (!fontsLoaded || !initialTheme || !userChecked)
		return null;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeContextProvider initialTheme={initialTheme}>
				<I18nContextProvider>
					<Main />
				</I18nContextProvider>
			</ThemeContextProvider>
		</GestureHandlerRootView>
	)
};