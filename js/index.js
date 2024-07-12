document.addEventListener("DOMContentLoaded", () => {
    const listPanel = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
    const user = {"id": 1, "username": "pouros"};
  
    // Fetch books from the server
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = book.title;
          li.addEventListener('click', () => showBookDetails(book));
          listPanel.appendChild(li);
        });
      });
  
    function showBookDetails(book) {
      showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnail}" alt="${book.title}">
        <p>${book.description}</p>
        <ul id="users-list">
          ${book.users.map(user => `<li>${user.username}</li>`).join('')}
        </ul>
        <button id="like-button">LIKE</button>
      `;
      const likeButton = document.getElementById('like-button');
      likeButton.addEventListener('click', () => toggleLike(book));
    }
  
    function toggleLike(book) {
      const usersList = document.getElementById('users-list');
      const userIndex = book.users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        book.users.push(user);
      } else {
        book.users.splice(userIndex, 1);
      }
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({users: book.users})
      })
      .then(response => response.json())
      .then(updatedBook => {
        usersList.innerHTML = updatedBook.users.map(user => `<li>${user.username}</li>`).join('');
      });
    }
  });
  