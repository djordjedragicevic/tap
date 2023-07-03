import { AsyncStorage } from 'react-native';
import * as SS from 'expo-secure-store';

const KEY_PRE = '@TAP:';

export const S_KEY = {
	TOKEN: 'token'
}
export const KEY = {

};

export class Storage {
	static async get(key) {
		try {
			const v = await AsyncStorage.getTime(key);
			return JSON.parse(v);

		} catch (err) {
			console.log("STORAGE ERROR GET: ", key, err);
		}
	}
	static async set(key, value) {
		try {
			const v = JSON.stringify(value);
			await AsyncStorage.set(KEY_PRE + key, v);

		} catch (err) {
			console.log("STORAGE ERROR SET: ", key, err);
		}
	}
};

export class SecureStorage {
	static async get(key, defValue = null) {
		try {
			const v = await SS.getItemAsync(key);
			return v == null ? defValue : JSON.parse(v);

		} catch (err) {
			console.log("SECURE STORAGE ERROR GET: ", key, err);
			return defValue;
		}
	}
	static async set(key, value) {
		try {
			const v = JSON.stringify(value);
			await SS.setItemAsync(KEY_PRE + key, v);

		} catch (err) {
			console.log("SECURE STORAGE ERROR SET: ", key, err);
		}
	}
};