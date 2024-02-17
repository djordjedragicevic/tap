import { ImageBackground, View } from 'react-native';
import XImage from 'xapp/src/components/basic/XImage';

const personalCoachImg = require('../assets/svg/personal_coach.jpg');
const barberyImg = require('../assets/svg/barbery1.jpg');
const carCheck = require('../assets/svg/car_check1.jpg');
const beautySalonImg = require('../assets/svg/beauty_salon.jpg');


const providerTypeImgMap = {

};


const ProviderImage = ({ providerImg, providerType, imgText }) => {

	return (
		<View style={{ flex: 1 }}>
			{
				item.mainImg ?
					<XImage
						imgPath={item.mainImg?.split(',')[0]}
						contentFit='cover'
						style={{ flex: 1 }}
					/>
					:
					<ImageBackground
						style={{
							flex: 1,
							justifyContent: 'center'
						}}
						source={require('../assets/svg/personal_coach.jpg')}
					>

						<View style={{
							flex: 1,
							//backgroundColor: Theme.opacity(Theme.Light.colors.gray, 0.7),
							justifyContent: 'center',
							alignItems: 'center'
						}}>
							<View style={{
								paddingHorizontal: 10,
								paddingVertical: 10,
								borderRadius: Theme.values.borderRadius,
								maxHeight: '50%',
								maxWidth: '80%',
								backgroundColor: Theme.opacity(Theme.Light.colors.black, 0.4)
							}}>
								{
									!!imgText &&
									<XText
										style={{ letterSpacing: 3 }}
										adjustsFontSizeToFit
										center
										secondary
										light
										bold
										size={26}
									>
										{imgText}
									</XText>
								}
							</View>
						</View>
					</ImageBackground>
			}
		</View>
	);
}

export default ProviderImage;