package solar_detect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private String email;
    private String name;
    private String userType;
    private Long userId;
    
    public AuthResponse(String token, String email, String name, String userType, Long userId) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.userType = userType;
        this.userId = userId;
    }
}
