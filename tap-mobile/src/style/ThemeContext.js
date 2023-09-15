import React, { useContext, useEffect, useMemo, useState } from "react";
import { THEME, Theme } from "./themes";
import { useColorScheme } from "react-native";
import { KEY, Storage } from "../store/deviceStorage";

const ThemeContext = React.createContext({
	themeId: Theme.Light,
	setThemeId: () => { }
});

export const ThemeContextProvider = ({ initialTheme = THEME.DARK, children }) => {
	const [themeId, setThemeId] = useState(initialTheme);

	useEffect(() => {
		Storage.set(KEY.THEME, themeId);
	}, [themeId])

	const context = useMemo(() => {
		return {
			themeId,
			setThemeId
		}
	}, [themeId]);

	return (
		<ThemeContext.Provider value={context}>
			{children}
		</ThemeContext.Provider>
	)
};

export const useTheme = () => {
	const { themeId } = useContext(ThemeContext);
	const scheme = useColorScheme();
	return (themeId === THEME.SYSETM && scheme === 'dark') || themeId === THEME.DARK ? Theme.Dark : Theme.Light;
};

export const useThemedStyle = (styleSheetCreator, arg1, arg2, arg3) => {
	const theme = useTheme();

	const stOb = useMemo(() => styleSheetCreator(theme, arg1, arg2, arg3), [theme, arg1, arg2, arg3]);

	return stOb;
};

export const usePrimaryColor = () => {
	const theme = useTheme();
	return theme.colors.primary;
};

export const useIsDarkTheme = () => {
	const theme = useTheme();

	return theme.id === THEME.DARK;
}

export default ThemeContext;