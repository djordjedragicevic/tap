/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { GlobalContextProvider } from './src/store/GlobalContext';
import { ThemeContextProvider } from './src/store/ThemeContext';
import { Theme } from './src/style/theme';

const Root = () => {
	return (
		<GlobalContextProvider>
			<ThemeContextProvider initialTheme={Theme.Light}>
				<App />
			</ThemeContextProvider>
		</GlobalContextProvider>
	)
};

AppRegistry.registerComponent(appName, () => Root);
