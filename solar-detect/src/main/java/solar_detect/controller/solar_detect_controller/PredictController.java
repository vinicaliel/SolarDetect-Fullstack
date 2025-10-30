package solar_detect.controller.solar_detect_controller;

import java.util.Locale;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import jakarta.validation.Valid;
import io.jsonwebtoken.io.IOException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import solar_detect.dto.DetectRequest;
import solar_detect.services.QuotaService;
import solar_detect.services.UserServices;
import org.springframework.security.core.context.SecurityContextHolder;
import solar_detect.models.User;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Prediction", description = "Solar detection prediction endpoints")
public class PredictController {
    private final QuotaService quotaService;
    private final UserServices userService;

    public PredictController(QuotaService quotaService, UserServices userService) {
        this.quotaService = quotaService;
        this.userService = userService;
    }

    @GetMapping("/predict")
    @Operation(summary = "Get solar prediction", description = "Get solar panel detection prediction for given coordinates")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved prediction image", content = @Content(mediaType = "image/png"))
    public ResponseEntity<byte[]> predictGet(
            @RequestParam Float lat,
            @RequestParam Float lon) throws IOException {
        // Get current user and check quota
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        quotaService.checkAndUpdateQuota(currentUser, lat, lon);

        String url = String.format(Locale.US,
                "http://fastapi:8000/predict?lat=%.6f&lon=%.6f", lat, lon);

        RestTemplate restTemplate = new RestTemplate();
        byte[] imageBytes = restTemplate.getForObject(url, byte[].class);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/predict/detect")
    @Operation(summary = "Post solar prediction", description = "Get solar panel detection prediction via POST request")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved prediction image", content = @Content(mediaType = "image/png"))
    public ResponseEntity<byte[]> predictPost(@Valid @RequestBody DetectRequest request) {
        // Get current user and check quota
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        quotaService.checkAndUpdateQuota(currentUser, request.getLat(), request.getLon());

        // Call Python FastAPI backend via POST with JSON body
        String pythonUrl = "http://fastapi:8000/predict";

        RestTemplate restTemplate = new RestTemplate();
        byte[] response = restTemplate.postForObject(pythonUrl, request, byte[].class);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        return new ResponseEntity<>(response, headers, HttpStatus.OK);
    }
}
