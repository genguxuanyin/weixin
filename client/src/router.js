import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Register from './views/Register'
import Nofind from './views/404'
import Login from './views/Login'
import Home from './views/Home'
import InfoShow from './views/InfoShow'
import FoundList from './views/FoundList'
import ManageUser from './views/manage/ManageUser'
// import ManageTicket from './views/ManageTicket'
// import ManageGoods from './views/ManageGoods'
// import ManageOrder from './views/ManageOrder'
// import DevelopConfig from './views/DevelopConfig'
// import DevelopLimit from './views/DevelopLimit'
// import SettingInfo from './views/SettingInfo'
import Setting from './views/setting/PersonalInfo'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '*', name: '/404', component: Nofind },
    { path: '/', redirect: '/index' },
    { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '', component: Home },
        { path: '/home', name: 'home', component: Home },
        { path: '/infoshow', name: 'infoshow', component: InfoShow },
        { path: '/foundlist', name: 'foundlist', component: FoundList },
        { path: '/manageUser', name: 'manageUser', component: ManageUser },
        /* { path: '/manageTicket', name: 'manageTicket', component: ManageTicket },
        { path: '/manageGoods', name: 'manageGoods', component: ManageGoods },
        { path: '/manageOrder', name: 'manageOrder', component: ManageOrder },
        { path: '/developConfig', name: 'developConfig', component: DevelopConfig },
        { path: '/developLimit', name: 'developLimit', component: DevelopLimit },
        { path: '/settingInfo', name: 'settingInfo', component: SettingInfo },*/
        { path: '/personalInfo', name: 'personalInfo', component: Setting } 
      ]
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
})

export default router;