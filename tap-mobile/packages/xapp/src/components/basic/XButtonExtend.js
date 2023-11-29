import { StyleSheet, View, TouchableWithoutFeedback, Pressable } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XButtonIcon from 'xapp/src/components/basic/XButtonIcon';
import { useCallback, useState } from "react";
import XChip from "./XChip";


const XButtonExtend = ({ icon, size, color, style, options = [] }) => {

	const [extendIsVisible, setExtendIsVisible] = useState(false);
	const styles = useThemedStyle(styleCreator, extendIsVisible);
	const onMainPress = useCallback(() => setExtendIsVisible(old => !old), []);
	const hideExtend = useCallback(() => setExtendIsVisible(false), []);

	return (
		<>
			{
				extendIsVisible &&
				<TouchableWithoutFeedback onPress={hideExtend}>
					<View style={{ ...StyleSheet.absoluteFill, zIndex: 1 }} />
				</TouchableWithoutFeedback>
			}

			<View style={[styles.container]}>
				<View style={styles.extendContainer}>
					{options.map((o, idx) => {
						return (
							<Pressable
								key={(idx + 1).toString()}
								style={styles.optionContainer}
								onPress={() => {
									o?.onPress();
									hideExtend();
								}}
							>
								{!!o.titleLeft && <XChip text={o.titleLeft} />}
								<XButtonIcon size={38} {...o}
									onPress={() => {
										o?.onPress()
										hideExtend();
									}}
								/>
							</Pressable>
						)
					})}
				</View>

				<XButtonIcon
					icon={icon}
					size={size}
					color={color}
					primary={!color}
					onPress={onMainPress}
				/>
			</View>
		</>
	);
};

const styleCreator = (theme, exVisible) => {
	return StyleSheet.create({
		container: {
			zIndex: 2,
			position: 'absolute',
			end: 10,
			bottom: 10,
			alignItems: 'flex-end'
		},
		extendContainer: {
			alignItems: 'center',
			rowGap: 8,
			paddingVertical: 5,
			marginBottom: 8,
			display: exVisible ? 'flex' : 'none'
		},
		optionContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			columnGap: 4
		}
	})
}

export default XButtonExtend;