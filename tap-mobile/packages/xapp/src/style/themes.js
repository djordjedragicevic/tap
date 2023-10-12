export const Theme = {
	LIGHT: 'Light',
	DARK: 'Dark',
	SYSETM: 'System',
	STORAGE_HEY: 'theme',

	values: {
		mainPaddingHorizontal: 8,
		borderRadius: 5,
		borderWidth: 1,
		disabledOpacity: 0.3,

		footerHeight: 52,
		chipHeight: 24,
		bigTitleSize: 26
	},

	Light: {
		id: 'Light',
		colors: {

			primary: 'deepskyblue',
			primaryLight: 'hsl(195, 100%, 97%)',
			secondary: '#042C4E',
			background: 'hsl(0, 0%, 95%)',
			backgroundElement: 'white',

			textPrimary: 'hsl(0, 0%, 15%)',
			textSecondary: 'hsl(0, 0%, 60%)',
			textTertiary: 'hsl(0, 0%, 85%)',
			//textLight: '#f2f2f3',
			textLight: 'white',

			borderColor: 'hsl(0, 0%, 85%)',

			red: 'red',
			redLight: 'hsl(0, 100%, 95%)',

			green: 'hsl(177, 70%, 41%)',
			greenLight: 'hsl(177, 70%, 92%)',

			yellow: 'hsl(51, 100%, 40%)',
			yellowLight: 'hsl(51, 100%, 95%)',

			orange: 'hsl(28, 100%, 50%)',
			orangeLight: 'hsl(28, 100%, 95%)'
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
			primary: '#2E8BC0',
			primaryLight: 'hsl(195, 100%, 13%)',
			secondary: '#042C4E',
			background: 'black',
			backgroundElement: 'hsl(0, 0%, 10%)',

			textPrimary: 'hsl(0, 0%, 95%)',  //white wariant
			textSecondary: 'hsl(0, 0%, 70%)',//white wariant
			textTertiary: 'hsl(0, 0%, 50%)', //white wariant
			//textLight: '#f2f2f3',
			textLight: 'white',

			borderColor: 'hsl(0, 0%, 50%)',
			red: 'red',
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


export const preStyles = {
	border: {
		borderRadius: Theme.values.borderRadius,
		borderColor: Theme.values.borderColor,
		borderWidth: Theme.values.borderWidth,
		overflow: 'hidden'
	}
};