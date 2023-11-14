import React, { useCallback, useContext, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import I18nContext, { useTranslation } from "xapp/src/i18n/I18nContext";
import { Theme } from "xapp/src/style/themes";
import XText from "xapp/src/components/basic/XText";
import XIcon from "xapp/src/components/basic/XIcon";
import { STATUS } from "../../common/general";

const PERIOD_TYPE = {
	CLOSE_EMPLOYEE_BREAK: "CLOSE_EMPLOYEE_BREAK",
	CLOSE_PROVIDER_BREAK: "CLOSE_PROVIDER_BREAK",
	CLOSE_APPOINTMENT: "CLOSE_APPOINTMENT"
};


// const generatePeriodData = (item, t) => {
// 	switch (item.name) {
// 		case PERIOD_TYPE.CLOSE_EMPLOYEE_BREAK:
// 		case PERIOD_TYPE.CLOSE_PROVIDER_BREAK:
// 			return { title: t('Break'), colorName: Theme.vars.orange };
// 		case PERIOD_TYPE.CLOSE_APPOINTMENT:
// 			return { title: item.data.sName, colorName: Theme.vars.green };
// 		default:
// 			break;
// 	}
// };



const TimePeriod = ({ item, height, top, style, onPress }) => {
	const styles = useThemedStyle(createStyle, height, top);
	const { lng } = useContext(I18nContext);
	const t = useTranslation();

	useMemo(() => {

	}, [item]);

	const onPressHandler = useCallback(() => {
		onPress(item)
	}, [onPress, item]);

	const TPeriod = useMemo(() => {
		if (item.name === PERIOD_TYPE.CLOSE_APPOINTMENT) {
			return (
				<View
					style={[styles.appointment, item.data.status === STATUS.WAITING && styles.appointmentWaiting]}
				>
					<View>
						{item.data.status === STATUS.WAITING && <XIcon size={14} icon='warning' color={styles.appointmentWIconColor} />}
					</View>
					<View>
						<XText light bold size={12}>{item.start + ' - ' + item.end}</XText>
					</View>
					<View>
						<XText
							light
							bold
							size={12}
							numberOfLines={1}
							ellipsizeMode='tail'
						>
							{item.data.sName}
						</XText>
					</View>
					<View style={{ flex: 1 }} />
					<View>
						<XText light bold size={12} >{item.data.uUsername}</XText>
					</View>
				</View>
			)
		}
		else {
			return (
				<View style={styles.break}>
					<XText light bold size={12}>{item.start + ' - ' + item.end}</XText>
					<XText light bold size={12}>{t('Break')}</XText>
				</View>
			)
		}
	}, [item, styles, t, height]);


	return (
		<TouchableOpacity style={[styles.itemContainer, style]} onPress={onPressHandler} >
			{TPeriod}
		</TouchableOpacity>
	);
};

const createStyle = (theme, height, top, colorName) => {
	const periodCommon = {
		opacity: 0.8,
		flex: 1,
		columnGap: 5,
		paddingHorizontal: 5,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: Theme.values.borderWidth,
		borderRadius: Theme.values.borderRadius,
		borderColor: theme.colors.borderColor,
	};

	return StyleSheet.create({
		itemContainer: {
			position: 'absolute',
			height,
			top,
			flex: 1,
			start: 10,
			end: 10,
			borderRadius: Theme.values.borderRadius,
			overflow: 'hidden'
		},

		appointmentWIconColor: theme.colors[Theme.vars.red],
		appointment: {
			...periodCommon,
			backgroundColor: theme.colors.green
		},
		appointmentWaiting: {
			backgroundColor: Theme.opacity(theme.colors.textTertiary, 0.6),
			borderColor: theme.colors.red
		},

		break: {
			...periodCommon,
			backgroundColor: theme.colors[Theme.vars.yellow]
		}
	});
}

export default React.memo(TimePeriod);