import { uploadOnCloudinary } from './cloudinary.js';

export async function uploadSingleImage(path: string): Promise<{ url: string; success: boolean }> {
  const response = await uploadOnCloudinary(path);
  return { url: response?.url ?? '', success: response?.url ? true : false };
}

export async function uploadMultipleImages(
  path: string[],
): Promise<{ urls: string[]; success: boolean }> {
  let urls: string[] = [];
  let success = true;
  path.forEach(async pathValue => {
    const { url, success: isUploaded } = await uploadSingleImage(pathValue);
    if (!isUploaded) {
      success = false;
    } else {
      urls.push(url);
    }
  });
  return { urls, success };
}
