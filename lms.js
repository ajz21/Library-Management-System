let addBookCard = document.querySelector('.addBooks'),
    returnBookCard = document.querySelector('.returnBooks'),
    issueBookCard = document.querySelector('.issueBooks'),
    tablebody = document.getElementById('tbody');

let add_btn = document.getElementById('addBtn'),
    issue_btn = document.getElementById('issueBtn'),
    return_btn = document.getElementById('returnBtn'),
    cancel_add_btn = document.getElementById('add-cancel'),
    cancel_return_btn = document.getElementById('return-cancel'),
    cancel_issue_btn = document.getElementById('issue-cancel'),
    addBooksBtn = document.getElementById('add'),
    returnBooksBtn = document.getElementById('return'),
    issueBooksBtn = document.getElementById('issue');

let total_books = document.getElementById('num1'),
    available_books = document.getElementById('num2');


let search = document.getElementById('search');

class Library {
    constructor(book, Author) {
        this.book = book;
        this.Author = Author;
    }
    static itemStorage() {
        let obj = localStorage.getItem('bookList');
        let bookObj;
        if (obj == null) {
            bookObj = [];
            return bookObj;
        } else {
            bookObj = JSON.parse(obj);
            return bookObj;
        }
    }

    static userStorage() {
        let logBook = localStorage.getItem('userLog');
        let logObj;
        if (logBook == null) {
            logObj = {};
            return logObj;
        } else {
            logObj = JSON.parse(logBook);
            return logObj;
        }
    }
    static storeAuthor() {
        let authorBook = localStorage.getItem('authorLog');
        let authorLog;
        if (authorBook == null) {
            authorLog = {};
            return authorLog;
        } else {
            authorLog = JSON.parse(authorBook);
            return authorLog;
        }
    }

    static addBook(bookName, Author) {
        let book_list = new Library(bookName, Author);
        let bookListObj = Library.itemStorage();

        bookListObj.push(book_list);
        localStorage.setItem('bookList', JSON.stringify(bookListObj));
        this.displayLib();
        this.bookIssued(bookName, Author, 'A');

    }

    static issueBook(bookName, user) {
        let userObj = Library.userStorage();
        let bookListObj = Library.itemStorage();
        let authorLog = this.storeAuthor();

        if (bookListObj.length != 0) {

            for (let i in bookListObj) {

                if (bookListObj[i].book.replace(/\s+/g, '') == bookName) {

                    authorLog[bookName] = bookListObj[i].Author;
                    localStorage.setItem('authorLog', JSON.stringify(authorLog))

                    userObj[bookName] = user;
                    localStorage.setItem('userLog', JSON.stringify(userObj));

                    this.displayLib();
                    this.bookIssued(bookName, user, 'I');

                } else {

                }
            }
        } else {
            console.log('no books are available');
        }


    }

    static returnBook(bookName, user) {
        let userObj = Library.userStorage();
        let authorLog = this.storeAuthor();

        if (userObj[bookName] == user) {
            delete userObj[bookName];
            localStorage.setItem('userLog', JSON.stringify(userObj));

            delete authorLog[bookName];
            localStorage.setItem('authorLog', JSON.stringify(authorLog));
            this.bookIssued(bookName, user, 'R');
            this.displayLib();
        } else {
            console.log('No Book Available');
        }
    }

    static displayLib() {
        let html = '';

        let bookObj = Library.itemStorage();
        let userObj = this.userStorage();


        bookObj.forEach(function(element, index) {
            let availability = Library.checkAvailability(element.book.trim());
            html += `<tr class="bookRow" id="trow_${index}">
                <td>${element.book}<h4>${element.Author}</h4></td>
                <td id="avail_${index}">${availability}</td>
                </tr>`;

            tablebody.innerHTML = html;
        });
        total_books.innerText = bookObj.length;
        available_books.innerText = bookObj.length - Object.keys(userObj).length;

    }

