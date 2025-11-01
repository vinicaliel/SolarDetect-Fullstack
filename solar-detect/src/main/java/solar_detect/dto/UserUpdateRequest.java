package solar_detect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateRequest {
    
    private String name;
    private String phone;
    private String address;
    
    @NotBlank(message = "Senha atual é obrigatória para confirmar a edição")
    private String currentPassword; // Confirmação de identidade
}
