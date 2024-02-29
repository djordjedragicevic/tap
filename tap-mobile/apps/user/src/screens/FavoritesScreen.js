import XScreen from "xapp/src/components/XScreen";
import { Http, useHTTPGetOnFocus } from "xapp/src/common/Http";
import { FlatList, StyleSheet } from "react-native";
import ProviderCard from "../components/ProviderCard";
import { useCallback } from "react";
import { storeDispatch } from "xapp/src/store/store";
import { emptyFn } from "xapp/src/common/utils";
import { Theme } from "xapp/src/style/themes";
import XAlert from "xapp/src/components/basic/XAlert";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { PROVIDER_SCREEN } from "../navigators/routes";
import { useFocusEffect } from "@react-navigation/native";
import XEmptyListIcon from "xapp/src/components/XEmptyListIcon";
const FavoritesScreen = ({ navigation }) => {

	const [data, refreshFn, refreshing] = useHTTPGetOnFocus(useFocusEffect, '/provider/favorite-list', null);
	const t = useTranslation();


	const onRender = useCallback(({ item }) => {
		return (
			<ProviderCard
				item={item}
				isFavorite
				onFavoritePress={() => {
					Http.delete('/user/favorite-provider', item.id)
						.then((fPs) => {
							storeDispatch('user.set_favoriteProviders', fPs);
							refreshFn();
						})
						.catch(emptyFn)
				}}
				onPress={() => {
					navigation.navigate(PROVIDER_SCREEN, { item })
				}}
			/>
		)
	}, [t]);

	return (
		<XScreen flat>
			{
				data ?
					data.length ?
						<FlatList
							data={data}
							renderItem={onRender}
							onRefresh={refreshFn}
							refreshing={refreshing}
							contentContainerStyle={styles.list}
						/>
						:
						<XEmptyListIcon text={t("No favorites")}/>

					:
					null
			}
		</XScreen>
	);
};

const styles = StyleSheet.create({
	list: {
		padding: Theme.values.mainPaddingHorizontal
	}
});

export default FavoritesScreen;