import React, { useState, useRef } from 'react';
import { View, Text, Canvas } from '@tarojs/components';
import Taro, { useRouter, createSelectorQuery } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { BatchNotification } from '@/types';
import dayjs from 'dayjs';
import styles from './index.module.scss';

const CredentialDetailPage: React.FC = () => {
  const router = useRouter();
  const { credentials, notifications } = useAppStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<any>(null);

  const credential = credentials.find(c => c.id === router.params.id);

  const linkedNotifications: BatchNotification[] = credential?.batchNotificationIds
    ? notifications.filter(n => credential.batchNotificationIds!.includes(n.id))
    : [];

  if (!credential) {
    return (
      <View className={styles.container}>
        <Text>凭证不存在</Text>
      </View>
    );
  }

  const drawCredentialCard = (ctx: any, width: number, height: number) => {
    if (!credential) return;

    const dpr = Taro.getSystemInfoSync().pixelRatio || 2;
    ctx.scale(dpr, dpr);

    const cardWidth = width / dpr;
    const cardHeight = height / dpr;

    // 背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // 顶部渐变
    const gradient = ctx.createLinearGradient(0, 0, cardWidth, 120);
    gradient.addColorStop(0, '#00A896');
    gradient.addColorStop(1, '#02C39A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cardWidth, 120);

    // 标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('种植体材料凭证', cardWidth / 2, 50);

    // 诊所名
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(credential.clinicName, cardWidth / 2, 75);

    // 分隔线
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(30, 90, cardWidth - 60, 1);

    // 患者信息
    ctx.fillStyle = '#333333';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('患者姓名：', 30, 145);
    ctx.fillStyle = '#00A896';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(credential.patientName, 110, 145);

    ctx.fillStyle = '#333333';
    ctx.font = '12px sans-serif';
    ctx.fillText('联系电话：', 30, 170);
    ctx.fillStyle = '#666666';
    ctx.fillText(credential.patientPhone, 110, 170);

    // 分隔线
    ctx.fillStyle = '#EEEEEE';
    ctx.fillRect(30, 185, cardWidth - 60, 1);

    // 植入体信息 - 标题
    ctx.fillStyle = '#00A896';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('植入体信息', 30, 215);

    ctx.fillStyle = '#999999';
    ctx.font = '12px sans-serif';
    let yOffset = 240;
    const infoItems = [
      { label: '品牌名称', value: credential.brand },
      { label: '规格型号', value: credential.model },
      { label: '产品批号', value: credential.batchNumber },
      { label: '植入牙位', value: `${credential.toothPosition}号牙` },
      { label: '主诊医生', value: credential.doctorName },
      { label: '植入日期', value: dayjs(credential.implantDate).format('YYYY年MM月DD日') }
    ];

    infoItems.forEach(item => {
      ctx.fillStyle = '#999999';
      ctx.fillText(item.label, 30, yOffset);
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(item.value, 110, yOffset);
      ctx.font = '12px sans-serif';
      yOffset += 28;
    });

    // 分隔线
    ctx.fillStyle = '#EEEEEE';
    ctx.fillRect(30, yOffset - 10, cardWidth - 60, 1);
    yOffset += 15;

    // 复诊提醒
    ctx.fillStyle = '#00A896';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('📅 复诊提醒', 30, yOffset);

    ctx.fillStyle = '#666666';
    ctx.font = '11px sans-serif';
    yOffset += 22;
    ctx.fillText('建议按时复诊，确保种植体长期健康。', 30, yOffset);
    yOffset += 18;
    ctx.fillStyle = '#00A896';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`下次复诊：${dayjs(credential.followUpDate).format('YYYY年MM月DD日')}`, 30, yOffset);

    // 底部装饰
    ctx.fillStyle = 'rgba(0, 168, 150, 0.1)';
    ctx.fillRect(0, cardHeight - 40, cardWidth, 40);

    ctx.fillStyle = '#00A896';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`凭证编号：${credential.id}`, cardWidth / 2, cardHeight - 22);
    ctx.fillStyle = '#999999';
    ctx.font = '10px sans-serif';
    ctx.fillText(`生成时间：${dayjs().format('YYYY-MM-DD HH:mm')}`, cardWidth / 2, cardHeight - 8);
  };

  const handleDownload = async () => {
    if (!credential) return;

    setIsDrawing(true);

    try {
      const dpr = Taro.getSystemInfoSync().pixelRatio || 2;
      const canvasWidth = 300 * dpr;
      const canvasHeight = 520 * dpr;

      await new Promise<void>((resolve, reject) => {
        const query = createSelectorQuery();
        query.select('#credentialCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            if (!res || !res[0] || !res[0].node) {
              reject(new Error('Canvas not found'));
              return;
            }

            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            drawCredentialCard(ctx, canvasWidth, canvasHeight);

            setTimeout(() => {
              Taro.canvasToTempFilePath({
                canvas: canvas,
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight,
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: (fileRes) => {
                  Taro.saveImageToPhotosAlbum({
                    filePath: fileRes.tempFilePath,
                    success: () => {
                      Taro.showToast({
                        title: '已保存到相册',
                        icon: 'success'
                      });
                      resolve();
                    },
                    fail: (err) => {
                      console.error('[CredentialDetail] Save image failed:', err);
                      if (err.errMsg?.includes('auth deny') || err.errMsg?.includes('authorize')) {
                        Taro.showModal({
                          title: '需要相册权限',
                          content: '请在设置中开启保存到相册的权限',
                          confirmText: '去设置',
                          success: (modalRes) => {
                            if (modalRes.confirm) {
                              Taro.openSetting();
                            }
                          }
                        });
                      } else {
                        Taro.showToast({
                          title: '保存失败，请重试',
                          icon: 'none'
                        });
                      }
                      reject(err);
                    }
                  });
                },
                fail: (err) => {
                  console.error('[CredentialDetail] Canvas to temp file failed:', err);
                  Taro.showToast({
                    title: '生成图片失败',
                    icon: 'none'
                  });
                  reject(err);
                }
              });
            }, 300);
          });
      });
    } catch (err) {
      console.error('[CredentialDetail] Download failed:', err);
    } finally {
      setIsDrawing(false);
    }
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

      {linkedNotifications.length > 0 && (
        <View className={styles.batchNotificationCard}>
          <View className={styles.batchNotifHeader}>
            <Text className={styles.batchNotifIcon}>💡</Text>
            <Text className={styles.batchNotifTitle}>复查温馨提醒</Text>
          </View>
          {linkedNotifications.map(notif => (
            <View key={notif.id} className={styles.batchNotifContent}>
              <Text className={styles.batchNotifText}>
                您好！我们收到了关于该批号种植体的相关通知，为了确保您的种植体健康，建议您：
              </Text>
              <View className={styles.batchNotifActions}>
                <Text className={styles.batchNotifStep}>• 联系诊所安排一次常规复查</Text>
                <Text className={styles.batchNotifStep}>• 让医生检查种植体状况</Text>
                <Text className={styles.batchNotifStep}>• 有任何不适请及时告知</Text>
              </View>
              <Text className={styles.batchNotifNote}>
                请不要担心，这是我们的常规关怀服务，您可以随时联系我们咨询。
              </Text>
            </View>
          ))}
          <View className={styles.batchNotifBtn} onClick={handleContact}>
            <Text className={styles.batchNotifBtnText}>立即联系诊所</Text>
          </View>
        </View>
      )}

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
          <Text className={styles.downloadBtnText}>{isDrawing ? '正在生成...' : '下载凭证图片'}</Text>
        </View>
        <View className={styles.contactBtn} onClick={handleContact}>
          <Text className={styles.contactBtnText}>联系诊所</Text>
        </View>
      </View>

      <Canvas
        type="2d"
        id="credentialCanvas"
        ref={canvasRef}
        className={styles.hiddenCanvas}
      />
    </View>
  );
};

export default CredentialDetailPage;
