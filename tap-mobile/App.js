import 'react-native-gesture-handler';
import { GlobalContextProvider } from './src/store/GlobalContext';
import { ThemeContextProvider } from './src/store/ThemeContext';
import { Theme } from './src/style/themes';
import { I18nContextProvider } from './src/store/I18nContext';
import { languages } from './src/i18n/i18n';
import { DEFAULT_LANGUAGE } from './src/common/config';
import Main from './src/Main';
//import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';


export default App = () => {
	let [fontsLoaded] = useFonts({
		Montserrat_400Regular,
		Montserrat_500Medium
	});
	if (!fontsLoaded)
		return null;
	return (
		<GlobalContextProvider>
			<ThemeContextProvider initialTheme={Theme.Light}>
				<I18nContextProvider language={DEFAULT_LANGUAGE} languages={languages}>
					<Main />
				</I18nContextProvider>
			</ThemeContextProvider>
		</GlobalContextProvider>
	)
};