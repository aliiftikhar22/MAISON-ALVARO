import { isFirebaseConfigured } from '@/lib/firebase';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(cloudName && uploadPreset);

/** Downscale to a JPEG data URL (demo mode only; keeps localStorage small). */
async function fileToDataUrl(file: File, maxSide = 1000): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Image processing is not supported in this browser.');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.8);
}

/** Uploads an image and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 12 * 1024 * 1024) throw new Error('Image is larger than 12 MB.');

  if (cloudinaryConfigured) {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', uploadPreset as string);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body,
    });
    if (!res.ok) throw new Error('Image upload failed. Check your Cloudinary cloud name and unsigned preset.');
    const data = (await res.json()) as { secure_url: string };
    return data.secure_url;
  }

  if (isFirebaseConfigured) {
    throw new Error(
      'Image uploads need Cloudinary. Add the Cloudinary env vars, or paste an image URL instead.',
    );
  }
  return fileToDataUrl(file);
}
