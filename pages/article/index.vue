<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>
        <ArticleMeta :article="article" />
      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12">

          <div v-html="article.body"></div>

          <!-- tag 标签 start -->
          <ul class="tag-list" v-if="article.tagList">
            <li 
              v-for="tag in article.tagList" 
              :key="tag"
              class="tag-default tag-pill tag-outline"
            >
              {{ tag }}
            </li>
          </ul>
          <!-- tag 标签 end -->
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" />
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">
          
          <ArticleComments v-if="user" :article="article" />
          <div v-else>
            <nuxt-link to="/login">Sign in</nuxt-link>
             or 
            <nuxt-link to="/register">Sign up</nuxt-link>
            to add comments on this article.
          </div>

        </div>

      </div>

    </div>

  </div>
              
</template>

<script>
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
import ArticleComments from './components/article-comments'
import { mapState } from 'vuex'
export default {
  name: 'ArticleIndex',
  async asyncData ({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article: data.article
    }
  },
  computed: {
    ...mapState(['user']),
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  }
}
</script>

<style>

</style>