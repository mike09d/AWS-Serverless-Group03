import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const appointmentHandler = async (event) => {
  console.log("Appointment in Peru");
  console.log(event);

  const records = event.Records;

  const listPromises = [];

  for (let record of records) {
    const body = JSON.parse(record.body);
    const id = body.detail.id;

    listPromises.push(
      dynamodb
        .update({
          TableName: "Appointment-dev",
          UpdateExpression: "set status_appointment = :newStatus",
          ExpressionAttributeValues: {
            ":newStatus": 1,
          },
          Key: { id },
          ReturnValues: "ALL_NEW",
        })
        .promise()
    );
  }

  const results = await Promise.all(listPromises);
  console.log("results: ", results);
  if (results[0].Attributes.pacientPhone === "999-999-999") {
    throw new Error("An error ocurred");
  }
  /* const id = event.detail.id;

  const result = await dynamodb
    .update({
      TableName: "Appointment-dev",
      UpdateExpression: "set status_appointment = :newStatus",
      ExpressionAttributeValues: {
        ":newStatus": 1,
      },
      Key: { id },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  console.log(result); */

  //return event;

  return { statusCode: 403, body: "An error occurred while updating" };
};
