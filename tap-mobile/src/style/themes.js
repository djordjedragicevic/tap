import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const THEME = {
	LIGHT: 'Light',
	DARK: 'Dark'
};

export const values = {
	mainPaddingHorizontal: 8,
	borderRadius: 8,
	borderWidth: 0.8,
	disabledOpacity: 0.7
}


export const Theme = {
	Light: {
		id: THEME.LIGHT,
		colors: {
			primary: '#005c99',
			primaryDark: '#0080ff',
			primaryLight: '#cce6ff',
			background: '#f0f0f5',
			backgroundElement: DefaultTheme.colors.card,
			textPrimary: '#404040',
			textSecondary: '#8c8c8c',
			textTertiary: '#cccccc',
			textLight: '#f2f2f3',

			borderColor: '#a6a6a6',
			red: 'red'
		},
		periodColors: {
			'FREE_APPOINTMENT': '#3399ff',
			'FREE_PERIOD': 'green',
			'BUSY_APPOINTMENT': 'red',
			'BUSY_BREAK': 'orange'
		},
		values: values
	},

	Dark: {
		id: THEME.DARK,
		colors: {
			primary: '#66c2ff',
			primaryDark: '#005c99',
			primaryLight: '#4db8ff',
			background: DarkTheme.colors.background,
			backgroundElement: DarkTheme.colors.card,
			textPrimary: '#f2f2f3',
			textSecondary: '#e4e4e7',
			textTertiary: '#d7d7da',
			textLight: '#f2f2f3',

			borderColor: '#595959',
			red: 'red'
		},
		periodColors: {
			'FREE_APPOINTMENT': '#46b7d7',
			'FREE_PERIOD': 'green',
			'BUSY_APPOINTMENT': 'red',
			'BUSY_BREAK': 'orange'
		},
		values: values
	}
};