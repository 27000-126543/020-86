import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { ImplantCredential } from '@/types';
import classnames from 'classnames';
import dayjs from 'dayjs';
import styles from './index.module.scss';

const toothPositions = [
  '左上1', '左上2', '左上3', '左上4', '左上5', '左上6', '左上7', '左上8',
  '右上1', '右上2', '右上3', '右上4', '右上5', '右上6', '右上7', '右上8',
  '左下1', '左下2', '左下3', '左下4', '左下5', '左下6', '左下7', '左下8',
  '右下1', '右下2', '右下3', '右下4', '右下5', '右下6', '右下7', '右下8'
];

const brandOptions = [
  'Straumann（士卓曼）',
  'Nobel Biocare（诺保科）',
  'Osstem（奥齿泰）',
  'Dentium（登腾）'
];

const RecordCredentialPage: React.FC = () => {
  const router = useRouter();
  const { appointments, addCredential } = useAppStore();

  const selectedAppointment = appointments.find(a => a.id === router.params.appointmentId);

  const [batchNumber, setBatchNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [toothPosition, setToothPosition] = useState('');
  const [doctorName, setDoctorName] = useState(selectedAppointment?.doctorName || '');
  const [implantDate, setImplantDate] = useState(dayjs().format('YYYY-MM-DD'));

  const handleScan = () => {
    Taro.scanCode({
      scanType: ['barCode', 'qrCode'],
      success: (res) => {
        console.info('[RecordCredential] Scan result:', res.result);
        setBatchNumber(res.result);
        Taro.showToast({ title: '批号已识别', icon: 'success' });
      },
      fail: (err) => {
        console.error('[RecordCredential] Scan failed:', err);
        Taro.showToast({ title: '请手动输入批号', icon: 'none' });
      }
    });
  };

  const handleSelectBrand = (b: string) => {
    setBrand(b);
  };

  const handleSelectTooth = (pos: string) => {
    setToothPosition(pos === toothPosition ? '' : pos);
  };

  const handleSubmit = () => {
    if (!batchNumber.trim()) {
      Taro.showToast({ title: '请输入批号', icon: 'none' });
      return;
    }
    if (!brand) {
      Taro.showToast({ title: '请选择品牌', icon: 'none' });
      return;
    }
    if (!toothPosition) {
      Taro.showToast({ title: '请选择牙位', icon: 'none' });
      return;
    }
    if (!doctorName.trim()) {
      Taro.showToast({ title: '请输入医生姓名', icon: 'none' });
      return;
    }

    const newCredential: ImplantCredential = {
      id: `cred_${Date.now()}`,
      patientName: selectedAppointment?.patientName || '未知患者',
      patientPhone: selectedAppointment?.patientPhone || '',
      brand,
      model: model || '标准型号',
      batchNumber: batchNumber.trim(),
      toothPosition,
      doctorName: doctorName.trim(),
      implantDate,
      status: 'confirmed',
      followUpDate: dayjs(implantDate).add(3, 'month').format('YYYY-MM-DD'),
      clinicName: '仁爱口腔门诊部',
      clinicPhone: '021-5555-1234',
      createdAt: dayjs().format('YYYY-MM-DD')
    };

    addCredential(newCredential);

    Taro.showToast({
      title: '凭证已生成',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      }
    });
  };

  return (
    <View className={styles.container}>
      {selectedAppointment && (
        <View className={styles.patientCard}>
          <Text className={styles.patientLabel}>当前患者</Text>
          <Text className={styles.patientName}>{selectedAppointment.patientName}</Text>
          <Text className={styles.patientInfo}>
            {selectedAppointment.patientPhone} · {selectedAppointment.appointmentDate} {selectedAppointment.appointmentTime}
          </Text>
        </View>
      )}

      <View className={styles.scanArea}>
        <Text className={styles.scanIcon}>📷</Text>
        <Text className={styles.scanHint}>扫描种植体包装上的条码或二维码</Text>
        <View className={styles.scanBtn} onClick={handleScan}>
          <Text className={styles.scanBtnText}>扫码识别批号</Text>
        </View>
      </View>

      <View className={styles.orDivider}>
        <View className={styles.dividerLine} />
        <Text className={styles.dividerText}>或手动输入</Text>
        <View className={styles.dividerLine} />
      </View>

      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>产品批号
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入批号"
            value={batchNumber}
            onInput={e => setBatchNumber(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>品牌
          </Text>
          <View className={styles.toothGrid}>
            {brandOptions.map(b => (
              <View
                key={b}
                className={classnames(
                  styles.toothItem,
                  brand === b && styles.toothItemActive
                )}
                onClick={() => handleSelectBrand(b)}
              >
                <Text className={styles.toothItemText}>{b.split('（')[0]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>规格型号</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入规格型号"
            value={model}
            onInput={e => setModel(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>植入牙位
          </Text>
          <View className={styles.toothGrid}>
            {toothPositions.map(pos => (
              <View
                key={pos}
                className={classnames(
                  styles.toothItem,
                  toothPosition === pos && styles.toothItemActive
                )}
                onClick={() => handleSelectTooth(pos)}
              >
                <Text className={styles.toothItemText}>{pos}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>主诊医生
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入医生姓名"
            value={doctorName}
            onInput={e => setDoctorName(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>植入日期</Text>
          <Input
            className={styles.formInput}
            placeholder="YYYY-MM-DD"
            value={implantDate}
            onInput={e => setImplantDate(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>确认生成凭证</Text>
        </View>
      </View>
    </View>
  );
};

export default RecordCredentialPage;
