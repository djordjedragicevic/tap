import XScreen from "xapp/src/components/XScreen";
import MapView, { Marker } from 'react-native-maps';
import { useState } from "react";

const MapScreen = ({ route }) => {
	const [latD] = useState(0.0055);
	const [lonD] = useState(0.0035);
	const { lat, lon, title, description } = route.params;

	return (
		<XScreen flat>
			<MapView
				style={{
					with: '100%',
					height: '100%'
				}}
				initialRegion={{
					latitude: lat,
					longitude: lon,
					latitudeDelta: latD,
					longitudeDelta: lonD
				}}
			>
				<Marker
					key={1}
					coordinate={{ latitude: lat, longitude: lon }}
					//image={'../../assets/favicon.png'}
					title={title}
					pinColor="blue"
					description={description}
					isPreselected={true}
				/>
			</MapView>
		</XScreen>
	);
}

export default MapScreen;