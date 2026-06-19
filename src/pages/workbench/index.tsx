import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

const WorkbenchPage: React.FC = () => {
  const {
    role,
    currentPatientName,
    credentials,
    notifications,
    filteredCredentials,
    filteredNotifications,
    setRole,
    pushNotification
  } = useAppStore();

  const unpushedNotifications = role === 'clinic'
    ? notifications.filter(n => !n.isPushed)
    : [];
  const statsCredentials = role === 'clinic' ? credentials : filteredCredentials;
  const confirmedCount = statsCredentials.filter(c => c.status === 'confirmed').length;
  const totalCount = statsCredentials.length;

  const handleSwitchRole = () => {
    const newRole = role === 'clinic' ? 'patient' : 'clinic';
    setRole(newRole);
    Taro.showToast({
      title: newRole === 'clinic' ? '已切换到诊所模式' : '已切换到患者模式',
      icon: 'none'
    });
  };

  const handleRecordCredential = () => {
    Taro.navigateTo({ url: '/pages/selectAppointment/index' });
  };

  const handleBatchNotify = () => {
    Taro.navigateTo({ url: '/pages/batchNotify/index' });
  };

  const handlePushNotification = (id: string) => {
    Taro.showModal({
      title: '推送复查提醒',
      content: '确认向该批号对应的患者推送复查提醒吗？提醒内容将强调联系诊所，不会引起恐慌。',
      success: (res) => {
        if (res.confirm) {
          pushNotification(id);
          Taro.showToast({ title: '提醒已推送', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.roleBanner}>
        <View className={styles.roleInfo}>
          <Text className={styles.roleTitle}>
            当前：{role === 'clinic' ? '诊所模式' : '患者模式'}
          </Text>
          <Text className={styles.roleDesc}>
            {role === 'clinic' ? '可录入凭证、管理批号通知' : '查看个人种植体凭证'}
          </Text>
        </View>
        <View className={styles.switchBtn} onClick={handleSwitchRole}>
          <Text className={styles.switchBtnText}>切换身份</Text>
        </View>
      </View>

      {role === 'clinic' && (
        <>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{totalCount}</Text>
              <Text className={styles.statDesc}>凭证总数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{confirmedCount}</Text>
              <Text className={styles.statDesc}>已确认</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{unpushedNotifications.length}</Text>
              <Text className={styles.statDesc}>待处理通知</Text>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>快捷操作</Text>
            <View className={styles.actionGrid}>
              <View className={styles.actionCard} onClick={handleRecordCredential}>
                <Text className={styles.actionIcon}>📝</Text>
                <Text className={styles.actionTitle}>录入凭证</Text>
                <Text className={styles.actionDesc}>扫描批号，填写植入信息</Text>
              </View>
              <View className={styles.actionCard} onClick={handleBatchNotify}>
                <Text className={styles.actionIcon}>🔔</Text>
                <Text className={styles.actionTitle}>批号通知</Text>
                <Text className={styles.actionDesc}>推送复查提醒给患者</Text>
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <SectionHeader
              title="待处理批号通知"
              actionText="查看全部"
              onAction={handleBatchNotify}
            />
            {unpushedNotifications.length > 0 ? (
              unpushedNotifications.slice(0, 3).map(notif => (
                <View key={notif.id} className={styles.notifyCard}>
                  <View className={styles.notifyHeader}>
                    <Text className={styles.notifyBrand}>{notif.brand}</Text>
                    <View className={styles.notifyBadge}>
                      <Text className={styles.notifyBadgeText}>待推送</Text>
                    </View>
                  </View>
                  <Text className={styles.notifyBatch}>批号：{notif.batchNumber}</Text>
                  <Text className={styles.notifyDate}>通知日期：{notif.noticeDate}</Text>
                  <View className={styles.notifyAction}>
                    <View className={styles.notifyBtn} onClick={() => handlePushNotification(notif.id)}>
                      <Text className={styles.notifyBtnText}>推送提醒</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <EmptyState
                title="暂无待处理通知"
                description="所有批号通知均已处理"
              />
            )}
          </View>
        </>
      )}

      {role === 'patient' && (
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentPatientName}</Text>
            <Text className={styles.statDesc}>当前患者</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{filteredCredentials.length}</Text>
            <Text className={styles.statDesc}>我的凭证</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{filteredNotifications.length}</Text>
            <Text className={styles.statDesc}>复查提醒</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default WorkbenchPage;
