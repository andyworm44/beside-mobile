import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

interface StatisticsChartProps {
  signalData: number[];
  accompanyData: number[];
  timeLabels: string[];
}

export default function StatisticsChart({ signalData, accompanyData, timeLabels }: StatisticsChartProps) {
  const [selectedTab, setSelectedTab] = useState<'signals' | 'accompany'>('signals');
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');

  const periods = [
    { key: 'today', label: '今日' },
    { key: 'week', label: '最近7天' },
    { key: 'month', label: '本月' },
    { key: 'year', label: '全年' },
  ];

  const getCurrentData = () => {
    return selectedTab === 'signals' ? signalData : accompanyData;
  };

  const getStatistics = () => {
    const data = getCurrentData();
    const total = data.reduce((sum, value) => sum + value, 0);
    const average = data.length > 0 ? (total / data.length).toFixed(1) : '0';
    const highest = Math.max(...data);
    const lowest = Math.min(...data);

    return { total, average, highest, lowest };
  };

  const renderSimpleChart = () => {
    const data = getCurrentData();
    const maxValue = Math.max(...data, 1);
    
    return (
      <View style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          {data.map((value, index) => {
            const height = (value / maxValue) * 100;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${height}%`,
                        backgroundColor: selectedTab === 'signals' ? '#FF6B6B' : '#4ECDC4',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{timeLabels[index]}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const statistics = getStatistics();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>統計圖表</Text>
        <Text style={styles.subtitle}>統計週期 • {new Date().toLocaleDateString('zh-TW')}</Text>
      </View>

      {/* Period Tabs */}
      <View style={styles.periodTabs}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodTab,
              selectedPeriod === period.key && styles.periodTabActive,
            ]}
            onPress={() => setSelectedPeriod(period.key as any)}
          >
            <Text
              style={[
                styles.periodTabText,
                selectedPeriod === period.key && styles.periodTabTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Type Tabs */}
      <View style={styles.chartTabs}>
        <TouchableOpacity
          style={[
            styles.chartTab,
            selectedTab === 'signals' && styles.chartTabActive,
          ]}
          onPress={() => setSelectedTab('signals')}
        >
          <Ionicons 
            name="send" 
            size={16} 
            color={selectedTab === 'signals' ? '#FF6B6B' : '#999'} 
          />
          <Text
            style={[
              styles.chartTabText,
              selectedTab === 'signals' && styles.chartTabTextActive,
            ]}
          >
            發出訊號
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.chartTab,
            selectedTab === 'accompany' && styles.chartTabActive,
          ]}
          onPress={() => setSelectedTab('accompany')}
        >
          <Ionicons 
            name="heart" 
            size={16} 
            color={selectedTab === 'accompany' ? '#4ECDC4' : '#999'} 
          />
          <Text
            style={[
              styles.chartTabText,
              selectedTab === 'accompany' && styles.chartTabTextActive,
            ]}
          >
            陪伴他人
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>
          {selectedTab === 'signals' ? '發出訊號趨勢' : '陪伴他人趨勢'}
        </Text>
        {renderSimpleChart()}
      </View>

      {/* Statistics Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>統計摘要</Text>
        <Text style={styles.summaryDate}>{new Date().toLocaleDateString('zh-TW')}</Text>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="hand-left" size={20} color="#FF6B6B" />
            </View>
            <Text style={styles.summaryLabel}>總次數</Text>
            <Text style={styles.summaryValue}>{statistics.total}</Text>
            <Text style={styles.summarySubtext}>本週期總共發生次數</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="bar-chart" size={20} color="#4ECDC4" />
            </View>
            <Text style={styles.summaryLabel}>平均</Text>
            <Text style={styles.summaryValue}>{statistics.average}</Text>
            <Text style={styles.summarySubtext}>每個時間點平均次數</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-up" size={20} color="#FF6B6B" />
            </View>
            <Text style={styles.summaryLabel}>最高</Text>
            <Text style={styles.summaryValue}>{statistics.highest}</Text>
            <Text style={styles.summarySubtext}>單一時間點最高發生次數</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-down" size={20} color="#4ECDC4" />
            </View>
            <Text style={styles.summaryLabel}>最低</Text>
            <Text style={styles.summaryValue}>{statistics.lowest}</Text>
            <Text style={styles.summarySubtext}>單一時間點最低發生次數</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  periodTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  periodTabActive: {
    backgroundColor: '#FF6B6B',
  },
  periodTabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  periodTabTextActive: {
    color: '#fff',
  },
  chartTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#333',
    gap: 6,
  },
  chartTabActive: {
    backgroundColor: '#FF6B6B20',
  },
  chartTabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  chartTabTextActive: {
    color: '#FF6B6B',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  chartWrapper: {
    height: 200,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  barWrapper: {
    height: '80%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    borderRadius: 2,
    minHeight: 2,
  },
  barLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  summaryDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    width: (screenWidth - 50) / 2,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
});
