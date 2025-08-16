const express = require('express');
const { request, response } = require('express');
const app = express();
const { Todo } = require('./models');
const bodyParser = require('body-parser');

app.use(express.json());

app.get("/todos", (request, response) => {
  console.log("Todo list")
})

app.post("/todos", async (request, response) => {
  try {
    const { title, dueDate } = request.body; // Destructure the request body to get the individual values

    // Pass the individual title and dueDate to the addTodo method
    const todo = await Todo.addTodo(title, dueDate);

    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  try {
    const todoId = request.params.id;

    // Find the todo by its primary key
    const todo = await Todo.findByPk(todoId);

    if (todo) {
      // Use the instance method to update the record
      const updatedTodo = await todo.update({ completed: true });
      return response.json(updatedTodo); // Return the updated object
    } else {
      return response.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", (request, response) => {
  console.log("Delete a todo by ID: ", request.params.id)
})

module.exports = app;