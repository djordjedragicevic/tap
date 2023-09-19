import { MaterialIcons } from '@expo/vector-icons';
import { HeaderBackButton } from '@react-navigation/elements';
import { useCallback } from 'react';

const HeaderDrawerButton = ({ navigation }) => {
	const onPress = useCallback(() => navigation.openDrawer(), []);
	const backImage = useCallback(({ tintColor }) => <MaterialIcons name="menu" color={tintColor} size={24} />, []);

	return <HeaderBackButton onPress={onPress} backImage={backImage} />;
}

export default HeaderDrawerButton;