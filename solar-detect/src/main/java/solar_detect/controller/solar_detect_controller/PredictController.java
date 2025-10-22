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
import solar_detect.dto.DetectRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PredictController  {

    @GetMapping("/predict")
    public ResponseEntity<byte[]> predict(
        @RequestParam Float lat,
        @RequestParam Float lon
    ) throws IOException {

        String url = String.format(Locale.US,
    "http://localhost:8000/predict?lat=%.6f&lon=%.6f", lat, lon);

        RestTemplate restTemplate = new RestTemplate();
        byte[] imageBytes = restTemplate.getForObject(url, byte[].class);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/predict")
    public ResponseEntity<byte[]> predictPost(@Valid @RequestBody DetectRequest request) {
        Float lat = request.getLat();
        Float lon = request.getLon();
    
        // Chama o backend Python FastAPI via POST com JSON body
        String pythonUrl = "http://localhost:8000/predict";
    
        RestTemplate restTemplate = new RestTemplate();
        byte[] response = restTemplate.postForObject(pythonUrl, request, byte[].class);
    
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        
        return new ResponseEntity<>(response, headers, HttpStatus.OK);
    }
}
