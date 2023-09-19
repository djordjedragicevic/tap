
export const LANGS = {
	en_US: 'en_US',
	sr_SP: 'sr_SP'
};

export const languages = {

};

/**
 * @param {Array} langs [{en_US: {id: 'en_US',code: 'en-US',name: 'English',dateCode: 'en',strings: {}}}]
 */
export const initLangs = (langs) => {
	Object.entries(langs).forEach(([k, v]) => languages[k] = v);
	return languages;
};

export const getLanguage = (lng) => {
	return languages[lng];
};