# Verification

**NOTE** - For all kafka message below, update the topic to be the one set in config.UBAHN_AGGREGATE_TOPIC and inside the payload object, create a new attribute named `originalTopic` with the value of the original topic. Example:

```
{
  "topic": "u-bahn.action.aggregate",
  "originator": "u-bahn-api",
  "timestamp": "2019-07-08T00:00:00.000Z",
  "mime-type": "application/json",
  "payload": {
    "originalTopic": "u-bahn.action.create"
    "resource": "user",
    "id": "391a3656-9a01-47d4-8c6d-64b68c44f212",
    "handle": "user"
  }
}
```

Additionally, you will be entering the messages into only one topic:

```
docker exec -it ubahn-data-processor-es_kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic u-bahn.action.aggregate
```

1. start kafka server, start elasticsearch, initialize Elasticsearch, start processor app
2. write message:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"user","id":"391a3656-9a01-47d4-8c6d-64b68c44f212","handle":"user","originalTopic":"u-bahn.action.create"}}`
4. Watch the app console, It will show message successfully handled.
5. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data.

6. write message:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"achievement","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","achievementsProviderId":"c77326d8-ef16-4be0-b844-d5c384b7bb8b","name":"achievement","uri":"https://google.com","certifierId":"b8726ca1-557e-4502-8f9b-25044b9c123d","certifiedDate":"2019-07-08T00:00:00.000Z","originalTopic":"u-bahn.action.create"}}`
7. Watch the app console, It will show message successfully handled.
8. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data.

9. write message:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"achievementprovider","id":"7b4f98b1-5831-45fe-a71f-8454d11eb8e8","name":"achievementprovider","originalTopic":"u-bahn.action.create"}}`
10. Watch the app console, It will show message successfully handled.
11. Run Command `npm run view-data achievementprovider 7b4f98b1-5831-45fe-a71f-8454d11eb8e8` to verify the elastic data.

12. write message:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"attributegroup","id":"720c34f9-0fd4-46fd-9293-4a8cfdcd3e96","organizationId":"017733ad-4704-4c7e-ae60-36b3332731df","name":"attributegroup","originalTopic":"u-bahn.action.create"}}`
13. Watch the app console, It will show message successfully handled.
14. Run Command `npm run view-data attributegroup 720c34f9-0fd4-46fd-9293-4a8cfdcd3e96` to verify the elastic data.

15. write message:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"externalprofile","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","organizationId":"e2aecf8b-532d-4625-b8e2-575110b9f944","uri":"https:google.com","originalTopic":"u-bahn.action.create"}}`
16. Watch the app console, It will show message successfully handled.
17. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data.

18. write message:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"organization","id":"603d4264-cdb0-47f1-914e-f053abc60422","name":"organization","originalTopic":"u-bahn.action.create"}}`
19. Watch the app console, It will show message successfully handled.
20. Run Command `npm run view-data organization 603d4264-cdb0-47f1-914e-f053abc60422` to verify the elastic data.

21. write message:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"role","id":"188446f1-02dc-4fc7-b74e-ab7ea3033a57","name":"role","originalTopic":"u-bahn.action.create"}}`
22. Watch the app console, It will show message successfully handled.
23. Run Command `npm run view-data role 188446f1-02dc-4fc7-b74e-ab7ea3033a57` to verify the elastic data.

24. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"skill","id":"a75d95d7-6ab8-472d-8103-19d7e642e8f7","skillProviderId":"63061b84-9784-4b71-b695-4a777eeb7601","externalId":"ba395d36-6ce8-4bd1-9d6c-754f0389abcb","uri":"https://google.com","name":"skill"}}`
25. Watch the app console, It will show message successfully handled.
26. Run Command `npm run view-data skill a75d95d7-6ab8-472d-8103-19d7e642e8f7` to verify the elastic data.

27. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"skillprovider","id":"2375564d-c5eb-4b80-9b35-465c6b700ac1","name":"skillprovider"}}`
28. Watch the app console, It will show message successfully handled.
29. Run Command `npm run view-data skillprovider 2375564d-c5eb-4b80-9b35-465c6b700ac1` to verify the elastic data.

30. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userattribute","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","attributeId":"b5a50f73-08e2-43d1-a78a-4652f15d950e","value":"userattribute"}}`
31. Watch the app console, It will show message successfully handled.
32. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data.

33. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userrole","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","roleId":"22028da5-0563-48e8-b84c-e480eb8ed98c"}}`
34. Watch the app console, It will show message successfully handled.
35. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data.

36. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userskill","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","skillId":"8a8c8d3a-9165-4dae-8a8c-f828cbe01d5d","metricValue":"userskill","certifierId":"7cf786d9-a8c0-48ed-a7cc-09dcf91d904c","certifiedDate":"2019-07-08T00:00:00.000Z"}}`
37. Watch the app console, It will show message successfully handled.
38. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data.

39. Repeat step 3 again and you will see error message in app console indicate conflict error.





