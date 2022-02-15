import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import auth from '@/utils/auth'

import store from '@/store'

const routes = [
    {
        path: '/',
        name: '/home',
        component: Home,
        meta: { requiresAuth: false}
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/login.vue'),
        meta: { requiresAuth: false}
    },  
    {
        path: '/inicio',
        name: 'Inicio',
        component: () => import('@/views/inicio.vue'),
        meta: { requiresAuth: true}
    },
    {
        path: '/newdoc',
        name: 'Newdoc',
        component: () => import('@/views/newdoc.vue'),
        meta: { requiresAuth: true}
    },
    {
        path: '/editdoc/:p_claveId?',
        name: 'Editdoc',
        component: () => import('@/views/newdoc.vue'),
        meta: { requiresAuth: true}
    },
    {
        path: '/deldoc',
        name: 'Deldoc',
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        meta: { requiresAuth: true}
    }      
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    mode: 'hash',
    routes
})

router.beforeEach((to, from, next) => {

    let isLogged = store.state.logged;   
    let requiere = to.matched.some(record => record.meta.requiresAuth);

    console.log("Router beforeEach", to.name, isLogged);  

    if (to.name == '/home' && (isLogged === true)) {
        console.log("Por aqui 1", isLogged);
        next('/inicio');
    } else {
        if (requiere == false) {
            console.log("Por aqui 2");
            next();
        } else if (requiere == true && isLogged === false) {
            console.log("Por aqui 3");
            auth.deleteUserLogged();
            next('/login');
        } else {
            console.log("Por aqui 4");
            next();
        }

    }

});

export default router
