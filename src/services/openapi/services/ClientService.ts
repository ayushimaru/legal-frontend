/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ClientService {

    /**
     * Get all Clients
     * @param authToken Auth Token
     * @param customerCode Customer code
     * @returns any Successful operation
     * @throws ApiError
     */
    public static getApiV1Client(
        authToken: string,
        customerCode: string,
    ): CancelablePromise<{
        data?: Array<Record<string, any>>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/client',
            headers: {
                'authToken': authToken,
            },
            query: {
                'customer_code': customerCode,
            },
        });
    }

    /**
     * Create a new client
     * Endpoint to create a new client
     * @param authToken Auth Token
     * @param requestBody
     * @returns any Client created successfully
     * @throws ApiError
     */
    public static postApiV1Client(
        authToken: string,
        requestBody: {
            address?: string;
            client_type: number;
            contact_person: {
                aadhar_card?: string;
                email: string;
                name: string;
                phone: string;
            };
            customer_code: string;
            name: string;
            status: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/client',
            headers: {
                'authToken': authToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Validation error`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * Delete client by ID
     * Delete client information by ID
     * @param id
     * @param authToken Auth Token
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1Client(
        id: string,
        authToken: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/client/{id}',
            path: {
                'id': id,
            },
            headers: {
                'authToken': authToken,
            },
            errors: {
                401: `Unauthorized`,
                404: `Client not found`,
            },
        });
    }

    /**
     * Get client by ID
     * Retrieve client information by ID
     * @param id
     * @param authToken Auth Token
     * @returns any Successful response - Client found
     * @throws ApiError
     */
    public static getApiV1Client1(
        id: string,
        authToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/client/{id}',
            path: {
                'id': id,
            },
            headers: {
                'authToken': authToken,
            },
            errors: {
                401: `Unauthorized`,
                404: `User not found`,
            },
        });
    }

    /**
     * Update client by ID
     * Update client information by ID
     * @param id
     * @param authToken Auth Token
     * @param requestBody
     * @returns any User updated successfully
     * @throws ApiError
     */
    public static putApiV1Client(
        id: string,
        authToken: string,
        requestBody: {
            address?: string;
            client_type: number;
            contact_person: {
                aadhar_card?: string;
                email: string;
                name: string;
                phone: string;
            };
            customer_code: string;
            name: string;
            status: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/client/{id}',
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
                401: `Unauthorized`,
                404: `User not found`,
            },
        });
    }

}
