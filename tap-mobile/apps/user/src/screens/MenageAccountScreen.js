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
		imgPath
	} = useStore(gs => gs.user);

	const [data, setData] = useState({
		id: id,
		username: username,
		email: email,
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		imgPath: imgPath
	});

	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null);

	const [selectedImage, setSelectedImage] = useState();

	useEffect(() => {
		setLoading(true);
		Http.get('/user/profile')
			.then(resp => setData(resp))
			.catch(emptyFn)
			.finally(() => setLoading(false));
	}, []);

	const saveProfile = () => {
		setLoading(true);

		Http.postFormData('/user/profile', {
			image: selectedImage,
			username: data.username,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			phone: data.phone
		})
			.then(_ => storeDispatch('user.set_data', data))
			.catch(emptyFn)
			.finally(() => setLoading(false));;
	};

	const selectImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true
		});

		if (!result.canceled) {
			const imgUrl = result.assets[0].uri;
			const imgName = imgUrl.split('/').pop();
			const imgType = imgName.split('.').pop();

			setSelectedImage({
				uri: imgUrl,
				name: imgName,
				type: `image/${imgType}`
			});

			setImage(result.assets[0].uri);
		}
	};


	return (
		<XScreen scroll loading={loading}>
			<View style={{ rowGap: 10 }}>

				<Pressable style={{ alignItems: 'center', marginTop: 15 }} onPress={selectImage}>
					<XAvatar
						initials={initials}
						imgPath={data.imgPath}
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