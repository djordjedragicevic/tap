import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useColor, useTheme, useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import XText from "xapp/src/components/basic/XText";
import XIcon from "xapp/src/components/basic/XIcon";
import { PERIOD, STATUS, isWaitingAppointment } from "../../common/general";
import I18n from "xapp/src/i18n/I18n";
import { FontAwesome5 } from '@expo/vector-icons';

const getPeriodColor = (item) => {

	switch (item.name) {
		case PERIOD.CLOSE_APPOINTMENT:
		case PERIOD.CLOSE_APPOINTMENT_BY_PROVIDER:
			if (item.data.status === STATUS.WAITING)
				return Theme.vars.red;
			else if (!item.data.userId)
				return Theme.vars.blue;
			else
				return Theme.vars.green;

		case PERIOD.CLOSE_EMPLOYEE_BREAK:
		case PERIOD.CLOSE_PROVIDER_BREAK:
			return Theme.vars.gray;
		default:
			return Theme.vars.gray;
	}
};

const getPeriodStyle = (item, theme) => {

	switch (item.name) {
		case PERIOD.CLOSE_APPOINTMENT:
		case PERIOD.CLOSE_APPOINTMENT_BY_PROVIDER:
			if (item.data.status === STATUS.WAITING)
				return Theme.vars.red;
			else if (!item.data.userId)
				return Theme.vars.blue;
			else
				return Theme.vars.green;

		case PERIOD.CLOSE_EMPLOYEE_BREAK:
		case PERIOD.CLOSE_PROVIDER_BREAK:
			return Theme.vars.gray;
		default:
			return Theme.vars.gray;
	}
};

const getPeriodText = (item) => {
	let text = item.start + '-' + item.end;

	switch (item.name) {
		case PERIOD.CLOSE_APPOINTMENT:
		case PERIOD.CLOSE_APPOINTMENT_BY_PROVIDER:
			text += ' ' + item.data.sName + ' ' + (item.data.uUsername || '')
			break;
		case PERIOD.CLOSE_EMPLOYEE_BREAK:
		case PERIOD.CLOSE_PROVIDER_BREAK:
			text += ' ' + I18n.t('Break');
			break;
		default:
			text += ' ' + (item.data.comment ? item.data.comment : I18n.t('Reserved time'));
			break;
	}

	return text;
};


const TimePeriod = ({ item, height, top, onPress }) => {

	const styles = useThemedStyle(createStyle, height, top, getPeriodColor(item));
	const cRed = useColor('red');

	const onPressHandler = useCallback(() => {
		onPress(item)
	}, [onPress, item]);

	const getExclamationIcon = useCallback(() => <FontAwesome5 name="exclamation" size={15} color={cRed} />, [cRed]);

	return (
		<TouchableOpacity style={styles.itemContainer} onPress={onPressHandler}>
			{(isWaitingAppointment(item) && height >= 15) &&
				<View style={{ alignItems: 'center', justifyContent: 'center', marginEnd: 3 }}>
					<XIcon icon={getExclamationIcon} />
				</View>
			}
			<View flex={1} style={styles.item}>
				<XText light adjustsFontSizeToFit>{getPeriodText(item)}</XText>
			</View>
		</TouchableOpacity>
	);
};

const createStyle = (theme, height, top, colorName) => {
	return StyleSheet.create({
		itemContainer: {
			position: 'absolute',
			height: height,
			overflow: 'hidden',
			flexDirection: 'row',
			top,
			start: 0,
			end: 0,
		},
		item: {
			flexDirection: 'row',
			flex: 1,
			//borderWidth: Theme.values.borderWidth,
			borderRadius: Theme.values.borderRadius,
			borderColor: theme.colors.borderColor,
			paddingHorizontal: 3,
			overflow: 'hidden',
			backgroundColor: Theme.opacity(theme.colors[colorName], 0.7)
		}

	});
}

export default React.memo(TimePeriod);