package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team4.quizify.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Basic finder methods
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(@Param("role") String role);
    
    @Query("SELECT u FROM User u WHERE u.fname LIKE %:name% OR u.lname LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND (u.fname LIKE %:search% OR u.lname LIKE %:search% OR u.username LIKE %:search% OR u.email LIKE %:search%)")
    List<User> searchUsersByRoleAndKeyword(@Param("role") String role, @Param("search") String search);
    
    @Query(value = "SELECT * FROM users WHERE LOWER(username) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY user_id DESC LIMIT :limit", nativeQuery = true)
    List<User> findTopUsersByUsernameContaining(@Param("keyword") String keyword, @Param("limit") int limit);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") String role);
}
