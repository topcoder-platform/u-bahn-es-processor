/**
 * This module contains es resources configuration.
 */

const config = require('config')
const { validProperties } = require('./helper')

const topResources = {
  achievementprovider: {
    index: config.get('ES.ACHIEVEMENT_PROVIDER_INDEX'),
    type: config.get('ES.ACHIEVEMENT_PROVIDER_TYPE')
  },
  attribute: {
    index: config.get('ES.ATTRIBUTE_INDEX'),
    type: config.get('ES.ATTRIBUTE_TYPE')
  },
  attributegroup: {
    index: config.get('ES.ATTRIBUTE_GROUP_INDEX'),
    type: config.get('ES.ATTRIBUTE_GROUP_TYPE')
  },

  organization: {
    index: config.get('ES.ORGANIZATION_INDEX'),
    type: config.get('ES.ORGANIZATION_TYPE')
  },
  role: {
    index: config.get('ES.ROLE_INDEX'),
    type: config.get('ES.ROLE_TYPE')
  },
  skill: {
    index: config.get('ES.SKILL_INDEX'),
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
    relateKey: 'achievementsProviderId',
    validate: payload => validProperties(payload, ['userId', 'achievementsProviderId'])
  },
  externalprofile: {
    propertyName: config.get('ES.USER_EXTERNALPROFILE_PROPERTY_NAME'),
    relateKey: 'organizationId',
    validate: payload => validProperties(payload, ['userId', 'organizationId'])
  },
  userattribute: {
    propertyName: config.get('ES.USER_ATTRIBUTE_PROPERTY_NAME'),
    relateKey: 'attributeId',
    validate: payload => validProperties(payload, ['userId', 'attributeId']),
    isNested: true // For ES index creation
  },
  userrole: {
    propertyName: config.get('ES.USER_ROLE_PROPERTY_NAME'),
    relateKey: 'roleId',
    validate: payload => validProperties(payload, ['userId', 'roleId'])
  },
  userskill: {
    propertyName: config.get('ES.USER_SKILL_PROPERTY_NAME'),
    relateKey: 'skillId',
    validate: payload => validProperties(payload, ['userId', 'skillId'])
  }
}

module.exports = {
  topResources, userResources
}
