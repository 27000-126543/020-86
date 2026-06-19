import React from 'react';
import { View, Text } from '@tarojs/components';
import { ImplantCredential } from '@/types';
import dayjs from 'dayjs';
import styles from './index.module.scss';

interface CredentialCardProps {
  credential: ImplantCredential;
  onClick?: (id: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onClick }) => {
  const handleTap = () => {
    if (onClick) {
      onClick(credential.id);
    }
  };

  return (
    <View className={styles.card} onClick={handleTap}>
      <View className={styles.cardHeader}>
        <Text className={styles.brand}>{credential.brand}</Text>
        <View className={
          credential.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending
        }>
          <Text className={styles.statusText}>
            {credential.status === 'confirmed' ? '已确认' : '待确认'}
          </Text>
        </View>
      </View>
      <View className={styles.cardBody}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>植入牙位</Text>
          <Text className={styles.infoValue}>{credential.toothPosition}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>批号</Text>
          <Text className={styles.infoValue}>{credential.batchNumber}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>植入日期</Text>
          <Text className={styles.infoValue}>{dayjs(credential.implantDate).format('YYYY年MM月DD日')}</Text>
        </View>
      </View>
      <View className={styles.cardFooter}>
        <Text className={styles.doctorName}>{credential.doctorName}</Text>
        <Text className={styles.followUpDate}>
          复诊：{dayjs(credential.followUpDate).format('MM月DD日')}
        </Text>
      </View>
    </View>
  );
};

export default CredentialCard;
