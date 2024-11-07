const booksDb = require("./booksDb");

const addBook = async (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const { nanoid } = await import("nanoid");
  const id = nanoid(16);
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  } else if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  booksDb.push(newBook);

  const isSucces = booksDb.filter((book) => book.id === id).length > 0;

  if (isSucces) {
    const index = booksDb.findIndex((n) => n.id === id);

    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: booksDb[index].id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "buku gagal ditambahkan",
  });
  response.code(404);
  return response;
};

const getAllBooks = (request, h) => {
  const response = h.response({
    status: "success",
    data: {
      books: booksDb.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = booksDb.filter((b) => b.id == bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: { book },
    });
    response.code(200);

    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);

    return response;
  }
};

const editBookById = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = booksDb.findIndex((b) => b.id == bookId);

  const updatedAt = new Date().toISOString();
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  } else if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  } else if (bookIndex == -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
  }

  booksDb[bookIndex] = {
    ...booksDb[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);

  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const boookIndex = booksDb.findIndex((b) => b.id == bookId);

  if (boookIndex == -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);

    return response;
  }

  booksDb.splice(boookIndex, 1);
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);

  return response;
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
