import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';

const App = () => {
	const [data, setData] = useState('TEST DATA');
	useEffect(() => {
		console.log("GET DATA");
		fetch('http://10.0.2.2:9080/api/company')
			.then(resp => {
				console.log(resp);
				return resp.json();
			})
			.then(r => setData(JSON.stringify(r)))
			.catch(err => {
				setData(old => old.concat('\n - ', err))
				console.log('ERR', err)
			});
	}, []);
	return (
		<>
			<StatusBar />
			<SafeAreaView>
				<View>
					<Text>TAP</Text>
					<Text>{data}</Text>
				</View>
			</SafeAreaView>
		</>
	);
};

export default App;
