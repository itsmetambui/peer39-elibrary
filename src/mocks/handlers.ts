import { http, HttpResponse } from "msw";

const getAuthorsFromStorage = async () => {
  const data = JSON.parse(sessionStorage.getItem("authors") || "[]") as {
    id: string;
    fullName: string;
  }[];
  return data;
};

const getBooksFromStorage = async () => {
  const data = JSON.parse(sessionStorage.getItem("books") || "[]") as {
    id: string;
    title: string;
    authors: string[];
    publishedYear: number;
  }[];
  return data;
};

const timeout = (delay: number) => {
  return new Promise((res) => setTimeout(res, delay));
};

export const handlers = [
  http.get("/api/authors", async () => {
    await timeout(500);
    const authors = await getAuthorsFromStorage();
    const books = await getBooksFromStorage();

    const authorWithBookStats = authors.map((author) => ({
      ...author,
      numberOfBooks:
        books.filter((book) => book.authors.includes(author.id)).length || 0,
    }));

    return HttpResponse.json(authorWithBookStats);
  }),

  http.get("/api/authors/:id", async ({ params }) => {
    await timeout(500);
    const authors = await getAuthorsFromStorage();
    const books = await getBooksFromStorage();
    const authorId = params.id;
    const author = authors.find((author) => author.id === authorId);

    if (!author) {
      return HttpResponse.json(
        { message: "Author not found" },
        { status: 404 }
      );
    }

    const numberOfBooks =
      books.filter((book) => book.authors.includes(author.id)).length || 0;

    return HttpResponse.json({
      ...author,
      numberOfBooks,
    });
  }),

  http.post("/api/authors", async ({ request }) => {
    await timeout(500);
    const body = (await request.json()) as { fullName: string };
    const newAuthor = {
      id: new Date().getTime().toString(),
      fullName: body.fullName,
    };
    const authors = await getAuthorsFromStorage();
    sessionStorage.setItem("authors", JSON.stringify([...authors, newAuthor]));

    return HttpResponse.json(
      { ...newAuthor, numberOfBooks: 0 },
      { status: 201 }
    );
  }),

  http.put("/api/authors/:id", async ({ request, params }) => {
    await timeout(500);
    const body = (await request.json()) as { fullName: string };
    const authors = await getAuthorsFromStorage();
    const authorId = params.id;
    const authorToUpdate = authors.find((author) => author.id === authorId);

    if (!authorToUpdate) {
      return HttpResponse.json(
        { message: "Author not found" },
        { status: 404 }
      );
    }

    const updatedAuthors = authors.map((author) =>
      author.id === authorId ? { ...author, fullName: body.fullName } : author
    );

    sessionStorage.setItem("authors", JSON.stringify(updatedAuthors));

    const books = await getBooksFromStorage();
    const numberOfBooks =
      books.filter((book) => book.authors.includes(authorToUpdate.id)).length ||
      0;

    return HttpResponse.json({
      ...authorToUpdate,
      fullName: body.fullName,
      numberOfBooks,
    });
  }),

  http.delete("/api/authors/:id", async ({ params }) => {
    await timeout(500);
    const authors = await getAuthorsFromStorage();
    const books = await getBooksFromStorage();

    const authorId = params.id;
    const authorToDelete = authors.find((author) => author.id === authorId);

    if (!authorToDelete) {
      return HttpResponse.json(
        { message: "Author not found" },
        { status: 404 }
      );
    }

    const updatedAuthors = authors.filter((author) => author.id !== authorId);
    const updatedBooks = books.map((book) => ({
      ...book,
      authors: book.authors.filter(
        (authorId) => authorId !== authorToDelete.id
      ),
    }));

    sessionStorage.setItem("authors", JSON.stringify(updatedAuthors));
    sessionStorage.setItem("books", JSON.stringify(updatedBooks));

    return HttpResponse.json({ status: 204 });
  }),

  http.get("/api/books", async ({ request }) => {
    await timeout(500);
    const url = new URL(request.url);
    const authorId = url.searchParams.get("authorId");
    const authors = await getAuthorsFromStorage();
    const books = await getBooksFromStorage();

    const filteredBooks = books.filter((book) =>
      authorId ? book.authors.includes(authorId) : true
    );

    const booksWithAuthors = filteredBooks.map((book) => ({
      ...book,
      authors: book.authors.map((authorId) =>
        authors.find((author) => author.id === authorId)
      ),
    }));

    return HttpResponse.json(booksWithAuthors);
  }),

  http.get("/api/books/:id", async ({ params }) => {
    await timeout(500);
    const authors = await getAuthorsFromStorage();
    const books = await getBooksFromStorage();
    const bookId = params.id;
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return HttpResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const bookWithAuthors = book.authors.map((authorId) =>
      authors.find((author) => author.id === authorId)
    );

    return HttpResponse.json({ ...book, authors: bookWithAuthors });
  }),

  http.post("/api/books", async ({ request }) => {
    await timeout(500);
    const body = (await request.json()) as {
      title: string;
      publishedYear: number;
      authors: string[];
    };
    const newBook = {
      id: new Date().getTime().toString(),
      title: body.title,
      authors: body.authors,
      publishedYear: body.publishedYear,
    };

    const books = await getBooksFromStorage();
    const authors = await getAuthorsFromStorage();

    const authorsWithFullName = newBook.authors.map((authorId) =>
      authors.find((author) => author.id === authorId)
    );

    sessionStorage.setItem("books", JSON.stringify([...books, newBook]));
    return HttpResponse.json(
      { ...newBook, authors: authorsWithFullName },
      { status: 201 }
    );
  }),

  http.put("/api/books/:id", async ({ request, params }) => {
    await timeout(500);
    const body = (await request.json()) as {
      title: string;
      publishedYear: number;
      authors: string[];
    };
    const books = await getBooksFromStorage();
    const authors = await getAuthorsFromStorage();

    const bookId = params.id;
    const bookToUpdate = books.find((book) => book.id === bookId);

    if (!bookToUpdate) {
      return HttpResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const updatedBooks = books.map((book) =>
      book.id === bookId
        ? {
            ...book,
            title: body.title,
            publishedYear: body.publishedYear,
            authors: body.authors,
          }
        : book
    );

    const authorsWithFullName = body.authors.map((authorId) =>
      authors.find((author) => author.id === authorId)
    );

    sessionStorage.setItem("books", JSON.stringify(updatedBooks));

    return HttpResponse.json(
      { ...bookToUpdate, authors: authorsWithFullName },
      { status: 500 }
    );
  }),

  http.delete("/api/books/:id", async ({ params }) => {
    await timeout(500);
    const books = await getBooksFromStorage();
    const bookId = params.id;
    const bookToDelete = books.find((book) => book.id === bookId);

    if (!bookToDelete) {
      return HttpResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const updatedBooks = books.filter((book) => book.id !== bookId);
    sessionStorage.setItem("books", JSON.stringify(updatedBooks));

    return HttpResponse.json({ status: 204 });
  }),
];
