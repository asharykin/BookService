package ru.knigoed.book.service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import ru.knigoed.book.service.dto.BookDTO;
import ru.knigoed.book.service.entity.Book;
import ru.knigoed.book.service.mapper.BookMapper;
import ru.knigoed.book.service.repository.BookRepository;
import ru.knigoed.book.service.specifications.BookSpecifications;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id).orElse(null);
        return bookMapper.toDTO(book);
    }

    public Page<BookDTO> getBooksByFilter(String title, String brand, Integer year, Pageable pageable) {
        Specification<Book> spec = BookSpecifications.filterBooks(title, brand, year);
        Page<Book> bookPage = bookRepository.findAll(spec, pageable);
        List<BookDTO> bookDTOs = bookMapper.toDTOs(bookPage.getContent());
        return new PageImpl<>(bookDTOs, pageable, bookPage.getTotalElements());
    }

    public BookDTO createBook(BookDTO bookDTO) {
        Book book = bookMapper.toEntity(bookDTO);
        Book savedBook = bookRepository.save(book);
        return bookMapper.toDTO(savedBook);
    }

    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookMapper.toEntity(bookDTO);
        book.setId(id);
        Book updatedBook = bookRepository.save(book);
        return bookMapper.toDTO(updatedBook);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

}

