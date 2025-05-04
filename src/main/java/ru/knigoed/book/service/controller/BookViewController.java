package ru.knigoed.book.service.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BookViewController {

    @GetMapping("/books")
    public String listBooks() {
        return "books";
    }
}

