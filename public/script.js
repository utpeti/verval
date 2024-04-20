function displayMenu() {
  document.getElementById('add-class-button').addEventListener('click', () => {
    document.getElementById('add-class').style.display = 'block';
    document.getElementById('add-class-button').style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => displayMenu());
