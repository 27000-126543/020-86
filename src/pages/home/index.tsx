import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import SectionHeader from '@/components/SectionHeader';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const {
    role,
    currentPatientName,
    filteredCredentials,
    filteredNotifications,
    notifications
  } = useAppStore();

  const displayCredentials = filteredCredentials.slice(0, 3);
  const unpushedNotifications = role === 'clinic'
    ? notifications.filter(n => !n.isPushed)
    : filteredNotifications;
  const confirmedCount = filteredCredentials.filter(c => c.status === 'confirmed').length;
  const pendingCount = filteredCredentials.filter(c => c.status === 'pending').length;

  const handleCredentialClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/credentialDetail/index?id=${id}` });
  };

  const handleRecordCredential = () => {
    Taro.navigateTo({ url: '/pages/selectAppointment/index' });
  };

  const handleBatchNotify = () => {
    Taro.navigateTo({ url: '/pages/batchNotify/index' });
  };

  const handleViewAllCredentials = () => {
    Taro.switchTab({ url: '/pages/credential/index' });
  };

  const handleViewNotifications = () => {
    Taro.navigateTo({ url: '/pages/batchNotify/index' });
  };

  const hasNotificationForPatient = role === 'patient' && filteredNotifications.length > 0;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.greeting}>
          {role === 'patient' ? `您好，${currentPatientName}` : '您好，医护'}
        </Text>
        <Text className={styles.greetingSub}>
          {role === 'patient' ? '查看您的种植体材料凭证' : '管理种植体凭证与批号通知'}
        </Text>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{confirmedCount}</Text>
            <Text className={styles.statLabel}>已确认凭证</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{pendingCount}</Text>
            <Text className={styles.statLabel}>待确认凭证</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{unpushedNotifications.length}</Text>
            <Text className={styles.statLabel}>待处理通知</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        {role === 'clinic' && (
          <View className={styles.quickActions}>
            <View className={styles.quickAction} onClick={handleRecordCredential}>
              <Text className={styles.quickActionIcon}>📝</Text>
              <Text className={styles.quickActionText}>录入凭证</Text>
            </View>
            <View className={styles.quickAction} onClick={handleBatchNotify}>
              <Text className={styles.quickActionIcon}>🔔</Text>
              <Text className={styles.quickActionText}>批号通知</Text>
            </View>
            <View className={styles.quickAction} onClick={handleViewAllCredentials}>
              <Text className={styles.quickActionIcon}>📋</Text>
              <Text className={styles.quickActionText}>全部凭证</Text>
            </View>
          </View>
        )}

        {(role === 'clinic' && unpushedNotifications.length > 0) && (
          <View className={styles.notificationBanner} onClick={handleViewNotifications}>
            <Text className={styles.notificationIcon}>⚠️</Text>
            <View className={styles.notificationContent}>
              <Text className={styles.notificationTitle}>
                您有{unpushedNotifications.length}条批号通知待处理
              </Text>
              <Text className={styles.notificationDesc}>
                请及时向患者推送复查提醒
              </Text>
            </View>
            <Text className={styles.notificationArrow}>›</Text>
          </View>
        )}

        {hasNotificationForPatient && (
          <View className={styles.notificationBanner} onClick={handleViewNotifications}>
            <Text className={styles.notificationIcon}>📋</Text>
            <View className={styles.notificationContent}>
              <Text className={styles.notificationTitle}>
                您有{filteredNotifications.length}条复查提醒
              </Text>
              <Text className={styles.notificationDesc}>
                请联系诊所安排常规复查
              </Text>
            </View>
            <Text className={styles.notificationArrow}>›</Text>
          </View>
        )}

        <View className={styles.recentSection}>
          <SectionHeader
            title="最近凭证"
            actionText="查看全部"
            onAction={handleViewAllCredentials}
          />
          <View className={styles.credentialList}>
            {displayCredentials.map(cred => (
              <View
                key={cred.id}
                className={styles.credentialItem}
                onClick={() => handleCredentialClick(cred.id)}
              >
                <View className={styles.credentialItemHeader}>
                  <Text className={styles.credentialBrand}>{cred.brand}</Text>
                  <View className={`${styles.credentialBadge} ${cred.status === 'confirmed' ? styles.badgeConfirmed : styles.badgePending}`}>
                    <Text className={styles.badgeText}>
                      {cred.status === 'confirmed' ? '已确认' : '待确认'}
                    </Text>
                  </View>
                </View>
                <View className={styles.credentialItemInfo}>
                  <Text className={styles.credentialInfoTag}>
                    牙位：{cred.toothPosition}
                  </Text>
                  <Text className={styles.credentialInfoDate}>
                    {cred.implantDate}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
