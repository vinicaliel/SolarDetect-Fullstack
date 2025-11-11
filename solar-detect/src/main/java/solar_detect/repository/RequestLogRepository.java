package solar_detect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import solar_detect.models.RequestLog;

public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
}