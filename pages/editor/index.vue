<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
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
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title" required>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?" required>
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)" required></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="inputTag" @keyup.13="addTag" type="text" class="form-control" placeholder="Enter tags">
                  <div class="tag-list">
                    <span 
                      v-for="tag in article.tagList"
                      :key="tag"
                      class="tag-default tag-pill"
                    >
                      <i class="ion-close-round" @click="deleteTag(tag)"></i>
                      {{ tag }}
                    </span>
                  </div>
              </fieldset>
              <button 
                type="button"
                @click="onSubmit"
                :disabled="disabledSubmit" 
                class="btn btn-lg pull-xs-right btn-primary"
              >
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from '@/api/article'
export default {
  // 在路由匹配组件渲染之前先执行中间件处理
  middleware: 'authenticated',
  name: 'EditorIndex',
  data () {
    return {
      inputTag: '',
      disabledSubmit: false,
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      errors: {} 
    }
  },
  async asyncData ({ params }) {
    if(!params.slug) return
    const { data } = await getArticle(params.slug)
    const { article } = data
    // const md = new MarkdownIt()
    // article.body = md.render(article.body)
    return {
      article
    }
  },
  methods: {
    addTag () {
      const val = this.inputTag
      const _index = this.article.tagList.findIndex(tag => tag === val)
      if(_index < 0){
        this.article.tagList.push(val)
      }
      this.inputTag = ''
    },
    deleteTag (tag) {
      const _index = this.article.tagList.findIndex(item => item === tag)
      this.article.tagList.splice(_index, 1)
    },
    async onSubmit () {
      this.disabledSubmit = true
      const slug = this.$route.params.slug
      try {
        // 提交
        const { title, description, body, tagList } = this.article
        const params = {
          title,
          description,
          body,
          tagList
        }
        const { data } = slug ? 
          await updateArticle(slug, { article: params }) 
          :
          await createArticle({ article: params })
        
        const { article } = data
        this.disabledSubmit = true
        // 跳转到文章详情页
        this.$router.push({ 
          name: 'article',
          params: {
            slug: article.slug
          }
        })
      } catch (err) {
        //  console.log(error)
        this.errors = err.response.data.errors
      }
    },
  }
}
</script>

<style>

</style>