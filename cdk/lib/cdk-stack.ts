import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import {
  DockerImageCode,
  DockerImageFunction,
  LoggingFormat,
} from 'aws-cdk-lib/aws-lambda';
import * as path from 'node:path';
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Dockerized Lambda Function
    const lambda = new DockerImageFunction(this, 'function', {
      functionName: 'fast-api-app-function',
      loggingFormat: LoggingFormat.JSON,
      memorySize: 512, // To avoid timeout
      code: DockerImageCode.fromImageAsset(path.join(__dirname, '..', '..'), {
        file: path.join('docker', 'Dockerfile-web'),
        platform: Platform.LINUX_AMD64, // If you are using Apple Silicon
        exclude: ['*', '!src', '!docker'],
      }),
    });

    // API Gateway REST API
    new LambdaRestApi(this, 'api', {
      handler: lambda,
      deploy: true,
    });
  }
}
