import { View } from 'react-native';
import XScreen from "xapp/src/components/XScreen";
import { Http } from 'xapp/src/common/Http';
import { useStore } from "xapp/src/store/store";
import TimePeriodsPanel from "../components/time-periods/TimePeriodPanel";
import { useEffect, useState } from 'react';
import XFieldDatePicker from "xapp/src/components/basic/XFieldDataPicker";
import { emptyFn, getInitials } from 'xapp/src/common/utils';
import XToolbarContainer from "xapp/src/components/XToolbarContainer";
import XText from "xapp/src/components/basic/XText";
import XAvatar from 'xapp/src/components/basic/XAvatar';
import { Theme } from 'xapp/src/style/themes';

const HOUR_HEIGHT = 60;


const AppointmentsScreen = () => {

	const sizeCoef = useState(2)[0];
	const pId = useStore(gS => gS.provider.id);
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState(new Date(2023, 10, 2));

	//const [employeeData] = useHTTPGet('/appointments/' + pId)
	useEffect(() => {
		setLoading(true);
		let finish = true;
		Http.get(`/appointments/${pId}`, { date: date })
			.then(reps => {
				if (finish) {
					setData(reps);
				}
			})
			.catch(emptyFn)
			.finally(setLoading)
		return () => finish = false;
	}, [date]);

	return (
		<XScreen flat loading={loading}>
			<XToolbarContainer
				barHeight={40}
				style={{ borderColor: 'red', borderWidth: 0, borderRadius: Theme.values.borderRadius, overflow: 'hidden' }}
				items={data?.employees.map(e => ({ id: e.employeeId, name: e.name, imagePath: e.imagePath }))}
				onItemRender={(item) => {
					return (
						<View style={{
							borderWidth: 1,
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 8,
							flex: 1,
							margin: 3
						}}>
							<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
								<XAvatar
									imgPath={item.imagePath}
									initials={getInitials(null, null, item.name)}
									size={24}
								/>
								<View>
									<XText>{item.name}</XText>
								</View>
							</View>
						</View>
					)
				}}
			/>
			<XFieldDatePicker
				style={{ marginBottom: 10 }}
				onConfirm={setDate}
				initDate={date}
			/>
			<TimePeriodsPanel
				sizeCoef={sizeCoef}
				startHour={9}
				endHour={22}
				rowHeight={HOUR_HEIGHT}
				items={data?.employees[1].timeline}
			/>
		</XScreen>
	);
}

export default AppointmentsScreen;