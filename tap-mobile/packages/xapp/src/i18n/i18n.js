import { Storage } from "../store/deviceStorage";

export default class I18nT {
	static lngs = '';
	static lng = '';
	static fallback = '';
	static fallbackError = '';
	static STORAGE_HEY = 'lngId'

	static t(text, params) {

		let s;
		if (I18nT.lng.strings.hasOwnProperty(text))
			s = I18nT.lng.strings[text];
		else if (I18nT.fallback && I18nT.lngs[fallback].strings.hasOwnProperty(text))
			s = I18nT.lngs[I18nT.fallback].strings[text]
		else
			return `= LOC MISS [${I18nT.lng.code}][${text}] =`;

		if (s && params)
			Object.entries(params).forEach(([k, v]) => s = s.replace('{:' + k + '}', v));

		return s;
	}

	static tErr(errorCode) {
		const err = I18nT.lng.errors[errorCode || I18nT.fallbackError] || I18nT.lng.errors[I18nT.fallbackError];
		return { ...err };
	}

	static init({ langs, defautlLng, fallbackLng, fallbackError }) {
		I18nT.langs = langs;
		I18nT.lng = langs[defautlLng];
		I18nT.fallback = !!fallbackLng;
		I18nT.fallbackError = fallbackError;
	}

	static changeLanguageById(lngId) {
		I18nT.lng = I18nT.langs[lngId];
		Storage.set(I18nT.STORAGE_HEY, lngId);
		return I18nT.lng;
	}

	static getLanguage() {
		return I18nT.lng;
	}

};
