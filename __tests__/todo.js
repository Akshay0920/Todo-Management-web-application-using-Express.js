const request = require("supertest");
const db = require("../models");
const app = require("../app");

let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    server = app.listen(3000);
    agent = request.agent(server);
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
  });

  test("Mark a todo as complete", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markCompleteResponse = await agent
      .put(`/todos/${todoID}/markAsCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);

    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Deletes a todo by ID and returns true", async () => {
    const createResponse = await agent.post("/todos").send({
      title: "Item to delete",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const todoId = createResponse.body.id;

    const deleteResponse = await agent.delete(`/todos/${todoId}`);

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body).toBe(true);
  });
});
