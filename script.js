const library = document.getElementById("library");
const dialog = document.getElementById("book-dialog");
const form = document.getElementById("book-form");
const search = document.querySelector('input[type="search"]');

class Book {
  constructor(title, author, noOfPages, haveRead) {
    this.id = crypto.randomUUID();
    this.author = author;
    this.title = title;
    this.noOfPages = noOfPages;
    this.haveRead = haveRead;
  }
  toggleReadStatus() {
    return (this.haveRead = !this.haveRead);
  }
}

class Library {
  #book = [];

  add(book) {
    this.#book.push(book);
  }

  search(query) {
    const q = query.toLowerCase();
    return this.#book.filter(
      (book) =>
        book.title?.toLowerCase().includes(q) ||
        book.author?.toLowerCase().includes(q),
    );
  }

  removeBook(id) {
    const index = this.#book.findIndex((b) => b.id === id);
    if (index === -1) return false;
    this.#book.splice(index, 1);
    return true;
  }
}

const myLibrary = new Library();

const addBooktolibrary = (title, author, noOfPages, haveRead) => {
  const book = new Book(title, author, noOfPages, haveRead);
  console.log(book); // i added this for debugging

  myLibrary.add(book);
  renderLibrary();
  console.log(myLibrary); // i added this for debugging
};

dialog.addEventListener("close", () => form.reset());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);

  const title = data.get("title");
  const author = data.get("author");
  const noOfPages = Number(data.get("pages"));
  const haveRead = data.get("read") === "on";

  addBooktolibrary(title, author, noOfPages, haveRead);
  dialog.close();
});

const renderLibrary = () => {
  const query = search.value;
  visibleBooks = myLibrary.search(query);

  library.replaceChildren();
  visibleBooks.forEach((book) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.dataset.id = book.id;

    const bookTitle = document.createElement("h2");
    bookTitle.classList.add("bookTitle");
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("bookAuthor");
    bookAuthor.textContent = book.author;

    const pages = document.createElement("p");
    pages.classList.add("pages");
    pages.textContent = `${book.noOfPages} pages`;

    const readStatus = document.createElement("p");
    readStatus.classList.add("readStatus");
    readStatus.textContent = book.haveRead ? "have Read" : "have not read";

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("removeBtn");
    removeBtn.textContent = "Remove";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.classList.add("toggleBtn");
    toggleBtn.textContent = "Read Status";

    actions.append(toggleBtn, removeBtn);
    card.append(bookTitle, bookAuthor, pages, readStatus, actions);
    library.append(card);

    removeBtn.addEventListener("click", () => {
      if (!myLibrary.removeBook(book.id)) {
        console.warn("No Book with that ID");
      }
      renderLibrary();
    });

    toggleBtn.addEventListener("click", () => {
      book.toggleReadStatus();
      renderLibrary();
      console.log(myLibrary);
    });
  });
};

search.addEventListener("input", renderLibrary);
