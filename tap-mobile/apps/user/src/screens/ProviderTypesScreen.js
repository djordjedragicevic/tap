import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Http } from "xapp/src/common/Http";
import { emptyFn } from "xapp/src/common/utils";
import XScreen from "xapp/src/components/XScreen";
import XImage from "xapp/src/components/basic/XImage";
import XText from "xapp/src/components/basic/XText";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import { PROVIDERS_SCREEN } from "../navigators/routes";

const pCountText = (t, count) => {
	if (!count)
		return t('Currently no offers')
	else if (count === 1)
		return '1 ' + t('offer');
	else
		return count + ' ' + t('offers');
};

const ProviderTypesScreen = ({ navigation }) => {
	const [providerTypes, setProviderTypes] = useState();
	const t = useTranslation();

	const styles = useThemedStyle(styleCreator);

	const loadProviders = useCallback(() => {
		Http.get('/provider/type-list')
			.then(setProviderTypes)
			.catch(emptyFn)
	}, []);

	const onItemRender = useCallback(({ item }) => {

		const RouteCmp = item.providerCount ? TouchableOpacity : View;

		return (
			<RouteCmp
				style={styles.route}
				onPress={() => navigation.navigate(PROVIDERS_SCREEN, { typeId: item.id })}
			>
				<XImage
					style={item.providerCount ? styles.image : styles.imageNoOffers}
					imgPath={item.imagePath}
					textOver={item.text}
				/>
				<View style={styles.imageTextCnt}>
					<XText
						style={styles.imageText}
						adjustsFontSizeToFit
						size={28}
						bold
						light
					>
						{item.name}
					</XText>
					<XText
						bold
						size={14}
						light
					>
						{pCountText(t, item.providerCount)}
					</XText>
				</View>
			</RouteCmp>
		)
	}, []);

	useEffect(loadProviders, []);

	return (
		<XScreen>
			{providerTypes &&
				<FlatList
					contentContainerStyle={styles.listCnt}
					data={providerTypes}
					renderItem={onItemRender}
				/>
			}
		</XScreen>
	);
};

const styleCreator = (theme, providerCount) => {
	return StyleSheet.create({
		route: {
			height: 230,
			flex: 1,
			borderRadius: Theme.values.borderRadius,
			overflow: 'hidden'
		},
		imageTextCnt: {
			position: 'absolute',
			flex: 1,
			top: 0,
			bottom: 0,
			start: 0,
			end: 0,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: 20,
			backgroundColor: Theme.opacity(theme.colors.black, 0.3)
		},
		image: {
			flex: 1
		},
		imageNoOffers: {
			flex: 1,
			opacity: 0.4
		},
		imageText: {
			textAlign: 'center'
		},
		listCnt: {
			rowGap: 10
		}
	});
};

export default ProviderTypesScreen;