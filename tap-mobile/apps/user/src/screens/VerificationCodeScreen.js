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
import { useColor, usePrimaryColor, useThemedStyle } from "xapp/src/style/ThemeContext";


const VerificationCodeScreen = ({ route }) => {
	const userId = route.params.userId;

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();

	const [data, setData] = useState({ length: 6, time: 0, mail: '' });
	const [code, setCode] = useState(Array.from({ length: data.length }, () => ''));
	const [loading, setLoading] = useState(true);
	const btnDisabled = code.filter(c => c === '')?.length > 0;


	const pColor = usePrimaryColor();
	const pLColor = useColor('primaryLight');

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
	}, [setLoading]);

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
	}, [setLoading]);

	const onVerify = useCallback(() => {
		setLoading(true);
		console.log(code, code.join(''))
		Http.post('/verification/verify', { userId: userId, code: code.join('') })
			.then((success) => {
				console.log("VERIFIED", success);
			})
			.catch(emptyFn)
			.finally(() => setLoading(false));
	}, [setLoading]);

	return (
		<XScreen
			flat
			style={styles.screen}
			bigTitle={t('Verify Code')}
		>
			<View style={{
				flex: 1
			}}>
				<View style={{ alignItems: 'center', textAlign: 'center', rowGap: 5, marginBottom: 50 }}>
					<XText style={{ textAlign: 'center' }}>{t('verCodeSubTitle')}</XText>
					<XText style={{ textAlign: 'center', color: pColor }}>{t('mail', { mail: data.mail })}</XText>
				</View>

				<View style={[styles.partWrap, {
					justifyContent: 'space-evenly',
					flexDirection: 'row',
					minHeight: 60
				}]}>
					{code.map((val, idx) => {
						return (
							<View key={(val + idx).toString()}>
								<XTextInput
									ref={(elem) => (codeRef.current[idx] = elem)}

									style={{ width: 45 }}
									fieldStyle={{
										textAlign: 'center'
									}}
									fieldContainerStyle={{
										backgroundColor: pLColor
									}}
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

				<View style={[styles.partWrap, { marginTop: 5 }]}>
					<XText secondary >{t('verCodeLast', { min: data.time })}</XText>
				</View>

				<XButton primary title={t("Verify Code")} style={{ marginTop: 50 }} disabled={btnDisabled || loading} onPress={onVerify} />

				<View style={[styles.partWrap, { marginTop: 30 }]}>
					<XText>{t('verCodeResend')}</XText>
					<XLink disabled={loading} style={{ paddingVertical: 5 }} onPress={onResend}>{t('Resend')}</XLink>
				</View>

			</View>
		</XScreen >
	);
};

const styleCreator = (theme) => StyleSheet.create({
	screen: {
		backgroundColor: theme.colors.backgroundElement,
		paddingHorizontal: 30,
		paddingVertical: 5,
		rowGap: 10
	},
	partWrap: {
		alignItems: 'center'
	}
});

export default VerificationCodeScreen;