import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import CredentialCard from '@/components/CredentialCard';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

type FilterTab = 'all' | 'confirmed' | 'pending';

const CredentialPage: React.FC = () => {
  const { filteredCredentials } = useAppStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'confirmed', label: '已确认' },
    { key: 'pending', label: '待确认' }
  ];

  const displayCredentials = filteredCredentials.filter(cred => {
    if (activeTab === 'all') return true;
    return cred.status === activeTab;
  });

  const handleCredentialClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/credentialDetail/index?id=${id}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
          </View>
        ))}
      </View>

      {displayCredentials.length > 0 ? (
        <View className={styles.list}>
          {displayCredentials.map(cred => (
            <CredentialCard
              key={cred.id}
              credential={cred}
              onClick={handleCredentialClick}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          title="暂无凭证"
          description="您还没有种植体材料凭证记录"
        />
      )}
    </View>
  );
};

export default CredentialPage;
