package solar_detect.services;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import solar_detect.exceptions.QuotaExceededException;
import solar_detect.models.RequestLog;
import solar_detect.models.RequestQuota;
import solar_detect.models.User;
import solar_detect.repository.RequestLogRepository;
import solar_detect.repository.RequestQuotaRepository;

@Service
@RequiredArgsConstructor
public class QuotaService {
    private static final int STUDENT_QUOTA = 3;
    private static final int COMPANY_QUOTA = 10;
    private static final int RESET_MINUTES = 5;
    private static final String ROLE_STUDENT = "ROLE_STUDENT";
    private static final String ROLE_COMPANY = "ROLE_COMPANY";

    private final RequestQuotaRepository quotaRepository;
    private final RequestLogRepository logRepository;

    @Transactional
    public void checkAndUpdateQuota(User user, Float latitude, Float longitude) {
        RequestQuota quota = quotaRepository.findByUser(user)
                .orElseGet(() -> createInitialQuota(user));

        LocalDateTime now = LocalDateTime.now();
        if (ChronoUnit.MINUTES.between(quota.getLastResetTime(), now) >= RESET_MINUTES) {
            resetQuota(quota, getUserRole(user));
        } else if (quota.getRemainingRequests() <= 0) {
            throw new QuotaExceededException("Request quota exceeded. Please wait until the quota resets.");
        }

        quota.setRemainingRequests(quota.getRemainingRequests() - 1);
        quotaRepository.save(quota);

        logRepository.save(RequestLog.builder()
                .user(user)
                .requestTime(now)
                .latitude(latitude)
                .longitude(longitude)
                .build());
    }

    private RequestQuota createInitialQuota(User user) {
        return RequestQuota.builder()
                .user(user)
                .remainingRequests(getQuotaForRole(getUserRole(user)))
                .lastResetTime(LocalDateTime.now())
                .build();
    }

    private void resetQuota(RequestQuota quota, String role) {
        quota.setRemainingRequests(getQuotaForRole(role));
        quota.setLastResetTime(LocalDateTime.now());
    }

    private String getUserRole(User user) {
        return user.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElseThrow(() -> new IllegalStateException("User has no roles"));
    }

    private int getQuotaForRole(String role) {
        return role.equals(ROLE_STUDENT) ? STUDENT_QUOTA : COMPANY_QUOTA;
    }
    
    public RequestQuota getQuota(User user) {
        RequestQuota quota = quotaRepository.findByUser(user)
                .orElseGet(() -> createInitialQuota(user));
        
        LocalDateTime now = LocalDateTime.now();
        if (ChronoUnit.MINUTES.between(quota.getLastResetTime(), now) >= RESET_MINUTES) {
            resetQuota(quota, getUserRole(user));
            quotaRepository.save(quota);
        }
        
        return quota;
    }
    
    public int getTotalQuotaForUser(User user) {
        return getQuotaForRole(getUserRole(user));
    }
}