import { Image } from "expo-image";
import { Http } from "../../common/Http";

const XImage = (params) => {

	if (!params.imgPath && !params.source)
		return null;

	return (
		<Image
			src={params.src}
			source={params.source || { uri: !params.local ? `${Http.getAPI()}/asset/download?lct=${encodeURIComponent(params.imgPath)}` : params.imgPath }}
			cachePolicy='memory-disk'
			{...params}
		/>
	)
};

export default XImage;