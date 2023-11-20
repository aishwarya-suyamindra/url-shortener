import { createResponse, createRequest } from 'node-mocks-http'
import express from "express";
import AppRoutes from '../../src/routes/routes.js'
import userService from "../../src/services/userService.js";
import urlService from "../../src/services/urlService.js";
import authenticateToken from "../../src/middleware/auth.js";
import validateLimit from "../../src/middleware/rateLimiter.js";
import validateURL from "../../src/middleware/urlValidator.js";
import validateEmail from "../../src/middleware/emailValidator.js";

// mock the required services and middleware
jest.mock('../../src/services/userService.js', () => ({
    signUp: jest.fn(),
    isRegisteredUser: jest.fn()
}))

jest.mock('../../src/services/urlService.js', () => ({
    shortenURL: jest.fn(),
    redirect: jest.fn(),
    getHistory: jest.fn()
}))

jest.mock('../../src/middleware/emailValidator.js')
jest.mock('../../src/middleware/urlValidator.js')
jest.mock('../../src/middleware/auth.js')
jest.mock('../../src/middleware/rateLimiter.js')

const middleware = {
    validateLimit: validateLimit.mockImplementation(
        (req, res, next) => {
            next()
        }
    ),
    validateURL: validateURL,
    authenticateToken: authenticateToken.mockImplementation(
        (req, res, next) => {
            req.user = { id: "123" }
            next()
        }),
    validateEmail: validateEmail.mockImplementation(
        (req, res, next) => {
            next()
        })
}

describe('Test cases for /token', () => {
    var request
    var response
    var app
    beforeEach(() => {
        app = express()
        app.use(express.json())
        request = createRequest();
        request.method = 'POST'
        request.url = '/token'
        response = createResponse();
    })

    it('should return token for the user', async () => {
        // Arrange
        request.body = {
            email: "email@email.com"
        }
        const mockUserService = jest.spyOn(userService, 'signUp')
        const mockUserSignUp = jest.fn(async (email) => {
            return "123456"
        })
        mockUserService.mockImplementation(mockUserSignUp)

        // Act
        AppRoutes(app, userService, null, middleware)
        await app(request, response)

        // Assert
        expect(mockUserService).toBeCalledTimes(1)
        expect(mockUserSignUp).toHaveBeenCalledWith("email@email.com")
        expect(response.statusCode).toEqual(200)
        expect(response._getData()).toEqual("123456")
    })

    it('should return error on failure', async () => {
        // Arrange
        request.body = {
            email: "email@email.com"
        }
        const mockUserService = jest.spyOn(userService, 'signUp')
        const mockUserSignUp = jest.fn(async () => {
            throw new Error("Error")
        })
        mockUserService.mockImplementation(mockUserSignUp)

        // Act
        AppRoutes(app, userService, null, middleware)
        await app(request, response)

        // Assert
        expect(mockUserService).toBeCalledTimes(1)
        // expect(response.statusCode).toEqual(500)
        expect(response._getData()).toEqual("Error")
    })


    afterEach(() => {
        jest.clearAllMocks();
    })
})

describe('Test cases for /history', () => {
    var request
    var response
    var app
    beforeEach(() => {
        app = express()
        app.use(express.json())
        request = createRequest();
        request.method = 'GET'
        request.url = '/history'
        response = createResponse();
    })

    it('should return history for the user with one url', async () => {
        // Arrange
        request.body = {
            email: "email@email.com"
        }
        const mockUrlService = jest.spyOn(urlService, 'getHistory')
        const mockGetHistory = jest.fn(async (userId) => {
            return ["wwww.test.com"]
        })
        mockUrlService.mockImplementation(mockGetHistory)

        // Act
        AppRoutes(app, null, mockUrlService, middleware)
        await app(request, response)

        // Assert
        expect(mockUrlService).toBeCalledTimes(1)
        expect(mockGetHistory).toHaveBeenCalledWith("123")
        expect(response.statusCode).toEqual(200)
        expect(response._getData()).toEqual(["wwww.test.com"])
    })

    // it('should return error on failure', async () => {
    //     // Arrange
    //     request.body = {
    //         email: "email@email.com"
    //     }
    //     const mockUrlService = jest.spyOn(URLSearchParams, 'signUp')
    //     const mockUserSignUp = jest.fn(async () => {
    //         throw new Error("Error")
    //     })
    //     mockUserService.mockImplementation(mockUserSignUp)

    //     // Act
    //     AppRoutes(app, userService, null, middleware)
    //     await app(request, response)

    //     // Assert
    //     expect(mockUserService).toBeCalledTimes(1)
    //     // expect(response.statusCode).toEqual(500)
    //     expect(response._getData()).toEqual("Error")
    // })


    afterEach(() => {
        jest.clearAllMocks();
    })
})




