import { createContext, useCallback, useContext, useMemo, useState } from "react";
import I18nT from "./i18n";

const I18nContext = createContext({
	lng: {},
	setLanguage: () => { }
});

export const I18nContextProvider = ({ children }) => {

	const [lng, setLng] = useState(I18nT.getLanguage());

	const setLanguage = useCallback((lngId) => {
		setLng(I18nT.changeLanguageById(lngId));
	}, [setLng, I18nT.changeLanguageById]);

	const context = useMemo(() => ({
		lng,
		setLanguage
	}), [lng, setLanguage]);

	return (
		<I18nContext.Provider value={context}>
			{children}
		</I18nContext.Provider>
	)
};

export const useTranslation = () => {
	const { lng } = useContext(I18nContext);

	const t = useCallback((text, params) => I18nT.t(text, params), [lng]);

	return t;
};

export const useDateCode = () => {
	const { lng } = useContext(I18nContext);

	return lng.dateCode;
};

export default I18nContext;