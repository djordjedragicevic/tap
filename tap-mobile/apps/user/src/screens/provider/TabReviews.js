import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Http } from 'xapp/src/common/Http';
import { emptyFn } from 'xapp/src/common/utils';
import XMarkStars from 'xapp/src/components/XMarkStars';
import XText from 'xapp/src/components/basic/XText';
import XSeparator from 'xapp/src/components/basic/XSeparator';
import { usePrimaryColor, useThemedStyle } from 'xapp/src/style/ThemeContext';
import I18nT from 'xapp/src/i18n/i18n';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { Theme } from 'xapp/src/style/themes';
import { ADD_REVIEW_SCREEN } from '../../navigators/routes';
import { useIsUserLogged } from '../../store/concreteStores';
import XButton from 'xapp/src/components/basic/XButton';
import XSelector from 'xapp/src/components/basic/XSelector';

const calculateTimeAgo = (data) => {
	const now = Date.now();
	let diff;
	let time;
	data.forEach(r => {
		diff = now - new Date(r.createdAt);
		time = diff / 1000 / 60;
		if (time < 60) {
			r.timeAgo = I18nT.t('timesAgo', { time: Math.ceil(time).toString(), measure: I18nT.t('tgMin') });
		}
		else if ((time = time / 60) < 60) {
			r.timeAgo = I18nT.t('timesAgo', { time: Math.ceil(time).toString(), measure: I18nT.t('tgHour') });
		}
		else if ((time = time / 24) < 27) {
			r.timeAgo = I18nT.t('timesAgo', { time: Math.ceil(time).toString(), measure: I18nT.t('tgDay') });
		}
		else if ((time = time / 30) < 12) {
			r.timeAgo = I18nT.t('timesAgo', { time: Math.ceil(time).toString(), measure: I18nT.t('tgMonth') });
		}
		else {
			r.timeAgo = I18nT.t('timesAgo', { time: Math.ceil(time / 12).toString(), measure: I18nT.t('tgYear') });
		}
	});

	return data;
};

const Review = ({ mark, comment, username, timeAgo }) => {
	return (
		<View style={{ padding: 10 }}>
			<View
				style={{
					borderWidth: 0,
					flexDirection: 'row',
					justifyContent: 'space-between'
				}}>
				<View style={{ flex: 1, marginEnd: 10, marginBottom: 5 }}>
					<XText bold oneLine size={15}>{username}</XText>
				</View>
				<XText size={13} tertiary>{timeAgo}</XText>
			</View>

			{comment && <XText style={{ paddingHorizontal: 5 }} secondary>{comment}</XText>}
			<XMarkStars style={{ marginTop: 15 }} mark={mark} />
		</View>
	)
};

const SORT_BY = [
	{ id: 1, title: 'Latest', sortField: 'createdAt', sortKey: 'DESC' },
	{ id: 2, title: 'The best', sortField: 'mark', sortKey: 'DESC' },
	{ id: 3, title: 'Worst', sortField: 'mark', sortKey: 'ASC' }
];

const ReviewsHeader = ({ navigation, providerId, sortedBy, setSortedBy }) => {
	const t = useTranslation();
	const styles = useThemedStyle(styleCreator);
	const isLogged = useIsUserLogged();
	const pColor = usePrimaryColor();

	return (
		<View style={styles.header}>

			<XSelector
				title={(
					<View style={styles.selectorFieldTitle}>
						<XText>{t('Sort by')}:</XText>
					</View>
				)}
				translateDataTitle
				initSelectedIdx={0}
				value={sortedBy.title}
				iconRight="arrowup"
				iconRightColor={pColor}
				iconRightStyle={styles.selectorFieldIcon}
				style={styles.selectorField}
				selected={sortedBy}
				onItemSelect={setSortedBy}
				data={SORT_BY}
				selector={{ title: t('Sort by') }}
				outline={true}
				flexCenter={false}
			/>

			{isLogged &&
				<TouchableOpacity onPress={() => navigation.navigate(ADD_REVIEW_SCREEN, { providerId })}>
					<XText icon='edit' colorPrimary size={13}>{t('Add review')}</XText>
				</TouchableOpacity>
			}
		</View>
	);
};

const TabReviews = ({ providerId, navigation, reload }) => {
	const styles = useThemedStyle(styleCreator);

	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [count, setCount] = useState(1);
	const [sortedBy, setSortedBy] = useState(SORT_BY[0]);

	useEffect(() => {
		setLoading(true);
		let finish = true;
		Http.get(`/provider/${providerId}/review/list`, { sortBy: sortedBy.sortField, sortKey: sortedBy.sortKey })
			.then((resp) => {
				if (finish)
					setReviews(calculateTimeAgo(resp));
			})
			.catch(emptyFn)
			.finally(() => setLoading(false));

		return () => finish = false;
	}, [count, reload, sortedBy]);

	const renderItem = useCallback(({ item }) => <Review
		mark={item.mark}
		comment={item.comment}
		username={item.username}
		timeAgo={item.timeAgo}
	/>, []);

	return (
		<>
			<ReviewsHeader
				navigation={navigation}
				providerId={providerId}
				sortedBy={sortedBy}
				setSortedBy={setSortedBy}
			/>

			<FlatList
				data={reviews}
				ItemSeparatorComponent={< XSeparator />}
				renderItem={renderItem}
				refreshing={loading}
				onRefresh={() => setCount(old => old + 1)}
				contentContainerStyle={styles.listCntStyle}
			/>
		</>
	);
};

const styleCreator = (theme) => {
	return StyleSheet.create({
		listCntStyle: {
			paddingHorizontal: 10
		},
		header: {
			paddingHorizontal: 10,
			paddingVertical: 12,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		selectorField: {
			padding: 3,
			minHeight: 25
		},
		selectorFieldTitle: {
			marginEnd: 10
		},
		selectorFieldIcon: {
			paddingHorizontal: 0,
			paddingVertical: 0
		}
	})
};

export default TabReviews;