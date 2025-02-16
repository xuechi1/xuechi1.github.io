const userDataDiv = document.getElementById('userData');
const resetBtn = document.getElementById('resetBtn');

function fetchUserData() {
  fetch('https://randomuser.me/api/')
    .then(response => response.json())
    .then(data => {
      const user = data.results[0];
      userDataDiv.innerHTML = `
        <div class="user-card">
          <img src="${user.picture.medium}" alt="User Image" class="user-image">
          <p><strong>Name:</strong> ${user.name.first} ${user.name.last}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Location:</strong> ${user.location.city}, ${user.location.country}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
        </div>
      `;
    })
    .catch(error => console.error('Error fetching data:', error));
}

fetchUserData();

resetBtn.addEventListener('click', fetchUserData);