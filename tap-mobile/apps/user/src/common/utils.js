import I18n from "xapp/src/i18n/I18n";

const utils = {
	generateMarkString: (mark, reviewCont) => {
		return (mark || '-') + (reviewCont != null ? (' (' + reviewCont + ' ' + I18n.translate('reviews') + ')') : '');
	}
};

export default utils;