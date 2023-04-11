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
			primary: 'steelblue',
			primaryDark: '#0080ff',
			primaryLight: '#cce6ff',
			background: '#f0f0f5',
			backgroundElement: DefaultTheme.colors.card,
			textPrimary: 'hsl(0, 0%, 30%)',
			textSecondary: 'hsl(0, 0%, 60%)',
			textTertiary: 'hsl(0, 0%, 80%)',
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
			textPrimary: 'hsl(0, 0%, 95%)',
			textSecondary: 'hsl(0, 0%, 70%)',
			textTertiary: 'hsl(0, 0%, 50%)',
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