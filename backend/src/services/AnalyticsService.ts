/**
 * Analytics Service
 * Tracks document metrics, user activity, and revenue insights
 */

interface DocumentMetric {
  id: string;
  userId: string;
  documentType: string;
  timestamp: Date;
  duration: number; // seconds to complete
  wordCount: number;
  hasPayment: boolean;
  revenue: number;
  language: string;
}

interface UserActivity {
  userId: string;
  documentsGenerated: number;
  lastActive: Date;
  favoriteDocumentType: string;
  totalRevenue: number;
  avgGenerationTime: number;
}

interface DashboardMetrics {
  overview: {
    totalDocuments: number;
    totalUsers: number;
    totalRevenue: number;
    documentsToday: number;
    documentsThisWeek: number;
    documentsThisMonth: number;
    growthRate: number; // % vs last month
  };
  topDocumentTypes: Array<{
    type: string;
    count: number;
    percentage: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    timestamp: Date;
    userId: string;
    userName: string;
    documentType: string;
    revenue: number;
  }>;
  revenueChart: Array<{
    date: string;
    revenue: number;
    documents: number;
  }>;
  userActivityHeatmap: Array<{
    hour: number;
    day: string;
    count: number;
  }>;
  performanceMetrics: {
    avgGenerationTime: number;
    successRate: number;
    errorRate: number;
  };
}

class AnalyticsService {
  private metrics: Map<string, DocumentMetric> = new Map();
  private userActivity: Map<string, UserActivity> = new Map();

  constructor() {
    console.log('📊 Analytics service initialized');
  }

  /**
   * Track document generation
   */
  trackDocumentGeneration(params: {
    userId: string;
    userName: string;
    documentType: string;
    duration: number;
    wordCount: number;
    hasPayment?: boolean;
    revenue?: number;
    language?: string;
  }): void {
    const metric: DocumentMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: params.userId,
      documentType: params.documentType,
      timestamp: new Date(),
      duration: params.duration,
      wordCount: params.wordCount,
      hasPayment: params.hasPayment || false,
      revenue: params.revenue || 0,
      language: params.language || 'en',
    };

    this.metrics.set(metric.id, metric);

    // Update user activity
    this.updateUserActivity(params.userId, metric, params.userName);

