package gov.mpin.service;

import gov.mpin.dto.NotificationLogDtos.AgeRangeDataPoint;
import gov.mpin.dto.NotificationLogDtos.ChartDataPoint;
import gov.mpin.dto.NotificationLogDtos.DashboardStatsDto;
import gov.mpin.dto.NotificationLogDtos.MonthlyDataPoint;
import gov.mpin.entity.MissingPersonEntity;
import gov.mpin.enums.CaseStatus;
import gov.mpin.enums.UserRole;
import gov.mpin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardStatsService {

    private final MissingPersonRepository missingPersonRepository;
    private final PoliceStationRepository policeStationRepository;
    private final UserRepository userRepository;
    private final SightingReportRepository sightingReportRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        List<MissingPersonEntity> allCases = missingPersonRepository.findAll();

        long totalMissing = allCases.stream().filter(c -> c.getStatus() == CaseStatus.MISSING || c.getStatus() == CaseStatus.INVESTIGATING).count();
        long totalFound = allCases.stream().filter(c -> c.getStatus() == CaseStatus.FOUND).count();
        long activeCases = allCases.stream().filter(c -> c.getStatus() == CaseStatus.INVESTIGATING).count();
        long closedCases = allCases.stream().filter(c -> c.getStatus() == CaseStatus.CLOSED).count();

        long totalStations = policeStationRepository.count();
        long totalVolunteers = userRepository.countByRole(UserRole.VOLUNTEER);
        long totalReports = sightingReportRepository.count();
        long totalUsers = userRepository.count();

        // State breakdown
        Map<String, Long> stateCounts = allCases.stream()
            .collect(Collectors.groupingBy(MissingPersonEntity::getState, Collectors.counting()));
        List<ChartDataPoint> byState = stateCounts.entrySet().stream()
            .map(e -> ChartDataPoint.builder().name(e.getKey()).value(e.getValue()).build())
            .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
            .collect(Collectors.toList());

        // Gender breakdown
        Map<String, Long> genderCounts = allCases.stream()
            .collect(Collectors.groupingBy(c -> c.getGender().name(), Collectors.counting()));
        List<ChartDataPoint> byGender = genderCounts.entrySet().stream()
            .map(e -> ChartDataPoint.builder().name(e.getKey()).value(e.getValue()).build())
            .collect(Collectors.toList());

        // Age breakdown
        List<AgeRangeDataPoint> byAge = Arrays.asList(
            AgeRangeDataPoint.builder().range("0-12").value(allCases.stream().filter(c -> c.getAge() <= 12).count()).build(),
            AgeRangeDataPoint.builder().range("13-18").value(allCases.stream().filter(c -> c.getAge() >= 13 && c.getAge() <= 18).count()).build(),
            AgeRangeDataPoint.builder().range("19-30").value(allCases.stream().filter(c -> c.getAge() >= 19 && c.getAge() <= 30).count()).build(),
            AgeRangeDataPoint.builder().range("31-50").value(allCases.stream().filter(c -> c.getAge() >= 31 && c.getAge() <= 50).count()).build(),
            AgeRangeDataPoint.builder().range("51+").value(allCases.stream().filter(c -> c.getAge() >= 51).count()).build()
        );

        // Monthly trends
        List<MonthlyDataPoint> monthly = new ArrayList<>();
        Month[] months = new Month[]{Month.JANUARY, Month.FEBRUARY, Month.MARCH, Month.APRIL, Month.MAY, Month.JUNE, Month.JULY, Month.AUGUST};
        for (Month m : months) {
            String monthName = m.getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            long missingCount = allCases.stream().filter(c -> c.getCreatedAt().getMonth() == m).count();
            long foundCount = allCases.stream().filter(c -> c.getStatus() == CaseStatus.FOUND && c.getUpdatedAt().getMonth() == m).count();
            monthly.add(MonthlyDataPoint.builder().month(monthName).missing(missingCount).found(foundCount).build());
        }

        return DashboardStatsDto.builder()
            .totalMissing(totalMissing)
            .totalFound(totalFound)
            .activeCases(activeCases)
            .closedCases(closedCases)
            .totalStations(totalStations)
            .totalVolunteers(totalVolunteers)
            .totalReports(totalReports)
            .totalUsers(totalUsers)
            .byState(byState)
            .byGender(byGender)
            .byAge(byAge)
            .monthly(monthly)
            .build();
    }
}
