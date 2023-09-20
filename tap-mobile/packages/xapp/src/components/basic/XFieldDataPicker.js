import { StyleSheet, View } from "react-native";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useMemo, useState } from "react";
import { emptyFn } from "../../common/utils";
import { useIsDarkTheme, useThemedStyle } from "../../style/ThemeContext";
import { useDateCode, useTranslation } from "../../i18n/I18nContext";
import { AntDesign } from '@expo/vector-icons';

const isTomorow = (date) => {
	const tomorow = new Date();
	tomorow.setDate(tomorow.getDate() + 1);
	return date.getDate() === tomorow.getDate() && date.getMonth() === tomorow.getMonth() && date.getFullYear() === tomorow.getFullYear();
};

const isToday = (date) => {
	const today = new Date();
	return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

const isYesterday = (date) => {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
}

const XFieldDatePicker = ({
	onConfirm = emptyFn,
	onCancel = emptyFn,
	fieldStyle = {},
	initDate = new Date(),
	preventPast = false,
	...rest
}) => {
	const [visible, setVisible] = useState(false);
	const [dateTime, setDateTime] = useState(initDate);

	const isDark = useIsDarkTheme();
	const dCode = useDateCode();
	const t = useTranslation();
	const styles = useThemedStyle(styleCreator);

	const displayDate = useMemo(() => {
		if (isToday(dateTime))
			return t('Today');
		else if (isTomorow(dateTime))
			return t('Tomorow');
		else if (isYesterday(dateTime))
			return t('Yesterday')
		else
			return dateTime.toLocaleDateString(dCode, { day: 'numeric', month: 'short', weekday: 'long' });

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
				onCenterPress={onPress}
				iconRight={(props) => <AntDesign name="right" {...props} color={styles.iconColor} />}
				iconLeft={(props) => <AntDesign name="left" {...props} color={styles.iconColor} />}
				onIconLeftPress={() => {
					if (preventPast !== true || dateTime > new Date()) {
						const newDate = new Date(dateTime);
						newDate.setDate(newDate.getDate() - 1);
						onConfirm(newDate);
						setDateTime(newDate);
					}
				}}
				iconLeftDisabled={!(preventPast !== true || dateTime > new Date())}
				onIconRightPress={() => {
					const newDate = new Date(dateTime);
					newDate.setDate(newDate.getDate() + 1);
					onConfirm(newDate);
					setDateTime(newDate)
				}}
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
				minimumDate={preventPast ? new Date() : undefined}
				{...rest}
			/>
		</View >

	);
};

const styleCreator = (theme) => StyleSheet.create({
	iconColor: theme.colors.primary
});

export default XFieldDatePicker;