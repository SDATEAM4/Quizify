package team4.quizify.patterns.singleton;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import team4.quizify.service.AdminService;


@Component
public class AdminServiceSingleton {
    private static AdminServiceSingleton instance;
    private final AdminService adminService;
    
    private AdminServiceSingleton(ApplicationContext context) {
        this.adminService = context.getBean(AdminService.class);
    }
    
    public static synchronized AdminServiceSingleton getInstance(ApplicationContext context) {
        if (instance == null) {
            instance = new AdminServiceSingleton(context);
        }
        return instance;
    }
    
    public AdminService getAdminService() {
        return adminService;
    }
}