40. Now, let's perform the update operations and verify.
41. write message to update the user:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"user","id":"391a3656-9a01-47d4-8c6d-64b68c44f212","handle":"update_user","originalTopic":"u-bahn.action.update"}}`
42. Watch the app console, It will show message successfully handled.
43. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been updated.

44. write message to update the achievement:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"achievement","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","achievementsProviderId":"c77326d8-ef16-4be0-b844-d5c384b7bb8b","name":"update_name","uri":"https://facebook.com","originalTopic":"u-bahn.action.update"}}`
45. Watch the app console, It will show message successfully handled.
46. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been updated.

47. write message to update the achievementprovider:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"achievementprovider","id":"7b4f98b1-5831-45fe-a71f-8454d11eb8e8","name":"update_name"}}`
48. Watch the app console, It will show message successfully handled.
49. Run Command `npm run view-data achievementprovider 7b4f98b1-5831-45fe-a71f-8454d11eb8e8` to verify the elastic data has been updated.

50. write message to update the attributegroup:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"attributegroup","id":"720c34f9-0fd4-46fd-9293-4a8cfdcd3e96","organizationId":"017733ad-4704-4c7e-ae60-36b3332731df","name":"update_name"}}`
51. Watch the app console, It will show message successfully handled.
52. Run Command `npm run view-data attributegroup 720c34f9-0fd4-46fd-9293-4a8cfdcd3e96` to verify the elastic data has been updated.

53. write message to update the externalprofile:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"externalprofile","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","organizationId":"e2aecf8b-532d-4625-b8e2-575110b9f944","uri":"https://facebook.com"}}`
54. Watch the app console, It will show message successfully handled.
55. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been updated.

56. write message to update the organization:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"organization","id":"603d4264-cdb0-47f1-914e-f053abc60422","name":"update_name"}}`
57. Watch the app console, It will show message successfully handled.
58. Run Command `npm run view-data organization 603d4264-cdb0-47f1-914e-f053abc60422` to verify the elastic data has been updated.

59. write message to update the role:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"role","id":"188446f1-02dc-4fc7-b74e-ab7ea3033a57","name":"update_name"}}`
60. Watch the app console, It will show message successfully handled.
61. Run Command `npm run view-data role 188446f1-02dc-4fc7-b74e-ab7ea3033a57` to verify the elastic data has been updated.

62. write message to update the skill:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"skill","id":"a75d95d7-6ab8-472d-8103-19d7e642e8f7","skillProviderId":"63061b84-9784-4b71-b695-4a777eeb7601","externalId":"ba395d36-6ce8-4bd1-9d6c-754f0389abcb","uri":"https://facebook.com","name":"update_skill"}}`
63. Watch the app console, It will show message successfully handled.
64. Run Command `npm run view-data skill a75d95d7-6ab8-472d-8103-19d7e642e8f7` to verify the elastic data has been updated.

65. write message to update the skillprovider:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"skillprovider","id":"2375564d-c5eb-4b80-9b35-465c6b700ac1","name":"update_skillprovider"}}`
66. Watch the app console, It will show message successfully handled.
67. Run Command `npm run view-data skillprovider 2375564d-c5eb-4b80-9b35-465c6b700ac1` to verify the elastic data has been updated.

68. write message to update the userattribute:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userattribute","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","attributeId":"b5a50f73-08e2-43d1-a78a-4652f15d950e","value":"update_userattribute"}}`
69. Watch the app console, It will show message successfully handled.
70. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been updated.

71. write message to update the userskill:
  `{"topic":"u-bahn.action.update","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userskill","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","skillId":"8a8c8d3a-9165-4dae-8a8c-f828cbe01d5d","metricValue":"update_userskill"}}`
72. Watch the app console, It will show message successfully handled.
73. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been updated.

74. start kafka-console-producer to write messages to `u-bahn.action.delete`
topic:
  `docker exec -it ubahn-data-processor-es_kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic u-bahn.action.delete`

75. write message to delete the achievement:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"achievement","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","achievementsProviderId":"c77326d8-ef16-4be0-b844-d5c384b7bb8b"}}`
76. Watch the app console, It will show message successfully handled.
77. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been deleted.

78. write message to delete the achievementprovider:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"achievementprovider","id":"7b4f98b1-5831-45fe-a71f-8454d11eb8e8"}}`
79. Watch the app console, It will show message successfully handled.
80. Run Command `npm run view-data achievementprovider 7b4f98b1-5831-45fe-a71f-8454d11eb8e8` to verify the elastic data has been deleted.

81. write message to delete the attributegroup:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"attributegroup","id":"720c34f9-0fd4-46fd-9293-4a8cfdcd3e96"}}`
82. Watch the app console, It will show message successfully handled.
83. Run Command `npm run view-data attributegroup 720c34f9-0fd4-46fd-9293-4a8cfdcd3e96` to verify the elastic data has been deleted.

84. write message to delete the externalprofile:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"externalprofile","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","organizationId":"e2aecf8b-532d-4625-b8e2-575110b9f944"}}`
85. Watch the app console, It will show message successfully handled.
86. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been deleted.

