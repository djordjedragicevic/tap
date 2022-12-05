
export const THEME = {
	LIGHT: 'Light',
	DARK: 'Dark'
};

export const values = {
	mainPaddingHorizontal: 10,
	borderRadius: 6,
	borderWidth: 0.8
}

export const Theme = {
	Light: {
		id: THEME.LIGHT,
		colors: {
			primary: '#e60073',
			background: '#f2f2f2',
			backgroundElement: '#fff',
			textPrimary: '#404040',
			textSecondary: '#8c8c8c',
			borderColor: '#a6a6a6'
		},
		values: values
	},

	Dark: {
		id: THEME.DARK,
		colors: {
			primary: '#007acc',
			background: '#000',
			//backgroundElement: '#004d66',
			backgroundElement: '#333333',
			textPrimary: '#f2f2f3',
			textSecondary: '#d7d7da',
			borderColor: '#595959'
		},
		values: values
	}
};