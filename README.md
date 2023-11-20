# url-shortener
A tier based application built with Node.js, Express and MongoDB to shorten a given long URL.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)

## Overview
The application allows a user to register, shorten long urls, view the history of original urls that are shortened and upgrade their tier. 
There are 4 tiers - `Tier 1`, `Tier 2`, `Tier 3`, `Tier 4`. When a new user registers, the user is added to `Tier 4` by default.

Overview of the endpoints:
1. /token -  This endpoint returns a token that can be used for the rest of the services. This registers the user. When the token of a registered users expires, the same endpoint can be used to generate a new token.
2. /shortenURL - This endpoint can be used to shorten a long URL. To use this service, the original URL must be provided.
3. /history - This endpoint can be used to retrieve all the long URL's shortened by the user.
4. /upgradeTier - This endpoint can be used to upgrade to a specific tier.

For a detailed documentation of the API and the expected request/ response, please visit https://url-shortener-fbdx.onrender.com/docs/. 

## Usage
To use the endpoints, please register first. This can be done by using the /token endpoint and providing an email address.

This project is deployed and can be accessed at https://url-shortener-fbdx.onrender.com/.
