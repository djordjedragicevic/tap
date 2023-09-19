import * as SS from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PRE = 'XAPP_';

export class Storage {
	static async get(key, defValue) {
		key = KEY_PRE + key;
		try {
			const v = await AsyncStorage.getItem(key);
			console.log(v, !!v)
			return v ? JSON.parse(v) : defValue;

		} catch (err) {
			console.log("STORAGE ERROR GET: ", key, err);
		}
	}
	static async set(key, value) {
		key = KEY_PRE + key;
		try {
			if (key && value != null) {
				const v = JSON.stringify(value);
				await AsyncStorage.setItem(key, v);
			}

		} catch (err) {
			console.log("STORAGE ERROR SET: ", key, err);
		}
	}
};

export class SecureStorage {
	static async get(key, defValue = null) {
		key = KEY_PRE + key;
		try {
			const v = await SS.getItemAsync(key);
			return v == null ? defValue : JSON.parse(v);

		} catch (err) {
			console.log("SECURE STORAGE ERROR GET: ", key, err);
			return defValue;
		}
	}
	static async set(key, value) {
		key = KEY_PRE + key;
		try {
			const v = JSON.stringify(value);
			await SS.setItemAsync(key, v);

		} catch (err) {
			console.log("SECURE STORAGE ERROR SET: ", key, err);
		}
	}
};