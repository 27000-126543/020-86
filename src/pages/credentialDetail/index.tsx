import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import dayjs from 'dayjs';
import styles from './index.module.scss';

const CredentialDetailPage: React.FC = () => {
  const router = useRouter();
  const { credentials } = useAppStore();

  const credential = credentials.find(c => c.id === router.params.id);

  if (!credential) {
    return (
      <View className={styles.container}>
        <Text>凭证不存在</Text>
      </View>
    );
  }

  const handleDownload = () => {
    Taro.showToast({
      title: '凭证图片已保存到相册',
      icon: 'success'
    });
  };

  const handleContact = () => {
    Taro.makePhoneCall({
      phoneNumber: '02155551234'
    }).catch(() => {
      console.error('[CredentialDetail] Phone call failed');
      Taro.showModal({
        title: '联系诊所',
        content: `诊所电话：${credential.clinicPhone}\n诊所名称：${credential.clinicName}`,
        showCancel: false
      });
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.credentialCard}>
        <View className={styles.cardTop}>
          <Text className={styles.cardTitle}>种植体材料凭证</Text>
          <Text className={styles.cardSubtitle}>{credential.clinicName}</Text>
        </View>

        <View className={styles.cardBody}>
          <View className={styles.infoGroup}>
            <Text className={styles.groupTitle}>植入体信息</Text>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>品牌名称</Text>
              <Text className={styles.infoValue}>{credential.brand}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>规格型号</Text>
              <Text className={styles.infoValue}>{credential.model}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>产品批号</Text>
              <Text className={styles.infoValue}>{credential.batchNumber}</Text>
            </View>
          </View>

          <View className={styles.infoGroup}>
            <Text className={styles.groupTitle}>植入信息</Text>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>植入牙位</Text>
              <Text className={styles.infoValue}>{credential.toothPosition}号牙</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>主诊医生</Text>
              <Text className={styles.infoValue}>{credential.doctorName}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>植入日期</Text>
              <Text className={styles.infoValue}>
                {dayjs(credential.implantDate).format('YYYY年MM月DD日')}
              </Text>
            </View>
            <View className={styles.statusRow}>
              <Text className={styles.infoLabel}>凭证状态</Text>
              <View className={`${styles.statusTag} ${credential.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending}`}>
                <Text className={styles.statusTagText}>
                  {credential.status === 'confirmed' ? '已确认' : '待确认'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.followUpCard}>
        <View className={styles.followUpHeader}>
          <Text className={styles.followUpIcon}>📅</Text>
          <Text className={styles.followUpTitle}>复诊提醒</Text>
        </View>
        <Text className={styles.followUpDesc}>
          您的种植体术后定期复查十分重要，建议按时复诊以确保种植体健康。
        </Text>
        <Text className={styles.followUpDate}>
          下次复诊日期：{dayjs(credential.followUpDate).format('YYYY年MM月DD日')}
        </Text>
      </View>

      <View className={styles.reminderCard}>
        <Text className={styles.reminderTitle}>温馨提示</Text>
        <Text className={styles.reminderText}>
          如术后感到任何不适，请第一时间联系您的诊疗医生。种植体材料信息已完整记录，如有疑问可随时向诊所咨询。请勿自行判断或听信非专业意见。
        </Text>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.downloadBtn} onClick={handleDownload}>
          <Text className={styles.downloadBtnText}>下载凭证图片</Text>
        </View>
        <View className={styles.contactBtn} onClick={handleContact}>
          <Text className={styles.contactBtnText}>联系诊所</Text>
        </View>
      </View>
    </View>
  );
};

export default CredentialDetailPage;
