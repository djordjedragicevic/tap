import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const THEME = {
	LIGHT: 'Light',
	DARK: 'Dark'
};

export const values = {
	mainPaddingHorizontal: 8,
	borderRadius: 6,
	borderWidth: 0.8,
	disabledOpacity: 0.7
}

export const Theme = {
	Light: {
		id: THEME.LIGHT,
		colors: {
			primary: '#66b3ff',
			background: DefaultTheme.colors.background,
			backgroundElement: DefaultTheme.colors.card,
			textPrimary: '#404040',
			textSecondary: '#8c8c8c',
			textTertiary: '#cccccc',
			textLight: '#f2f2f3',
			borderColor: '#a6a6a6',
		},
		periodColors: {
			'FREE_APPOINTMENT': 'blue',
			'FREE_PERIOD': 'green',
			'BUSY_APPOINTMENT': 'red',
			'BUSY_BREAK': 'yellow'
		},
		values: values
	},
	
	Dark: {
		id: THEME.DARK,
		colors: {
			primary: '#007acc',
			background: DarkTheme.colors.background,
			backgroundElement: DarkTheme.colors.card,
			textPrimary: '#f2f2f3',
			textSecondary: '#e4e4e7',
			textTertiary: '#d7d7da',
			textLight: '#f2f2f3',
			borderColor: '#595959'
		},
		periodColors: {
			'FREE_APPOINTMENT': 'blue',
			'FREE_PERIOD': 'green',
			'BUSY_APPOINTMENT': 'red',
			'BUSY_BREAK': 'yellow'
		},
		values: values
	}
};