import { BlogImage } from '../../models/Blog';

interface UploadOptions {
  onProgress: (progress: number) => void;
}

export class BlogImageService {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getImages(): Promise<BlogImage[]> {
    const response = await fetch(`${this.apiUrl}/images`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    return response.json();
  }

  async getImage(id: string): Promise<BlogImage> {
    const response = await fetch(`${this.apiUrl}/images/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    return response.json();
  }

  async uploadImage(file: File, options?: UploadOptions): Promise<BlogImage> {
    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.apiUrl}/images`, true);

    return new Promise((resolve, reject) => {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && options?.onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          options.onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Invalid response format';
            reject(new Error(errorMessage));
          }
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error'));
      };

      xhr.send(formData);
    });
  }

  async deleteImage(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/images/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  }
}

// Create and export a singleton instance
export const blogImageService = new BlogImageService(process.env.REACT_APP_API_URL || '/api'); 