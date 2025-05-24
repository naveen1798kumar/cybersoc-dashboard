import axios from 'axios';

const apiUrl = 'https://your-api-endpoint.com';

export const createCategory = (categoryData) => {
  return axios.post(`${apiUrl}/categories`, categoryData);
};

export const createService = (serviceData) => {
  return axios.post(`${apiUrl}/services`, serviceData);
};

export const updateCategory = (categoryId, categoryData) => {
  return axios.put(`${apiUrl}/categories/${categoryId}`, categoryData);
};

export const updateService = (serviceId, serviceData) => {
  return axios.put(`${apiUrl}/services/${serviceId}`, serviceData);
};

export const deleteCategory = (categoryId) => {
  return axios.delete(`${apiUrl}/categories/${categoryId}`);
};

export const deleteService = (serviceId) => {
  return axios.delete(`${apiUrl}/services/${serviceId}`);
};
