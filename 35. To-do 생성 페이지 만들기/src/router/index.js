import { createRouter, createWebHistory } from "vue-router";
import Home from '../pages/index'
import Todos from '../pages/todos/index'
import Todo from '../pages/todos/_id'
import TodoCreate from '../pages/todos/create/index'

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
            path: '/todos/create',
            name: 'TodoCreate',
            component: TodoCreate
        },
        {
            path: '/todos/:id',
            name: 'Todo',
            component: Todo
        },
    ]
})

export default router;
