package team4.quizify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subject")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    
    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Integer subject_id;
    
      @Id
          @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subject_id")
    private Integer subject_id;


    @Column(nullable = false)
    private String name;
    
    @Column(name = "teachers_id", columnDefinition = "integer[]")
    private Integer[] teachersId;

    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "description")
    private String description;
}
