import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { BatchNotification } from '@/types';
import classnames from 'classnames';
import dayjs from 'dayjs';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

type FilterType = 'all' | 'pending' | 'pushed';

const BatchNotifyPage: React.FC = () => {
  const { role, filteredNotifications: storeFilteredNotifications, pushNotification, credentials } = useAppStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待推送' },
    { key: 'pushed', label: '已推送' }
  ];

  const filteredNotifications = storeFilteredNotifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !n.isPushed;
    return n.isPushed;
  });

  const handlePush = (notif: BatchNotification) => {
    const affectedCredentials = credentials.filter(c => c.batchNumber === notif.batchNumber);

    Taro.showModal({
      title: '确认推送复查提醒',
      content: `将向${affectedCredentials.length}位使用批号${notif.batchNumber}的患者推送复查提醒。提醒内容将强调联系诊所，不会制造恐慌。`,
      success: (res) => {
        if (res.confirm) {
          pushNotification(notif.id);
          console.info('[BatchNotify] Pushed notification:', notif.id, 'affected patients:', affectedCredentials.length);
          Taro.showToast({ title: '提醒已推送', icon: 'success' });
        }
      }
    });
  };

  const handleContact = () => {
    Taro.makePhoneCall({
      phoneNumber: '02155551234'
    }).catch(() => {
      console.error('[BatchNotify] Phone call failed');
      Taro.showModal({
        title: '联系诊所',
        content: '诊所电话：021-5555-1234\n诊所名称：仁爱口腔门诊部',
        showCancel: false
      });
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.filterBar}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(
              styles.filterTab,
              filter === f.key && styles.filterTabActive
            )}
            onClick={() => setFilter(f.key)}
          >
            <Text className={styles.filterTabText}>{f.label}</Text>
          </View>
        ))}
      </View>

      {filteredNotifications.length > 0 ? (
        filteredNotifications.map(notif => (
          <View
            key={notif.id}
            className={classnames(
              styles.notifyCard,
              notif.isPushed && styles.notifyCardPushed
            )}
          >
            <View className={styles.notifyHeader}>
              <Text className={styles.notifyBrand}>{notif.brand}</Text>
              <View className={classnames(
                styles.notifyStatus,
                notif.isPushed ? styles.statusPushed : styles.statusPending
              )}>
                <Text className={styles.notifyStatusText}>
                  {notif.isPushed ? '已推送' : '待推送'}
                </Text>
              </View>
            </View>

            <View className={styles.notifyInfo}>
              <Text className={styles.notifyBatch}>批号：{notif.batchNumber}</Text>
              <Text className={styles.notifySupplier}>供应商：{notif.supplierName}</Text>
              <Text className={styles.notifyDate}>通知日期：{notif.noticeDate}</Text>
            </View>

            <View className={styles.notifyContent}>
              <Text className={styles.notifyContentText}>{notif.noticeContent}</Text>
            </View>

            {notif.isPushed && notif.pushedPatients && notif.pushedPatients.length > 0 && (
              <View className={styles.pushedPatientsSection}>
                <Text className={styles.pushedPatientsTitle}>
                  已推送患者（{notif.pushedPatients.length}人）
                </Text>
                <View className={styles.pushedPatientsList}>
                  {notif.pushedPatients.map(p => (
                    <View key={p.credentialId} className={styles.pushedPatientItem}>
                      <View className={styles.patientInfo}>
                        <Text className={styles.patientName}>{p.patientName}</Text>
                        <Text className={styles.patientPhone}>{p.patientPhone}</Text>
                      </View>
                      <View className={styles.pushStatus}>
                        <Text className={styles.pushStatusIcon}>✓</Text>
                        <Text className={styles.pushStatusText}>
                          {dayjs(p.pushedAt).format('MM-DD HH:mm')}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className={styles.notifyFooter}>
              {role === 'clinic' ? (
                <>
                  <Text className={styles.affectedCount}>
                    涉及患者：{notif.affectedPatientCount}人
                  </Text>
                  <View
                    className={classnames(
                      styles.pushBtn,
                      notif.isPushed && styles.pushBtnDisabled
                    )}
                    onClick={() => {
                      if (!notif.isPushed) handlePush(notif);
                    }}
                  >
                    <Text className={styles.pushBtnText}>
                      {notif.isPushed ? '已推送' : '推送提醒'}
                    </Text>
                  </View>
                </>
              ) : (
                <View className={styles.patientContactBtn} onClick={handleContact}>
                  <Text className={styles.patientContactBtnText}>联系诊所安排复查</Text>
                </View>
              )}
            </View>
          </View>
        ))
      ) : (
        <EmptyState
          title={role === 'clinic' ? '暂无通知' : '暂无复查提醒'}
          description={role === 'clinic' ? '当前没有批号通知记录' : '您目前没有复查提醒，如有需要可联系诊所咨询'}
        />
      )}

      {role === 'clinic' && (
        <View className={styles.reminderPreview}>
          <Text className={styles.reminderLabel}>患者将收到的提醒内容示例：</Text>
          <Text className={styles.reminderContent}>
            【复查提醒】您好，您植入的种植体材料供应商已发布产品信息更新通知。为保障您的口腔健康，建议您近期联系诊所安排一次常规复查。如有任何疑问，请致电诊所咨询，医生将为您详细解答。无需担忧，定期复查是种植术后正常护理环节。
          </Text>
        </View>
      )}
    </View>
  );
};

export default BatchNotifyPage;
