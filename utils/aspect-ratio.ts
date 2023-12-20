import axios from "axios"; // You'll need to install the axios library

export async function getBestAspectRatio(url: string) {
	try {
		const response = await axios.get(url, { responseType: "arraybuffer" });
		const imageBlob = new Blob([response.data]);
		const imageUrl = URL.createObjectURL(imageBlob);
		const image = new Image();

		return new Promise((resolve, reject) => {
			image.onload = () => {
				const originalWidth = image.width;
				const originalHeight = image.height;
				const originalAspectRatio = originalWidth / originalHeight;
				const aspectRatios = [1.91 / 1, 16 / 9, 4 / 5, 1 / 1];

				let bestAspectRatio = aspectRatios[2];
				let minDifference = Math.abs(originalAspectRatio - bestAspectRatio);

				for (const aspectRatio of aspectRatios) {
					const difference = Math.abs(originalAspectRatio - aspectRatio);
					if (difference < minDifference) {
						minDifference = difference;
						bestAspectRatio = aspectRatio;
					}
				}

				console.log("ar", bestAspectRatio.toFixed(2));
				resolve(bestAspectRatio.toFixed(2));
			};

			image.onerror = () => {
				reject(new Error("Failed to load the image."));
			};

			image.src = imageUrl;
		});
	} catch (error: any) {
		console.error(`Error: ${error.message}`);
		return null;
	}
}
