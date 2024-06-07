// kliens oldali class torles
async function deleteClass(deleteClassID) {
  try {
    const confirmDelete = window.confirm('Are you sure you want to delete this class?');
    if (confirmDelete) {
      const res = await fetch('/deleteclass', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classID: deleteClassID }),
      });
      const responseData = await res.json();
      if (res.status === 200) {
        const classElement = document.getElementById(`class-${deleteClassID}`);
        classElement.parentNode.removeChild(classElement);
      } else {
        alert(responseData.message);
      }
    }
  } catch (error) {
    const errorMessage = document.getElementById('error');
    errorMessage.getElementsByTagName('p')[0].textContent = 'Error deleting class';
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 3000);
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
    if (res.status === 200) {
      const descriptionElement = document.getElementById(`class-description-${classID}`);
      descriptionElement.style.display = 'block';
      descriptionElement.textContent = responseData.description;
      const showLessButton = document.getElementById(`show-less-button-${classID}`);
      showLessButton.style.display = 'block';
    } else {
      alert(responseData.message);
    }
  } catch (error) {
    const errorMessage = document.getElementById('error');
    errorMessage.getElementsByTagName('p')[0].textContent = 'Error showing more';
    errorMessage.getAttribute('style').display = 'block';
    setTimeout(() => {
      errorMessage.getAttribute('style').display = 'none';
    }, 3000);
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
    const errorMessage = document.getElementById('error');
    errorMessage.getElementsByTagName('p')[0].textContent = 'Error showing less';
    errorMessage.getAttribute('style').display = 'block';
    setTimeout(() => {
      errorMessage.getAttribute('style').display = 'none';
    }, 3000);
    console.error(error);
  }
}

// kliens oldali assignment torles
async function deleteAssignment(deleteAssignmentID) {
  try {
    const confirmDelete = window.confirm('Are you sure you want to delete this assignment?');
    if (confirmDelete) {
      const res = await fetch('/deleteassignment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentID: deleteAssignmentID }),
      });
      const responseData = await res.json();
      const message = document.getElementById('assignment-delete-message');
      if (res.status === 200) {
        const assignmentElement = document.getElementById(`assignment-${deleteAssignmentID}`);
        assignmentElement.parentNode.removeChild(assignmentElement);
        message.textContent = responseData.message;
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
    const message = document.getElementById('assignment-delete-message');
    message.textContent = 'Error deleting assignment';
    message.className = 'error';
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
    console.error(error);
  }
}

// kliens oldali user torles (projekt)
async function deleteUser(deleteUserID) {
  try {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      const res = await fetch('/deleteuser', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: deleteUserID }),
      });
      const responseData = await res.json();
      const message = document.getElementById('user-delete-message');
      if (res.status === 200) {
        const userElement = document.getElementById(`user-${deleteUserID}`);
        userElement.parentNode.removeChild(userElement);
        message.textContent = responseData.message;
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
    const message = document.getElementById('user-delete-message');
    message.textContent = 'Error deleting user';
    message.className = 'error';
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
    console.error(error);
  }
}

// kliens oldali user role modositas (projekt)
async function updateUserRole(userID, role) {
  try {
    const res = await fetch('/edituser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, role }),
    });
    const responseData = await res.json();
    const message = document.getElementById('user-edit-message');
    if (res.status === 200) {
      const userElement = document.getElementById(`user-${userID}`);
      userElement.getElementsByTagName('span')[1].textContent = role;
      message.textContent = responseData.message;
      message.className = 'success';
    } else {
      message.textContent = responseData.message;
      message.className = 'error';
    }
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
  } catch (error) {
    const message = document.getElementById('user-edit-message');
    message.textContent = 'Error updating user';
    message.className = 'error';
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
    console.error(error);
  }
}

