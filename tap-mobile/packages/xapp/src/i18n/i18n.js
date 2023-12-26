import { Storage } from "../store/deviceStorage";
import { strings as en_US_str } from './en_US/strings';
import { errors as en_US_err } from './en_US/errors';
import { strings as sr_SP_str } from './sr_SP/strings';
import { errors as sr_SP_err } from './sr_SP/errors';

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

		if (I18nT.langs.hasOwnProperty('en_US')) {
			I18nT.langs.en_US.strings = {
				...I18nT.langs.en_US.strings,
				...en_US_str
			};
			I18nT.langs.en_US.errors = {
				...I18nT.langs.en_US.errors,
				...en_US_err
			};
		}

		if (I18nT.langs.hasOwnProperty('sr_SP')) {
			I18nT.langs.sr_SP.strings = {
				...I18nT.langs.sr_SP.strings,
				...sr_SP_str
			};
			I18nT.langs.sr_SP.errors = {
				...I18nT.langs.sr_SP.errors,
				...sr_SP_err
			};
		}

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