87. write message to delete the organization:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"organization","id":"603d4264-cdb0-47f1-914e-f053abc60422"}}`
88. Watch the app console, It will show message successfully handled.
89. Run Command `npm run view-data organization 603d4264-cdb0-47f1-914e-f053abc60422` to verify the elastic data has been deleted.

90. write message to delete the role:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"role","id":"188446f1-02dc-4fc7-b74e-ab7ea3033a57"}}`
91. Watch the app console, It will show message successfully handled.
92. Run Command `npm run view-data role 188446f1-02dc-4fc7-b74e-ab7ea3033a57` to verify the elastic data has been deleted.

93. write message to delete the skill:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"skill","id":"a75d95d7-6ab8-472d-8103-19d7e642e8f7"}}`
94. Watch the app console, It will show message successfully handled.
95. Run Command `npm run view-data skill a75d95d7-6ab8-472d-8103-19d7e642e8f7` to verify the elastic data has been deleted.

96. write message to delete the skillprovider:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"skillprovider","id":"2375564d-c5eb-4b80-9b35-465c6b700ac1"}}`
97. Watch the app console, It will show message successfully handled.
98. Run Command `npm run view-data skillprovider 2375564d-c5eb-4b80-9b35-465c6b700ac1` to verify the elastic data has been deleted.

99. write message to delete the userattribute:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userattribute","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","attributeId":"b5a50f73-08e2-43d1-a78a-4652f15d950e"}}`
100. Watch the app console, It will show message successfully handled.
101. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been deleted.

102. write message to delete the userrole:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userrole","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","roleId":"22028da5-0563-48e8-b84c-e480eb8ed98c"}}`
103. Watch the app console, It will show message successfully handled.
104. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been deleted.

105. write message to delete the userskill:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userskill","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","skillId":"8a8c8d3a-9165-4dae-8a8c-f828cbe01d5d"}}`
106. Watch the app console, It will show message successfully handled.
107. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been deleted.

108. write message to delete the user:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"user","id":"391a3656-9a01-47d4-8c6d-64b68c44f212"}}`
109. Watch the app console, It will show message successfully handled.
110. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been deleted.


# Verification (with groups)

1. start kafka server, start elasticsearch, initialize Elasticsearch, start processor app
2. start kafka-console-producer to write messages to `u-bahn.action.aggregate`
topic:
  `docker exec -it ubahn-data-processor-es_kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic u-bahn.action.create`
3. write message:
  `{"topic":"u-bahn.action.aggregate","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"user","id":"391a3656-9a01-47d4-8c6d-64b68c44f212","handle":"user","originalTopic":"u-bahn.action.aggregate"}}`
4. Watch the app console, It will show message successfully handled.
5. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data.

6. start kafka-console-producer to write messages to `groups.notification.member.add`
topic:
  `docker exec -it ubahn-data-processor-es_kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic groups.notification.member.add`
7. write message:
  `{"topic":"groups.notification.member.add","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"id":"c2f302cf-759a-4847-8acd-843e258359db","groupId":"036cc9c1-189a-4cf6-853b-0f5bc9b4ce75","oldId":"20000309","name":"House Stark","createdAt":"2020-09-11T13:14:54.108Z","createdBy":"8547899","universalUID":"391a3656-9a01-47d4-8c6d-64b68c44f212","membershipType":"user"}}`
8. Watch the app console, It will show message successfully handled.
9. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data.


10. Repeat again and you will see error message in app console indicate conflict error.
  write message:
  `{"topic":"groups.notification.member.add","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"id":"c2f302cf-759a-4847-8acd-843e258359db","groupId":"036cc9c1-189a-4cf6-853b-0f5bc9b4ce75","oldId":"20000309","name":"House Stark","createdAt":"2020-09-11T13:14:54.108Z","createdBy":"8547899","universalUID":"391a3656-9a01-47d4-8c6d-64b68c44f212","membershipType":"user"}}`

11. start kafka-console-producer to write messages to `groups.notification.member.delete`
topic:
  `docker exec -it ubahn-data-processor-es_kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic groups.notification.member.delete`
12. write message to remove the groups user:
  `{"topic":"groups.notification.member.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"groupId":"036cc9c1-189a-4cf6-853b-0f5bc9b4ce75","name":".NET Taas Project","oldId":"20000335","memberId":"00000000","universalUID":"391a3656-9a01-47d4-8c6d-64b68c44f212"}}`
13. Watch the app console, It will show message successfully handled.
14. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data

15. Repeat again and you will see error message in app console indicate not found error.
  write message:
  `{"topic":"groups.notification.member.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"groupId":"036cc9c1-189a-4cf6-853b-0f5bc9b4ce75","name":".NET Taas Project","oldId":"20000335","memberId":"00000000","universalUID":"391a3656-9a01-47d4-8c6d-64b68c44f212"}}`

16. start kafka-console-producer to write messages to `u-bahn.action.delete`
topic:
  `docker exec -it ubahn-data-processor-es_kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic u-bahn.action.delete`
17. write message to delete the user:
  `{"topic":"u-bahn.action.delete","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"user","id":"391a3656-9a01-47d4-8c6d-64b68c44f212"}}`
18. Watch the app console, It will show message successfully handled.
19. Run Command `npm run view-data user 391a3656-9a01-47d4-8c6d-64b68c44f212` to verify the elastic data has been deleted.
