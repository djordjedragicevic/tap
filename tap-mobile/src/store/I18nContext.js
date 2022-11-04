import React, { useCallback, useContext, useMemo, useState } from "react";

const I18nContext = React.createContext({
	lng: {},
	setLanguage: () => { }
});

export const I18nContextProvider = ({ children, language = { strings: {} } }) => {

	const [lng, setLanguage] = useState(language);

	const context = useMemo(() => {
		return {
			lng,
			setLanguage
		}
	}, [lng, setLanguage]);

	return (
		<I18nContext.Provider value={context}>
			{children}
		</I18nContext.Provider>
	)
};

export const useTranslation = () => {
	const { lng } = useContext(I18nContext);

	const t = useCallback((text) => {
		if (lng.strings.hasOwnProperty(text))
			return lng.strings[text];
		else
			return `= LOC. MISSING [${lng.code}][${text}] =`;
	}, [lng]);

	return t;
};

export default I18nContext;