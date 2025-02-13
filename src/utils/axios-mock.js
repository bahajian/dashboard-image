import axios from 'axios';

const axiosServices = axios.create({ baseURL: 'https://mock-data-api-nextjs.vercel.app/'});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTg2ODA5MjgzZTI4Yjk2ZDJkMzg1MzciLCJpYXQiOjE3MzU3NTg4MjMsImV4cCI6MTczNTg0NTIyM30.PkGg6mckD1g43mQUSVGQqv3YfsLcijBabeZVw-8Xnrk`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error)
    // if (error.response.status === 401 && !window.location.href.includes('/login')) {
    //   window.location.pathname = '/maintenance/500';
    // }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
