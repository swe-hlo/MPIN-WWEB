package gov.mpin.controller;

import gov.mpin.dto.NotificationLogDtos.DashboardStatsDto;
import gov.mpin.service.DashboardStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Analytics & Stats", description = "Dashboard analytics, KPIs, and reporting distributions")
public class StatsController {

    private final DashboardStatsService dashboardStatsService;

    @GetMapping("/stats/dashboard")
    @Operation(summary = "Get comprehensive dashboard statistics and chart analytics")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(dashboardStatsService.getDashboardStats());
    }

    @GetMapping("/public/stats")
    @Operation(summary = "Get public statistics overview")
    public ResponseEntity<DashboardStatsDto> getPublicStats() {
        return ResponseEntity.ok(dashboardStatsService.getDashboardStats());
    }
}
