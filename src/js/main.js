let contacts = [];
let editIndex = null;
let deleteIndex = null;
const searchBar = document.getElementById('searchBar');
const addBtn = document.getElementById('addBtn');
const resultList = document.getElementById('result');
const totalCount = document.getElementById('totalCount');
const addNameInput = document.getElementById('addName');
const addNumberInput = document.getElementById('addNumber');
const deleteModal = document.getElementById('deleteModal');
const letterStats = document.getElementById('letterStats');
const letterStatsSection = document.getElementById('letterStatsSection');

// Count contacts by first letter (only letters that have contacts)
function countContactsByLetter() {
  const letterCounts = {};
  contacts.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (firstLetter >= 'A' && firstLetter <= 'Z') {
      letterCounts[firstLetter] = (letterCounts[firstLetter] || 0) + 1;
    }
  });
  return letterCounts;
}

// Render letter statistics
function renderLetterStats() {
  const letterCounts = countContactsByLetter();
  letterStats.innerHTML = '';

  if (Object.keys(letterCounts).length === 0) {
    letterStatsSection.classList.add('hidden');
    return;
  }

  letterStatsSection.classList.remove('hidden');

  Object.keys(letterCounts)
    .sort()
    .forEach((letter) => {
      const count = letterCounts[letter];
      const letterDiv = document.createElement('div');
      letterDiv.className = 'letter-count';
      letterDiv.textContent = `${letter} - ${count}`;
      letterStats.appendChild(letterDiv);
    });
}

// Form validation
function validateForm() {
  const name = addNameInput.value.trim();
  const number = addNumberInput.value.trim();
  let isValid = true;

  addNameInput.classList.remove('error');
  addNumberInput.classList.remove('error');

  if (!name) {
    addNameInput.classList.add('error');
    isValid = false;
  }
  if (!number || number.length < 10) {
    addNumberInput.classList.add('error');
    isValid = false;
  }
  return isValid;
}

// Update count
function updateCount() {
  totalCount.textContent = `Total: ${contacts.length}`;
}

// Render contacts
function renderContacts(list) {
  resultList.innerHTML = '';

  if (list.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-address-book"></i>
      <p>No contacts found</p>
    `;
    resultList.appendChild(emptyState);
    updateCount();
    return;
  }

  list.forEach((c, idx) => {
    const li = document.createElement('li');
    li.className = 'contact-item';
    li.innerHTML = `
      <div class="contact-info">
        <div class="contact-name">${c.name}</div>
        <div class="contact-number">
          <i class="fas fa-phone"></i>
          ${c.number}
        </div>
      </div>
      <span class="actions">
        <button class="edit-btn" onclick="editContact(${idx})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" onclick="showDeleteModal(${idx})">
          <i class="fas fa-trash"></i>
        </button>
      </span>
    `;
    resultList.appendChild(li);
  });

  updateCount();
  renderLetterStats();
}

// Add or Save contact
addBtn.addEventListener('click', () => {
  if (!validateForm()) return;

  const name = addNameInput.value.trim();
  const number = addNumberInput.value.trim();

  if (editIndex === null) {
    contacts.push({ name, number });
  } else {
    contacts[editIndex] = { name, number };
    editIndex = null;
    addBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    addBtn.classList.remove('edit-mode');
  }

  addNameInput.value = '';
  addNumberInput.value = '';
  addNameInput.classList.remove('error');
  addNumberInput.classList.remove('error');

  renderContacts(contacts);
  liveSearch();
  renderLetterStats();
});

// Edit contact
window.editContact = function (index) {
  const contact = contacts[index];
  addNameInput.value = contact.name;
  addNumberInput.value = contact.number;
  editIndex = index;
  addBtn.innerHTML = '<i class="fas fa-save"></i> Save';
  addBtn.classList.add('edit-mode');
};

// Show delete modal
window.showDeleteModal = function (index) {
  deleteIndex = index;
  deleteModal.classList.add('show');
};

// ✅ Close delete modal (normal function)
function closeDeleteModal() {
  deleteModal.classList.remove('show');
  deleteIndex = null;
}
window.closeDeleteModal = closeDeleteModal; // expose if used in HTML

// ✅ Confirm delete (normal function)
function confirmDelete() {
  if (deleteIndex !== null) {
    contacts.splice(deleteIndex, 1);
    renderContacts(contacts);
    liveSearch();
    renderLetterStats();
    closeDeleteModal();
  }
}
window.confirmDelete = confirmDelete; // expose if used in HTML

// Live search
function liveSearch() {
  const query = searchBar.value.trim().toLowerCase();
  const filtered = contacts.filter(
    (c) => c.name.toLowerCase().includes(query) || c.number.includes(query)
  );
  renderContacts(filtered);
}

// Remove validation errors on input
addNameInput.addEventListener('input', () => {
  if (addNameInput.value.trim()) {
    addNameInput.classList.remove('error');
  }
});
addNumberInput.addEventListener('input', () => {
  if (addNumberInput.value.trim()) {
    addNumberInput.classList.remove('error');
  }
});

// Event listeners
searchBar.addEventListener('input', liveSearch);

// Close modal on outside click
deleteModal.addEventListener('click', (e) => {
  if (e.target === deleteModal) {
    closeDeleteModal();
  }
});

// Initial render
renderContacts(contacts);
renderLetterStats();
