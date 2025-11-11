package solar_detect.controller;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import solar_detect.dto.UpdateUserRequest;
import solar_detect.dto.UserProfileResponse;
import solar_detect.exceptions.ResourceNotFoundException;
import solar_detect.models.RequestQuota;
import solar_detect.models.User;
import solar_detect.repository.UserRepository;
import solar_detect.services.QuotaService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "User", description = "User profile and quota management endpoints")
public class UserController {
    
    private final QuotaService quotaService;
    private final UserRepository userRepository;
    
    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Get current user profile information and quota")
    public ResponseEntity<UserProfileResponse> getProfile() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        RequestQuota quota = quotaService.getQuota(user);
        int totalQuota = quotaService.getTotalQuotaForUser(user);
        
        LocalDateTime now = LocalDateTime.now();
        long minutesUntilReset = Math.max(0, 
            5 - ChronoUnit.MINUTES.between(quota.getLastResetTime(), now));
        
        UserProfileResponse.QuotaInfo quotaInfo = UserProfileResponse.QuotaInfo.builder()
                .remainingRequests(quota.getRemainingRequests())
                .totalQuota(totalQuota)
                .lastResetTime(quota.getLastResetTime())
                .minutesUntilReset(minutesUntilReset)
                .build();
        
        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .userType(user.getUserType().name())
                .documentNumber(user.getDocumentNumber())
                .phone(user.getPhone())
                .address(user.getAddress())
                .quota(quotaInfo)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update current user profile information")
    public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody UpdateUserRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            // Verifica se o email já está em uso por outro usuário
            if (!user.getEmail().equals(request.getEmail()) && 
                userRepository.existsByEmail(request.getEmail())) {
                throw new solar_detect.exceptions.BusinessException("Email já está em uso");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
        user = userRepository.save(user);
        
        RequestQuota quota = quotaService.getQuota(user);
        int totalQuota = quotaService.getTotalQuotaForUser(user);
        
        LocalDateTime now = LocalDateTime.now();
        long minutesUntilReset = Math.max(0, 
            5 - ChronoUnit.MINUTES.between(quota.getLastResetTime(), now));
        
        UserProfileResponse.QuotaInfo quotaInfo = UserProfileResponse.QuotaInfo.builder()
                .remainingRequests(quota.getRemainingRequests())
                .totalQuota(totalQuota)
                .lastResetTime(quota.getLastResetTime())
                .minutesUntilReset(minutesUntilReset)
                .build();
        
        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .userType(user.getUserType().name())
                .documentNumber(user.getDocumentNumber())
                .phone(user.getPhone())
                .address(user.getAddress())
                .quota(quotaInfo)
                .build();
        
        return ResponseEntity.ok(response);
    }
}

