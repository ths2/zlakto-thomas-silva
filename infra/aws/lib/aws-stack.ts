import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';

export class AwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Manter o bucket S3 existente (ou criar um novo se não existir)
    const logBucket = new s3.Bucket(this, 'CloudLogBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
      autoDeleteObjects: true, // NOT for production
    });

    // 2. Criar ECR Repositories
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

    // 3. Criar App Runner Service para o backend
    const backendService = new apprunner.Service(this, 'BackendService', {
      source: apprunner.Source.fromEcr({
        imageConfiguration: { port: 3000 },
        repository: backendRepository,
        tagOrDigest: 'latest', // ou uma tag específica
      }),
      serviceName: 'cloud-log-backend-service',
    });

    // 4. Criar App Runner Service para o frontend
    const frontendService = new apprunner.Service(this, 'FrontendService', {
      source: apprunner.Source.fromEcr({
        imageConfiguration: {
          port: 3001,
          environmentVariables: {
            // Passa a URL do backend para o frontend como uma variável de ambiente
            NEXT_PUBLIC_API_URL: backendService.serviceUrl,
          },
        },
        repository: frontendRepository,
        tagOrDigest: 'latest',
      }),
      serviceName: 'cloud-log-frontend-service',
    });

    // 5. Criar outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: logBucket.bucketName,
      description: 'The name of the S3 bucket for logs.',
    });

    new cdk.CfnOutput(this, 'BackendRepositoryUri', {
      value: backendRepository.repositoryUri,
      description: 'The URI of the backend ECR repository.',
    });

    new cdk.CfnOutput(this, 'FrontendRepositoryUri', {
      value: frontendRepository.repositoryUri,
      description: 'The URI of the frontend ECR repository.',
    });

    new cdk.CfnOutput(this, 'BackendServiceUrl', {
      value: backendService.serviceUrl,
      description: 'The URL of the App Runner service for the backend.',
    });

    new cdk.CfnOutput(this, 'FrontendServiceUrl', {
      value: frontendService.serviceUrl,
      description: 'The URL of the App Runner service for the frontend.',
    });
  }
}