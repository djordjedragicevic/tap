import { Theme } from "../style/themes";

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
	WAITING: 'clockcircle',
	ACCEPTED: 'checkcircle',
	REJECTED: 'closecircle',
	CANCELED: 'exception1',
	DROPPED: 'arrowdown'
};

export const APP_STATUS_COLOR = {
	WAITING: Theme.vars.yellow,
	ACCEPTED: Theme.vars.green,
	REJECTED: Theme.vars.red,
	DROPPED: Theme.vars.gray,
	CANCELED: Theme.vars.brown
};