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
import { storeDispatch, storeGetValue } from "xapp/src/store/store";
import XText from "xapp/src/components/basic/XText";
import XIcon from "xapp/src/components/basic/XIcon";
import * as ImagePicker from 'expo-image-picker';

const MenageAccountScreen = ({ navigation }) => {
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
	} = storeGetValue(gs => gs.user);

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
			.then(resp => {
				storeDispatch('user.set_data', resp);
				navigation.goBack();
			})
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
		}
	};


	return (
		<XScreen scroll loading={loading}>
			<View style={{ rowGap: 10 }}>

				<Pressable style={{ alignItems: 'center', marginTop: 15 }} onPress={selectImage}>
					<XAvatar
						initials={initials}
						imgPath={selectedImage?.uri || imgPath}
						local={!!selectedImage?.uri}
						size={100}
					/>
					<View style={{ flexDirection: 'row', paddingVertical: 10, columnGap: 5, alignItems: 'center' }}>
						<XIcon size={16} icon='edit' />
						<XText>{t('Choose profile image')}</XText>
					</View>
				</Pressable>

				<XSection transparent title={t('Account')}>
					<XTextInput
						title={t('Username')}
						value={data.username}
						clearable
						onClear={() => setData(old => ({ ...old, username: '' }))}
						onChangeText={(v) => setData(old => ({ ...old, username: v }))}
					/>
					<XTextInput
						title={t('Email')}
						disabled
						value={data.email}
						onChangeText={(v) => setData(old => ({ ...old, email: v }))}
					/>
				</XSection>

				<XSection transparent title={'Personal information'} style={{ marginTop: 20 }}>
					<XTextInput
						title={t('First name')}
						value={data.firstName}
						clearable
						onClear={() => setData(old => ({ ...old, firstName: '' }))}
						onChangeText={(v) => setData(old => ({ ...old, firstName: v }))}
					/>
					<XTextInput
						title={t('Last name')}
						value={data.lastName}
						clearable
						onClear={() => setData(old => ({ ...old, lastName: '' }))}
						onChangeText={(v) => setData(old => ({ ...old, lastName: v }))}
					/>
					<XTextInput
						title={t('Phone')}
						value={data.phone}
						clearable
						onClear={() => setData(old => ({ ...old, phone: '' }))}
						onChangeText={(v) => setData(old => ({ ...old, phone: v }))}
					/>

				</XSection>

				<XSection transparent style={{ marginTop: 10 }}>
					<XButton
						title={t('Save')}
						primary
						onPress={saveProfile}
						disabled={loading}
					/>
				</XSection>
			</View>

		</XScreen>
	);
}

export default MenageAccountScreen;