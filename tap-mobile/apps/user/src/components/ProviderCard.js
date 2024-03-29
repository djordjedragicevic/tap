import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { emptyFn } from "xapp/src/common/utils";
import XMarkStars from "xapp/src/components/XMarkStars";
import XChip from "xapp/src/components/basic/XChip";
import XImage from "xapp/src/components/basic/XImage";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XText from "xapp/src/components/basic/XText";
import XTextTermHighlight from "xapp/src/components/basic/XTextTermHighlight";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
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
	city = item?.city,

	onPress = emptyFn,
	searchTerm,
	style,
	isFavorite,
	onFavoritePress = emptyFn,
	horizontalOriented = false,
	imageHeight = horizontalOriented ? 120 : 160,
}) => {

	const styles = useThemedStyle(styleCreator, horizontalOriented, imageHeight);
	const [pColor, sColor] = useColor(['primary', 'secondary']);

	const onPressHandle = () => {
		onPress({ id, name, providerType, address1, mainImg, reviewCount })
	};

	const onFavoritePressHandle = () => {
		onFavoritePress(isFavorite)
	};

	return (
		<Pressable
			onPress={onPressHandle}
			style={[styles.card, style]}
		>
			<View style={styles.image}>
				<XImage
					imgPath={mainImg?.split(',')[0]}
					style={{ flex: 1 }}
				/>

				{
					isFavorite != null ?
						<XButtonIcon
							icon={isFavorite ? 'heart' : 'hearto'}
							iconColor={pColor}
							backgroundColor={sColor}
							onPress={onFavoritePressHandle}
							style={styles.headerButtonRight}
							bgOpacity={0.6}
						/>
						:
						null
				}
			</View>

			<View style={{ padding: 10, paddingTop: 5 }}>
				<View style={{ rowGap: 4 }}>
					<XTextTermHighlight
						bold
						size={18}
						term={searchTerm}
						searchString={searchName}
						adjustsFontSizeToFit
						oneLine
					>
						{name}
					</XTextTermHighlight>
					{!!providerType && <XChip outline style={{ alignSelf: 'flex-start' }}><XText secondary oneLine>{providerType}</XText></XChip>}
					{!!address1 && <XText secondary oneLine>{address1}</XText>}
					{!!city && <XText secondary oneLine>{city}</XText>}
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
									<XChip color={Theme.vars.purple} outline text={'+' + (serviceResult.count - serviceResult.services.length)} />
								}
							</View>
						</View>
					</View>
				}
			</View>
		</Pressable>
	)
};

const styleCreator = (theme, horizontalOriented, imageHeight) => StyleSheet.create({
	card: {
		borderRadius: Theme.values.borderRadius,
		borderWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor,
		backgroundColor: theme.colors.backgroundElement,
		overflow: 'hidden',
		flexDirection: horizontalOriented ? 'row' : 'column'
	},
	image: {
		height: horizontalOriented ? undefined : imageHeight,
		width: horizontalOriented ? imageHeight : undefined
	},
	headerButtonRight: {
		position: 'absolute',
		end: 8,
		top: 8
	}
});

export default memo(ProviderCard);