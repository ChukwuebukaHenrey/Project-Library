const library = document.getElementById("library");
const dialog = document.getElementById("book-dialog");
const form = document.getElementById("book-form");
const cancelBtn = document.getElementById("cancel-btn");
const submitBtn = document.querySelector('button[type = "submit"]');
const remove = document.querySelector(".removeBtn");
const search = document.querySelector('input[type="search"]');

const myLibrary = [];

function Book(title, author, noOfPages, haveRead) {
  if (!new.target) {
    throw new Error("you have to use the new keyword");
  }
  this.id = crypto.randomUUID();
  this.author = author;
  this.title = title;
  this.noOfPages = noOfPages;
  this.haveRead = haveRead;
}

Book.prototype.toggleReadStatus = function () {
  this.haveRead = !this.haveRead;
};

const addBooktolibrary = (title, author, noOfPages, haveRead) => {
  const book = new Book(title, author, noOfPages, haveRead);
  console.log(book);

  myLibrary.push(book);
  renderBook(book);
  console.log(myLibrary);
};

dialog.addEventListener("close", () => form.reset());

form.addEventListener("submit", () => {
  const data = new FormData(form);

  const title = data.get("title");
  const author = data.get("author");
  const noOfPages = Number(data.get("pages"));
  const haveRead = data.get("read") === "on";

  addBooktolibrary(title, author, noOfPages, haveRead);
});

const renderBook = () => {
  const query = search.value.toLowerCase();
  console.log(query);

  const visibleBooks = myLibrary.filter(
    (book) =>
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query),
  );

  console.log(visibleBooks);

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
      const index = myLibrary.findIndex((b) => b.id === book.id);
      index !== -1
        ? myLibrary.splice(index, 1)
        : console.warn("this shii aint real");
      renderBook();
    });

    toggleBtn.addEventListener("click", () => {
      book.toggleReadStatus();
      renderBook();
    });
  });
};

search.addEventListener("input", renderBook);
