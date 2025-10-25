package solar_detect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DetectRequest {
    @NotNull(message = "lat é obrigatória")
    private Float lat;

    @NotNull(message = "lon é obrigatória")
    private Float lon;
}