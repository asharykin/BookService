package ru.knigoed.book.service.specifications;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import ru.knigoed.book.service.entity.Book;

public class BookSpecifications {

    public static Specification<Book> titleEquals(String title) {
        return (root, query, criteriaBuilder) -> {
            if (title == null || title.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("title"), title);
        };
    }

    public static Specification<Book> brandEquals(String brand) {
        return (root, query, criteriaBuilder) -> {
            if (brand == null || brand.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("brand"), brand);
        };
    }

    public static Specification<Book> yearEquals(Integer year) {
        return (root, query, criteriaBuilder) -> {
            if (year == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("year"), year);
        };
    }

    public static Specification<Book> filterBooks(String title, String brand, Integer year) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            predicate = criteriaBuilder.and(predicate, titleEquals(title).toPredicate(root, query, criteriaBuilder));
            predicate = criteriaBuilder.and(predicate, brandEquals(brand).toPredicate(root, query, criteriaBuilder));
            predicate = criteriaBuilder.and(predicate, yearEquals(year).toPredicate(root, query, criteriaBuilder));
            return predicate;
        };
    }
}

