import 'react-native-gesture-handler';
import { Theme } from './src/style/themes';
import { languages } from './src/i18n/i18n';
import { DEFAULT_LANGUAGE } from './src/common/config';
import Main from './src/Main';
//import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { I18nContextProvider } from './src/i18n/I18nContext';
import { ThemeContextProvider } from './src/style/ThemeContext';
import { useEffect, useState } from 'react';
import { S_KEY, SecureStorage } from './src/store/deviceStorage';
import { Http } from './src/common/Http';
import { storeDispatch, storeInit } from './src/store/store';
import { appStore, testStore, userStore } from './src/store/concreteStores';

storeInit(appStore());
storeInit(userStore());
storeInit(testStore());

export default App = () => {
	let [fontsLoaded] = useFonts({
		Montserrat_400Regular,
		Montserrat_500Medium
	});

	const [inited, setInited] = useState(false);

	useEffect(() => {
		const asyncWrap = async () => {
			const token = await Http.getToken() || 'apc';
			if (token) {
				const userData = await Http.post('/user/by-token', { token });
				if (userData)
					storeDispatch('user.set_data', userData);

			}
			setInited(true);
		};

		asyncWrap();
	}, []);


	if (!fontsLoaded && inited)
		return null;

	return (
		<ThemeContextProvider initialTheme={Theme.Light}>
			<I18nContextProvider language={DEFAULT_LANGUAGE} languages={languages}>
				<Main />
			</I18nContextProvider>
		</ThemeContextProvider>
	)
};