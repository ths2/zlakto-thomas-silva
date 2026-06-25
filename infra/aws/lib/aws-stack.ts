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

    // 3. App Runner Services (pointing to our ECR images)
    const backendService = new apprunner.Service(this, 'BackendService', {
      source: apprunner.Source.fromEcr({
        imageConfiguration: { port: 3000 }, // Backend app's port
        repository: backendRepository,
        tagOrDigest: 'latest',
      }),
      serviceName: 'cloud-log-backend-service',
    });

    const frontendService = new apprunner.Service(this, 'FrontendService', {
      source: apprunner.Source.fromEcr({
        imageConfiguration: {
          port: 3001, // Frontend app's port
          environmentVariables: {
            NEXT_PUBLIC_API_URL: backendService.serviceUrl,
          },
        },
        repository: frontendRepository,
        tagOrDigest: 'latest',
      }),
      serviceName: 'cloud-log-frontend-service',
    });

    frontendService.node.addDependency(backendService);

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