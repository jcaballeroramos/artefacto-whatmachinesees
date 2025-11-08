export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result is a data URL: "data:image/jpeg;base64,LzlqLzRBQ...".
        // We only need the part after the comma.
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const extractFramesFromVideo = (
  videoFile: File,
  frameCount: number = 15
): Promise<{ mimeType: string; data: string; timestamp: number }[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.preload = 'auto';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject('Canvas context not available');

    const frames: { mimeType: string; data: string; timestamp: number }[] = [];

    video.onloadeddata = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const duration = video.duration;
      if (duration <= 0) {
        URL.revokeObjectURL(video.src);
        return reject('Video has no duration or is invalid.');
      }
      
      const interval = duration / frameCount;

      for (let i = 0; i < frameCount; i++) {
        const currentTime = Math.min(i * interval, duration - 0.1);
        video.currentTime = currentTime;
        
        await new Promise(res => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            res(null);
          };
          video.addEventListener('seeked', onSeeked);
        });
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64Data = dataUrl.split(',')[1];
        if (base64Data) {
          frames.push({
            mimeType: 'image/jpeg',
            data: base64Data,
            timestamp: currentTime,
          });
        }
      }
      
      URL.revokeObjectURL(video.src);
      resolve(frames);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Error loading video file. It may be corrupt or in an unsupported format.'));
    };
  });
};