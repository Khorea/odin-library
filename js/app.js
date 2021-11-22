console.log("Hi!");

function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? 'read' : 'not read'}`;
} 

let bk1 = new Book('t1tl3', 'horea', 32, true);
let bk2 = new Book('title2', 'horea2', 322, false);

class Library {
    constructor() {
        this.books = [];
    }
}

Library.prototype.showBooks = function() {
    console.table(this.books);
}

Library.prototype.addBook = function(book) {
    this.books.push(book);
}

Library.prototype.toggleReadStatus = function(i) {
    this.books[i].isRead = !this.books[i].isRead;
}

let storageLibrary = localStorage.getItem('library');
let myLibrary = new Library();
if (storageLibrary) {
    myLibrary = Object.create(Library.prototype);
    myLibrary.books = JSON.parse(storageLibrary).books;
}

const content = document.querySelector('.content');
const card = document.querySelector('.book-card');
const addBookButton = document.querySelector('.add-book-button');

// add new book modal
const addBookModal = document.querySelector('.modal-background');
const submitButton = document.querySelector('.submit');
const titleInput = document.querySelector('.title-input');
const authorInput = document.querySelector('.author-input');
const pageNrInput = document.querySelector('.pageNr-input');
const isReadInput = document.querySelector('#isRead');

// invalid input error messages
const titleError = document.querySelector('.error[data-input="title"]');
const authorError = document.querySelector('.error[data-input="author"]');
const pageNrError = document.querySelector('.error[data-input="pageNr"]');

function toggleReadStatus(bookIndex) {
    const clickedCard = document.querySelector(`.book-card[data-index='${bookIndex}']`);
    const cardBookIsRead = clickedCard.querySelector('.card-book-isread');
    myLibrary.toggleReadStatus(bookIndex);
    cardBookIsRead.textContent = `Status: ${myLibrary.books[bookIndex].isRead ? 'read' : 'not read'}`
    localStorage.setItem('library', JSON.stringify(myLibrary));
}

function deleteBook(bookIndex) {
    const clickedCard = document.querySelector(`.book-card[data-index='${bookIndex}']`);
    clickedCard.remove();
    delete myLibrary.books[bookIndex];
    localStorage.setItem('library', JSON.stringify(myLibrary));
}

function createNewCard(book) {
    const newCard = card.cloneNode(true);
    const cardBookTitle = newCard.querySelector('.card-book-title');
    const cardBookAuthor = newCard.querySelector('.card-book-author');
    const cardBookPageNr = newCard.querySelector('.card-book-pgnumber');
    const cardBookIsRead = newCard.querySelector('.card-book-isread');
    const cardSetStatus = newCard.querySelector('.card-status-button');
    const cardDelete = newCard.querySelector('.card-delete-button');
    cardBookTitle.textContent += book.title;
    cardBookAuthor.textContent += book.author;
    cardBookPageNr.textContent += book.pages;
    cardBookIsRead.textContent += book.isRead ? 'read' : 'not read';
    cardSetStatus.onclick = () => toggleReadStatus(cardSetStatus.parentNode.parentNode.dataset.index);
    cardDelete.onclick = () => deleteBook(cardSetStatus.parentNode.parentNode.dataset.index);
    newCard.setAttribute('data-index', myLibrary.books.indexOf(book));
    newCard.style.display = 'flex';
    return newCard;
}

function addNewCard(book) {
    if (!book) {
        return;
    }
    const newCard = createNewCard(book);   
    content.appendChild(newCard);
}

function resetModal() {
    titleInput.value = '';
    authorInput.value = '';
    pageNrInput.value = '';
    isReadInput.checked = false;
}

myLibrary.books.forEach(book => addNewCard(book));
addBookButton.onclick = () => {
    resetModal();
    addBookModal.classList.toggle('active');
};

submitButton.onclick = () => {
    let inputErrorFound = false;
    if (titleInput.value.length === 0) {
        titleError.classList.add('active');
        inputErrorFound = true;
    } else {
        titleError.classList.remove('active');
    }
    if (authorInput.value.length === 0) {
        authorError.classList.add('active');
        inputErrorFound = true;
    } else {
        authorError.classList.remove('active');
    }
    if (!Number(pageNrInput.value) || Number(pageNrInput.value) <= 0) {
        pageNrError.classList.add('active');
        inputErrorFound = true;
    } else {
        pageNrError.classList.remove('active');
    }
    if (inputErrorFound) {
        return;
    }
    addBook(titleInput.value, authorInput.value, pageNrInput.value, isReadInput.value);
    addBookModal.classList.toggle('active');
}

function addBook(title, author, pageNr, isRead) {
    const book = new Book(title, author, pageNr, isRead);
    myLibrary.addBook(book);
    addNewCard(book);
    localStorage.setItem('library', JSON.stringify(myLibrary));
}

window.addEventListener('click', (e) => {
    if(e.target.classList[0] === 'modal-background') {
        addBookModal.classList.toggle('active');
    } 
})

