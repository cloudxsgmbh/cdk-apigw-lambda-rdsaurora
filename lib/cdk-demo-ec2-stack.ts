import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class CdkDemoEc2Stack extends Stack {

  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /* create a vpc */
    this.vpc = new ec2.Vpc(this, 'vpc', {
      /* provide an vpc options */
    });
    
    /* Secrets Manager Endpoint */
    this.vpc.addInterfaceEndpoint('sm',{
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER
    });
    
    /* RDS Data API Endpoint */
    this.vpc.addInterfaceEndpoint('rds_data',{
      service: ec2.InterfaceVpcEndpointAwsService.RDS_DATA
    });


  }
}
