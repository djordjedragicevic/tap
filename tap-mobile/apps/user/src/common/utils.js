import { i18n } from "xapp/src/i18n/I18nContext";

const utils = {
	generateMarkString: (mark, reviewCont) => {
		return (mark || '-') + (reviewCont != null ? (' (' + reviewCont + ' ' + i18n.translate('reviews') + ')') : '');
	}
};

export default utils;