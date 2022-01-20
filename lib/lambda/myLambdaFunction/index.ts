import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
 
export const handleApiRequest = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
 
  // prepare SQL command
  const sqlParams = {
    secretArn: process.env.secretArn,
    resourceArn: process.env.dbClusterArn,
    sql: 'select * from myDemoTable;',
    database: 'mydatabase',
    includeResultMetadata: true
  } as AWS.RDSDataService.ExecuteStatementRequest;
 
  const rdsData = new AWS.RDSDataService();
  const result = await rdsData.executeStatement(sqlParams, (err, data) => {
    if (err){
      console.log(err);
    } else {
      console.log(data);
    }
  }).promise();
 
 
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'command completed successfully',
      result: result,
      event: event
    }),
  };
};