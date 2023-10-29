import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { Pressable, View } from "react-native";
import { useEffect, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { emptyFn } from "xapp/src/common/utils";
import XSection from "xapp/src/components/basic/XSection";
import { storeDispatch, useStore } from "xapp/src/store/store";
import XText from "xapp/src/components/basic/XText";
import XIcon from "xapp/src/components/basic/XIcon";
import * as ImagePicker from 'expo-image-picker';
import XAlert from "xapp/src/components/basic/XAlert";

const MenageAccountScreen = () => {
	const t = useTranslation();

	const {
		id,
		username,
		email,
		firstName,
		lastName,
		phone,
		initials,
		imagePath
	} = useStore(gs => gs.user);

	const [data, setData] = useState({
		id: id,
		username: username,
		email: email,
		firstName: firstName,
		lastName: lastName,
		phone: phone
	});

	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null);

	useEffect(() => {
		setLoading(true);
		Http.get('/user/profile')
			.then(resp => setData(resp))
			.catch(emptyFn)
			.finally(() => setLoading(false));
	}, []);

	const saveProfile = () => {
		setLoading(true);
		Http.post('/user/profile', data)
			.then(_ => storeDispatch('user.set_data', data))
			.catch(emptyFn)
			.finally(() => setLoading(false));
	};

	// const selectImage = async () => {
	// 	let result = await ImagePicker.launchImageLibraryAsync({
	// 		mediaTypes: ImagePicker.MediaTypeOptions.All,
	// 		allowsEditing: true,
	// 		//aspect: [4, 3],
	// 		quality: 1,
	// 	});

	// 	console.log(result);

	// 	if (!result.canceled) {
	// 		setImage(result.assets[0].uri);
	// 	}
	// };

	const selectImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== "granted") {

			// If permission is denied, show an alert 
			XAlert.alert(
				"Permission Denied",
				`Sorry, we need camera  
			 roll permission to upload images.`
			);
		} else {

			// Launch the image library and get 
			// the selected image 
			const result = await ImagePicker.launchImageLibraryAsync();

			if (!result.canceled) {

				// If an image is selected (not cancelled),  
				// update the file state variable 
				setImage(result.assets[0]);

				// Clear any previous errors 
				//setError(null);
			}
		}
	};




	return (
		<XScreen scroll loading={loading}>
			<View style={{ rowGap: 10 }}>

				<Pressable style={{ alignItems: 'center', marginTop: 15 }} onPress={selectImage}>
					<XAvatar
						initials={initials}
						imgPath={image}
						size={100}
					/>
					<View style={{ flexDirection: 'row', paddingVertical: 10, columnGap: 5, alignItems: 'center' }}>
						<XIcon size={16} icon='edit' />
						<XText>{t('Choose profile image')}</XText>
					</View>
				</Pressable>

				<XSection transparent>
					<XTextInput
						title={t('Username')}
						value={data.username}
						onChangeText={(v) => setData(old => ({ ...old, username: v }))}
					/>
					<XTextInput
						title={t('Email')}
						value={data.email}
						onChangeText={(v) => setData(old => ({ ...old, email: v }))}
					/>
				</XSection>

				<XSection transparent>
					<XTextInput
						title={t('First name')}
						value={data.firstName}
						onChangeText={(v) => setData(old => ({ ...old, firstName: v }))}
					/>
					<XTextInput
						title={t('Last name')}
						value={data.lastName}
						onChangeText={(v) => setData(old => ({ ...old, lastName: v }))}
					/>
					<XTextInput
						title={t('Phone')}
						value={data.phone}
						onChangeText={(v) => setData(old => ({ ...old, phone: v }))}
					/>

				</XSection>

				<XSection transparent style={{ marginTop: 10 }}>
					<XButton title='Save' primary large onPress={saveProfile} disabled={loading} />
				</XSection>
			</View>

		</XScreen>
	);
}

export default MenageAccountScreen;