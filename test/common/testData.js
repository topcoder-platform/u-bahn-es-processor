module.exports = {
  fields: {
    achievement: {
      createIndex: 1,
      updateIndex: 1,
      deleteIndex: 0,
      requiredFields: ['payload.resource', 'payload.userId', 'payload.achievementsProviderId']
    },
    achievementprovider: {
      createIndex: 2,
      updateIndex: 2,
      deleteIndex: 1,
      requiredFields: ['payload.resource', 'payload.id']
    },
    attributegroup: {
      createIndex: 3,
      updateIndex: 3,
      deleteIndex: 2,
      requiredFields: ['payload.resource', 'payload.id']
    },
    externalprofile: {
      createIndex: 4,
      updateIndex: 4,
      deleteIndex: 3,
      requiredFields: ['payload.resource', 'payload.userId', 'payload.organizationId']
    },
    organization: {
      createIndex: 5,
      updateIndex: 5,
      deleteIndex: 4,
      requiredFields: ['payload.resource', 'payload.id']
    },
    role: {
      createIndex: 6,
      updateIndex: 6,
      deleteIndex: 5,
      requiredFields: ['payload.resource', 'payload.id']
    },
    skill: {
      createIndex: 7,
      updateIndex: 7,
      deleteIndex: 6,
      requiredFields: ['payload.resource', 'payload.id']
    },
    skillprovider: {
      createIndex: 8,
      updateIndex: 8,
      deleteIndex: 7,
      requiredFields: ['payload.resource', 'payload.id']
    },
    user: {
      createIndex: 0,
      updateIndex: 0,
      deleteIndex: 11,
      requiredFields: ['payload.resource', 'payload.id']
    },
    userattribute: {
      createIndex: 9,
      updateIndex: 9,
      deleteIndex: 8,
      requiredFields: ['payload.resource', 'payload.userId', 'payload.attributeId']
    },
    userrole: {
      createIndex: 10,
      deleteIndex: 9,
      requiredFields: ['payload.resource', 'payload.userId', 'payload.roleId']
    },
    userskill: {
      createIndex: 11,
      updateIndex: 10,
      deleteIndex: 10,
      requiredFields: ['payload.resource', 'payload.userId', 'payload.skillId']
    }
  },
  testTopics: {
    Create: [
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'user',
          id: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          handle: 'user',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'achievement',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          achievementsProviderId: 'c77326d8-ef16-4be0-b844-d5c384b7bb8b',
          name: 'achievement',
          uri: 'https://google.com',
          certifierId: 'b8726ca1-557e-4502-8f9b-25044b9c123d',
          certifiedDate: '2019-07-08T00:00:00.000Z',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'achievementprovider',
          id: '7b4f98b1-5831-45fe-a71f-8454d11eb8e8',
          name: 'achievementprovider',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'attributegroup',
          id: '720c34f9-0fd4-46fd-9293-4a8cfdcd3e96',
          organizationId: '017733ad-4704-4c7e-ae60-36b3332731df',
          name: 'attributegroup',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'externalprofile',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          organizationId: 'e2aecf8b-532d-4625-b8e2-575110b9f944',
          uri: 'https:google.com',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'organization',
          id: '603d4264-cdb0-47f1-914e-f053abc60422',
          name: 'organization',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'role',
          id: '188446f1-02dc-4fc7-b74e-ab7ea3033a57',
          name: 'role',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'skill',
          id: 'a75d95d7-6ab8-472d-8103-19d7e642e8f7',
          skillProviderId: '63061b84-9784-4b71-b695-4a777eeb7601',
          externalId: 'ba395d36-6ce8-4bd1-9d6c-754f0389abcb',
          uri: 'https://google.com',
          name: 'skill',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'skillprovider',
          id: '2375564d-c5eb-4b80-9b35-465c6b700ac1',
          name: 'skillprovider',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userattribute',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          attributeId: 'b5a50f73-08e2-43d1-a78a-4652f15d950e',
          value: 'userattribute',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userrole',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          roleId: '22028da5-0563-48e8-b84c-e480eb8ed98c',
          originalTopic: 'u-bahn.action.create'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userskill',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          skillId: '8a8c8d3a-9165-4dae-8a8c-f828cbe01d5d',
          metricValue: 'userskill',
          certifierId: '7cf786d9-a8c0-48ed-a7cc-09dcf91d904c',
          certifiedDate: '2019-07-08T00:00:00.000Z',
          originalTopic: 'u-bahn.action.create'
        }
      }
    ],
    Update: [
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'user',
          id: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          handle: 'update_user',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'achievement',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          achievementsProviderId: 'c77326d8-ef16-4be0-b844-d5c384b7bb8b',
          name: 'update_name',
          uri: 'https://facebook.com',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'achievementprovider',
          id: '7b4f98b1-5831-45fe-a71f-8454d11eb8e8',
          name: 'update_name',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'attributegroup',
          id: '720c34f9-0fd4-46fd-9293-4a8cfdcd3e96',
          organizationId: '017733ad-4704-4c7e-ae60-36b3332731df',
          name: 'update_name',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'externalprofile',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          organizationId: 'e2aecf8b-532d-4625-b8e2-575110b9f944',
          uri: 'https://facebook.com',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'organization',
          id: '603d4264-cdb0-47f1-914e-f053abc60422',
          name: 'update_name',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'role',
          id: '188446f1-02dc-4fc7-b74e-ab7ea3033a57',
          name: 'update_name',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'skill',
          id: 'a75d95d7-6ab8-472d-8103-19d7e642e8f7',
          skillProviderId: '63061b84-9784-4b71-b695-4a777eeb7601',
          externalId: 'ba395d36-6ce8-4bd1-9d6c-754f0389abcb',
          uri: 'https://facebook.com',
          name: 'update_skill',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'skillprovider',
          id: '2375564d-c5eb-4b80-9b35-465c6b700ac1',
          name: 'update_skillprovider',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userattribute',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          attributeId: 'b5a50f73-08e2-43d1-a78a-4652f15d950e',
          value: 'update_userattribute',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userskill',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          skillId: '8a8c8d3a-9165-4dae-8a8c-f828cbe01d5d',
          metricValue: 'update_userskill',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'achievement',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          achievementsProviderId: 'A77326d8-ef16-4be0-b844-d5c384b7bb8b',
          name: 'update_name',
          uri: 'https://facebook.com',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'achievementprovider',
          id: 'Ab4f98b1-5831-45fe-a71f-8454d11eb8e8',
          name: 'update_name',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'attributegroup',
          id: 'A20c34f9-0fd4-46fd-9293-4a8cfdcd3e96',
          organizationId: 'A17733ad-4704-4c7e-ae60-36b3332731df',
          name: 'update_name',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'externalprofile',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          organizationId: 'A2aecf8b-532d-4625-b8e2-575110b9f944',
          uri: 'https://facebook.com',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'organization',
          id: 'A03d4264-cdb0-47f1-914e-f053abc60422',
          name: 'update_name',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'role',
          id: 'A88446f1-02dc-4fc7-b74e-ab7ea3033a57',
          name: 'update_name',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'skill',
          id: 'A75d95d7-6ab8-472d-8103-19d7e642e8f7',
          skillProviderId: '63061b84-9784-4b71-b695-4a777eeb7601',
          externalId: 'ba395d36-6ce8-4bd1-9d6c-754f0389abcb',
          uri: 'https://facebook.com',
          name: 'update_skill',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'skillprovider',
          id: 'A375564d-c5eb-4b80-9b35-465c6b700ac1',
          name: 'update_skillprovider',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'user',
          id: 'A91a3656-9a01-47d4-8c6d-64b68c44f212',
          handle: 'update_user',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userattribute',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          attributeId: 'A5a50f73-08e2-43d1-a78a-4652f15d950e',
          value: 'update_userattribute',
          originalTopic: 'u-bahn.action.update'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userskill',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          skillId: 'Aa8c8d3a-9165-4dae-8a8c-f828cbe01d5d',
          metricValue: 'update_userskill',
          originalTopic: 'u-bahn.action.update'
        }
      }
    ],
    Delete: [
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'achievement',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          achievementsProviderId: 'c77326d8-ef16-4be0-b844-d5c384b7bb8b',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'achievementprovider',
          id: '7b4f98b1-5831-45fe-a71f-8454d11eb8e8',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'attributegroup',
          id: '720c34f9-0fd4-46fd-9293-4a8cfdcd3e96',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'externalprofile',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          organizationId: 'e2aecf8b-532d-4625-b8e2-575110b9f944',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'organization',
          id: '603d4264-cdb0-47f1-914e-f053abc60422',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'role',
          id: '188446f1-02dc-4fc7-b74e-ab7ea3033a57',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'skill',
          id: 'a75d95d7-6ab8-472d-8103-19d7e642e8f7',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'skillprovider',
          id: '2375564d-c5eb-4b80-9b35-465c6b700ac1',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userattribute',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          attributeId: 'b5a50f73-08e2-43d1-a78a-4652f15d950e',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userrole',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          roleId: '22028da5-0563-48e8-b84c-e480eb8ed98c',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'userskill',
          userId: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          skillId: '8a8c8d3a-9165-4dae-8a8c-f828cbe01d5d',
          originalTopic: 'u-bahn.action.delete'
        }
      },
      {
        topic: 'u-bahn.action.aggregate',
        originator: 'u-bahn-api',
        timestamp: '2019-07-08T00:00:00.000Z',
        'mime-type': 'application/json',
        payload: {
          resource: 'user',
          id: '391a3656-9a01-47d4-8c6d-64b68c44f212',
          originalTopic: 'u-bahn.action.delete'
        }
      }
    ]
  },
  groupsTopics: {
    addData: {
      topic: 'groups.notification.member.add',
      originator: 'u-bahn-api',
      timestamp: '2019-07-08T00:00:00.000Z',
      'mime-type': 'application/json',
      payload: {
        id: 'c2f302cf-759a-4847-8acd-843e258359db',
        groupId: '036cc9c1-189a-4cf6-853b-0f5bc9b4ce75',
        oldId: '20000309',
        name: 'House Stark',
        createdAt: '2020-09-11T13:14:54.108Z',
        createdBy: '8547899',
        universalUID: '391a3656-9a01-47d4-8c6d-64b68c44f212',
        membershipType: 'user'
      }
    },
    deleteData: {
      topic: 'groups.notification.member.delete',
      originator: 'u-bahn-api',
      timestamp: '2019-07-08T00:00:00.000Z',
      'mime-type': 'application/json',
      payload: {
        groupId: '036cc9c1-189a-4cf6-853b-0f5bc9b4ce75',
        name: '.NET Taas Project',
        oldId: '20000335',
        memberId: '00000000',
        universalUID: '391a3656-9a01-47d4-8c6d-64b68c44f212'
      }
    }
  }
}
