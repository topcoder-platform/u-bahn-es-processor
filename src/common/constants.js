/**
 * This module contains es resources configuration.
 */

const config = require('config')
const { validProperties } = require('./helper')

const topResources = {
  achievementprovider: {
    index: config.get('ES.ACHIEVEMENT_PROVIDER_INDEX'),
    mappingFields: ['id', 'achievementsProviderId', 'name', 'uri', 'certifierId', 'certifiedDate', 'created', 'updated', 'createdBy', 'updatedBy'],
    enrichPolicy: 'achievementprovider-policy',
    type: config.get('ES.ACHIEVEMENT_PROVIDER_TYPE')
  },
  attribute: {
    index: config.get('ES.ATTRIBUTE_INDEX'),
    enrichPolicy: 'attribute-policy',
    mappingFields: ['id', 'name', 'attributeGroupId', 'created', 'updated', 'createdBy', 'updatedBy'],
    type: config.get('ES.ATTRIBUTE_TYPE')
  },
  attributegroup: {
    index: config.get('ES.ATTRIBUTE_GROUP_INDEX'),
    type: config.get('ES.ATTRIBUTE_GROUP_TYPE')
  },

  organization: {
    index: config.get('ES.ORGANIZATION_INDEX'),
    enrichPolicy: 'organization-policy',
    mappingFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy'],
    type: config.get('ES.ORGANIZATION_TYPE')
  },
  role: {
    index: config.get('ES.ROLE_INDEX'),
    enrichPolicy: 'role-policy',
    mappingFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy'],
    type: config.get('ES.ROLE_TYPE')
  },
  skill: {
    index: config.get('ES.SKILL_INDEX'),
    enrichPolicy: 'skill-policy',
    mappingFields: ['id', 'skillProviderId', 'name', 'externalId', 'uri', 'created', 'updated', 'createdBy', 'updatedBy'],
    type: config.get('ES.SKILL_TYPE')
  },
  skillprovider: {
    index: config.get('ES.SKILL_PROVIDER_INDEX'),
    type: config.get('ES.SKILL_PROVIDER_TYPE')
  },
  user: {
    index: config.get('ES.USER_INDEX'),
    type: config.get('ES.USER_TYPE')
  }
}

const userResources = {
  achievement: {
    propertyName: config.get('ES.USER_ACHIEVEMENT_PROPERTY_NAME'),
    relateTopResource: 'achievementprovider',
    relateKey: 'achievementsProviderId',
    validate: payload => validProperties(payload, ['userId', 'achievementsProviderId'])
  },
  externalprofile: {
    propertyName: config.get('ES.USER_EXTERNALPROFILE_PROPERTY_NAME'),
    relateTopResource: 'organization',
    relateKey: 'organizationId',
    validate: payload => validProperties(payload, ['userId', 'organizationId'])
  },
  userattribute: {
    propertyName: config.get('ES.USER_ATTRIBUTE_PROPERTY_NAME'),
    relateTopResource: 'attribute',
    relateKey: 'attributeId',
    validate: payload => validProperties(payload, ['userId', 'attributeId']),
    isNested: true // For ES index creation
  },
  userrole: {
    propertyName: config.get('ES.USER_ROLE_PROPERTY_NAME'),
    relateTopResource: 'role',
    relateKey: 'roleId',
    validate: payload => validProperties(payload, ['userId', 'roleId'])
  },
  userskill: {
    propertyName: config.get('ES.USER_SKILL_PROPERTY_NAME'),
    relateTopResource: 'skill',
    relateKey: 'skillId',
    validate: payload => validProperties(payload, ['userId', 'skillId'])
  }
}

const organizationResources = {
  organizationskillprovider: {
    propertyName: config.get('ES.ORGANIZATION_SKILLPROVIDER_PROPERTY_NAME'),
    relateKey: 'skillProviderId',
    validate: payload => validProperties(payload, ['organizationId', 'skillProviderId'])
  }
}

module.exports = {
  topResources, userResources, organizationResources
}
