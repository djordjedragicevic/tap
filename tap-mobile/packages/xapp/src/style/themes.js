export const Theme = {
	LIGHT: 'Light',
	DARK: 'Dark',
	SYSETM: 'System',
	STORAGE_HEY: 'theme',

	values: {
		mainPaddingHorizontal: 8,
		borderRadius: 5,
		borderWidth: 0.7,
		disabledOpacity: 0.7
	},

	Light: {
		id: 'Light',
		colors: {

			primary: 'cornflowerblue', //#ff8c00
			background: 'hsl(0, 0%, 90%)',
			backgroundElement: 'white',

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
		id: 'Dark',
		colors: {
			primary: 'cornflowerblue',
			background: 'black',
			backgroundElement: 'hsl(0, 0%, 10%)',

			textPrimary: 'hsl(0, 0%, 95%)',  //white wariant
			textSecondary: 'hsl(0, 0%, 70%)',//white wariant
			textTertiary: 'hsl(0, 0%, 50%)', //white wariant
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
	},

	initThemes: function (themes) {
		this.Light.colors = {
			...this.Light.colors,
			...themes[Theme.LIGHT]
		};

		this.Dark.colors = {
			...this.Dark.colors,
			...themes[Theme.DARK]
		}

		return this;
	}
};