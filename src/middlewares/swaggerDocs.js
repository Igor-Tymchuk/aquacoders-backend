import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [
      ...swaggerUI.serve,
      swaggerUI.setup(swaggerDoc, {
        customCss: `body, .swagger-ui {
      background-image: linear-gradient(to right, #5B9160, #c2cFd7, #c2cFd7, #c2cFd7, #c2cFd7, #c2cFd7, #c2cFd7, #c2cFd7, #5B9160);
      color: #404040 !important;
      }
        .swagger-ui .info a {
        font-weight: bold;
      color: white;
        }
        .swagger-ui .scheme-container {
      max-width: 1460px;
      margin: 0 auto;
      border-radius: 25px;
      background-color: #2A3C44 !important;
      border: 1px solid #444 !important;
      color: #FFFFFF !important;
      }
        .swagger-ui .scheme-container select {
      background-color: #444 !important;
      color: #FFFFFF !important;
      border: 1px solid #555 !important;
      }
        .swagger-ui .json-schema-2020-12-accordion,
        .swagger-ui .json-schema-2020-12-expand-deep-button {
      background-color: transparent !important;
      color: #2A3C44;
      }
        .swagger-ui .opblock .opblock-section-header {
      background-image: linear-gradient(to bottom, #2B609155, #b2c7dF, #b2c7dF, #b2c7dF, #2B609155);
      }
      .information-container.wrapper {
      padding: 0;
      }
        .information-container.wrapper .block.col-12 {
      background-image: linear-gradient(to right, #9BE1A0, #5B9160);
      box-shadow: 0 0 5px 2px #87D28D;
      padding: 15px;
      margin: 20px 0;
      border-radius: 25px;
      display: flex;
      justify-content: end;
      align-items: start;
      & .info {
      margin: 0;
      }
      }`,
      }),
    ];
  } catch (err) {
    console.log(err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
