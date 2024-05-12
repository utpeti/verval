// kliens oldali class torles
async function deleteClass(deleteClassID) {
  try {
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
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('[data-class-id]');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      deleteClass(event.target.dataset.classId);
    });
  });
});
