import XScreen from "xapp/src/components/XScreen";
import MapView, { Marker } from 'react-native-maps';
import { useState } from "react";

const MapScreen = () => {
	const [latD, setLatD] = useState(0.0035);
	const [lonD, setLonD] = useState(0.0035);
	return (
		<XScreen flat>
			<MapView
				style={{
					with: '100%',
					height: '100%'
				}}
				initialRegion={{
					latitude: 44.7728626,
					longitude: 17.1931324,
					latitudeDelta: latD,
					longitudeDelta: lonD
				}}
			>
				<Marker
					key={1}
					coordinate={{ latitude: 44.7728626, longitude: 17.1931324 }}
					//image={'../../assets/favicon.png'}
					title={'Đole'}
					pinColor="blue"
					description={'Frizerski salon'}
					isPreselected={true}
				/>
			</MapView>
		</XScreen>
	);
}

export default MapScreen;