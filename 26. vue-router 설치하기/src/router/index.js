import { createRouter, createWebHistory } from "vue-router";
import Home from '../pages/index'
import Todos from '../pages/todos/index'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/todos',
            name: 'Todos',
            component: Todos
        },
    ]
})

export default router;
