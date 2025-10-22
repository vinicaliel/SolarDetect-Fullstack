package solar_detect.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import lombok.RequiredArgsConstructor;
import solar_detect.dto.AuthResponse;
import solar_detect.dto.LoginRequest;
import solar_detect.dto.RegisterRequest;
import solar_detect.services.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

private final AuthService authService;

     @PostMapping("/login")
     public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request){

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);

     }

     @PostMapping("/register")
     public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request){

        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
     }

     @PostMapping("/register/student")
     public ResponseEntity<AuthResponse> RegisterStudent(@Valid @RequestBody RegisterRequest request){
        request.setUserType(solar_detect.models.User.UserType.STUDENT);
        return register(request);

     }

     @PostMapping("/register/company")
     public ResponseEntity<AuthResponse> RegisterCompany(@Valid @RequestBody RegisterRequest request){
        request.setUserType(solar_detect.models.User.UserType.COMPANY);
        return register(request);

     }

}
