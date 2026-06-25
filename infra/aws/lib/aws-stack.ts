import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';

export class AwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. S3 Bucket
    const logBucket = new s3.Bucket(this, 'CloudLogBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. ECR Repositories
    const backendRepository = new ecr.Repository(this, 'BackendRepository', {
      repositoryName: 'cloud-log-access-backend',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
    });

    const frontendRepository = new ecr.Repository(this, 'FrontendRepository', {
      repositoryName: 'cloud-log-access-frontend',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
    });

    // 3. App Runner Services (com imagem hello-world inicial)
    const backendService = new apprunner.Service(this, 'BackendService', {
      source: apprunner.Source.fromEcrPublic({
        imageConfiguration: { port: 8080 },
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      serviceName: 'cloud-log-backend-service',
    });

    const frontendService = new apprunner.Service(this, 'FrontendService', {
      source: apprunner.Source.fromEcrPublic({
        imageConfiguration: { port: 8080 },
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      serviceName: 'cloud-log-frontend-service',
    });

    // 4. Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: logBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'BackendRepositoryUri', {
      value: backendRepository.repositoryUri,
    });

    new cdk.CfnOutput(this, 'FrontendRepositoryUri', {
      value: frontendRepository.repositoryUri,
    });

    new cdk.CfnOutput(this, 'BackendServiceUrl', {
      value: backendService.serviceUrl,
    });

    new cdk.CfnOutput(this, 'FrontendServiceUrl', {
      value: frontendService.serviceUrl,
    });
  }
}