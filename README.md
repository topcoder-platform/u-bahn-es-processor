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
- UBAHN_CREATE_TOPIC: the create ubahn entity Kafka message topic, default value is 'u-bahn.action.create'
- UBAHN_UPDATE_TOPIC: the update ubahn entity Kafka message topic, default value is 'u-bahn.action.update'
- UBAHN_DELETE_TOPIC: the delete ubahn entity Kafka message topic, default value is 'u-bahn.action.delete'
- ES.HOST: Elasticsearch host, default value is 'localhost:9200'
- ES.AWS_REGION: The Amazon region to use when using AWS Elasticsearch service, default value is 'us-east-1'
- ES.API_VERSION: Elasticsearch API version, default value is '6.8'
- ES.ACHIEVEMENT_PROVIDER_INDEX: Elasticsearch index name for achievement provider, default value is 'achievement_provider'
- ES.ACHIEVEMENT_PROVIDER_TYPE: Elasticsearch index type for achievement provider, default value is '_doc'
- ES.ATTRIBUTE_INDEX: Elasticsearch index name for attribute, default value is 'attribute'
- ES.ATTRIBUTE_TYPE: Elasticsearch index type for attribute, default value is '_doc'
- ES.ATTRIBUTE_GROUP_INDEX: Elasticsearch index name for attribute group, default value is 'attribute_group'
- ES.ATTRIBUTE_GROUP_TYPE: Elasticsearch index type for attribute group, default value is '_doc'
- ES.ORGANIZATION_INDEX: Elasticsearch index name for organization, default value is 'organization'
- ES.ORGANIZATION_TYPE: Elasticsearch index type for organization, default value is '_doc'
- ES.ROLE_INDEX: Elasticsearch index name for role, default value is 'role'
- ES.ROLE_TYPE: Elasticsearch index type for role, default value is '_doc'
- ES.SKILL_INDEX: Elasticsearch index name for skill, default value is 'skill'
- ES.SKILL_TYPE: Elasticsearch index type for skill, default value is '_doc'
- ES.SKILL_PROVIDER_INDEX: Elasticsearch index name for skill provider, default value is 'skill_provider'
- ES.SKILL_PROVIDER_TYPE: Elasticsearch index type for skill provider, default value is '_doc'
- ES.USER_INDEX: Elasticsearch index name for user, default value is 'user'
- ES.USER_TYPE: Elasticsearch index type for user, default value is '_doc'
- ES.USER_ACHIEVEMENT_PROPERTY_NAME: the user property name of achievement, default value is 'achievements',
- ES.USER_EXTERNALPROFILE_PROPERTY_NAME: the user property name of externalProfile, default value is 'externalProfiles',
- ES.USER_ATTRIBUTE_PROPERTY_NAME: the user property name of attribute, default value is 'attributes',
- ES.USER_ROLE_PROPERTY_NAME: the user property name of role, default value is 'roles',
- ES.USER_SKILL_PROPERTY_NAME: the user property name of skill, default value is 'skills'

There is a `/health` endpoint that checks for the health of the app. This sets up an expressjs server and listens on the environment variable `PORT`. It's not part of the configuration file and needs to be passed as an environment variable

Configuration for the tests is at `config/test.js`, only add such new configurations different from `config/default.js`

- WAIT_TIME: wait time used in test, default is 1500 or 1.5 second
- ES.ACHIEVEMENT_PROVIDER_INDEX: Elasticsearch index name for achievement provider in testing environment
- ES.ATTRIBUTE_INDEX: Elasticsearch index name for attribute in testing environment
- ES.ATTRIBUTE_GROUP_INDEX: Elasticsearch index name for attribute group in testing environment
- ES.ORGANIZATION_INDEX: Elasticsearch index name for organization in testing environment
- ES.ROLE_INDEX: Elasticsearch index name for role in testing environment
- ES.SKILL_INDEX: Elasticsearch index name for skill in testing environment
- ES.SKILL_PROVIDER_INDEX: Elasticsearch index name for skill provider in testing environment
- ES.USER_INDEX: Elasticsearch index name for user in testing environment

## Local Kafka and ElasticSearch setup

1. Navigate to the directory `docker-kafka-es`

2. Run the following command

    ```bash
    docker-compose up -d
    ```

3. initialize Elasticsearch, create configured Elasticsearch index: `npm run init-es force`

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

    ```bash
    npm run init-es
    ```

    To delete and re-create the index:

    ```bash
    npm run init-es force
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

## Unit Tests and E2E Tests

- Run `npm run test` to execute unit tests.
- Run `npm run test:cov` to execute unit tests and generate coverage report.
- RUN `npm run e2e` to execute e2e tests.
- RUN `npm run e2e:cov` to execute e2e tests and generate coverage report.

## Verification

see [VERIFICATION.md](VERIFICATION.md)
