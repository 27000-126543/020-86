import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import classnames from 'classnames';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

const statusMap = {
  waiting: '待就诊',
  in_progress: '就诊中',
  completed: '已完成'
};

const SelectAppointmentPage: React.FC = () => {
  const { appointments } = useAppStore();
  const [searchKey, setSearchKey] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    if (!searchKey.trim()) return true;
    const key = searchKey.trim().toLowerCase();
    return apt.patientName.includes(key) || apt.patientPhone.includes(key);
  });

  const handleSelectAppointment = (id: string) => {
    Taro.navigateTo({
      url: `/pages/recordCredential/index?appointmentId=${id}`
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.searchBox}>
        <Input
          className={styles.searchInput}
          placeholder="搜索患者姓名或手机号"
          value={searchKey}
          onInput={e => setSearchKey(e.detail.value)}
        />
      </View>

      <Text className={styles.sectionTitle}>
        预约记录（{filteredAppointments.length}）
      </Text>

      {filteredAppointments.length > 0 ? (
        filteredAppointments.map(apt => (
          <View
            key={apt.id}
            className={styles.appointmentCard}
            onClick={() => handleSelectAppointment(apt.id)}
          >
            <View className={styles.appointmentHeader}>
              <Text className={styles.patientName}>{apt.patientName}</Text>
              <View className={classnames(
                styles.appointmentStatus,
                apt.status === 'waiting' && styles.statusWaiting,
                apt.status === 'in_progress' && styles.statusInProgress,
                apt.status === 'completed' && styles.statusCompleted
              )}>
                <Text className={styles.statusText}>{statusMap[apt.status]}</Text>
              </View>
            </View>
            <View className={styles.appointmentInfo}>
              <Text className={styles.infoTag}>{apt.appointmentDate} {apt.appointmentTime}</Text>
              <Text className={styles.infoTag}>{apt.doctorName}</Text>
              <Text className={styles.infoTag}>{apt.treatmentType}</Text>
            </View>
          </View>
        ))
      ) : (
        <EmptyState
          title="暂无预约记录"
          description="没有找到匹配的预约记录"
        />
      )}
    </View>
  );
};

export default SelectAppointmentPage;
