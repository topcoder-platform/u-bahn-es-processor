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

  GROUPS_MEMBER_ADD_TOPIC: process.env.GROUPS_MEMBER_ADD_TOPIC || 'groups.notification.member.add',
  GROUPS_MEMBER_DELETE_TOPIC: process.env.GROUPS_MEMBER_DELETE_TOPIC || 'groups.notification.member.delete',
  GROUPS_MEMBERSHIP_TYPE: process.env.GROUPS_MEMBERSHIP_TYPE || 'user',

  ES: {
    HOST: process.env.ES_HOST || 'http://localhost:9200',

    ELASTICCLOUD: {
      id: process.env.ELASTICCLOUD_ID,
      username: process.env.ELASTICCLOUD_USERNAME,
      password: process.env.ELASTICCLOUD_PASSWORD
    },

    AWS_REGION: process.env.AWS_REGION || 'us-east-1', // AWS Region to be used if we use AWS ES
    USER_INDEX: process.env.USER_INDEX || 'user',
    USER_TYPE: process.env.USER_TYPE || '_doc',

    ENRICHMENT: {
      user: {
        pipelineId: process.env.USER_PIPELINE_ID || 'user-pipeline'
      }
    }
  }
}
