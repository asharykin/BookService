package ru.knigoed.book.service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookDTO {
    private Long id;
    private String vendorCode;
    private String title;
    private int year;
    private String brand;
    private int stock;
    private double price;
}