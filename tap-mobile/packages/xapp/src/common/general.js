export const groupServices = (sers) => {

	if (!sers)
		return sers;

	const cats = {};
	const catList = [];
	const sMap = {};

	const gMap = {};

	sers.forEach(ser => {
		sMap[ser.id] = ser;
		const cId = !ser.c_id ? '__default' : ser.c_id;
		if (!cats[cId]) {
			cats[cId] = {
				name: ser.c_name,
				groups: []
			};
			catList.push({
				name: ser.c_name,
				id: cId
			})
		}


		const gId = !ser.g_id ? '__default' : ser.g_id;
		const gMid = gId + cId;
		if (!gMap[gMid]) {
			gMap[gMid] = { data: [] };

			cats[cId].groups.push({
				title: ser.g_name || '__default',
				data: gMap[gMid].data
			});
		}

		gMap[gMid].data.push(ser);

	});

	return {
		categories: cats,
		categoryList: catList,
		sMap
	};
};

export const APP_STATUS = {
	WAITING: 'WAITING',
	ACCEPTED: 'ACCEPTED',
	REJECTED: 'REJECTED',
	CANCELED: 'CANCELED',
	DROPPED: 'DROPPED'
};

export const APP_STATUS_ICON = {
	WAITING: 'hourglass',
	ACCEPTED: 'checkcircle',
	REJECTED: 'closecircle',
	CANCELED: 'close',
	DROPPED: 'arrowdown'
};