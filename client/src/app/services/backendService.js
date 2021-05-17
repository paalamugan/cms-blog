import axios from "axios";
import qs from "qs";
import { isObjectLike } from 'lodash';
import history from 'history.js';

import localStorageService from "./localStorageService";
import jwtAuthService from "./jwtAuthService";

const API_END_POINT = '/api';
const AUTH_END_POINT = '/auth';

const handleError = ({ response }) => {

    if (!response) return;

    setTimeout(() => {

        if (response.status === 401) { // "Unauthorized"
            jwtAuthService.logout();
            history.push({
                pathname: '/login'
            });

        } else if (response.status === 403) { // Forbidden
            history.push({
                pathname: '/posts'
            });
        } else if (response.status === 404) { // "Not Found"
            history.push({
                pathname: '/404'
            });
        }
    
    }, 600);

    let message = isObjectLike(response.data) ? response.data.message : response.data;

    return { success: false, data: message };
}

const handleResponse = (response) =>  {
    return { success: true, data: response.data }
};

class Service {

    constructor (endPoint) {

        endPoint = endPoint || '/';

        this.request = axios.create({
            baseURL: endPoint
        });

        if (endPoint === API_END_POINT) {

            this.request.interceptors.request.use(function (config) {
            
                let token = localStorageService.getToken();
    
                if (token) {
                    config.headers.common["Authorization"] = "Bearer " + token;
                } else {
                    delete config.headers.common['Authorization'];
                }
    
                return config;
            });

        }
    }

    queryString(data) {
        return qs.stringify(data);
    }

    queryParse(query) {

        if (!query) return query;

        query = query.replace(/^\?/, '');
        return qs.parse(query);
    }

    get(url, params) {
        return this.request.get(url, { params }).then(handleResponse).catch(handleError);
    }

    post(url, data = {}, options) {
        return this.request.post(url, data, { ...options }).then(handleResponse).catch(handleError);
    }

    put(url, data = {}, options) {
        return this.request.put(url, data, { ...options }).then(handleResponse).catch(handleError);
    }

    delete(url, params) {
        return this.request.delete(url, { params }).then(handleResponse).catch(handleError);
    }

    remove(url, params) {
        return this.request.delete(url, { params }).then(handleResponse).catch(handleError);
    }

}

const backendService = new Service();

export const get = backendService.get.bind(backendService);
export const post = backendService.post.bind(backendService);
export const put = backendService.put.bind(backendService);
export const remove = backendService.delete.bind(backendService);

backendService.auth = new Service(AUTH_END_POINT);
backendService.api = new Service(API_END_POINT);

export const auth = backendService.auth;
export const api = backendService.api;

export default backendService;

