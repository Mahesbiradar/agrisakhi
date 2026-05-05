export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null
    this.chunks = []
    this.stream = null
  }

  async start() {
    this.chunks = []
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'audio/webm' })
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data)
    }
    this.mediaRecorder.start()
  }

  stop() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        resolve(new Blob(this.chunks, { type: 'audio/webm' }))
      }
      this.mediaRecorder.stop()
      this.stream.getTracks().forEach((t) => t.stop())
    })
  }

  isSupported() {
    return !!navigator.mediaDevices?.getUserMedia
  }
}
