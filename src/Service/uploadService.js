import axios from 'axios';

const CLOUD_NAME = "drleabez2";
const UPLOAD_PRESET = "wecg1rfy";

export const uploadToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const cloudinaryAxios = axios.create(); 

  const response = await cloudinaryAxios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    formData,
    {
      // Theo dõi tiến độ upload
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted); // Gửi phần trăm về component
        }
      },
      headers: {
        'Authorization': undefined
      },
      transformRequest: [(data, headers) => {
        if (headers) {
          delete headers['Authorization'];
          delete headers['authorization'];
          if (headers.common) {
            delete headers.common['Authorization'];
          }
        }
        return data;
      }, ...axios.defaults.transformRequest]
    }
  );
  return response.data;
};