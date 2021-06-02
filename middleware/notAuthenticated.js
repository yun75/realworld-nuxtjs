/**
 * 验证是否登陆的中间件
 */
export default function ({ store, redirect }) {
  // 判断用户是否登陆
  if (store.state.user) {
    return redirect('/')
  }
}