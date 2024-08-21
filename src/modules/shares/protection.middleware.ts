import { Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';
import AppConfig from '../../../configs/app.config';
import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const qs = require('qs');

@Injectable()
export class ProtectionMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    try {
      const { headers, cookies } = request;
      if (!headers.authorization) {
        if (cookies && cookies.refreshToken) {
          const checkRefreshToken: any = await this.checkRefreshTokenValidity(
            cookies.refreshToken,
          );
          if (checkRefreshToken.statusCode === 200) {
            const expires = new Date();
            expires.setMilliseconds(
              expires.getMilliseconds() +
              checkRefreshToken.data.refresh_expires_in * 1000,
            );
            response.cookie(
              'refreshToken',
              checkRefreshToken.data.refresh_token,
              {
                domain: '.sanawict.ir',
                expires,
                secure: true,
                httpOnly: true,
                sameSite: 'lax',
              },
            );
            const { sub } = jwt.decode(checkRefreshToken.data.refresh_token);
            return response.status(202).json({
              access_token: checkRefreshToken.data.access_token,
              id: sub,
            });
          } else return response.status(401).json('not authorized1');
        } else {
          return response.status(401).json('not authorized2');
        }
      }
      const accessTokenValidityResult: any =
        await this.checkAccessTokenAsOnline(headers.authorization);
      if (accessTokenValidityResult.statusCode === 200) {
        const accessToken = jwt.decode(
          headers.authorization.split(' ').slice(-1)[0],
        );
        const { resource_access } = accessToken;
        request.user = {
          id: accessToken.sub,
          phoneNumber: accessToken.preferred_username,
          name: accessToken.name,
          isAdmin: resource_access[`${AppConfig().keycloak.clientId}`]?.roles?.includes('Ticketing'),
        };
        return next();
      } else if (cookies && cookies.refreshToken) {
        const checkRefreshToken: any = await this.checkRefreshTokenValidity(
          cookies.refreshToken,
        );
        if (checkRefreshToken.statusCode === 200) {
          // check user has admin role
          const { resource_access } = jwt.decode(
            checkRefreshToken.data.access_token,
          );
          if (!resource_access[`${AppConfig().keycloak.clientId}`])
            return response.status(403).json('forbidden');
          const expires = new Date();
          expires.setMilliseconds(
            expires.getMilliseconds() +
            checkRefreshToken.data.refresh_expires_in * 1000,
          );
          response.cookie(
            'refreshToken',
            checkRefreshToken.data.refresh_token,
            {
              domain: '.sanawict.ir',
              expires,
              secure: true,
              httpOnly: true,
              sameSite: 'lax',
            },
          );
          const { sub } = jwt.decode(checkRefreshToken.data.refresh_token);
          return response.status(202).json({
            access_token: checkRefreshToken.data.access_token,
            id: sub,
          });
        } else return response.status(401).json('not authorized3');
      } else return response.status(401).json('not authorized4');
    } catch (err) {
      console.log('protection error => ', err);
      return response.status(403).json('forbidden');
    }
  }

  async checkRefreshTokenValidity(refreshToken) {
    const data = qs.stringify({
      grant_type: 'refresh_token',
      client_id: AppConfig().keycloak.authClientId,
      client_secret: AppConfig().keycloak.authClientSecret,
      refresh_token: refreshToken,
    });
    const config = {
      method: 'post',
      url: `${AppConfig().keycloak.authServer}/realms/${AppConfig().keycloak.realm}/protocol/openid-connect/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    const result = new Promise((resolve, reject) => {
      axios(config)
        .then((response) => {
          resolve({ statusCode: 200, data: response.data });
        })
        .catch((err) => {
          resolve({ statusCode: 400 });
        });
    });
    return result;
  }

  async checkAccessTokenAsOnline(accessToken: string) {
    const config = {
      method: 'get',
      url: `${AppConfig().keycloak.authServer}/realms/${AppConfig().keycloak.realm}/protocol/openid-connect/userinfo`,
      headers: {
        Authorization: accessToken,
      },
    };

    const result = new Promise((resolve, reject) => {
      axios(config)
        .then((response) => {
          resolve({ statusCode: 200, data: response.data });
        })
        .catch((err) => {
          resolve({ statusCode: 400 });
        });
    });
    return result;
  }
}