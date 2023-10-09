import { Storage } from "../store/deviceStorage";

export default class I18n {
	static lngs = '';
	static lng = '';
	static fallback = '';
	static fallbackError = '';
	static STORAGE_HEY = 'lngId'

	static translate(text, params) {

		let s;
		if (I18n.lng.strings.hasOwnProperty(text))
			s = I18n.lng.strings[text];
		else if (I18n.fallback && I18n.lngs[fallback].strings.hasOwnProperty(text))
			s = I18n.lngs[I18n.fallback].strings[text]
		else
			return `= LOC MISS [${I18n.lng.code}][${text}] =`;

		if (s && params)
			Object.entries(params).forEach(([k, v]) => s = s.replace('{:' + k + '}', v));

		return s;
	}

	static translateError(errorCode) {
		const err = I18n.lng.errors[errorCode || I18n.fallbackError] || I18n.lng.errors[I18n.fallbackError];
		return { ...err };
	}

	static init({ langs, defautlLng, fallbackLng, fallbackError }) {
		I18n.langs = langs;
		I18n.lng = langs[defautlLng];
		I18n.fallback = !!fallbackLng;
		I18n.fallbackError = fallbackError;
	}

	static changeLanguageById(lngId) {
		I18n.lng = I18n.langs[lngId];
		Storage.set(I18n.STORAGE_HEY, lngId);
		return I18n.lng;
	}

	static getLanguage() {
		return I18n.lng;
	}

};
