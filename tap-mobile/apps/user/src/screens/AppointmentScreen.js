import { useEffect, useMemo, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { APP_STATUS, APP_STATUS_COLOR, APP_STATUS_ICON } from "xapp/src/common/general";
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { Theme } from "xapp/src/style/themes";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XTextInput from "xapp/src/components/basic/XTextInput";
import AppointmentInfo from "../components/AppointmentInfo";
import XAlert from "xapp/src/components/basic/XAlert";
import { StyleSheet, View } from "react-native";
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XText from "xapp/src/components/basic/XText";
import XSection from "xapp/src/components/basic/XSection";
import utils from "../common/utils";
import XMarkStars from "xapp/src/components/XMarkStars";
import Footer from "../components/Footer";
import XChip from "xapp/src/components/basic/XChip";

const Review = ({
	selectedMark,
	setSelectedMark,
	reviewComment,
	setReviewComment,
	editable,
	reviewCommentApproved
}) => {

	const t = useTranslation();

	return (
		<>
			<XSeparator margin={10} style={{ marginBottom: 10, marginTop: 20 }} />
			<XSection
				title={t('Overall raiting') + (selectedMark ? ' ' + selectedMark : '')}
				outline
				style={{ paddingHorizontal: 5 }}
				titleRight={
					!editable && <XChip
						color={reviewCommentApproved ? Theme.vars.green : Theme.vars.orange}
						icon={reviewCommentApproved ? 'check' : 'hourglass'}
						text={t(reviewCommentApproved ? 'Approved' : 'Pending approval')}
					/>
				}
			>
				<XMarkStars
					mark={selectedMark}
					showChip={false}
					style={styles.starCnt}
					starSize={36}
					starStyle={styles.star}
					onStarPress={editable ? setSelectedMark : null}
				/>
			</XSection>

			{(editable || reviewComment) &&
				<XSection
					title={t('Detailed review')}
					transparent
				>
					<XTextInput
						outline
						textarea
						value={reviewComment}
						editable={editable}
						clearable
						onClear={() => setReviewComment('')}
						onChangeText={setReviewComment}
					/>
				</XSection>
			}
		</>
	);
};

const ChangeStatus = ({
	statusComment,
	setStatusComment,
	title
}) => {
	return (
		<>
			<XSeparator margin={10} style={{ marginBottom: 10, marginTop: 20 }} />

			<XSection
				title={title}
				transparent
			>
				<XTextInput
					value={statusComment}
					textarea
					outline
					clearable
					onClear={() => setComment('')}
					onChangeText={setStatusComment}
				/>
			</XSection>
		</>
	)
}


const AppointmentScreen = ({ navigation, route }) => {

	const id = route.params.id;
	const t = useTranslation();

	const [data, setData] = useState({});
	const [markEdiatable, setMarkEdiatable] = useState(false);

	useEffect(() => {
		Http.get(`/appointment/${id}`)
			.then(data => {
				setData({ ...data, _isHistory: utils.isHistoryServices(data.start) });
				setMarkEdiatable(!data.mark);
			})
			.catch(emptyFn);
	}, []);


	const changeStatus = () => {
		XAlert.askEdit(() => {
			const newStatus = data.status === APP_STATUS.ACCEPTED ? APP_STATUS.CANCELED : APP_STATUS.DROPPED;
			Http.post(`/appointment/${id}/edit-status`, {
				appointmentstatus: { name: newStatus },
				statusComment: data.statusComment
			})
				.then(() => navigation.goBack())
				.catch(emptyFn);
		})
	};

	const submintReview = () => {
		XAlert.askEdit(() => {
			Http.post(`/appointment/${id}/review/add`, {
				mark: data.mark,
				comment: data.reviewComment
			})
				.then(() => navigation.goBack())
				.catch(emptyFn);
		})
	};


	const getActionCmp = () => {
		if (data._isHistory && data.status === APP_STATUS.ACCEPTED && markEdiatable) {
			return <Review
				selectedMark={data.mark}
				setSelectedMark={mark => setData(old => ({ ...old, mark }))}
				reviewComment={data.reviewComment}
				setReviewComment={reviewComment => setData(old => ({ ...old, reviewComment }))}
				editable={markEdiatable}
				reviewCommentApproved={!!data.reviewApprovedAt}
			/>
		}
		else if (!data._isHistory && (data.status === APP_STATUS.ACCEPTED || data.status === APP_STATUS.WAITING)) {
			return <ChangeStatus
				statusComment={data.statusComment}
				setStatusComment={statusComment => setData(old => ({ ...old, statusComment }))}
				title={t(data.status === APP_STATUS.WAITING ? 'Withdrawing reason' : 'Cancelation reason')}
			/>
		}
	};

	const getFooterCmp = () => {
		if (data._isHistory && data.status === APP_STATUS.ACCEPTED && markEdiatable) {
			return <Footer>
				<XButton
					title={t('Submit review')}
					disabled={!data.mark}
					style={{ flex: 1 }}
					primary
					onPress={submintReview}
				/>
			</Footer>
		}
		else if (!data._isHistory && (data.status === APP_STATUS.ACCEPTED || data.status === APP_STATUS.WAITING)) {
			return <Footer>
				<XButton
					style={{ flex: 1 }}
					colorName={Theme.vars.red}
					secondary
					title={t(data.status === APP_STATUS.WAITING ? 'Withdraw' : 'Cancel')}
					onPress={changeStatus}
				/>
			</Footer>
		}
	};

	return (
		<XScreen
			scroll
		//Footer={getFooterCmp()}
		>
			<AppointmentInfo
				isHistory={data._isHistory}
				providerName={data.providerName}
				providerType={data.providerType}
				providerAddress={data.providerAddress}
				providerCity={data.providerCity}
				timeFrom={(DateUtils.getTimeFromDateTimeString(data.start))}
				timeTo={DateUtils.getTimeFromDateTimeString(data.end)}
				date={data.start}
				services={[{
					id: id,
					name: data.serviceName,
					price: data.servicePrice,
					start: DateUtils.getTimeFromDateTimeString(data.start),
					duration: data.serviceDuration,
					employeeName: data.employeeName,
					note: data.serviceNote
				}]}
				extraFields={
					<>
						<XFieldContainer
							iconLeftSize={24}
							iconLeft={APP_STATUS_ICON[data.status]}
							iconLeftColorName={APP_STATUS_COLOR[data.status]}
						>
							<View>
								<XText secondary>{t('Status')}</XText>
								<XText bold colorName={APP_STATUS_COLOR[data.status]}>{t(data.status)}</XText>
							</View>
							{
								data.statusComment &&
								<View style={{ marginTop: 8 }}>
									<XText secondary>{data.statusComment}</XText>
								</View>
							}

						</XFieldContainer>

						{!!data.mark &&
							<XFieldContainer
								iconLeftSize={26}
								iconLeft='staro'
							>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ rowGap: 5 }}>
										<XText secondary>{t('Review')}</XText>
										<XMarkStars mark={data.mark} />
									</View>
									<View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1, alignItems: 'flex-end' }}>
										<XChip
											color={data.reviewApprovedAt ? Theme.vars.green : Theme.vars.orange}
											icon={data.reviewApprovedAt ? 'check' : 'hourglass'}
											text={t(data.reviewApprovedAt ? 'Approved' : 'Pending approval')}
										/>
									</View>
								</View>
								{
									data.reviewComment &&
									<View style={{ marginTop: 8 }}>
										<XText secondary>{data.reviewComment}</XText>
									</View>
								}
							</XFieldContainer>
						}
					</>
				}
			/>

			{/* {getActionCmp()} */}

		</XScreen>
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
		//backgroundColor: 'white',
		alignSelf: 'center'
	},
	commentFieldStyle: {
		flex: 1,
		textAlignVertical: 'top'
	},
	commentFieldCntStyle: {
		height: 100
	}
});

export default AppointmentScreen;