// kliens oldali class torles
async function deleteClass(deleteClassID) {
  try {
    const confirmDelete = window.confirm('Are you sure you want to delete this class?');
    if (confirmDelete) {
      const response = await fetch('/deleteclass', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classID: deleteClassID }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        const classElement = document.getElementById(`class-${deleteClassID}`);
        classElement.parentNode.removeChild(classElement);
      } else {
        alert(responseData.message);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// show more gomb
async function showMore(classID) {
  try {
    const res = await fetch(`/class/showmore/${classID}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const responseData = await res.json();
    if (responseData.success) {
      const descriptionElement = document.getElementById(`class-description-${classID}`);
      descriptionElement.style.display = 'block';
      descriptionElement.textContent = responseData.description;
      const showLessButton = document.getElementById(`show-less-button-${classID}`);
      showLessButton.style.display = 'block';
    } else {
      alert(responseData.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// show less gomb
function showLess(classID) {
  try {
    const descriptionElement = document.getElementById(`class-description-${classID}`);
    descriptionElement.style.display = 'none';
    const showLessButton = document.getElementById(`show-less-button-${classID}`);
    showLessButton.style.display = 'none';
  } catch (error) {
    console.error(error);
  }
}

// kliens oldali assignment torles
async function deleteAssignment(deleteAssignmentID) {
  try {
    const confirmDelete = window.confirm('Are you sure you want to delete this assignment?');
    if (confirmDelete) {
      const response = await fetch('/deleteassignment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentID: deleteAssignmentID }),
      });
      const responseData = await response.json();
      const message = document.getElementById('assignment-delete-message');
      if (responseData.success) {
        const assignmentElement = document.getElementById(`assignment-${deleteAssignmentID}`);
        assignmentElement.parentNode.removeChild(assignmentElement);
        message.textContent = 'Assignment deleted successfully';
        message.className = 'success';
      } else {
        message.textContent = responseData.message;
        message.className = 'error';
      }
      message.style.display = 'block';
      setTimeout(() => {
        message.style.display = 'none';
      }, 3000);
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const deleteClassButtons = document.querySelectorAll('[data-class-id]');
  deleteClassButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      deleteClass(event.target.dataset.classId);
    });
  });

  const showMoreButtons = document.querySelectorAll('[data-show-more-id]');
  showMoreButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      showMore(event.target.dataset.showMoreId);
    });
  });

  const showLessButtons = document.querySelectorAll('[data-show-less-id]');
  showLessButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      showLess(event.target.dataset.showLessId);
    });
  });

  const deleteAssignmentButtons = document.querySelectorAll('[data-assignment-id]');
  deleteAssignmentButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      deleteAssignment(event.target.dataset.assignmentId);
    });
  });
});
