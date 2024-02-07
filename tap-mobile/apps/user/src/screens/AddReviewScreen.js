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
		<XScreen rowGap={25} Footer={<Footer>
			<XButton
				title={t('Submit')}
				disabled={!selectedMark}
				style={{ flex: 1 }}
				primary
				onPress={submintReview}
			/>
		</Footer>
		}>

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
				<View style={styles.commentTextCnt}>
					<XText>{t('Add detailed review')}</XText>
				</View>
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

		</XScreen>
	);
};

const styles = StyleSheet.create({
	starCnt: {
		rowGap: 20,
		alignItems: 'center',
		height: 140,
		justifyContent: 'center'
	},
	commentCnt: {
		paddingHorizontal: 20,
		rowGap: 20
	},
	commentFieldStyle: {
		flex: 1,
		textAlignVertical: 'top',
		//paddingVertical: 10
	},
	commentTextCnt: {
		alignSelf: 'center'
	},
	commentFieldCntStyle: {
		height: 100
	}
});

export default AddReviewScreen;