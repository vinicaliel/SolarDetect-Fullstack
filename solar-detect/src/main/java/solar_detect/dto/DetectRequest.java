package solar_detect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DetectRequest {
    @NotNull(message = "lat é obrigatório")
    private Float lat;

    @NotNull(message = "lon é obrigatório")
    private Float lon;
}