// (projekt)
function editUser(editUserID) {
  document.getElementById('edit-user').getElementsByTagName('h1')[0].style.display = 'block';
  const editUserForm = document.getElementById('edit-user-form');
  editUserForm.style.display = 'block';

  const oldSaveButton = document.getElementById('save-button');
  const newSaveButton = oldSaveButton.cloneNode(true);
  oldSaveButton.parentNode.replaceChild(newSaveButton, oldSaveButton);

  newSaveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const role = document.getElementById('edit-user-role').value;
    updateUserRole(editUserID, role);
  });

  const oldCancelButton = document.getElementById('cancel-button');
  const newCancelButton = oldCancelButton.cloneNode(true);
  oldCancelButton.parentNode.replaceChild(newCancelButton, oldCancelButton);

  newCancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    editUserForm.style.display = 'none';
    document.getElementById('edit-user').getElementsByTagName('h1')[0].style.display = 'none';
  });
}

// kliens oldali user meghivasa egy osztalyhoz (projekt)
async function inviteUserToClass(inviteUserID, classID) {
  try {
    const res = await fetch('/addusertoclass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID: inviteUserID, classID }),
    });
    const responseData = await res.json();
    const message = document.getElementById('invitation-message');
    if (res.status === 200) {
      message.textContent = responseData.message;
      message.className = 'success';
    } else {
      message.textContent = responseData.message;
      message.className = 'error';
    }
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
  } catch (error) {
    const message = document.getElementById('invitation-message');
    message.textContent = 'Error inviting user';
    message.className = 'error';
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
    console.error(error);
  }
}

// (projekt)
function inviteUser(inviteUserID) {
  document.getElementById('invite-user').getElementsByTagName('h1')[0].style.display = 'block';
  const inviteUserForm = document.getElementById('invite-user-form');
  inviteUserForm.style.display = 'block';

  const oldSaveButton = document.getElementById('invite-button');
  const newSaveButton = oldSaveButton.cloneNode(true);
  oldSaveButton.parentNode.replaceChild(newSaveButton, oldSaveButton);

  newSaveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const classID = document.getElementById('invite-user-class').value;
    inviteUserToClass(inviteUserID, classID);
  });

  const oldCancelButton = document.getElementById('cancel-invite-button');
  const newCancelButton = oldCancelButton.cloneNode(true);
  oldCancelButton.parentNode.replaceChild(newCancelButton, oldCancelButton);

  newCancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    inviteUserForm.style.display = 'none';
    document.getElementById('invite-user').getElementsByTagName('h1')[0].style.display = 'none';
  });
}

// tantargy meghivas elfogadasa (projekt)
async function acceptInvitation(acceptInvitationID) {
  try {
    const res = await fetch('/acceptinvitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classID: acceptInvitationID }),
    });
    const responseData = await res.json();
    const message = document.getElementById('invitation-message');
    if (res.status === 200) {
      const classElement = document.getElementById(`invitation-${acceptInvitationID}`);
      classElement.parentNode.removeChild(classElement);
      message.textContent = responseData.message;
      message.className = 'success';
    } else {
      message.textContent = responseData.message;
      message.className = 'error';
    }
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
  } catch (error) {
    const message = document.getElementById('invitation-message');
    message.textContent = 'Error accepting invitation';
    message.className = 'error';
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
    console.error(error);
  }
}

// kliens oldali meghivas elutasitasa (projekt)
async function declineInvitation(declineInvitationID) {
  try {
    const res = await fetch('/declineinvitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classID: declineInvitationID }),
    });
    const responseData = await res.json();
    const message = document.getElementById('invitation-message');
    if (res.status === 200) {
      const classElement = document.getElementById(`class-${declineInvitationID}`);
      classElement.parentNode.removeChild(classElement);
      message.textContent = responseData.message;
      message.className = 'success';
    } else {
      message.textContent = responseData.message;
      message.className = 'error';
    }
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
  } catch (error) {
    const message = document.getElementById('invitation message');
    message.textContent = 'Error declining invitation';
    message.className = 'error';
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
    console.error(error);
  }
}

