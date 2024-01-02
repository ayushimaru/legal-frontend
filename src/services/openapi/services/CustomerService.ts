/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CustomerService {

    /**
     * Get all customers
     * @param authToken authToken
     * @param status Status (0: Inactive, 1: Active (default), 2: Deleted, -1: None Deleted, -2: All)
     * @param name name
     * @param contactName Contact person name
     * @param customerCode Customer Code
     * @param perPage Per page
     * @param pageNumber Page Number
     * @param sortBy Sort by (column name)
     * @param order Order by (asc, desc)
     * @returns any Successful operation
     * @throws ApiError
     */
    public static getApiV1Customer(
        authToken: string,
        status?: number,
        name?: string,
        contactName?: string,
        customerCode?: string,
        perPage?: string,
        pageNumber?: string,
        sortBy?: string,
        order?: string,
    ): CancelablePromise<{
        current_page?: number;
        data?: Array<Record<string, any>>;
        per_page?: number;
        total?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customer',
            headers: {
                'authToken': authToken,
            },
            query: {
                'status': status,
                'name': name,
                'contact_name': contactName,
                'customer_code': customerCode,
                'per_page': perPage,
                'page_number': pageNumber,
                'sort_by': sortBy,
                'order': order,
            },
        });
    }

    /**
     * Add new customer
     * @param authToken Auth Token
     * @param requestBody
     * @returns any customer added successfully
     * @throws ApiError
     */
    public static postApiV1Customer(
        authToken: string,
        requestBody: {
            address: string;
            contact: {
                email: string;
                name: string;
                phone: string;
            };
            customer_code: string;
            name: string;
            status?: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/customer',
            headers: {
                'authToken': authToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request data`,
            },
        });
    }

    /**
     * Delete customer by ID
     * @param id ID of the customer
     * @param authToken Auth Token
     * @returns any customer deleted successfully
     * @throws ApiError
     */
    public static deleteApiV1Customer(
        id: string,
        authToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/customer/{id}',
            path: {
                'id': id,
            },
            headers: {
                'authToken': authToken,
            },
            errors: {
                404: `customer not found`,
            },
        });
    }

    /**
     * Get customer by ID
     * @param id ID of the customer
     * @param authToken Auth Token
     * @returns any Successful response - Customer found
     * @throws ApiError
     */
    public static getApiV1Customer1(
        id: string,
        authToken: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customer/{id}',
            path: {
                'id': id,
            },
            headers: {
                'authToken': authToken,
            },
            errors: {
                404: `customer not found`,
            },
        });
    }

    /**
     * Update customer by ID
     * @param id ID of the customer
     * @param authToken Auth Token
     * @param requestBody
     * @returns any customer updated successfully
     * @throws ApiError
     */
    public static putApiV1Customer(
        id: string,
        authToken: string,
        requestBody: {
            address?: string;
            contact?: {
                email?: string;
                name?: string;
                phone?: string;
            };
            customer_code?: string;
            name?: string;
            status?: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/customer/{id}',
            path: {
                'id': id,
            },
            headers: {
                'authToken': authToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                404: `customer not found`,
            },
        });
    }

    /**
     * Get customer by customer code
     * @param id ID of the customer
     * @param authToken Auth Token
     * @returns any Successful operation
     * @throws ApiError
     */
    public static getApiV1CustomerCode(
        id: string,
        authToken: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customer_code/{id}',
            path: {
                'id': id,
            },
            headers: {
                'authToken': authToken,
            },
            errors: {
                404: `customer not found`,
            },
        });
    }

}
