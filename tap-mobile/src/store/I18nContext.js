import React, { useCallback, useContext, useMemo, useState } from "react";
import en_US from "../i18n/en_US";

const I18nContext = React.createContext({
	lng: {},
	setLanguage: () => { }
});

export const I18nContextProvider = ({ children, language, languages, fallbackLanguage }) => {

	const [lngs] = useState(languages);
	const [fallback] = useState(fallbackLanguage);
	const [lng, setLanguage] = useState(lngs[language]);

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

	const t = useCallback((text) => {
		if (lng.strings.hasOwnProperty(text))
			return lng.strings[text];
		else if (fallback && lngs[fallback].strings.hasOwnProperty(text))
			return lngs[fallback].strings[text]
		else
			return `= LOC MISS [${lng.code}][${text}] =`;
	}, [lng]);

	return t;
};

export default I18nContext;