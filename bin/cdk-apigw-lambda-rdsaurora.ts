#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkDemoEc2Stack } from '../lib/cdk-demo-ec2-stack';
import { CdkDemoRdsStack } from '../lib/cdk-demo-rds-stack';
import { CdkDemoApiStack } from '../lib/cdk-demo-api-stack';

const app = new cdk.App();

/* EC2 */
const ec2Stack = new CdkDemoEc2Stack(app, 'CdkDemoEc2Stack');

/* RDS */
const rdsStack = new CdkDemoRdsStack(app, 'CdkDemoRdsStack', {
  vpc: ec2Stack.vpc
});

/* API Gateway */
new CdkDemoApiStack(app, 'CdkDemoApiStack', {
  lambdaHandler: rdsStack.lambdaHandler
});