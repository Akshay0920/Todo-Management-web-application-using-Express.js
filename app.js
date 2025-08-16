const express = require("express");
//const { request, response } = require("express");
const app = express();
const { Todo } = require("./models");
const path = require("path");

app.use(express.json());

app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if(request.accepts("html")) {
    return response.render("index", { allTodos });
  }else {
    response.json({allTodos});
  }
  
});

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async (request, response) => {
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  try {
    const { title, dueDate } = request.body;
    const todo = await Todo.addTodo(title, dueDate);
    return response.json(todo);
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  try {
    const todoId = request.params.id;
    const todo = await Todo.findByPk(todoId);

    if (todo) {
      const updatedTodo = await todo.update({ completed: true });
      return response.json(updatedTodo);
    } else {
      return response.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  try {
    const todoId = request.params.id;
    const deleted = await Todo.destroy({
      where: {
        id: todoId,
      },
    });
    return response.json(deleted > 0);
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
