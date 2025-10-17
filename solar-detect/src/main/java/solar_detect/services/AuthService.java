package solar_detect.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import solar_detect.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import solar_detect.dto.AuthResponse;
import solar_detect.dto.LoginRequest;
import solar_detect.dto.RegisterRequest;
import solar_detect.models.User;
import solar_detect.util.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserServices userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user);
            
            return new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getName(),
                    user.getUserType().name(),
                    user.getId()
            );
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Email ou senha incorretos");
        }
    }
    
    public AuthResponse register(RegisterRequest request) {
        User user = userService.registerUser(request);
        String token = jwtUtil.generateToken(user);
        
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getUserType().name(),
                user.getId()
        );
    }
}
