package ru.knigoed.book.service.mapper;

import org.mapstruct.Mapper;
import ru.knigoed.book.service.dto.BookDTO;
import ru.knigoed.book.service.entity.Book;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookMapper {

    BookDTO toDTO(Book book);

    Book toEntity(BookDTO bookDTO);

    List<BookDTO> toDTOs(List<Book> books);
}
