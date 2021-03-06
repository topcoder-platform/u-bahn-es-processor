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
- UBAHN_AGGREGATE_TOPIC: the ubahn entity aggregate topic, that contains create, update and delete topics. Default value is 'u-bahn.action.aggregate'
- GROUPS_MEMBER_ADD_TOPIC: the add groups member Kafka message topic, default value is 'groups.notification.member.add'
- GROUPS_MEMBER_DELETE_TOPIC: the delete groups member Kafka message topic, default value is 'groups.notification.member.delete'
- GROUPS_MEMBERSHIP_TYPE: the groups membership type that should be processed, default value is 'user'
- ES_HOST: Elasticsearch host, default value is 'localhost:9200'
- ES.AWS_REGION: The Amazon region to use when using AWS Elasticsearch service, default value is 'us-east-1'
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
- ES.ORGANIZATION_SKILLPROVIDER_PROPERTY_NAME: the org property name of org skill providers, default value is 'skillProviders'
- ES.USER_GROUP_PROPERTY_NAME: the user property name of group, default value is 'groups'
- ATTRIBUTE_GROUP_PIPELINE_ID: The pipeline id for enrichment with attribute group. Default is `attributegroup-pipeline`
- SKILL_PROVIDER_PIPELINE_ID: The pipeline id for enrichment with skill provider. Default is `skillprovider-pipeline`
- USER_PIPELINE_ID: The pipeline id for enrichment of user details. Default is `user-pipeline`
- ATTRIBUTE_GROUP_ENRICH_POLICYNAME: The enrich policy for attribute group. Default is `attributegroup-policy`
- SKILL_PROVIDER_ENRICH_POLICYNAME: The enrich policy for skill provider. Default is `skillprovider-policy`
- ROLE_ENRICH_POLICYNAME: The enrich policy for role. Default is `role-policy`
- ACHIEVEMENT_PROVIDER_ENRICH_POLICYNAME: The enrich policy for achievement provider. Default is `achievementprovider-policy`
- SKILL_ENRICH_POLICYNAME: The enrich policy for skill. Default is `skill-policy`
- ATTRIBUTE_ENRICH_POLICYNAME: The enrich policy for skill. Default is `attribute-policy`
- ELASTICCLOUD_ID: The elastic cloud id, if your elasticsearch instance is hosted on elastic cloud. DO NOT provide a value for ES_HOST if you are using this
- ELASTICCLOUD_USERNAME: The elastic cloud username for basic authentication. Provide this only if your elasticsearch instance is hosted on elastic cloud
- ELASTICCLOUD_PASSWORD: The elastic cloud password for basic authentication. Provide this only if your elasticsearch instance is hosted on elastic cloud
- AUTH0_URL: The auth0 url, Default is 'https://topcoder-dev.auth0.com/oauth/token'
- AUTH0_AUDIENCE: The auth0 audience for accessing ubahn api(s), Default is 'https://m2m.topcoder-dev.com/'
- AUTH0_CLIENT_ID: The auth0 client id
- AUTH0_CLIENT_SECRET: The auth0 client secret
- AUTH0_PROXY_SERVER_URL: The auth0 proxy server url
- TOKEN_CACHE_TIME: The token cache time
- TOPCODER_GROUP_API: The topcoder groups api, Default is 'https://api.topcoder-dev.com/v5/groups'

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

## Unit Tests and E2E Tests

- Run `npm run test` to execute unit tests.
- Run `npm run test:cov` to execute unit tests and generate coverage report.
- RUN `npm run e2e` to execute e2e tests.
- RUN `npm run e2e:cov` to execute e2e tests and generate coverage report.

## Verification

see [VERIFICATION.md](VERIFICATION.md)
