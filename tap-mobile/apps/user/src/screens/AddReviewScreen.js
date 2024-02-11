import { useState } from "react";
import { StyleSheet, View } from "react-native";
import XMarkStars from "xapp/src/components/XMarkStars";
import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XText from "xapp/src/components/basic/XText";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { Http } from 'xapp/src/common/Http';
import { emptyFn } from "xapp/src/common/utils";
import Footer from "../components/Footer";
import XSection from "xapp/src/components/basic/XSection";

const AddReviewScreen = ({ navigation, route }) => {

	const [selectedMark, setSelectedMark] = useState(0);
	const [comment, setComment] = useState('');
	const t = useTranslation();
	const appId = route.params.appId;

	const submintReview = () => {
		Http.post(`/appointment/${appId}/review/add`, {
			mark: selectedMark,
			comment: comment
		})
			.then(() => navigation.goBack())
			.catch(emptyFn);
	};

	return (
		<XScreen rowGap={20}>
			<XSection
				outline
				title={t('Overall raiting') + (selectedMark ? ' ' + selectedMark : '')}
			>
				<XMarkStars
					mark={selectedMark}
					style={styles.starCnt}
					showChip={false}
					starSize={36}
					starStyle={styles.star}
					onStarPress={setSelectedMark}
				/>
			</XSection>

			<XSection
				title={t('Detailed review')}
				styleContent={{ padding: 0 }}
			>
				<XTextInput
					outline
					textarea
					value={comment}
					clearable
					onClear={() => setComment('')}
					onChangeText={setComment}
				/>
			</XSection>

			<XButton
				primary
				title={t('Submit review')}
				disabled={!selectedMark}
				onPress={submintReview}
			/>

		</XScreen >
	);
};

const styles = StyleSheet.create({
	star: {
		paddingVertical: 10,
		paddingHorizontal: 5,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	starCnt: {
		maxWidth: 450,
		alignSelf: 'center',
		paddingVertical: 10
	}
});

export default AddReviewScreen;