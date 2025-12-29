// Simple item manager
interface Item {
  _id: string;
  name: string;
}

const API_URL = `http://${
  import.meta.env.IS_DOCKER ? 'backend' : 'localhost'
}:${import.meta.env.PORT}`;

async function loadItems(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/items`);
    const items: Item[] = await response.json();
    renderItems(items);
  } catch (error) {
    console.error('Failed to load items:', error);
  }
}

async function addItem(name: string): Promise<void> {
  if (name.trim() === '') {
    return;
  }

  try {
    await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name.trim() }),
    });

    // Reload items after adding
    await loadItems();

    // Clear input
    const input = document.getElementById('itemInput') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  } catch (error) {
    console.error('Failed to add item:', error);
  }
}

function renderItems(items: Item[]): void {
  const listElement = document.getElementById('itemsList');
  if (!listElement) {
    return;
  }

  listElement.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.name;
    listElement.appendChild(li);
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addBtn');
  const itemInput = document.getElementById('itemInput') as HTMLInputElement;

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (itemInput) {
        addItem(itemInput.value);
      }
    });
  }

  if (itemInput) {
    itemInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        addItem(itemInput.value);
      }
    });
  }

  // Load items on page load
  loadItems();
});
