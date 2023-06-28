import 'react-native-gesture-handler';
import { Theme } from './src/style/themes';
import { languages } from './src/i18n/i18n';
import { DEFAULT_LANGUAGE } from './src/common/config';
import Main from './src/Main';
//import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { I18nContextProvider } from './src/i18n/I18nContext';
import { ThemeContextProvider } from './src/style/ThemeContext';


export default App = () => {
	let [fontsLoaded] = useFonts({
		Montserrat_400Regular,
		Montserrat_500Medium
	});
	if (!fontsLoaded)
		return null;
	return (
		<ThemeContextProvider initialTheme={Theme.Light}>
			<I18nContextProvider language={DEFAULT_LANGUAGE} languages={languages}>
				<Main />
			</I18nContextProvider>
		</ThemeContextProvider>
	)
};