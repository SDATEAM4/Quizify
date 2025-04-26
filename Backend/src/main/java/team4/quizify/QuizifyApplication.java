package team4.quizify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class QuizifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuizifyApplication.class, args);
	}

}
