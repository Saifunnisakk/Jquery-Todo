$(document).ready(function () {
  const apiUrl = "http://localhost:4001/api/tasks";

  // Fetch tasks on page load
  fetchTasks();

  // Form submission
  $("#taskForm").submit(function (e) {
    e.preventDefault();
    const taskType = $("#type").val();
    const taskTitle = $("#title").val();
    const taskStatus = $("#status").val();

    if (taskType.trim() !== "" || taskTitle.trim() !== "") {
      addTask(taskType, taskTitle, taskStatus);
    } else {
      alert("Type and Title cannot be empty!");
    }
  });

  // Function to fetch tasks from the server
  function fetchTasks() {
    $.get(apiUrl)
      .done(function (response) {
        console.log("Server Response:", response);
        const tasks = response || [];
        displayTasks(tasks);
      })
      .fail(function (xhr, status, error) {
        console.error("Error fetching tasks:", error);
      });
  }

  function displayTasks(response) {
    const tasks = response && response.data ? response.data : [];
    const taskList = $("#taskList");
    taskList.empty();

    tasks.forEach(function (task) {
      const listItem = $("<li>")
        .text(`${task.type} | ${task.title} | ${task.status}`)
        .click(function () {
          toggleTaskCompletion(task._id, !task.completed);
        });

      if (task.completed) {
        listItem.addClass("completedTask");
      }

      // Create a div to hold both buttons
      const buttonContainer = $("<div>").addClass("buttonContainer");

      // Add Update button with different color
      const updateButton = $("<button>")
        .text("Update")
        .addClass("updateButton")
        .click(function () {
          updateTaskPrompt(task._id, task.type, task.title, task.status);
        });

      // Add Delete button with different color
      const deleteButton = $("<button>")
        .text("Delete")
        .addClass("deleteButton")
        .click(function () {
          deleteTask(task._id);
        });

      // Append buttons to the div
      buttonContainer.append(updateButton, deleteButton);

      // Append the div to the list item
      listItem.append(buttonContainer);
      taskList.append(listItem);
    });
  }

  // Function to add a new task
  // Function to add a new task
  function addTask(type, title, status) {
    $.ajax({
      url: apiUrl,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        type: type,
        title: title,
        status: status,
        completed: false,
      }),
      success: function () {
        fetchTasks();
        $("#type").val("");
        $("#title").val("");
        $("#status").val("");
      },

      error: function (error) {
        console.error("Error adding task:", error);
      },
    });
  }

  // Function to delete a task
  function deleteTask(id) {
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "DELETE",
      success: function () {
        fetchTasks();
      },
      error: function () {
        alert("Error deleting task");
      },
    });
  }

  // Function to toggle task completion
  function toggleTaskCompletion(id, completed) {
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "PUT",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ completed }),
      success: function () {
        fetchTasks();
      },
      error: function () {
        alert("Error updating task completion");
      },
    });
  }

  // Function to prompt the user for an updated task
  function updateTaskPrompt(id, currentType, currentTitle, currentStatus) {
    const updatedType = prompt("Update task type:", currentType);
    const updatedTitle = prompt("Update task title:", currentTitle);
    const updatedStatus = prompt("Update task status:", currentStatus);

    if (
      updatedType !== null &&
      updatedTitle !== null &&
      updatedStatus !== null
    ) {
      updateTask(id, updatedType, updatedTitle, updatedStatus);
    }
  }

  // Function to update a task
  function updateTask(id, updatedType, updatedTitle, updatedStatus) {
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "PUT",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        type: updatedType,
        title: updatedTitle,
        status: updatedStatus,
      }),
      success: function () {
        fetchTasks();
      },
      error: function () {
        alert("Error updating task");
      },
    });
  }
});
