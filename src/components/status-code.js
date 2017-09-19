const STATUS_CODE = {
  FAIL: 0, // 操作失败
  LOGIN_EXPIRED: 1, // 登录失效,请重新登录
  PARAM_NULL: 2, // 参数不全或为空
  PWD_ERROR: 3, // 账号或密码错误
  ACCOUNT_NULL: 4, // 账号不存在
  SUP_NULL: 5, // 企业信息未完善
  REPORT_PRICE_NULL: 6, // 此单已报价
  NOT_OWN: 7, // 操作不属于自己的信息
  SUCCESS: 200 // 操作成功
}
export default STATUS_CODE
