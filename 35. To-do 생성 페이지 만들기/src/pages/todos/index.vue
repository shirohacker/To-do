<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2>To-Do List</h2>
      <button class="btn btn-primary" @click="moveToCreatePage">Todo 생성</button>
    </div>

    <input class="form-control" type="text" v-model="searchText" placeholder="검색" @keyup.enter="searchTodo">
    <hr/>
    <div v-if="!todos.length">
      표시할 To-do가 없습니다.
    </div>
    <!-- props로 자식 컴포넌트로 데이터 보내기 (자식 컴포넌트에서 todos 이름으로 todos 데이터에 접근이 가능함)-->
    <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo"/>
    <hr/>
    <!-- Pagenation -->
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li v-if="currentPage !== 1" class="page-item">
          <a style="cursor: pointer" class="page-link" @click="getTodos(currentPage - 1)">이전</a>
        </li>
        <li v-for="page in numberOfPages" :key="page" class="page-item" :class="currentPage === page ? 'active' : ''">
          <a style="cursor: pointer" class="page-link" @click="getTodos(page)">{{ page }}</a>
        </li>
        <li v-if="currentPage !== numberOfPages" class="page-item">
          <a style="cursor: pointer" class="page-link" @click="getTodos(currentPage + 1)">다음</a>
        </li>
      </ul>
    </nav>
  </div>
  <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType"/>
</template>

<script>
import { ref, computed, watch } from 'vue'
import TodoList from '@/components/TodoList'
import axios from 'axios'
import Toast from '@/components/Toast'
import { useToast } from '@/composables/toast'
import { useRouter } from 'vue-router'

export default {
  components: { // 컴포넌트 등록
    TodoList,
    Toast,
  },
  setup() {
    const router = useRouter()
    const todos = ref([])
    const error = ref('')
    const numberOfTodos = ref(0)  // 총 데이터 개수
    const limit = 5;  // 한 페이지에 보여줄 To do 개수
    const currentPage = ref(1) // 현재 페이지
    const searchText = ref('')

    const { toastMessage, toastAlertType, showToast, triggerToast } = useToast();

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value/limit)
    })

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page
      try {
        const res = await axios.get(`http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`)
        numberOfTodos.value = res.headers['x-total-count']
        todos.value = res.data
      } catch(err) {
        console.log(err)
        triggerToast('DB 연결 오류', 'danger')
      }
    }

    getTodos()

    const addTodo = async (todo) => { // 자식 컴포넌트에서 받아온 데이터가 todo에 저장됨
      // 데이터베이스에 todo를 저장
      error.value = '';
      try {
        await axios.post('http://localhost:3000/todos', {
          subject: todo.subject,
          completed: todo.completed
        })
        getTodos(1)
      } catch (err) {
        console.log(err)
        triggerToast('DB 연결 오류', 'danger')
      }
    }

    const toggleTodo = async (index, checked) => {
      error.value = ''
      const id = todos.value[index].id
      try{
        await axios.patch('http://localhost:3000/todos/' + id, {
          completed: checked
        })
        todos.value[index].completed = checked
      } catch (err) {
        console.log(err)
        triggerToast('DB 연결 오류', 'danger')
      }
    }

    const deleteTodo = async (index) => {
      error.value = ''
      const id = todos.value[index].id
      try {
        await axios.delete('http://localhost:3000/todos/' + id)
        getTodos(1)
      } catch(err) {
        console.log(err)
        triggerToast('DB 연결 오류', 'danger')
      }
    }

    const moveToCreatePage = () => {
      router.push({
        name: 'TodoCreate'
      })
    }

    let timeout = null
    const searchTodo = () => {
      clearTimeout(timeout)
      getTodos(1)
    }

    watch(searchText, () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        getTodos(1)
      }, 1000)
    })

    return {
      todos,
      addTodo,
      deleteTodo,
      toggleTodo,
      searchText,
      error,
      getTodos,
      numberOfTodos,
      limit,
      currentPage,
      numberOfPages,
      searchTodo,
      toastMessage,
      toastAlertType,
      showToast,
      moveToCreatePage,
    }
  }
}
</script>

<style scoped>

</style>
