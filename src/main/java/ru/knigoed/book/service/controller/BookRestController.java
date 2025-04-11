package ru.knigoed.book.service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.knigoed.book.service.dto.BookDTO;
import ru.knigoed.book.service.service.BookService;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookRestController {

    private final BookService bookService;

    @GetMapping
    public Page<BookDTO> getBooks(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "year", required = false) Integer year) {
        Pageable pageable = PageRequest.of(page, size);
        return bookService.getBooksByFilter(title, brand, year, pageable);
    }

    @PostMapping
    public ResponseEntity<BookDTO> createBook(@RequestBody BookDTO bookDTO) {
        BookDTO createdBook = bookService.saveBook(bookDTO);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @RequestBody BookDTO bookDTO) {
        BookDTO existingBook = bookService.getBookById(id);
        if (existingBook == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        bookDTO.setId(id);
        BookDTO updatedBook = bookService.saveBook(bookDTO);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        BookDTO existingBook = bookService.getBookById(id);
        if (existingBook == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        bookService.deleteBook(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
