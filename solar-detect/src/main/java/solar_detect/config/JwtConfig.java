package solar_detect.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {
    
    private String secret = "mySecretKey12345678901234567890123456789012345678901234567890";
    private int expiration = 20 * 1000; // 24 horas em millisegundos
    private String header = "Authorization";
    private String prefix = "Bearer ";
    
    public String getHeaderPrefix() {
        return prefix;
    }
}