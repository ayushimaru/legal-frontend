/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LoginService {

    /**
     * Change Password
     * Change Password
     * @param id
     * @param authToken Auth Token
     * @param requestBody
     * @returns any Password updated successfully
     * @throws ApiError
     */
    public static putApiV1ChangePassword(
        id: string,
        authToken: string,
        requestBody: {
            password?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/change_password/{id}',
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
                401: `Token has expired`,
                404: `User not found`,
            },
        });
    }

    /**
     * Generate Forgot Password Key
     * Generate Forgot Password Key
     * @param email
     * @returns any Forgot Password Key Generated
     * @throws ApiError
     */
    public static getApiV1ForgotPassword(
        email: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/forgot_password/{email}',
            path: {
                'email': email,
            },
            errors: {
                404: `User not found`,
            },
        });
    }

    /**
     * User Logout
     * Endpoint for user logout
     * @param authToken Auth Token
     * @returns any Logout successfully
     * @throws ApiError
     */
    public static deleteApiV1Login(
        authToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/login',
            headers: {
                'authToken': authToken,
            },
            errors: {
                400: `Bad request - Validation error`,
            },
        });
    }

    /**
     * User login
     * Endpoint for user login
     * @param requestBody
     * @returns any Login successfully
     * @throws ApiError
     */
    public static postApiV1Login(
        requestBody: {
            customer_code: string;
            email: string;
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Validation error`,
                401: `Invalid credentials`,
                404: `User not found`,
            },
        });
    }

    /**
     * Reset Password
     * Reset Password
     * @param requestBody
     * @returns any Password updated successfully
     * @throws ApiError
     */
    public static postApiV1ResetPassword(
        requestBody: {
            key: string;
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/reset_password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error in updating password`,
                404: `User not found`,
            },
        });
    }

}
