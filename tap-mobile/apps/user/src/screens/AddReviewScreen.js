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
import { PROVIDER_SCREEN } from "../navigators/routes";
import { emptyFn } from "xapp/src/common/utils";

const AddReviewScreen = ({ navigation, route }) => {

	const [selectedMark, setSelectedMark] = useState(0);
	const [comment, setComment] = useState('');
	const t = useTranslation();
	const providerId = route.params.providerId;

	const submintReview = () => {
		Http.post(`/provider/${providerId}/review/add`, {
			mark: selectedMark,
			comment: comment
		})
			.then(() => navigation.goBack())
			.catch(emptyFn);
	};

	return (
		<XScreen rowGap={25}>

			<View style={styles.starCnt}>
				<XText>{t('Overall raiting')}  <XText bold>{selectedMark || '-'}</XText></XText>
				<XMarkStars
					mark={selectedMark}
					showChip={false}
					starSize={32}
					starsGap={10}
					onStarPress={setSelectedMark}
				/>
			</View>

			<XSeparator />

			<View style={styles.commentCnt}>
				<XText>{t('Add detailed review')}</XText>
				<XTextInput
					outline
					fieldStyle={styles.commentFieldStyle}
					fieldContainerStyle={styles.commentFieldCntStyle}
					value={comment}
					multiline
					clearable
					onClear={() => setComment('')}
					onChangeText={setComment}
				/>
			</View>

			<XButton
				title={t('Submit')}
				disabled={!selectedMark}
				primary
				onPress={submintReview}
			/>

		</XScreen>
	);
};

const styles = StyleSheet.create({
	starCnt: {
		rowGap: 20,
		alignItems: 'center',
		height: 150,
		justifyContent: 'center'
	},
	commentCnt: {
		rowGap: 20,
		alignItems: 'center'
	},
	commentFieldStyle: {
		flex: 1,
		textAlignVertical: 'top',
		paddingVertical: 10
	},
	commentFieldCntStyle: {
		height: 100,
		width: '100%'
	}
});

export default AddReviewScreen;