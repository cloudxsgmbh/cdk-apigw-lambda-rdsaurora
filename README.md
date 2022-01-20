# CDK Demo: API Gateway, Lambda and RDS Aurora

This is a demo project to illustrate, how to connect an API Gateway through a Lambda function with a RDS Aurora database.  
Please note: This project is written for [AWS CDK v2](https://docs.aws.amazon.com/cdk/v2/guide/home.html).

## Deployment

Run the following commands to deploy the whole project, while `<profile>` is an _AWS CLI_ profile pointing to your desired account. The region parameter is optional, if you want to deploy into another region than your profile is configured to.

```bash
npm run buildLambda
cdk deploy --all --profile <profile> --region 'eu-central-1'
```

## Test

After a successful deployment, a request to the API will cause an "Internal Server Error". Of course, the RDS database is empty. Go to RDS and the Query editor (Connect with the Arn you find in the Secrets manager and set database to _mydatabase_, like in the RDS stack.) and paste the follwing commands.

```SQL
CREATE TABLE myDemoTable (
    id int,
    name text
);

INSERT INTO myDemoTable (id, name)
VALUES (1, 'my first entry');
INSERT INTO myDemoTable (id, name)
VALUES (2, 'my second entry');


SELECT * FROM myDemoTable;
```

Now the database has some content and a request to your API `GET /demo` should return the two database entries. You can test it by going in the AWS Console to _API Gateway_, under _Resources_ select the _/demo GET_ and click on _Test_.
