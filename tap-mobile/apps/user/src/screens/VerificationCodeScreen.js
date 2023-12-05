import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Http } from "xapp/src/common/Http";
import { emptyFn } from "xapp/src/common/utils";
import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XLink from "xapp/src/components/basic/XLink";
import XText from "xapp/src/components/basic/XText";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { MAIN_TAB_HOME } from "../navigators/routes";
import { throwUnexpected } from "../common/general";
import { storeDispatch } from "xapp/src/store/store";


const VerificationCodeScreen = ({ navigation, route }) => {
	const { userId, username, password } = route.params;

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();

	const [data, setData] = useState({ length: 6, time: 0, mail: '' });
	const [code, setCode] = useState(Array.from({ length: data.length }, () => ''));
	const [loading, setLoading] = useState(true);
	const btnDisabled = code.filter(c => c === '')?.length > 0;


	const codeRef = useRef([]);

	useEffect(() => {
		let finish = true;
		Http.get('/verification/data/' + userId)
			.then(resp => {
				if (finish) {
					setData(resp);
					setCode(Array.from({ length: resp.length }, () => ''));
				}
			})
			.finally(() => {
				setLoading(false);
			});
		return () => {
			finish = false;
			setLoading(false);
		};
	}, [setLoading, userId]);

	const onResend = useCallback(() => {
		setLoading(true);
		Http.get('/verification/resend/' + userId)
			.then((newLast) => {
				if (newLast != null)
					setData(curr => ({ ...curr, time: newLast }));
			})
			.catch(emptyFn)
			.finally(() => {
				setLoading(false);
			})
	}, [setLoading, userId]);

	const onVerify = useCallback(() => {
		setLoading(true);
		storeDispatch('app.mask', { maskText: t('Verifying') + '...' })
		Http.post('/verification/verify', { userId: userId, code: code.join('') })
			.then(async () => {
				if (username && password) {
					const resp = await Http.post('/app/login', { username, password });
					if (resp.token) {
						await Http.setToken(resp.token);

						const user = await Http.get('/user/profile');

						storeDispatch('user.set_data', user);

						navigation.navigate(MAIN_TAB_HOME);
					}
					else {
						throwUnexpected()
					}
				}
				else
					navigation.goBack();
			})
			.catch(emptyFn)
			.finally(() => {
				setLoading(false);
				storeDispatch('app.mask', false);
			});
	}, [setLoading, code, userId, navigation, username, password]);

	return (
		<XScreen
			flat
			style={styles.screen}
			bigTitle={t('Verify Code')}
			loading={loading}
		>
			<View>
				<View style={styles.subtitleCnt}>
					<XText style={styles.subtitleText}>{t('verCodeSubTitle')}</XText>
					<XText style={styles.subtitleMail}>{t('mail', { mail: data.mail })}</XText>
				</View>

				<View style={styles.codeCnt}>
					{code.map((val, idx) => {
						return (
							<View key={(val + idx).toString()}>
								<XTextInput
									ref={(elem) => (codeRef.current[idx] = elem)}

									style={styles.codeInput}
									fieldStyle={styles.codeInputField}
									fieldContainerStyle={styles.codeInputFieldCnt}
									disabled={loading}
									outline
									maxLength={1}
									inputMode='numeric'
									value={val}
									selectTextOnFocus
									onChange={({ nativeEvent: { text } }) => {
										const newCode = [...code];
										newCode[idx] = text;
										setCode(newCode);
										if (idx < code.length - 1)
											codeRef.current[idx + 1].focus();
									}}

								/>
							</View>
						)
					})}
				</View>

				<View style={styles.codeLastCnt}>
					<XText secondary >{t('verCodeLast', { min: data.time })}</XText>
				</View>

				<XButton primary title={t("Verify Code")} style={styles.verifyBtn} disabled={btnDisabled || loading} onPress={onVerify} />

				<View style={styles.resendCnt}>
					<XText>{t('verCodeResend')}</XText>
					<XLink disabled={loading} style={styles.resendLink} onPress={onResend}>{t('Resend')}</XLink>
				</View>

			</View>
		</XScreen >
	);
};

const styleCreator = (theme) => StyleSheet.create({
	screen: {
		//backgroundColor: theme.colors.backgroundElement,
		paddingHorizontal: 30,
		paddingVertical: 5,
		rowGap: 10
	},
	partWrap: {
		alignItems: 'center'
	},
	subtitleCnt: {
		alignItems: 'center', textAlign: 'center', rowGap: 5, marginBottom: 50
	},
	subtitleText: {
		textAlign: 'center'
	},
	subtitleMail: {
		textAlign: 'center', color: theme.colors.primary
	},
	codeCnt: {
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		minHeight: 60
	},
	codeInput: {
		width: 45
	},
	codeInputField: {
		textAlign: 'center'
	},
	codeInputFieldCnt: {
		backgroundColor: theme.colors.primaryLight
	},
	codeLastCnt: {
		marginTop: 5,
		alignItems: 'center'
	},
	verifyBtn: {
		marginTop: 50
	},
	resendCnt: {
		marginTop: 30,
		alignItems: 'center'
	},
	resendLink: {
		paddingVertical: 5
	}
});

export default VerificationCodeScreen;