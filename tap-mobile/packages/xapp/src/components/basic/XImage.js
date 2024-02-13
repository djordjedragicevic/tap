import { Image } from "expo-image";
import { Http } from "../../common/Http";

const XImage = (params) => {

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