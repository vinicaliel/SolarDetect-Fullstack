package solar_detect.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import solar_detect.models.User;
import lombok.RequiredArgsConstructor;
import solar_detect.dto.AuthResponse;
import solar_detect.dto.LoginRequest;
import solar_detect.dto.RegisterRequest;
import solar_detect.dto.UserUpdateRequest;
import solar_detect.services.AuthService;
import solar_detect.services.UserServices;
import solar_detect.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {
    
        private final UserServices userService;
        private final JwtUtil jwtUtil;
        private final PasswordEncoder passwordEncoder;

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

         // 🔒 Atualizar dados do usuário autenticado
    @PutMapping("/edit")
    public ResponseEntity<?> updateUser(
            @Valid @RequestBody UserUpdateRequest request,
            HttpServletRequest httpRequest) {

        String token = jwtUtil.resolveToken(httpRequest);
        jwtUtil.validateOrThrow(token);

        String email = jwtUtil.extractUsername(token);
        User user = userService.findByEmail(email);


        User updatedUser = userService.updateUser(user, request);
        return ResponseEntity.ok(updatedUser);
    }

    // 🔒 Deletar conta com confirmação de senha
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(
            @Valid @RequestBody UserUpdateRequest request,
            HttpServletRequest httpRequest) {

        String token = jwtUtil.resolveToken(httpRequest);
        jwtUtil.validateOrThrow(token);

        String email = jwtUtil.extractUsername(token);
        User user = userService.findByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(403).body("❌ Senha incorreta. Exclusão não autorizada.");
        }

        userService.deleteUser(user.getId());
        return ResponseEntity.ok("✅ Usuário deletado com sucesso.");
    }

}
