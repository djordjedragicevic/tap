import { Image } from "expo-image";
import { Http } from "../../common/Http";

const XImage = (params) => {

	console.log(!params.local ? `${Http.getAPI()}/asset/download?lct=${encodeURIComponent(params.imgPath)}` : params.imgPath);

	if (!params.imgPath)
		return null;

	return (
		<Image
			source={{ uri: !params.local ? `${Http.getAPI()}/asset/download?lct=${encodeURIComponent(params.imgPath)}` : params.imgPath }}
			cachePolicy='memory'
			{...params}
		/>
	)
};

export default XImage;