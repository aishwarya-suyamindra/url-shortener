# url-shortener
A tier based application built with Node.js, Express and MongoDB to shorten a given long URL.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)

## Overview
The application allows a user to register, shorten long urls, view the history of original urls that are shortened and upgrade their tier. 
There are 4 tiers - `Tier 1`, `Tier 2`, `Tier 3`, `Tier 4`, with `Tier 1` being the highest.
Each of these tiers have a different number of requests that can be made, within different time frames.
  - Tier 1
    ```
    windowPeriod: 300
    numberOfRequests: 50
    ```
  - Tier 2
    ```
    windowPeriod: 200
    numberOfRequests: 20
    ```
  - Tier 3
    ```
    windowPeriod: 150
    numberOfRequests: 15
    ```
  - Tier 4
    ```
    windowPeriod: 100
    numberOfRequests: 5
    ```
    
When a new user registers, the user is added to `Tier 4` by default.

Overview of the endpoints:
1. /token -  This endpoint returns a token that can be used for the rest of the services. This registers the user. When the token of a registered users expires, the same endpoint can be used to generate a new token.
2. /shortenURL - This endpoint can be used to shorten a long URL. To use this service, the original URL must be provided. It returns a shortURL, which on navigation redirects to the original URL.
3. /history - This endpoint can be used to retrieve all the long URL's shortened by the user.
4. /upgradeTier - This endpoint can be used to upgrade to a specific tier.

For a detailed documentation of the API and the expected request/ response, please visit [link](https://url-shortener-fbdx.onrender.com/docs/). 

## Installation

To use the application locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/aishwarya-suyamindra/url-shortener.git
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the project:**
   On initial run, to insert default data to the database
    ```bash
    node index.js --insert-data
    ```

   To run it without the argument,
    ```bash
    npm start
    ```

The Node.js application should be running on [http://localhost:4500](http://localhost:4500).

To insert default data to the application or to reset the tiers and users, run the application with the `--insert-data` argument.

## Usage
To use the endpoints, please register first. This can be done by using the /token endpoint and providing an email address.

This project is deployed and can be accessed [here](https://url-shortener-fbdx.onrender.com/).


