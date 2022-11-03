import React, { useMemo } from "react";

const GlobalContext = React.createContext({
});

export const GlobalContextProvider = (props) => {

	const context = useMemo(() => {
	}, []);

	return (
		<GlobalContext.Provider value={context}>
			{props.children}
		</GlobalContext.Provider>
	)
};

export default GlobalContext;