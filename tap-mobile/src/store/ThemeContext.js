import React, { useCallback, useContext, useMemo, useState } from "react";
import { Theme } from "../style/themes";

const ThemeContext = React.createContext({
	theme: Theme.Light,
	setTheme: () => { }
});

export const ThemeContextProvider = ({ initialTheme = Theme.Dark, children }) => {
	const [theme, setT] = useState(initialTheme);

	const setTheme = useCallback((themeId) => {
		setT(typeof themeId === 'string' ? Theme[themeId] : themeId);
	}, []);

	const context = useMemo(() => {
		return {
			theme,
			setTheme
		}
	}, [theme]);

	return (
		<ThemeContext.Provider value={context}>
			{children}
		</ThemeContext.Provider>
	)
};

export const useTheme = () => useContext(ThemeContext);

export const useThemedStyle = (styleSheetCreator, arg1) => {
	const { theme } = useTheme();

	const stOb = useMemo(() => styleSheetCreator(theme, arg1), [theme, styleSheetCreator, arg1]);

	return stOb;
}

export default ThemeContext;