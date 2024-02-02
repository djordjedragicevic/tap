export const Theme = {
	LIGHT: 'Light',
	DARK: 'Dark',
	SYSETM: 'System',
	STORAGE_HEY: 'theme',

	vars: {
		red: 'red',
		redLight: 'redLight',
		redDark: 'redDark',

		green: 'green',
		greenLight: 'greenLight',
		yellow: 'yellow',
		yellowLight: 'yellowLight',
		orange: 'orange',
		orangeLight: 'orangeLight',
		blue: 'blue',
		blueLight: 'blueLight',
		purple: 'purple',
		purpleLight: 'purpleLight',
		gray: 'gray',
		grayLight: 'grayLight',
		brown: 'brown',
		brownLight: 'brown',

		primary: 'primary',
		primaryLight: 'primaryLight',
		secondary: 'secondary',
		background: 'background',
		backgroundElement: 'backgroundElement',

		textPrimary: 'textPrimary',
		textSecondary: 'textSecondary',
		textTertiary: 'textTertiary',
		textLight: 'textLight'
	},

	values: {
		mainPaddingHorizontal: 8,
		borderRadius: 5,
		borderWidth: 1,
		disabledOpacity: 0.3,

		footerHeight: 52,
		chipHeight: 24,
		bigTitleSize: 26,
		buttonHeight: 38
	},

	Light: {
		id: 'Light',
		colors: {
			primary: 'hsl(195, 100%, 50%)', //'deepskyblue'
			primaryLight: 'hsl(195, 100%, 97%)',
			secondary: 'hsl(208, 90%, 16%)',
			background: 'hsl(0, 0%, 95%)',
			backgroundElement: 'white',

			textPrimary: 'hsl(0, 0%, 15%)',
			textSecondary: 'hsl(0, 0%, 35%)',
			textTertiary: 'hsl(0, 0%, 70%)',
			textLight: 'white',

			borderColor: 'hsl(0, 0%, 85%)',

			gray: 'hsl(0, 0%, 60%)',
			grayLight: 'hsl(0, 0%, 95%)',

			red: 'hsl(0, 100%, 50%)',
			redLight: 'hsl(0, 100%, 95%)',
			redDark: 'hsl(0, 100%, 27%)',

			green: 'hsl(177, 70%, 41%)',
			greenLight: 'hsl(177, 70%, 92%)',

			yellow: 'hsl(45, 100%, 50%)',
			yellowLight: 'hsl(45, 100%, 95%)',

			orange: 'hsl(28, 100%, 50%)',
			orangeLight: 'hsl(28, 100%, 95%)',

			blue: 'hsl(225, 100%, 45%)',
			blueLight: 'hsl(225, 100%, 95%)',

			purple: 'hsl(330, 100%, 30%)',
			purpleLight: 'hsl(330, 100%, 95%)',

			brown: 'hsl(25, 76%, 31%)',
			brownLight: 'hsl(25, 76%, 95%)'
		}
	},

	Dark: {
		id: 'Dark',
		colors: {
			primary: 'hsl(195, 100%, 50%)', //'deepskyblue'
			primaryLight: 'hsl(195, 100%, 13%)',
			secondary: 'hsl(208, 90%, 16%)',
			background: 'black',
			backgroundElement: 'hsl(0, 0%, 10%)',

			textPrimary: 'hsl(0, 0%, 95%)',  //white wariant
			textSecondary: 'hsl(0, 0%, 75%)',//white wariant
			textTertiary: 'hsl(0, 0%, 40%)', //white wariant
			//textLight: '#f2f2f3',
			textLight: 'white',

			borderColor: 'hsl(0, 0%, 25%)',

			gray: 'hsl(0, 0%, 60%)',
			grayLight: 'hsl(0, 0%, 95%)',

			red: 'hsl(0, 100%, 40%)',
			redLight: 'hsl(0, 100%, 95%)',
			redDark: 'hsl(0, 100%, 27%)',

			green: 'hsl(177, 70%, 41%)',
			greenLight: 'hsl(177, 70%, 92%)',

			yellow: 'hsl(51, 100%, 40%)',
			yellowLight: 'hsl(51, 100%, 95%)',

			orange: 'hsl(28, 100%, 50%)',
			orangeLight: 'hsl(28, 100%, 95%)',

			blue: 'hsl(225, 100%, 45%)',
			blueLight: 'hsl(225, 100%, 95%)',

			purple: 'hsl(330, 100%, 30%)',
			purpleLight: 'hsl(330, 100%, 95%)',

			brown: 'hsl(25, 76%, 31%)',
			brownLight: 'hsl(25, 76%, 95%)'
		}
	},
	opacity: (color, v) => {
		if (color.startsWith('hsl')) {
			let c = color.replace('hsl', 'hsla');
			c = c.substring(0, c.length - 1);
			return c + ', ' + v + ')';
		}
		else
			return color;
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

export const COLORS = {

}