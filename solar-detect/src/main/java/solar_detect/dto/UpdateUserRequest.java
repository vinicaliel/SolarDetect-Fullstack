package solar_detect.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String name;
    
    @Email(message = "Email inválido")
    private String email;
    
    private String phone;
    private String address;
}


