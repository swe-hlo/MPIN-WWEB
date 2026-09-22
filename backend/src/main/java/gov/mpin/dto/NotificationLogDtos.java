package gov.mpin.dto;

import gov.mpin.enums.LogLevel;
import gov.mpin.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class NotificationLogDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationDto {
        private String id;
        private String userId;
        private NotificationType type;
        private String title;
        private String message;
        private String caseId;
        private boolean read;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SystemLogDto {
        private String id;
        private String userId;
        private String userName;
        private String action;
        private String entity;
        private String entityId;
        private LogLevel level;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChartDataPoint {
        private String name;
        private long value;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AgeRangeDataPoint {
        private String range;
        private long value;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyDataPoint {
        private String month;
        private long missing;
        private long found;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardStatsDto {
        private long totalMissing;
        private long totalFound;
        private long activeCases;
        private long closedCases;
        private long totalStations;
        private long totalVolunteers;
        private long totalReports;
        private long totalUsers;
        private List<ChartDataPoint> byState;
        private List<ChartDataPoint> byGender;
        private List<AgeRangeDataPoint> byAge;
        private List<MonthlyDataPoint> monthly;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PageResponse<T> {
        private List<T> content;
        private long totalElements;
        private int page;
        private int size;
        private int totalPages;
    }
}
