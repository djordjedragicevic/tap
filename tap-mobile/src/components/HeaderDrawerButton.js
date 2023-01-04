import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeaderBackButton } from '@react-navigation/elements';
import { useCallback } from 'react';

const HeaderDrawerButton = ({ navigation }) => {
	const onPress = useCallback(() => navigation.openDrawer(), []);
	const backImage = useCallback(({ tintColor }) => <Icon name="menu" color={tintColor} size={24} />, []);
	
	return <HeaderBackButton onPress={onPress} backImage={backImage} />;
}

export default HeaderDrawerButton;