import ajax from './ajax'

// 1. 基础路径
const BASE_URL = '/api';
// const BASE_URL = 'http://localhost:3000';

// 2. 请求方法

// 2.1 用户注册
export const register = (registerUser) => ajax(BASE_URL + '/users/register', registerUser, 'POST');
// 2.2 用户登录
export const login = (loginUser) => ajax(BASE_URL + '/users/login', loginUser, 'POST');