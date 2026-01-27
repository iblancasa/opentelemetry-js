/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import {
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

// Optional and only needed to see the internal diagnostic logging (during development)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK({
  autoDetectResources: false,
  logRecordProcessors: [
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
  ],
  exceptionHandler: {
    enabled: true,
    exitOnUnhandledRejection: false,
    exitOnUncaughtException: false,
  },
});

sdk.start();

const logger = logs.getLogger('logs-exceptions-example', '1.0.0');

logger.recordException(new Error('manual exception'), {
  severityNumber: SeverityNumber.ERROR,
  attributes: { 'error.kind': 'manual' },
});

Promise.reject(new Error('unhandled rejection'));

setTimeout(() => {
  throw new Error('uncaught exception');
}, 10);

setTimeout(async () => {
  await sdk.shutdown();
}, 100);
