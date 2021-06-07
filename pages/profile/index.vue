<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio || '' }}</p>
            <button 
              v-if="user && user.username === profile.username" 
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="editProfile"
            >
              <i class="ion-gear-a"></i>
              &nbsp;
               Edit Profile Settings 
            </button>
            <button 
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              :disabled="profile.followDisabled"
              @click="onFollow(profile)"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }} 
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'author'
                  }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'author'
                    }
                  }"
                  exact
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited'
                  }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited'
                    }
                  }"
                  exact
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-if="articles.length==0" >No articles are here... yet.</div>
          <div 
            v-else
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <article-item :article="article" />
          </div>

          <!-- 分页列表 start -->
          <nav>
            <ul class="pagination">
              <li  
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link 
                  class="page-link"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      page: item,
                      tab,
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- 分页列表 end -->
        </div>

      </div>
    </div>

  </div>

</template>

<script>
import { getProfile, addFollow, deleteFollow } from '@/api/profile'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import articleItem from '@/components/article-item'
export default {
  components: { articleItem },
  // 在路由匹配组件渲染之前先执行中间件处理
  // middleware: 'authenticated',
  name: 'UserProfile',
  async asyncData ({ params, query }) {
    const page = Number.parseInt(query.page || 1) 
    const limit = 10
    const tab = query.tab || 'author'
    const [ profileRes, articleRes ] = await Promise.all([
      getProfile(params.username),
      getArticles({
        limit,
        offset: (page - 1) * limit,
        [tab]: params.username,
      })
    ])
    const { profile } = profileRes.data
    profile.followDisabled = false
    const { articles, articlesCount } = articleRes.data
    articles.forEach( article => {
      article.favoriteDisabled = false
      article.followDisabled = false
    })
    
    return {
      profile,
      articles, 
      articlesCount,
      page,
      limit,
      tab
    }
  },
  watchQuery: ['page', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    editProfile () {
      this.$router.push('/settings')
    },
    async onFollow (profile) {
      if(!this.$store.state.user){
        this.$router.push('/login')
        return
      }
      profile.followDisabled = true
      if(profile.following){
        // 取消关注
        await deleteFollow(profile.username)
        profile.following = false
      } else {
        // 关注
        await addFollow(profile.username)
        profile.following = true
      }
      profile.followDisabled = false
    },
  }
}
</script>

<style>

</style>