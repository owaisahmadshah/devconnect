import { uploadOnCloudinary } from './cloudinary.js';

export async function uploadSingleImage(path: string): Promise<{ url: string; success: boolean }> {
  const response = await uploadOnCloudinary(path);
  return { url: response?.url ?? '', success: response?.url ? true : false };
}

export async function uploadMultipleImages(
  paths: string[],
): Promise<{ urls: string[]; success: boolean }> {
  try {
    const results = await Promise.all(paths.map(path => uploadSingleImage(path)));

    const urls = results.filter(r => r.success).map(r => r.url);

    const success = results.every(r => r.success);

    return { urls, success };
  } catch (error) {
    return { urls: [], success: false };
  }
}
