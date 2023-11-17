import React, { memo, useCallback, useContext, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
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


const Time = memo(({ start, end }) => {
	return (
		<View>
			<XText light bold size={12}>{start + '-' + end}</XText>
		</View>
	)
});

const TimePeriod = ({ item, height, top, style, onPress }) => {
	const styles = useThemedStyle(createStyle, height, top);
	const t = useTranslation();

	const colorRed = useColor('red');

	const onPressHandler = useCallback(() => {
		onPress(item)
	}, [onPress, item]);

	const TPeriod = useMemo(() => {
		if (item.name === PERIOD_TYPE.CLOSE_APPOINTMENT) {
			return (
				<View style={[styles.appointment, item.data.status === STATUS.WAITING && styles.appointmentWaiting]}>

					<Time start={item.start} end={item.end} />

					<View style={styles.itemConteainerCenter}>
						<XText light bold oneLine size={12}>
							{item.data.sName}, {item.data.uUsername}
						</XText>
					</View>
					{item.data.status === STATUS.WAITING &&
						<XIcon icon={'warning'} size={14} color={colorRed} />
					}
				</View>
			)
		}
		else {
			return (
				<View style={[styles.break]}>
					<Time start={item.start} end={item.end} />

					<View style={styles.itemConteainerCenter}>
						<XText light bold size={12}>{t('Break')}</XText>
					</View>
				</View>
			)
		}
	}, [item, styles, t, height]);


	return (
		<TouchableOpacity style={[styles.itemContainer, style]} onPress={onPressHandler}>
			{TPeriod}
		</TouchableOpacity>
	);
};

const createStyle = (theme, height, top, colorName) => {
	const periodCommon = {
		opacity: 0.8,
		flex: 1,
		paddingHorizontal: 3,
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
		itemConteainerCenter: {
			flex: 1,
			//flexDirection: 'row',
			//alignItems: 'center',
			paddingHorizontal: 10
		},

		appointmentWIconColor: theme.colors[Theme.vars.red],
		appointment: {
			...periodCommon,
			backgroundColor: Theme.opacity(theme.colors.green, 0.6)
		},
		appointmentWaiting: {
			backgroundColor: Theme.opacity(theme.colors.red, 0.4),
			borderColor: theme.colors.red
		},

		break: {
			...periodCommon,
			backgroundColor: Theme.opacity(theme.colors[Theme.vars.gray], 0.6)
		}
	});
}

export default React.memo(TimePeriod);