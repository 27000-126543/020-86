export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/credential/index',
    'pages/workbench/index',
    'pages/mine/index',
    'pages/credentialDetail/index',
    'pages/recordCredential/index',
    'pages/batchNotify/index',
    'pages/selectAppointment/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2ba8a0',
    navigationBarTitleText: '种植体凭证',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#2ba8a0',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/credential/index',
        text: '凭证'
      },
      {
        pagePath: 'pages/workbench/index',
        text: '工作台'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
