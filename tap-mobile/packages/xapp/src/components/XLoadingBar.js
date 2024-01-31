import { useThemedStyle } from "../style/ThemeContext";
import { StyleSheet, View } from 'react-native';

const XLoadingBar = ({ absolute = true }) => {
	const styles = useThemedStyle(styleCreator, absolute);

	return (<View style={styles.bar} />);
};

const styleCreator = (theme, absolute) => StyleSheet.create({
	bar: {
		backgroundColor: theme.colors.primary,
		position: absolute ? 'absolute' : 'relative',
		height: 3,
		width: '100%'
	}
})

export default XLoadingBar;