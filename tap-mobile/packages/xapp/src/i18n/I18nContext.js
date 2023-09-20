import { createContext, useCallback, useContext, useMemo, useState } from "react";

const I18nContext = createContext({
	lng: {},
	setLanguage: () => { }
});

export const i18n = {
	lng: '',
	lngs: '',
	fallback: '',

	translate: (text, lng = i18n.lng, lngs = i18n.lngs, fallback = i18n.fallback) => {
		if (lng.strings.hasOwnProperty(text))
			return lng.strings[text];
		else if (fallback && lngs[fallback].strings.hasOwnProperty(text))
			return lngs[fallback].strings[text]
		else
			return `= LOC MISS [${lng.code}][${text}] =`;
	}
};

export const I18nContextProvider = ({ children, language, languages, fallbackLanguage }) => {

	const [lngs] = useState(languages);
	const [fallback] = useState(fallbackLanguage);
	const [lng, setLng] = useState(lngs[language]);

	const setLanguage = (lngId) => {
		setLng(lngs[lngId])
	};

	i18n.lng = lng;
	i18n.lngs = lngs;
	i18n.fallback = fallback;

	const context = useMemo(() => {
		return {
			lng,
			setLanguage,
			lngs,
			fallback
		}
	}, [lng, setLanguage]);

	return (
		<I18nContext.Provider value={context}>
			{children}
		</I18nContext.Provider>
	)
};

export const useTranslation = () => {
	const { lng, lngs, fallback } = useContext(I18nContext);

	const t = useCallback((text) => i18n.translate(text, lng, lngs, fallback), [lng]);

	return t;
};

export const useDateCode = () => {
	const { lng } = useContext(I18nContext);

	return lng.dateCode;
};

export const useCurrency = ()


export default I18nContext;