DEPRECATED 2/1/2024 https://topcoder.atlassian.net/browse/CORE-203

# UBahn - Elasticsearch Data Processor

## Dependencies

- Nodejs(v12+)
- ElasticSearch
- Kafka

## Configuration

Configuration for the ubahn es processor is at `config/default.js`.
The following parameters can be set in config files or in env variables:

- LOG_LEVEL: the log level; default value: 'debug'
- KAFKA_URL: comma separated Kafka hosts; default value: 'localhost:9092'
- KAFKA_CLIENT_CERT: Kafka connection certificate, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to certificate file or certificate content
- KAFKA_CLIENT_CERT_KEY: Kafka connection private key, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to private key file or private key content
- KAFKA_GROUP_ID: the Kafka group id, default value is 'ubahn-processor-es'
- GROUPS_MEMBER_ADD_TOPIC: the add groups member Kafka message topic, default value is 'groups.notification.member.add'
- GROUPS_MEMBER_DELETE_TOPIC: the delete groups member Kafka message topic, default value is 'groups.notification.member.delete'
- GROUPS_MEMBERSHIP_TYPE: the groups membership type that should be processed, default value is 'user'
- ES_HOST: Elasticsearch host, default value is 'localhost:9200'
- ES.AWS_REGION: The Amazon region to use when using AWS Elasticsearch service, default value is 'us-east-1'
- ES.USER_GROUP_PROPERTY_NAME: the user property name of group, default value is 'groups'
- USER_PIPELINE_ID: The pipeline id for enrichment of user details. Default is `user-pipeline`
- ELASTICCLOUD_ID: The elastic cloud id, if your elasticsearch instance is hosted on elastic cloud. DO NOT provide a value for ES_HOST if you are using this
- ELASTICCLOUD_USERNAME: The elastic cloud username for basic authentication. Provide this only if your elasticsearch instance is hosted on elastic cloud
- ELASTICCLOUD_PASSWORD: The elastic cloud password for basic authentication. Provide this only if your elasticsearch instance is hosted on elastic cloud

There is a `/health` endpoint that checks for the health of the app. This sets up an expressjs server and listens on the environment variable `PORT`. It's not part of the configuration file and needs to be passed as an environment variable

Configuration for the tests is at `config/test.js`, only add such new configurations different from `config/default.js`

- WAIT_TIME: wait time used in test, default is 1500 or 1.5 second
- ES.USER_INDEX: Elasticsearch index name for user in testing environment

## Local Kafka and ElasticSearch setup

1. Navigate to the directory `docker-kafka-es`

2. Run the following command

    ```bash
    docker-compose up -d
    ```

3. initialize Elasticsearch. Execute the `insert-data` script in the [API repository](https://github.com/topcoder-platform/u-bahn-api) to set it up and then clear only the data

## Local deployment

1. Make sure that Kafka and Elasticsearch is running as per instructions above.

2. From the project root directory, run the following command to install the dependencies

    ```bash
    npm install
    ```

3. To run linters if required

    ```bash
    npm run lint
    ```

    To fix possible lint errors:

    ```bash
    npm run lint:fix
    ```

4. Initialize Elasticsearch index
    For this, refer to the [Ubahn API](https://github.com/topcoder-platform/u-bahn-api) repository. In this repository, you need to execute the following script (after following their deployment guide):

    ```bash
    npm run insert-data
    ```

5. Start the processor and health check dropin

    ```bash
    npm start
    ```

## Local Deployment with Docker

To run the UBahn ES Processor using docker, follow the below steps

1. Navigate to the directory `docker`

2. Rename the file `sample.api.env` to `api.env`

3. Set the required AWS credentials and ElasticSearch host in the file `api.env`

4. Once that is done, run the following command

    ```bash
    docker-compose up
    ```

5. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies
