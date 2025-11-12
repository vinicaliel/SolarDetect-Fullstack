package solar_detect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String email;
    private String name;
    private String userType;
    private String documentNumber;
    private String phone;
    private String address;
    private QuotaInfo quota;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuotaInfo {
        private int remainingRequests;
        private int totalQuota;
        private LocalDateTime lastResetTime;
        private long minutesUntilReset;
    }
}


