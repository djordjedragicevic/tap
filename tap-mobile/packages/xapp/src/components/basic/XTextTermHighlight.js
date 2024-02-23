import { memo } from "react";
import { Theme } from "../../style/themes";
import XText from "./XText";

const formatSearchString = (str) => {
	let fs = str;

	fs = fs.replace('Š', 'S');
	fs = fs.replace('š', 's');
	fs = fs.replace('Ć', 'C');
	fs = fs.replace('ć', 'c');
	fs = fs.replace('Č', 'C');
	fs = fs.replace('č', 'c');
	fs = fs.replace('Đ', 'D');
	fs = fs.replace('đ', 'd');

	return fs;
};

const XTextTermHighlight = ({ children, term, searchString, ...rest }) => {

	if (term) {
		const fTerm = searchString ? formatSearchString(term) : term;
		let startIdx = (searchString || children).toLowerCase().indexOf(fTerm.toLowerCase());

		if (startIdx > -1) {
			const endIdx = startIdx + term.length;
			return (
				<XText {...rest}>{children.substring(0, startIdx)}
					<XText {...rest} colorName={Theme.vars.primary}>{children.substring(startIdx, endIdx)}</XText>
					{children.substring(endIdx)}
				</XText>
			)
		}
	}

	return <XText {...rest}>{children}</XText>
};

export default memo(XTextTermHighlight);