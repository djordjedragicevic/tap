/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { GlobalContextProvider } from './src/store/GlobalContext';
import { ThemeContextProvider } from './src/store/ThemeContext';
import { Theme } from './src/style/themes';
import { I18nContextProvider } from './src/store/I18nContext';
import { languages } from './src/common/i18n';
import { DEFAULT_LANGUAGE } from './src/common/config';

const Root = () => {
	return (
		<GlobalContextProvider>
			<ThemeContextProvider initialTheme={Theme.Light}>
				<I18nContextProvider language={languages[DEFAULT_LANGUAGE]}>
					<App />
				</I18nContextProvider>
			</ThemeContextProvider>
		</GlobalContextProvider>
	)
};

AppRegistry.registerComponent(appName, () => Root);
