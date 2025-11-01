package solar_detect.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import solar_detect.models.RequestQuota;
import solar_detect.models.User;

public interface RequestQuotaRepository extends JpaRepository<RequestQuota, Long> {
    Optional<RequestQuota> findByUser(User user);
}