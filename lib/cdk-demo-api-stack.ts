import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Function } from 'aws-cdk-lib/aws-lambda'


interface CdkDemoApiStackProps extends StackProps {
  lambdaHandler: Function;
}


export class CdkDemoApiStack extends Stack {

  constructor(scope: Construct, id: string, props: CdkDemoApiStackProps) {
    super(scope, id, props);
    
    /* create an API */
    const apiDemo = new apigw.RestApi(this, 'demoApi');
    
    /* add a resource to the API and a method to the resource */
    const demo = apiDemo.root.addResource('demo');
    demo.addMethod('GET', new apigw.LambdaIntegration(props.lambdaHandler));

  }
}
