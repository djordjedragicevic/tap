import I18nT from "xapp/src/i18n/i18n";

const utils = {
	generateMarkString: (mark, reviewCont) => {
		return (mark ? mark.toFixed(1) : ' - ') + (reviewCont != null ? (' (' + reviewCont + ' ' + I18nT.t('reviews') + ')') : '');
	}
};

export default utils;