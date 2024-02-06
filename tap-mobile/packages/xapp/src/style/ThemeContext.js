import React, { useContext, useEffect, useMemo, useState } from "react";
import { Theme } from "./themes";
import { useColorScheme } from "react-native";
import { Storage } from "../store/deviceStorage";

const ThemeContext = React.createContext({
	themeId: Theme.Light,
	setThemeId: () => { }
});

export const ThemeContextProvider = ({ initialTheme = Theme.DARK, children }) => {
	const [themeId, setThemeId] = useState(initialTheme);

	useEffect(() => {
		Storage.set(Theme.STORAGE_HEY, themeId);
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
	return (themeId === Theme.SYSETM && scheme === 'dark') || themeId === Theme.DARK ? Theme.Dark : Theme.Light;
};

export const useThemedStyle = (styleSheetCreator, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
	const theme = useTheme();

	const stOb = useMemo(() => styleSheetCreator(theme, arg1, arg2, arg3, arg4, arg5, arg6, arg7), [theme, arg1, arg2, arg3, arg4, arg5, arg6, arg7]);

	return stOb;
};

export const usePrimaryColor = () => {
	const theme = useTheme();
	return theme.colors.primary;
};

export const useColor = (color) => {
	const theme = useTheme();
	let resp;
	if (Array.isArray(color)) {
		resp = [];
		for (let i = 0, s = color.length; i < s; i++)
			resp.push(theme.colors[color[i]])
	}
	else {
		resp = theme.colors[color];
	}

	return resp;

};

export const useIsDarkTheme = () => {
	const theme = useTheme();

	return theme.id === Theme.DARK;
};

export default ThemeContext;