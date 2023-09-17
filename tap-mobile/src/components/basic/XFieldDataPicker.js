import { View } from "react-native";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useMemo, useState } from "react";
import { emptyFn } from "../../common/utils";
import { useIsDarkTheme } from "../../style/ThemeContext";
import { useDateCode, useTranslation } from "../../i18n/I18nContext";

const XFieldDatePicker = ({
	onConfirm = emptyFn,
	onCancel = emptyFn,
	fieldStyle = {},
	initDate = new Date(),
	...rest
}) => {
	const [visible, setVisible] = useState(false);
	const [dateTime, setDateTime] = useState(initDate);

	const isDark = useIsDarkTheme();
	const dCode = useDateCode();
	const t = useTranslation();

	const displayDate = useMemo(() => {
		const d = Math.ceil((dateTime.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
		console.log(d, (dateTime.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
		if (d === 0)
			return t('Today');
		else if (d === 1)
			return t('Tomorow');
		else
			return dateTime.toLocaleDateString(dCode, { day: 'numeric', month: 'short', weekday: 'long' });;

	}, [dateTime, dCode, t]);

	const onPress = () => {
		setVisible(true);
	}

	const onConfirmIntern = (a) => {
		setVisible(false);
		setDateTime(a);
		onConfirm(a);
	}

	return (
		<View>
			<XFieldContainer
				styleCenterContainer={{ alignItems: 'center' }}
				style={[fieldStyle]}
				onPress={onPress}
			>
				<View>
					<XText size={18} style={{ textTransform: 'capitalize' }}>{displayDate}</XText>
				</View>
			</XFieldContainer>

			<DateTimePickerModal
				display='inline'
				isVisible={visible}
				locale="dCode"
				mode="date"
				date={dateTime}
				onConfirm={onConfirmIntern}
				onCancel={() => setVisible(false)}
				onHide={() => setVisible(false)}
				isDarkModeEnabled={isDark}
				{...rest}
			/>
		</View>

	);
}

export default XFieldDatePicker;