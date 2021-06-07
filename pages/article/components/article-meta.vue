<template>
  <div class="article-meta">
      <nuxt-link :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        <img :src="article.author.image" />
      </nuxt-link>
      <div class="info">
        <nuxt-link class="author" :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }">
          {{ article.author.username }}
        </nuxt-link>
        <span class="date">{{ article.createAt | date('MMMM D, YYYY')}}</span>
      </div>
      <template v-if="user && user.username === article.author.username">
        <nuxt-link 
          class="btn btn-sm btn-outline-secondary"
          :to="{
            name: 'editor',
            params: {
              slug: article.slug
            }
          }"
        >
          <i class="ion-edit"></i>
          &nbsp;
          Edit Article
        </nuxt-link>
        &nbsp;&nbsp;
        <button 
          class="btn btn-sm btn-outline-danger"
          @click="onDelete(article)"
          :disabled="article.deleteDisabled"
        >
          <i class="ion-trash-a"></i>
          &nbsp;
          Delete Article
        </button>
      </template>
      <template v-else>
        <button 
          class="btn btn-sm btn-outline-secondary"
          :class="{
            active: article.author.following
          }"
          @click="onFollow(article)"
          :disabled="article.followDisabled"
        >
          <i class="ion-plus-round"></i>
          &nbsp;
          {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
        </button>
        &nbsp;&nbsp;
        <button 
          class="btn btn-sm btn-outline-primary"
          :class="{
            active: article.favorited
          }"
          @click="onFavorite(article)"
          :disabled="deleteDisabled"
        >
          <i class="ion-heart"></i>
          &nbsp;
          Favorite Article <span class="counter">({{ article.favoritesCount }})</span>
        </button>
      </template>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/article'
import { addFollow,deleteFollow } from '@/api/profile'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      deleteDisabled: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onFollow (article) {
      // console.log(this);
      // console.log(article);
      // return
      if(!this.$store.state.user){
        this.$router.push('/login')
        return
      }
      article.followDisabled = true
      if(article.author.following){
        // 取消关注
        await deleteFollow(article.author.username)
         article.author.following = false
      } else {
        // 关注
        await addFollow(article.author.username)
         article.author.following = true
      }
      article.followDisabled = false
    },
    async onFavorite (article) {
      if(!this.$store.state.user){
        this.$router.push('/login')
        return
      }
      article.favoriteDisabled = true
      if(article.favorited){
        // 取消点赞
        await deleteFavorite(article.slug)
         article.favorited = false
         article.favoritesCount += -1
         
      } else {
        // 点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    async onDelete (article) {
      this.deleteDisabled = true
      await deleteArticle(article.slug)
      this.deleteDisabled = false
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>