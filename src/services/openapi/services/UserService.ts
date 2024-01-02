/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Get all Users
     * @param authToken Auth Token
     * @param status Status (0: Inactive, 1: Active (default), 2: Deleted, -1: None Deleted, -2: All)
     * @param role Status (1: admin, 2: operation manager, 3: employee, 4: all (default))
     * @param perPage Per page
     * @param pageNumber Page Number
     * @param sortBy Sort by (column name)
     * @param order Order by (asc, desc)
     * @returns any Successful operation
     * @throws ApiError
     */
    public static getApiV1User(
        authToken: string,
        status?: number,
        role?: number,
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
            url: '/api/v1/user',
            headers: {
                'authToken': authToken,
            },
            query: {
                'status': status,
                'role': role,
                'per_page': perPage,
                'page_number': pageNumber,
                'sort_by': sortBy,
                'order': order,
            },
        });
    }

    /**
     * Create a new user
     * Endpoint to create a new user
     * @param authToken Auth Token
     * @param requestBody
     * @returns any User created successfully
     * @throws ApiError
     */
    public static postApiV1User(
        authToken: string,
        requestBody: {
            aadhar_card: string;
            address: string;
            customer_code: string;
            email: string;
            first_name: string;
            last_name: string;
            middle_name?: string;
            password: string;
            phone: string;
            role: number;
            status: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/user',
            headers: {
                'authToken': authToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Validation error`,
            },
        });
    }

    /**
     * Delete user by ID
     * Delete user information by ID
     * @param id
     * @param authToken Auth Token
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1User(
        id: string,
        authToken: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/user/{id}',
            path: {
                'id': id,
            },
            headers: {
                'authToken': authToken,
            },
            errors: {
                404: `User not found`,
            },
        });
    }

    /**
     * Get user by ID
     * Retrieve user information by ID
     * @param id
     * @param authToken Auth Token
     * @returns any Successful response - User found
     * @throws ApiError
     */
    public static getApiV1User1(
        id: string,
        authToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/{id}',
            path: {
                'id': id,
            },
            headers: {
                'authToken': authToken,
            },
            errors: {
                404: `User not found`,
            },
        });
    }

    /**
     * Update user by ID
     * Update user information by ID
     * @param id
     * @param authToken Auth Token
     * @param requestBody
     * @returns any User updated successfully
     * @throws ApiError
     */
    public static putApiV1User(
        id: string,
        authToken: string,
        requestBody: {
            aadhar_card?: string;
            address?: string;
            email?: string;
            first_name?: string;
            last_name?: string;
            middle_name?: string;
            password?: string;
            phone?: string;
            role?: number;
            status?: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/user/{id}',
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
                404: `User not found`,
            },
        });
    }

}
