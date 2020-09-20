# Verification

1. start kafka server, start elasticsearch, initialize Elasticsearch, start processor app
2. start kafka-console-producer to write messages to `u-bahn.action.create`
topic:
  `docker exec -it ubahn-data-processor-es_kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic u-bahn.action.create`
3. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"user","id":"391a3656-9a01-47d4-8c6d-64b68c44f212","handle":"user"}}`
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
