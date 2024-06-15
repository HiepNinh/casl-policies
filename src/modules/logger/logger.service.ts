// import { Injectable } from '@nestjs/common';
// import * as winston from 'winston';

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const customFieldFilter = winston.format((info, opts) => {
//   if (JSON.parse(info.message).isTracked) {
//     return info;
//   }
//   return false; // Discards the log if it doesn't meet the criteria
// });

// @Injectable()
// export class LoggerService {
//   constructor(private readonly logger: winston.Logger, private readonly configService: ConfifServi) {
//     logger = winston.createLogger({
//       level: 'info',
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json(),
//       ),
//       transports: [
//         new winston.transports.File({
//           filename: `logs/info-${new Date().toISOString().replace(/:/g, '-')}.json`,
//           level: 'info',
//           format: winston.format.combine(
//             winston.format((info) => {
//               return info.level === 'info' ? info : false;
//             })(),
//             winston.format.json(),
//             customFieldFilter(),
//           ),
//         }),
//         new winston.transports.File({
//           filename: `logs/error-${new Date().toISOString().replace(/:/g, '-')}.json`,
//           level: 'error',
//           format: winston.format.combine(
//             winston.format.json(),
//             customFieldFilter(),
//           ),
//         }),
//       ],
//     });
//   }

//   log(message: string, context?: string) {
//     this.logger.info(message, { context });
//   }

//   error(message: string, trace: string, context?: string) {
//     this.logger.error(message, { trace, context });
//   }

//   warn(message: string, context?: string) {
//     this.logger.warn(message, { context });
//   }
// }
