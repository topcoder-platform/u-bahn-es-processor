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

  TOPCODER_GROUP_API: process.env.TOPCODER_GROUP_API || 'https://api.topcoder-dev.com/v5/groups',

  AUTH0_URL: process.env.AUTH0_URL || 'https://topcoder-dev.auth0.com/oauth/token', // Auth0 credentials
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://m2m.topcoder-dev.com/',
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,

  UBAHN_CREATE_TOPIC: process.env.UBAHN_CREATE_TOPIC || 'u-bahn.action.create',
  UBAHN_UPDATE_TOPIC: process.env.UBAHN_UPDATE_TOPIC || 'u-bahn.action.update',
  UBAHN_DELETE_TOPIC: process.env.UBAHN_DELETE_TOPIC || 'u-bahn.action.delete',
  UBAHN_AGGREGATE_TOPIC: process.env.UBAHN_AGGREGATE_TOPIC || 'u-bahn.action.aggregate',
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
    USER_SKILL_PROPERTY_NAME: process.env.USER_SKILL_PROPERTY_NAME || 'skills',
    USER_GROUP_PROPERTY_NAME: process.env.USER_GROUP_PROPERTY_NAME || 'groups',

    ORGANIZATION_SKILLPROVIDER_PROPERTY_NAME: process.env.ORGANIZATION_SKILLPROVIDER_PROPERTY_NAME || 'skillProviders',

    ENRICHMENT: {
      attributegroup: {
        enrichPolicyName: process.env.ATTRIBUTE_GROUP_ENRICH_POLICYNAME || 'attributegroup-policy',
        pipelineId: process.env.ATTRIBUTE_GROUP_PIPELINE_ID || 'attributegroup-pipeline'
      },
      skillprovider: {
        enrichPolicyName: process.env.SKILL_PROVIDER_ENRICH_POLICYNAME || 'skillprovider-policy',
        pipelineId: process.env.SKILL_PROVIDER_PIPELINE_ID || 'skillprovider-pipeline'
      },
      user: {
        pipelineId: process.env.USER_PIPELINE_ID || 'user-pipeline'
      },
      role: {
        enrichPolicyName: process.env.ROLE_ENRICH_POLICYNAME || 'role-policy'
      },
      achievementprovider: {
        enrichPolicyName: process.env.ACHIEVEMENT_PROVIDER_ENRICH_POLICYNAME || 'achievementprovider-policy'
      },
      skill: {
        enrichPolicyName: process.env.SKILL_ENRICH_POLICYNAME || 'skill-policy'
      },
      attribute: {
        enrichPolicyName: process.env.ATTRIBUTE_ENRICH_POLICYNAME || 'attribute-policy'
      },
      organization: {
        enrichPolicyName: process.env.ORGANIZATION_ENRICH_POLICYNAME || 'organization-policy'
      },
      // sub resources under user
      achievement: {
        userField: process.env.USER_ACHIEVEMENT_PROPERTY_NAME || 'achievements'
      },
      externalprofile: {
        userField: process.env.USER_EXTERNALPROFILE_PROPERTY_NAME || 'externalProfiles'
      },
      userattribute: {
        userField: process.env.USER_ATTRIBUTE_PROPERTY_NAME || 'attributes'
      },
      userrole: {
        userField: process.env.USER_ROLE_PROPERTY_NAME || 'roles'
      },
      userskill: {
        userField: process.env.USER_SKILL_PROPERTY_NAME || 'skills'
      },
      // sub resources under organization
      organizationskillprovider: {
        orgField: process.env.ORGANIZATION_SKILLPROVIDER_PROPERTY_NAME || 'skillProviders'
      }
    }
  }
}
