import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const THEME = {
	LIGHT: 'Light',
	DARK: 'Dark',
	SYSETM: 'System'
};


export const Theme = {
	values: {
		mainPaddingHorizontal: 8,
		borderRadius: 5,
		borderWidth: 0.7,
		disabledOpacity: 0.7
	},
	Light: {
		id: THEME.LIGHT,
		colors: {

			primary: 'cornflowerblue', //#ff8c00
			background: '#f0f0f5',
			backgroundElement: DefaultTheme.colors.card,

			textPrimary: 'hsl(0, 0%, 25%)',
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
		}
	},

	Dark: {
		id: THEME.DARK,
		colors: {
			primary: 'cornflowerblue',
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
		}
	}
};