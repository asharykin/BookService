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
    public ResponseEntity<Page<BookDTO>> getBooks(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "year", required = false) Integer year) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BookDTO> bookDTOs = bookService.getBooksByFilter(title, brand, year, pageable);
        return new ResponseEntity<>(bookDTOs, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BookDTO> createBook(@RequestBody BookDTO bookDTO) {
        BookDTO createdBookDTO = bookService.createBook(bookDTO);
        return new ResponseEntity<>(createdBookDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @RequestBody BookDTO bookDTO) {
        if (bookService.getBookById(id) != null) {
            BookDTO updatedBookDTO = bookService.updateBook(id, bookDTO);
            return new ResponseEntity<>(updatedBookDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.getBookById(id) != null) {
            bookService.deleteBook(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
