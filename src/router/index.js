import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/login.vue'
import home from '@/views/home.vue'
import user from '@/views/user.vue'
import right from '@/views/right.vue'
import roles from '@/views/roles.vue'
import cateparams from '@/views/cateparams.vue'
import goodscate from '@/views/goodscate.vue'
import goodslist from '@/views/goodslist.vue'
import goodsadd from '@/views/goodsadd.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    name:'login',
    path:'/login',
    component:login
  },{
    name:'home',
    path:'/home',
    component:home,
      children:[{
      name:'user',
      path:'/users',
      component:user
      },{
        name:'rights',
        path:'/rights',
        component:right
      },{
        name:'cateparams',
        path:'/params',
        component:cateparams
      },{
        name:'roles',
        path:'/roles',
        component:roles
      },{
        name:'goodscate',
        path:'/categories',
        component:goodscate
      },{
        name:'goodslist',
        path:'/goods',
        component:goodslist
      },{
        name:'goodsadd',
        path:'/goods/add',
        component:goodsadd
      }]
  }
    
  ]
})
//导航守卫
router.beforeEach((to, from, next) => {
  if(to.path==='/login'){
    next()
  }else{
    const token = sessionStorage.getItem('token')
    if(!token){
      rotuer.push('/login')
      return
    }
    next()
  }
})
export default router