    console.log(`📊 Tracked: ${params.documentType} by ${params.userName} (${params.duration}s)`);
  }

  /**
   * Update user activity
   */
  private updateUserActivity(userId: string, metric: DocumentMetric, userName: string): void {
    let activity = this.userActivity.get(userId);

    if (!activity) {
      activity = {
        userId,
        documentsGenerated: 0,
        lastActive: new Date(),
        favoriteDocumentType: metric.documentType,
        totalRevenue: 0,
        avgGenerationTime: 0,
      };
    }

    activity.documentsGenerated += 1;
    activity.lastActive = new Date();
    activity.totalRevenue += metric.revenue;
    
    // Calculate running average
    const totalDuration = activity.avgGenerationTime * (activity.documentsGenerated - 1) + metric.duration;
    activity.avgGenerationTime = totalDuration / activity.documentsGenerated;

    // Update favorite document type
    const typeCounts = Array.from(this.metrics.values())
      .filter(m => m.userId === userId)
      .reduce((acc, m) => {
        acc[m.documentType] = (acc[m.documentType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    activity.favoriteDocumentType = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || metric.documentType;

    this.userActivity.set(userId, activity);
  }

  /**
   * Get dashboard metrics
   */
  getDashboardMetrics(userId?: string): DashboardMetrics {
    const allMetrics = Array.from(this.metrics.values());
    const userMetrics = userId ? allMetrics.filter(m => m.userId === userId) : allMetrics;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const documentsToday = userMetrics.filter(m => m.timestamp >= today).length;
    const documentsThisWeek = userMetrics.filter(m => m.timestamp >= weekAgo).length;
    const documentsThisMonth = userMetrics.filter(m => m.timestamp >= monthAgo).length;
    const documentsLastMonth = userMetrics.filter(
      m => m.timestamp >= twoMonthsAgo && m.timestamp < monthAgo
    ).length;

    const growthRate = documentsLastMonth > 0
      ? ((documentsThisMonth - documentsLastMonth) / documentsLastMonth) * 100
      : 100;

    const totalRevenue = userMetrics.reduce((sum, m) => sum + m.revenue, 0);

    // Top document types
    const typeCounts = userMetrics.reduce((acc, m) => {
      if (!acc[m.documentType]) {
        acc[m.documentType] = { count: 0, revenue: 0 };
      }
      acc[m.documentType].count += 1;
      acc[m.documentType].revenue += m.revenue;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const topDocumentTypes = Object.entries(typeCounts)
      .map(([type, data]) => ({
        type,
        count: data.count,
        percentage: (data.count / userMetrics.length) * 100,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent activity (last 10)
    const recentActivity = userMetrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
      .map(m => {
        const activity = this.userActivity.get(m.userId);
        return {
          timestamp: m.timestamp,
          userId: m.userId,
          userName: activity ? `User ${m.userId.substring(0, 8)}` : 'Unknown',
          documentType: m.documentType,
          revenue: m.revenue,
        };
      });

    // Revenue chart (last 30 days)
    const revenueByDate = new Map<string, { revenue: number; documents: number }>();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      revenueByDate.set(dateStr, { revenue: 0, documents: 0 });
    }

    userMetrics.forEach(m => {
      const dateStr = m.timestamp.toISOString().split('T')[0];
      const existing = revenueByDate.get(dateStr);
      if (existing) {
        existing.revenue += m.revenue;
        existing.documents += 1;
      }
    });

    const revenueChart = Array.from(revenueByDate.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        documents: data.documents,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // User activity heatmap (hour x day of week)
    const heatmapData = new Map<string, number>();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        heatmapData.set(`${days[day]}-${hour}`, 0);
      }
    }

    userMetrics.forEach(m => {
      const day = days[m.timestamp.getDay()];
      const hour = m.timestamp.getHours();
      const key = `${day}-${hour}`;
      heatmapData.set(key, (heatmapData.get(key) || 0) + 1);
    });

    const userActivityHeatmap = Array.from(heatmapData.entries()).map(([key, count]) => {
      const [day, hourStr] = key.split('-');
      return {
        hour: parseInt(hourStr),
        day,
        count,
      };
    });

    // Performance metrics
    const avgGenerationTime = userMetrics.reduce((sum, m) => sum + m.duration, 0) / userMetrics.length || 0;
    const successRate = 100; // Assuming all tracked documents are successful
    const errorRate = 0;

    return {
      overview: {
        totalDocuments: userMetrics.length,
        totalUsers: new Set(userMetrics.map(m => m.userId)).size,
        totalRevenue,
        documentsToday,
        documentsThisWeek,
        documentsThisMonth,
        growthRate,
      },
      topDocumentTypes,
      recentActivity,
      revenueChart,
      userActivityHeatmap,
      performanceMetrics: {
        avgGenerationTime,
        successRate,
        errorRate,
      },
    };
  }

  /**
   * Get user-specific analytics
   */
  getUserAnalytics(userId: string): {
    activity: UserActivity | null;
    documentHistory: DocumentMetric[];
    insights: {
      mostProductiveHour: number;
      mostProductiveDay: string;
      avgWordsPerDocument: number;
      totalTimeSpent: number;
      favoriteLanguage: string;
    };
  } {
    const activity = this.userActivity.get(userId);
    const documentHistory = Array.from(this.metrics.values())
      .filter(m => m.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Calculate insights
    const hourCounts = new Map<number, number>();
    const dayCounts = new Map<string, number>();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let totalWords = 0;
    let totalTime = 0;
    const languageCounts = new Map<string, number>();

    documentHistory.forEach(m => {
      const hour = m.timestamp.getHours();
      const day = days[m.timestamp.getDay()];
      
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
      
      totalWords += m.wordCount;
      totalTime += m.duration;
      
      languageCounts.set(m.language, (languageCounts.get(m.language) || 0) + 1);
    });

    const mostProductiveHour = Array.from(hourCounts.entries())
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 9;

    const mostProductiveDay = Array.from(dayCounts.entries())
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Monday';

    const avgWordsPerDocument = documentHistory.length > 0 ? totalWords / documentHistory.length : 0;

    const favoriteLanguage = Array.from(languageCounts.entries())
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'en';

    return {
      activity: activity || null,
      documentHistory,
      insights: {
        mostProductiveHour,
        mostProductiveDay,
        avgWordsPerDocument,
        totalTimeSpent: totalTime,
        favoriteLanguage,
      },
    };
  }

  /**
   * Get real-time stats (for live dashboard)
   */
  getRealTimeStats(): {
    documentsLast24h: number;
    activeUsersLast24h: number;
    revenueLast24h: number;
    avgGenerationTimeLast24h: number;
  } {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMetrics = Array.from(this.metrics.values())
      .filter(m => m.timestamp >= last24h);

    const documentsLast24h = recentMetrics.length;
    const activeUsersLast24h = new Set(recentMetrics.map(m => m.userId)).size;
    const revenueLast24h = recentMetrics.reduce((sum, m) => sum + m.revenue, 0);
    const avgGenerationTimeLast24h = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / documentsLast24h || 0;

    return {
      documentsLast24h,
      activeUsersLast24h,
      revenueLast24h,
      avgGenerationTimeLast24h,
    };
  }

  /**
   * Export analytics data
   */
  exportAnalytics(userId?: string, format: 'json' | 'csv' = 'json'): string {
    const metrics = userId
      ? Array.from(this.metrics.values()).filter(m => m.userId === userId)
      : Array.from(this.metrics.values());

    if (format === 'json') {
      return JSON.stringify(metrics, null, 2);
    } else {
      // CSV format
      const headers = ['ID', 'User ID', 'Document Type', 'Timestamp', 'Duration', 'Word Count', 'Revenue', 'Language'];
      const rows = metrics.map(m => [
        m.id,
        m.userId,
        m.documentType,
        m.timestamp.toISOString(),
        m.duration.toString(),
        m.wordCount.toString(),
        m.revenue.toString(),
        m.language,
      ]);

      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }

  /**
   * Clear old metrics (keep last 90 days)
   */
  cleanupOldMetrics(): number {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    let removed = 0;

    for (const [id, metric] of this.metrics.entries()) {
      if (metric.timestamp < ninetyDaysAgo) {
        this.metrics.delete(id);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} old metrics`);
    }

    return removed;
  }
}

export default AnalyticsService;
