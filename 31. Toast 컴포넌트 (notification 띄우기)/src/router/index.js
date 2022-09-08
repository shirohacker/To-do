import { createRouter, createWebHistory } from "vue-router";
import Home from '../pages/index'
import Todos from '../pages/todos/index'
import Todo from '../pages/todos/_id'

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
        {
            path: '/todos/:id',
            name: 'Todo',
            component: Todo
        },
    ]
})

export default router;
