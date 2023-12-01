# Workout API 🏋️‍♂️💪

## Overview

API utilized for managing comprehensive fitness and wellness data, mirroring the functionality of renowned platforms like Total Pass and GymPass. This robust interface empowers seamless integration with diverse fitness services, facilitating user access to a myriad of gyms, classes, and health offerings. With a user-friendly design, this API streamlines the process of discovering and accessing fitness services, enhancing the overall experience for both providers and enthusiasts. It supports diverse functionalities, ranging from membership management to real-time class schedules, providing a unified solution for fitness enthusiasts and businesses alike.

## Table of Contents

- [Getting Started](#getting-started-)
  - [Authentication](#authentication-)
  - [Base URL](#base-url-)
- [Endpoints](#endpoints-)
  - [Gyms](#gyms-)
  - [Check-ins](#check-ins-)
  - [User Profile](#user-profile-)
- [Error Handling](#error-handling-)
- [SDKs](#sdks-)
- [Contact](#contact-)

## Getting Started 🚀

### Authentication 🔐

To interact with the API, authentication is required. Obtain an access token by making a request to the /me endpoint. This token is essential for give your user profile and the other endpoints.

### Base URL 🌐

All API requests should be made to the following base URL:

```url
http://localhost:3333/
```

## Endpoints 🎯

### Gyms 🏢

- `POST /gyms`: Create a new gym (requires ADMIN Role).
- `GET /gyms/search`: Search gyms by title.
- `GET /gyms/nearby`: Fetch nearby gyms.

### Check-ins ✅

- `POST /gyms/{gym_id}/check-ins`: Create a new check-in.
- `GET /check-ins/history`: Retrieve the check-in history of a user.
- `GET /check-ins/metrics`:  Retrieve metrics of a user's check-ins.
- `PATCH /check-ins/{checkInId}/validate`: Validate a check-in.

### User Profile 👤

- `POST /users`: GRegister new user.
- `POST /sessions`: Initiate new sessions.
- `PATCH /token/refresh`: Refresh token.
- `GET /me`: Retrieve your user profile.

## Error Handling ❌

The Workout API uses standard HTTP status codes to indicate the success or failure of a request. Detailed error messages will be included in the response body in case of an error.

## SDKs 👨🏾‍💻

- NodeJS
- Fastify
- Prisma
- Vitest

## Contact 📧

If you have any questions, concerns, or feedback, please contact our support team at <oswaldo.dev.oliveira@gmail.com>.

Thank you for choosing Workout API! 🏋️‍♂️💪
