import { BatchNotification } from '@/types';

export const mockNotifications: BatchNotification[] = [
  {
    id: 'notif_001',
    batchNumber: 'STRA-2024-A7832',
    brand: 'Straumann（士卓曼）',
    supplierName: '士卓曼（中国）贸易有限公司',
    noticeDate: '2025-06-18',
    noticeContent: '该批次种植体表面处理工艺微调，建议对已植入患者安排复查，确认骨结合情况良好。无安全风险，仅做预防性提醒。',
    affectedPatientCount: 2,
    isPushed: true,
    pushedPatients: [
      {
        credentialId: 'cred_001',
        patientName: '张丽华',
        patientPhone: '138****6721',
        pushedAt: '2025-06-19 10:30'
      },
      {
        credentialId: 'cred_005',
        patientName: '孙志强',
        patientPhone: '135****5566',
        pushedAt: '2025-06-19 10:31'
      }
    ]
  },
  {
    id: 'notif_002',
    batchNumber: 'NOBEL-2024-B2190',
    brand: 'Nobel Biocare（诺保科）',
    supplierName: '诺保科（中国）医疗器械有限公司',
    noticeDate: '2025-06-19',
    noticeContent: '该批次产品包装标签信息更新，种植体本身无任何质量问题。建议通知患者复查时携带凭证原件核对信息。',
    affectedPatientCount: 2,
    isPushed: false,
    pushedPatients: []
  },
  {
    id: 'notif_003',
    batchNumber: 'OSST-2024-C5567',
    brand: 'Osstem（奥齿泰）',
    supplierName: '奥齿泰（北京）商贸有限公司',
    noticeDate: '2025-06-20',
    noticeContent: '供应商通知该批次种植体在特定条件下存在微小的连接件公差偏差，建议对已植入患者进行临床复查，确认修复体适配情况。如有任何不适请联系诊所。',
    affectedPatientCount: 1,
    isPushed: false,
    pushedPatients: []
  },
  {
    id: 'notif_004',
    batchNumber: 'DENT-2024-D8891',
    brand: 'Dentium（登腾）',
    supplierName: '登腾（上海）医疗器械有限公司',
    noticeDate: '2025-06-20',
    noticeContent: '该批次产品经供应商二次检测确认质量完全合格，此通知仅为信息同步，无需特殊处理。',
    affectedPatientCount: 1,
    isPushed: true,
    pushedPatients: [
      {
        credentialId: 'cred_004',
        patientName: '赵文静',
        patientPhone: '136****2233',
        pushedAt: '2025-06-20 09:15'
      }
    ]
  }
];
