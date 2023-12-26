import { useCallback } from "react";
import XHeaderButtonBack from "../components/XHeaderButtonBack";
import XHeaderButtonDelete from "../components/XHeaderButtonDelete";

export const useHeaderBackButton = () => {
	const btnFn = useCallback((props) => {
		return (<XHeaderButtonBack {...props} />);
	}, []);

	return btnFn;
};


export const useHeaderDeleteButton = () => {
	const btnFn = useCallback((props) => {
		return (<XHeaderButtonDelete {...props} />);
	}, []);

	return btnFn;
};