import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { role, setRole } = useAppStore();

  const handleSwitchRole = () => {
    const newRole = role === 'clinic' ? 'patient' : 'clinic';
    setRole(newRole);
    Taro.showToast({
      title: newRole === 'clinic' ? '已切换到诊所模式' : '已切换到患者模式',
      icon: 'none'
    });
  };

  const handleMenuClick = (type: string) => {
    switch (type) {
      case 'about':
        Taro.showModal({
          title: '关于种植体凭证',
          content: '种植体材料凭证小程序，致力于让患者术后能清晰了解自己植入材料的来源，建立医患信任。版本 1.0.0',
          showCancel: false
        });
        break;
      case 'privacy':
        Taro.showModal({
          title: '隐私说明',
          content: '我们重视您的隐私。所有凭证数据仅用于记录和展示种植体材料信息，不会泄露给第三方。患者端仅展示本人凭证，不显示诊所内部库存信息。',
          showCancel: false
        });
        break;
      case 'help':
        Taro.showModal({
          title: '使用帮助',
          content: '患者：可查看种植体材料凭证、下载凭证图片。诊所：可录入凭证、管理批号通知、推送复查提醒。',
          showCancel: false
        });
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { icon: '🛡️', label: '隐私说明', type: 'privacy' },
    { icon: '❓', label: '使用帮助', type: 'help' },
    { icon: 'ℹ️', label: '关于', type: 'about' }
  ];

  return (
    <View className={styles.container}>
      <View className={styles.profileHeader}>
        <View className={styles.avatar}>
          <Text className={styles.avatarText}>{role === 'clinic' ? '👩‍⚕️' : '😊'}</Text>
        </View>
        <View className={styles.profileInfo}>
          <Text className={styles.profileName}>
            {role === 'clinic' ? '诊所工作人员' : '患者用户'}
          </Text>
          <Text className={styles.profileRole}>
            {role === 'clinic' ? '仁爱口腔门诊部' : '种植体凭证持有者'}
          </Text>
        </View>
      </View>

      <View className={styles.roleSwitchCard}>
        <View className={styles.roleSwitchInfo}>
          <Text className={styles.roleSwitchLabel}>身份切换</Text>
          <Text className={styles.roleSwitchDesc}>
            当前：{role === 'clinic' ? '诊所模式' : '患者模式'}
          </Text>
        </View>
        <View className={styles.roleSwitchBtn} onClick={handleSwitchRole}>
          <Text className={styles.roleSwitchBtnText}>切换身份</Text>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuGroup}>
          {menuItems.map(item => (
            <View
              key={item.type}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.type)}
            >
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <View className={styles.menuContent}>
                <Text className={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <Text className={styles.versionText}>种植体凭证 v1.0.0</Text>
    </View>
  );
};

export default MinePage;
