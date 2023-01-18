// 获取环境变量
export default function getEnv() {
  const env = {
    REACT_APP_SITE_NAME: 'KPI_UI_SITE',
  }
  return {
    env,
    str: Object.entries(env).reduce((result, [key, value]) => {
      return { ...result, [key]: JSON.stringify(value) }
    }, {}),
  }
}
