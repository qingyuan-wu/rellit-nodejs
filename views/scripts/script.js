
/** Fetches tasks from the server and adds them to the DOM. */
function loadQuestions() {
    fetch('/list-responses').then(response => response.json()).then((questions) => {
      const taskListElement = document.getElementById('response-list');
      questions.forEach((question) => {
        taskListElement.appendChild(createQuestionElement(question));
      })
    });
}
  
/** Creates an element that represents a task, including its delete button. */
function createQuestionElement(question) {
    const taskElement = document.createElement('li');
    taskElement.className = 'response';
  
    const titleElement = document.createElement('span');
    titleElement.innerText = task.title;
  
    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.innerText = 'Delete';
  
    taskElement.appendChild(titleElement);
    taskElement.appendChild(deleteButtonElement);
    return taskElement;
}