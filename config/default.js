/**
 * The default configuration file.
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  KAFKA_URL: process.env.KAFKA_URL || 'localhost:9092',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT,
  KAFKA_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY,

  // Kafka group id
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'ubahn-processor-es',

  UBAHN_CREATE_TOPIC: process.env.UBAHN_CREATE_TOPIC || 'u-bahn.action.create',
  UBAHN_UPDATE_TOPIC: process.env.UBAHN_UPDATE_TOPIC || 'u-bahn.action.update',
  UBAHN_DELETE_TOPIC: process.env.UBAHN_DELETE_TOPIC || 'u-bahn.action.delete',

  ES: {
    HOST: process.env.ES_HOST || 'localhost:9200',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1', // AWS Region to be used if we use AWS ES
    API_VERSION: process.env.ES_API_VERSION || '7.4',
    ACHIEVEMENT_PROVIDER_INDEX: process.env.ACHIEVEMENT_PROVIDER_INDEX || 'achievement_provider',
    ACHIEVEMENT_PROVIDER_TYPE: process.env.ACHIEVEMENT_PROVIDER_TYPE || '_doc',
    ATTRIBUTE_INDEX: process.env.ATTRIBUTE_INDEX || 'attribute',
    ATTRIBUTE_TYPE: process.env.ATTRIBUTE_TYPE || '_doc',
    ATTRIBUTE_GROUP_INDEX: process.env.ATTRIBUTE_GROUP_INDEX || 'attribute_group',
    ATTRIBUTE_GROUP_TYPE: process.env.ATTRIBUTE_GROUP_TYPE || '_doc',
    ORGANIZATION_INDEX: process.env.ORGANIZATION_INDEX || 'organization',
    ORGANIZATION_TYPE: process.env.ORGANIZATION_TYPE || '_doc',
    ROLE_INDEX: process.env.ROLE_INDEX || 'role',
    ROLE_TYPE: process.env.ROLE_TYPE || '_doc',
    SKILL_INDEX: process.env.SKILL_INDEX || 'skill',
    SKILL_TYPE: process.env.SKILL_TYPE || '_doc',
    SKILL_PROVIDER_INDEX: process.env.SKILL_PROVIDER_INDEX || 'skill_provider',
    SKILL_PROVIDER_TYPE: process.env.SKILL_PROVIDER_TYPE || '_doc',
    USER_INDEX: process.env.USER_INDEX || 'user',
    USER_TYPE: process.env.USER_TYPE || '_doc',

    USER_ACHIEVEMENT_PROPERTY_NAME: process.env.USER_ACHIEVEMENT_PROPERTY_NAME || 'achievements',
    USER_EXTERNALPROFILE_PROPERTY_NAME: process.env.USER_EXTERNALPROFILE_PROPERTY_NAME || 'externalProfiles',
    USER_ATTRIBUTE_PROPERTY_NAME: process.env.USER_ATTRIBUTE_PROPERTY_NAME || 'attributes',
    USER_ROLE_PROPERTY_NAME: process.env.USER_ROLE_PROPERTY_NAME || 'roles',
    USER_SKILL_PROPERTY_NAME: process.env.USER_SKILL_PROPERTY_NAME || 'skills'
  }
}
