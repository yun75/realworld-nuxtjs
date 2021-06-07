<template>
  <div>
    <form @submit.prevent="onSubmit" class="card comment-form">
      <div class="card-block">
        <textarea v-model="comment.body" class="form-control" placeholder="Write a comment..." rows="3" required></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
        Post Comment
        </button>
      </div>
    </form>
    <div 
      class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createAt | date('MMM DD, YYYY') }}</span>
        <span class="mod-options" v-if="comment.author.username === user.username">
          <!-- <i class="ion-edit"></i> -->
          <i @click="onDelete(comment.id)" class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [], // 评论列表
      comment: {
        body: ''
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  methods: {
    async onSubmit () {
      try {
        // 提交评论
        const { data } = await addComment(this.article.slug, { comment: this.comment }) 
        this.comments.unshift(data.comment)
        this.comment.body = ''
      } catch (err) {
        //  console.log(error)
        this.errors = err.response.data.errors
      }
    },
    async onDelete (id) {
      try {
        // 删除评论
        await deleteComment(this.article.slug, id)
        const _index = this.comments.findIndex(comment => comment.id === id)
        this.comments.splice(_index, 1)
      } catch (err) {
        //  console.log(error)
        this.errors = err.response.data.errors
      }
    }
  }
}
</script>

<style>

</style>