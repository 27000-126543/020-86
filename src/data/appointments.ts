import { Appointment } from '@/types';

export const mockAppointments: Appointment[] = [
  {
    id: 'apt_001',
    patientName: '张丽华',
    patientPhone: '138****6721',
    appointmentDate: '2025-06-20',
    appointmentTime: '09:00',
    doctorName: '王明德医师',
    treatmentType: '种植牙',
    status: 'completed'
  },
  {
    id: 'apt_002',
    patientName: '李建国',
    patientPhone: '139****3845',
    appointmentDate: '2025-06-20',
    appointmentTime: '10:30',
    doctorName: '陈思远医师',
    treatmentType: '种植牙',
    status: 'in_progress'
  },
  {
    id: 'apt_003',
    patientName: '王秀英',
    patientPhone: '137****9012',
    appointmentDate: '2025-06-20',
    appointmentTime: '14:00',
    doctorName: '王明德医师',
    treatmentType: '种植修复',
    status: 'waiting'
  },
  {
    id: 'apt_004',
    patientName: '赵文静',
    patientPhone: '136****2233',
    appointmentDate: '2025-06-21',
    appointmentTime: '09:30',
    doctorName: '陈思远医师',
    treatmentType: '种植牙',
    status: 'waiting'
  },
  {
    id: 'apt_005',
    patientName: '孙志强',
    patientPhone: '135****5566',
    appointmentDate: '2025-06-21',
    appointmentTime: '11:00',
    doctorName: '王明德医师',
    treatmentType: '种植牙',
    status: 'waiting'
  },
  {
    id: 'apt_006',
    patientName: '周美琳',
    patientPhone: '133****7788',
    appointmentDate: '2025-06-22',
    appointmentTime: '09:00',
    doctorName: '陈思远医师',
    treatmentType: '种植修复',
    status: 'waiting'
  },
  {
    id: 'apt_007',
    patientName: '吴海燕',
    patientPhone: '131****4455',
    appointmentDate: '2025-06-22',
    appointmentTime: '14:30',
    doctorName: '王明德医师',
    treatmentType: '种植牙',
    status: 'waiting'
  },
  {
    id: 'apt_008',
    patientName: '郑伟明',
    patientPhone: '132****6677',
    appointmentDate: '2025-06-23',
    appointmentTime: '10:00',
    doctorName: '陈思远医师',
    treatmentType: '种植牙',
    status: 'waiting'
  },
  {
    id: 'apt_009',
    patientName: '陈晓芳',
    patientPhone: '130****8899',
    appointmentDate: '2025-06-23',
    appointmentTime: '15:00',
    doctorName: '王明德医师',
    treatmentType: '种植修复',
    status: 'waiting'
  },
  {
    id: 'apt_010',
    patientName: '林佳慧',
    patientPhone: '158****3344',
    appointmentDate: '2025-06-24',
    appointmentTime: '09:30',
    doctorName: '陈思远医师',
    treatmentType: '种植牙',
    status: 'waiting'
  }
];
