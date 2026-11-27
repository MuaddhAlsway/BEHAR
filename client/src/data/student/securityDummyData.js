
export const securityDummyData = {
  isDemo: true,
  twoFactorEnabled: true,

  sessions: [
    {
      id: 'session-001',
      device: 'Windows 11',
      browser: 'Google Chrome',
      location: {
        en: 'Jeddah, Saudi Arabia',
        ar: 'جدة، المملكة العربية السعودية',
      },
      ipAddress: '192.0.2.10',
      lastActive: '2026-11-27T18:30:00Z',
      isCurrent: true,
      type: 'desktop',
    },
    {
      id: 'session-002',
      device: 'iPhone 15 Pro',
      browser: 'Safari',
      location: {
        en: 'Riyadh, Saudi Arabia',
        ar: 'الرياض، المملكة العربية السعودية',
      },
      ipAddress: '192.0.2.20',
      lastActive: '2026-11-26T15:45:00Z',
      isCurrent: false,
      type: 'mobile',
    },
    {
      id: 'session-003',
      device: 'MacBook Pro',
      browser: 'Google Chrome',
      location: {
        en: 'Dubai, United Arab Emirates',
        ar: 'دبي، الإمارات العربية المتحدة',
      },
      ipAddress: '192.0.2.30',
      lastActive: '2026-11-24T09:15:00Z',
      isCurrent: false,
      type: 'laptop',
    },
  ],

  loginActivity: [
    {
      id: 'activity-001',
      description: {
        en: 'Successful login',
        ar: 'تسجيل دخول ناجح',
      },
      device: 'Windows 11 — Chrome',
      location: {
        en: 'Jeddah, Saudi Arabia',
        ar: 'جدة، المملكة العربية السعودية',
      },
      date: '2026-11-27T18:30:00Z',
      status: 'success',
    },
    {
      id: 'activity-002',
      description: {
        en: 'Successful login',
        ar: 'تسجيل دخول ناجح',
      },
      device: 'iPhone 15 Pro — Safari',
      location: {
        en: 'Riyadh, Saudi Arabia',
        ar: 'الرياض، المملكة العربية السعودية',
      },
      date: '2026-11-26T15:45:00Z',
      status: 'success',
    },
    {
      id: 'activity-003',
      description: {
        en: 'Failed login attempt',
        ar: 'محاولة تسجيل دخول فاشلة',
      },
      device: 'Unknown device',
      location: {
        en: 'Unknown location',
        ar: 'موقع غير معروف',
      },
      date: '2026-11-25T21:10:00Z',
      status: 'failed',
    },
    {
      id: 'activity-004',
      description: {
        en: 'Password changed',
        ar: 'تم تغيير كلمة المرور',
      },
      device: 'Windows 11 — Chrome',
      location: {
        en: 'Jeddah, Saudi Arabia',
        ar: 'جدة، المملكة العربية السعودية',
      },
      date: '2026-11-22T12:20:00Z',
      status: 'success',
    },
  ],
}
