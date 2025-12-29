// Simple item manager
interface Item {
  id: number;
  name: string;
}

let items: Item[] = [];
let nextId = 1;

function addItem(name: string): void {
  if (name.trim() === '') {
    return;
  }

  const item: Item = {
    id: nextId++,
    name: name.trim(),
  };

  items.push(item);
  renderItems();

  // Clear input
  const input = document.getElementById('itemInput') as HTMLInputElement;
  if (input) {
    input.value = '';
  }
}

function renderItems(): void {
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

  renderItems();
});
