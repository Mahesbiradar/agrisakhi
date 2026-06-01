const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

function cloudinaryUrl(resourceType) {
  if (!CLOUDINARY_CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary upload is not configured')
  }
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`
}

export async function uploadImage(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('folder', 'agrisakhi/images')
  const res = await fetch(cloudinaryUrl('image'), { method: 'POST', body: form })
  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.secure_url
}

export async function uploadAudio(blob) {
  const form = new FormData()
  form.append('file', blob, 'audio.webm')
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('folder', 'agrisakhi/audio')
  const res = await fetch(cloudinaryUrl('video'), { method: 'POST', body: form })
  if (!res.ok) throw new Error('Audio upload failed')
  const data = await res.json()
  return data.secure_url
}
