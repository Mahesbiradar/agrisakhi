const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('folder', 'agrisakhi/images')
  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.secure_url
}

export async function uploadAudio(blob) {
  const form = new FormData()
  form.append('file', blob, 'audio.webm')
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('resource_type', 'video')
  form.append('folder', 'agrisakhi/audio')
  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Audio upload failed')
  const data = await res.json()
  return data.secure_url
}
