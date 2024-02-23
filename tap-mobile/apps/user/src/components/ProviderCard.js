import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { emptyFn } from "xapp/src/common/utils";
import XMarkStars from "xapp/src/components/XMarkStars";
import XChip from "xapp/src/components/basic/XChip";
import XImage from "xapp/src/components/basic/XImage";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XText from "xapp/src/components/basic/XText";
import XTextTermHighlight from "xapp/src/components/basic/XTextTermHighlight";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";

const isEqual = (newValues, oldValues) => {
	return newValues.id === oldValues.id &&
		newValues.serviceResult === oldValues.serviceResult &&
		newValues.searchTerm === oldValues.searchTerm;
}

const ProviderCard = ({
	item,
	id = item?.id,
	mainImg = item?.mainImg || item?.providerTypeImage,
	name = item?.name,
	providerType = item?.providerType,
	address1 = item?.address1,
	mark = item?.mark,
	reviewCount = item?.reviewCount,
	searchName = item?.searchName,
	serviceResult = item?.serviceResult,

	imageHeight = 150,
	onPress = emptyFn,
	searchTerm,
	style
}) => {
	const styles = useThemedStyle(styleCreator);

	const onPressHandle = () => {
		onPress({ id, name, providerType, address1, mainImg, reviewCount })
	};

	return (
		<Pressable
			onPress={onPressHandle}
			style={[styles.card, style]}
		>
			<View style={{ height: imageHeight }}>
				<XImage
					imgPath={mainImg?.split(',')[0]}
					style={{ flex: 1 }}
				/>
			</View>

			<View style={{ padding: 10, paddingTop: 5 }}>
				<View style={{ rowGap: 2 }}>
					<XTextTermHighlight
						bold
						size={18}
						term={searchTerm}
						searchString={searchName}
					>
						{name}
					</XTextTermHighlight>
					{!!providerType && <XText secondary oneLine>{providerType}</XText>}
					{!!address1 && <XText secondary oneLine>{address1}</XText>}
					<XMarkStars mark={mark} reviewCount={reviewCount} />
				</View>

				{serviceResult &&
					<View>
						<XSeparator style={{ marginVertical: 10 }} />
						<View>
							<View style={{ flex: 1, gap: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
								{serviceResult.services.map(s => (
									<XChip color={Theme.vars.purple} outline key={s.id} icon={'tag'}>
										<XTextTermHighlight
											key={s.id}
											term={searchTerm}
											searchString={s.searchName}
											colorName={Theme.vars.purple}
										>
											{s.name}
										</XTextTermHighlight>
									</XChip>
								))}
								{serviceResult.services.length < serviceResult.count &&
									<XChip color={Theme.vars.purple} text={'+' + (serviceResult.count - serviceResult.services.length)} />
								}
							</View>
						</View>
					</View>
				}
			</View>
		</Pressable>
	)
};

const styleCreator = (theme) => StyleSheet.create({
	card: {
		borderRadius: Theme.values.borderRadius,
		borderWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor,
		backgroundColor: theme.colors.backgroundElement,
		overflow: 'hidden',
	}
});

export default memo(ProviderCard);