    static checkAvailability(bookName) {

        let userObj = Library.userStorage();

        if (userObj.hasOwnProperty(bookName.replace(/\s+/g, ''))) {
            return 'Not Available'
        } else {
            return 'Available';
        }
    }
    static searchBook() {

        let bookListObj = this.itemStorage();
        let tbody2 = document.getElementsByTagName('tbody')[1].children;
        if (search.value != '') {
            for (let i in bookListObj) {
                if (bookListObj[i].book.toLowerCase().includes(search.value) || bookListObj[i].Author.toLowerCase().includes(search.value)) {

                } else {
                    tbody2[i].style.display = 'none';
                }
            }
        } else {
            this.displayLib()
        }

    }

    static bookIssued(bookName, user, n) {
        let successMessage = document.createElement('div');
        let msg = document.createElement('h3');
        msg.style.textAlign = 'center';
        let clBtn = document.createElement('button');
        let textBtn = document.createTextNode('close');
        clBtn.setAttribute('id', 'closeBtn');
        clBtn.appendChild(textBtn);
        if (n == 'I') {
            let textMsg = document.createTextNode(`${bookName} issued to ${user}!`);
            msg.appendChild(textMsg);

        } else if (n == 'R') {
            let textMsg = document.createTextNode(`${user} returned ${bookName}.`);
            msg.appendChild(textMsg);
        } else {
            let textMsg = document.createTextNode(`${bookName} by ${user} added to Library!`);
            msg.appendChild(textMsg);
        }

        successMessage.classList.add('successMsg', 'Books');
        successMessage.appendChild(msg);
        successMessage.appendChild(clBtn);
        modal.append(successMessage);
        modal.classList.toggle('modalDisplay');
        let closeBtn = document.getElementById('closeBtn');
        closeBtn.addEventListener('click', () => {
            successMessage.remove()
            modal.classList.toggle('modalDisplay');
        })
    }
}

Library.displayLib();



let modal = document.querySelector('.model');
add_btn.addEventListener('click', () => {
    addBookCard.classList.add('Books');
    modal.classList.toggle('modalDisplay');
});

return_btn.addEventListener('click', () => {
    modal.classList.toggle('modalDisplay');
    returnBookCard.classList.add('Books');
});

issue_btn.addEventListener('click', () => {
    modal.classList.toggle('modalDisplay');
    issueBookCard.classList.add('Books');;
});



cancel_add_btn.addEventListener('click', () => { clearCard('A') });
cancel_return_btn.addEventListener('click', () => { clearCard('B') });
cancel_issue_btn.addEventListener('click', () => { clearCard('C') });


addBooksBtn.addEventListener('click', () => {
    let bookElem = document.getElementById('book'),
        authorName = document.getElementById('author');

    if (bookElem.value != '') {
        if (authorName.value != '') {
            Library.addBook(bookElem.value, authorName.value);

            bookElem.value = '';
            authorName.value = '';
            clearCard('A');
        } else {
            authorName.style.borderColor = 'red';
        }
    } else {
        bookElem.style.borderColor = 'red';
    }
});

returnBooksBtn.addEventListener('click', () => {
    let returnBook = document.getElementById('return-book-name'),
        returnUserName = document.getElementById('return-user-name');

    if (returnBook.value != '') {
        if (returnUserName.value != '') {
            Library.returnBook(returnBook.value, returnUserName.value);
            returnBook.value = '';
            returnUserName.value = '';
            clearCard('B');
        } else {
            returnUserName.style.borderColor = 'red';
        }
    } else {
        returnBook.style.borderColor = 'red';
    }
});

issueBooksBtn.addEventListener('click', () => {
    let issueBook = document.getElementById('issue-book-name'),
        issueUserName = document.getElementById('issue-user-name');

    if (issueBook.value != '') {
        if (issueUserName.value != '') {
            Library.issueBook(issueBook.value.replace(/\s+/g, ''), issueUserName.value);
            issueBook.value = '';
            issueUserName.value = '';
            clearCard('C');
        } else {
            issueUserName.style.borderColor = 'red';
        }
    } else {
        issueBook.style.borderColor = 'red';
    }
});


function clearCard(n) {
    modal.classList.toggle('modalDisplay');
    if (n == 'A') {
        addBookCard.classList.remove('Books');
    } else if (n == 'B') {
        returnBookCard.classList.remove('Books');
    } else {
        issueBookCard.classList.remove('Books');
    }
}

search.addEventListener('input', () => {
    Library.searchBook();
})