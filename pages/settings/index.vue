<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template 
              v-for="(messages, filed) in errors"
            >
              <li
                v-for="(message, index) in messages"
                :key="index"
              >{{ filed }} {{ message }}</li>
            </template> 
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="user.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>

          <hr />
          <button class="btn btn-outline-danger" @click="loginOut">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import { currentUser, updateUser } from '@/api/user'
// 仅在客户端加载 js-cookie 这个包
const Cookie = process.client ? require('js-cookie') : undefined;
export default {
  // 在路由匹配组件渲染之前先执行中间件处理
  middleware: 'authenticated',
  name: 'Settins',
  async asyncData () {
    const { data } = await currentUser()
    const { user } = data
    return {
      user
    }
  },
  data () {
    return {
      user: {
        username: '',
        password: '',
        image: '',
        bio: '',
        email: ''
      },
      errors: {}
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 提交修改
        const { data } = await updateUser({
          user: this.user
        }) 
        const { user } = data
        // 保存用户的登录状态
        // 存储到容器，方便共享
        this.$store.commit('setUser', user)
        // 把用户状态更新到 Cookie 中
        Cookie.set('user', user)
        // 跳转到个人详情页
        this.$router.push({ 
          name: 'profile',
          params: {
            username: user.username
          }
        })
      } catch (err) {
        //  console.log(error)
        this.errors = err.response.data.errors
      }
    },
    loginOut () {
      this.$store.commit('deleteUser')
      Cookie.remove('user')
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>