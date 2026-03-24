import axios from 'axios';

class ApiService {
  static instance = null;
  
  constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    }
    
    this.api = axios.create({
      baseURL: 'http://localhost:8082/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Interceptor para añadir token automáticamente
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    ApiService.instance = this;
    console.log('✅ [Singleton] API Service inicializado');
  }
  
  getInstance() {
    return this.api;
  }
  
  static getInstance() {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance.getInstance();
  }
}

export default ApiService.getInstance();