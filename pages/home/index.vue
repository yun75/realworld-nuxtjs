<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                  exact
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                  exact
                >Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'tag'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tag,
                      tab: 'tag'
                    }
                  }"
                  exact
                >#{{ tag }}</nuxt-link>
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
                    name: 'home',
                    query: {
                      page: item,
                      tag,
                      tab,
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- 分页列表 end -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link 
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag'
                  }
                }"
              >{{ item }}</nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

</template>

<script>
import { mapState } from 'vuex'
import { 
  getArticles, 
  getFeedArticles
} from '@/api/article'
import { getTags } from '@/api/tag'
import articleItem from '@/components/article-item'
export default {
  components: { articleItem },
  name: 'HomeIndex',
  async asyncData ({ query, store }) {
    const page = Number.parseInt(query.page || 1) 
    const limit = 10
    const { tag } = query
    const tab = query.tab || 'global_feed'
    const loadArticles = store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles
    const [ articleRes, tagRes ] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      }),
      getTags()
    ])
    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data
    articles.forEach( article => {
      article.favoriteDisabled = false
      article.followDisabled = false
    })
    return {
      articles,
      articlesCount,
      page,
      limit,
      tags,
      tag,
      tab
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  }
}
</script>

<style>

</style>