// kliens oldali jegyek mentese (projekt)
async function saveGrades() {
  const saveGradesButton = document.getElementById('save-grades-button');
  saveGradesButton.disabled = true;

  try {
    const assignmentGrades = [];
    const assignmentGradeElements = document.querySelectorAll('#assignment-grades li');
    assignmentGradeElements.forEach((element) => {
      const studentID = element.querySelector('.name').id;
      const assignmentID = element.id.replace('assignment-grade-', '');
      const gradeInput = element.querySelector('input[type="text"]');
      const grade = gradeInput.value.trim();
      assignmentGrades.push({ studentID, assignmentID, grade });
    });

    const response = await fetch('/savegrades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentGrades),
    });

    const message = document.getElementById('grades-message');
    if (response.status === 200) {
      const result = await response.json();
      message.textContent = result.message;
      message.className = 'success';
      message.style.display = 'block';

      result.updatedGrades.forEach((updatedGrade) => {
        const gradeElement = document.querySelector(`
        #assignment-grade-${updatedGrade.assignment} .u-${updatedGrade.user}`);
        if (gradeElement) {
          const gradeInput = gradeElement.closest('li').querySelector('input[type="text"]');
          gradeInput.value = updatedGrade.grade;
        }
      });
    } else {
      const errorText = await response.text();
      message.textContent = `Error saving grades: ${errorText}`;
      message.className = 'error';
      message.style.display = 'block';
    }
  } catch (error) {
    const message = document.getElementById('grades-message');
    message.textContent = 'Error saving grades';
    message.className = 'error';
    message.style.display = 'block';
    console.error(error);
  } finally {
    saveGradesButton.disabled = false;
    setTimeout(() => {
      const message = document.getElementById('grades-message');
      message.style.display = 'none';
    }, 3000);
  }
}

// kliens oldali assignmenthez tartozo jegyek statiszikajanak megjelenitese (projekt)
// eslint-disable-next-line no-unused-vars
async function showStatistics(assignmentID) {
  try {
    const res = await fetch(`/assignment/${assignmentID}/statistics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const responseData = await res.json();
    if (res.status === 200) {
      const statisticsElement = document.querySelector(`#statistics-${assignmentID}`);
      statisticsElement.textContent = `Mean: ${responseData.mean}, Min: ${responseData.min}, Max: ${responseData.max}`;
      statisticsElement.style.display = 'block';

      const showStatisticsButton = document.getElementById(`${assignmentID}`);
      showStatisticsButton.textContent = 'Hide statistics';
      showStatisticsButton.setAttribute('onclick', `hideStatistics('${assignmentID}')`);
    } else {
      alert(responseData.message);
    }
  } catch (error) {
    const errorMessage = document.getElementById('error');
    errorMessage.getElementsByTagName('p')[0].textContent = 'Error showing statistics';
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 3000);
    console.error(error);
  }
}

// kliens oldali assignmenthez tartozo jegyek statiszikajanak elrejtse (projekt)
// eslint-disable-next-line no-unused-vars
function hideStatistics(assignmentID) {
  try {
    const statisticsElement = document.querySelector(`#statistics-${assignmentID}`);
    statisticsElement.style.display = 'none';

    const showStatisticsButton = document.getElementById(`${assignmentID}`);
    showStatisticsButton.textContent = 'Show statistics';
    showStatisticsButton.setAttribute('onclick', `showStatistics('${assignmentID}')`);
  } catch (error) {
    const errorMessage = document.getElementById('error');
    errorMessage.getElementsByTagName('p')[0].textContent = 'Error hiding statistics';
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 3000);
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

  const deleteUserButtons = document.querySelectorAll('[data-user-id]');
  deleteUserButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      deleteUser(event.target.dataset.userId);
    });
  });

  const editUserButtons = document.querySelectorAll('[data-edit-user-id]');
  editUserButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      editUser(event.target.dataset.editUserId);
    });
  });

  const inviteUserButtons = document.querySelectorAll('[data-invite-user-id]');
  inviteUserButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      inviteUser(event.target.dataset.inviteUserId);
    });
  });

  const acceptInvitationButtons = document.querySelectorAll('[data-accept-invitation-id]');
  acceptInvitationButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      acceptInvitation(event.target.dataset.acceptInvitationId);
    });
  });

  const declineInvitationButtons = document.querySelectorAll('[data-decline-invitation-id]');
  declineInvitationButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      declineInvitation(event.target.dataset.declineInvitationId);
    });
  });

  const saveGradesButton = document.getElementById('save-grades-button');
  saveGradesButton.addEventListener('click', (event) => {
    saveGrades(event);
  });
});
