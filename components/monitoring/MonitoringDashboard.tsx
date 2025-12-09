// goalkicklive/components/monitoring/MonitoringDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Cpu,
  Server,
  Users,
} from "lucide-react";
import useRTL from "@/hooks/useRTL";

interface MonitoringStats {
  webVitals: {
    CLS: number;
    FID: number;
    LCP: number;
    FCP: number;
    TTFB: number;
    INP: number;
  };
  performance: {
    pageLoadTime: number;
    firstPaint: number;
    domContentLoaded: number;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    last24h: number;
  };
  traffic: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
  };
  system: {
    memoryUsage: number;
    cpuUsage: number;
    uptime: number;
  };
}

interface MonitoringDashboardProps {
  refreshInterval?: number;
  locale: string;
}

export default function MonitoringDashboard({
  refreshInterval = 30000,
}: MonitoringDashboardProps) {
  const { isRTL, direction } = useRTL();
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/monitoring/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch monitoring data");
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching monitoring data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();

    const interval = setInterval(fetchMonitoringData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getVitalRating = (
    value: number,
    thresholds: { good: number; poor: number },
  ) => {
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.poor) return "needs-improvement";
    return "poor";
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "text-green-600 bg-green-100";
      case "needs-improvement":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" dir={direction}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" dir={direction}>
        <div className="text-center text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isRTL ? "خطأ في المراقبة" : "Monitoring Error"}
          </h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" dir={direction}>
        <div className="text-center text-gray-500">
          <Server className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">
            {isRTL ? "لا توجد بيانات متاحة" : "No data available"}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? "لوحة التحكم" : "Monitoring Dashboard"}
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          {isRTL ? "تحديث تلقائي كل 30 ثانية" : "Auto-refresh every 30s"}
        </div>
      </div>

      {/* Web Vitals Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          {isRTL ? "مقاييس الويب الأساسية" : "Core Web Vitals"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              key: "LCP",
              value: stats.webVitals.LCP,
              thresholds: { good: 2500, poor: 4000 },
              label: "LCP",
            },
            {
              key: "FID",
              value: stats.webVitals.FID,
              thresholds: { good: 100, poor: 300 },
              label: "FID",
            },
            {
              key: "CLS",
              value: stats.webVitals.CLS,
              thresholds: { good: 0.1, poor: 0.25 },
              label: "CLS",
            },
            {
              key: "FCP",
              value: stats.webVitals.FCP,
              thresholds: { good: 1800, poor: 3000 },
              label: "FCP",
            },
            {
              key: "TTFB",
              value: stats.webVitals.TTFB,
              thresholds: { good: 800, poor: 1800 },
              label: "TTFB",
            },
            {
              key: "INP",
              value: stats.webVitals.INP,
              thresholds: { good: 200, poor: 500 },
              label: "INP",
            },
          ].map(({ key, value, thresholds, label }) => {
            const rating = getVitalRating(value, thresholds);
            return (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getRatingColor(rating)}`}
                  >
                    {rating.replace("-", " ")}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {value.toFixed(1)}
                  {key === "CLS" ? "" : "ms"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Cpu className="h-5 w-5 mr-2" />
          {isRTL ? "أداء التطبيق" : "Application Performance"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "وقت تحميل الصفحة" : "Page Load Time"}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.performance.pageLoadTime}ms
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "الرسم الأول" : "First Paint"}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.performance.firstPaint}ms
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "تحميل المحتوى" : "DOM Content Loaded"}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.performance.domContentLoaded}ms
            </div>
          </div>
        </div>
      </div>

      {/* Traffic & Errors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Traffic Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {isRTL ? "حركة المرور" : "Traffic"}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {isRTL ? "مشاهدات الصفحة" : "Page Views"}
              </span>
              <span className="font-medium">{stats.traffic.pageViews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {isRTL ? "زوار فريدون" : "Unique Visitors"}
              </span>
              <span className="font-medium">
                {stats.traffic.uniqueVisitors}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {isRTL ? "معدل الارتداد" : "Bounce Rate"}
              </span>
              <span className="font-medium">{stats.traffic.bounceRate}%</span>
            </div>
          </div>
        </div>

        {/* Error Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {isRTL ? "الأخطاء" : "Errors"}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {isRTL ? "إجمالي الأخطاء" : "Total Errors"}
              </span>
              <span className="font-medium text-red-600">
                {stats.errors.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {isRTL ? "آخر 24 ساعة" : "Last 24h"}
              </span>
              <span className="font-medium">{stats.errors.last24h}</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Server className="h-5 w-5 mr-2" />
          {isRTL ? "صحة النظام" : "System Health"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "استخدام الذاكرة" : "Memory Usage"}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.system.memoryUsage}%
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "استخدام المعالج" : "CPU Usage"}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.system.cpuUsage}%
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "مدة التشغيل" : "Uptime"}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatUptime(stats.system.uptime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
