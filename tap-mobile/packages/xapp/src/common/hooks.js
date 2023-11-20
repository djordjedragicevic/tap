import { useCallback } from "react";
import XHeaderButtonBack from "../components/XHeaderButtonBack";

export const useHeaderBackButton = () => {
	const btnFn = useCallback((props) => {
		return (<XHeaderButtonBack {...props} />);
	}, []);

	return btnFn;
};