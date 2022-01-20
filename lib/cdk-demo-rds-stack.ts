import { Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';

interface CdkDemoRdsStackProps extends StackProps {
  vpc: Vpc;
}

export class CdkDemoRdsStack extends Stack {
  
  public readonly dbCluster: rds.ServerlessCluster;
  public readonly lambdaHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: CdkDemoRdsStackProps) {
    super(scope, id, props);
 
    /* RDS - Aurora - database */
    this.dbCluster = new rds.ServerlessCluster(this, 'database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({version: rds.AuroraPostgresEngineVersion.VER_10_12}),
      vpc: props.vpc,
      defaultDatabaseName: 'mydatabase',
      enableDataApi: true,  /* this is important ! */
      removalPolicy: RemovalPolicy.RETAIN,
    });

    /* grab the automatically generated database secret */
    const secret = this.dbCluster.node.children.filter((child) => child instanceof rds.DatabaseSecret)[0] as rds.DatabaseSecret;

 
    /* create a lambda handler function */
    this.lambdaHandler = new lambda.Function(this, 'myLambdaFunction',{
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('./lib/lambda/myLambdaFunction'),
      handler: 'index.handleApiRequest',
      vpc: props.vpc,
      environment: {
        'dbClusterArn': this.dbCluster.clusterArn,
        'secretArn': secret.secretArn
      },
      timeout: Duration.seconds(29) /* the API Gateway disconnects after 30s, so with 29 it still gets an answer */
    });
    
    /* grant permissions to access the RDS Data API */
    this.dbCluster.grantDataApiAccess(this.lambdaHandler);

  }
}
