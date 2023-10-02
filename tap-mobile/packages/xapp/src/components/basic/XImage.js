import { Image } from "expo-image";
import { Http } from "../../common/Http";

const XImage = (params) => {

	if (!params.imgPath)
		return null;

	return (
		<Image
			source={`${Http.getHOST()}${params.imgPath}`}
			cachePolicy='memory'
			contentFit="cover"
			{...params}
		/>
	)
};

export default XImage;