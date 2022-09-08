<template>
  <h1>To-Do Page</h1>
  <div v-if="loading">
    Loading...
  </div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>제목</label>
          <input v-model="todo.subject" type="text" class="form-control">
        </div>
      </div>
      <div class="col-6">
      <div class="form-group">
        <label>상태</label>
        <div>
          <button type="button" class="btn" :class="todo.completed ? 'btn-success' : 'btn-danger'" @click="toggleTodoStatus">
            {{todo.completed ? '완료' : '미완료'}}
          </button>
        </div>
      </div>
    </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">저장</button>
    <button class="btn btn-outline-dark m-lg-2" @click="moveToTodoListPage">취소</button>
  </form>
  <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType"/>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ref, computed } from "vue";
import _ from 'lodash'
import Toast from '@/components/Toast'

export default {
  components: {
    Toast
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const todo = ref(null)  // To-do 데이터가 저장되는 변수
    const originalTodo = ref(null)  // 기존 데이터
    const loading = ref(true)
    const showToast = ref(false)
    const toastMessage = ref('')  // props를 이용해서 Toast 컴포넌트로 넘겨주기 위한 변수
    const toastAlertType = ref('')
    const todoId = route.params.id

    const getTodo = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`)
        todo.value = {...res.data} // To-do 데이터를 가져와서 to-do 변수에 저장
        originalTodo.value = {...res.data}
        loading.value = false
      } catch (error) {
        triggerToast('DB 연결 오류', 'danger')
      }
    }

    const todoUpdated = computed(() => {  // todo.value와 originalTodo.value가 같은지 비교
      return !_.isEqual(todo.value, originalTodo.value)
    })

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed
    }

    const moveToTodoListPage = () => {
      router.push({
        name: 'Todos'
      })
    }

    const triggerToast = (message, type = 'success') => {  // toast를 실행시키는 함수
      toastMessage.value = message
      toastAlertType.value = type
      showToast.value = true
      setTimeout(() => {  // 3초후 Toast 사라지도록 만들기
        toastMessage.value = ''
        toastAlertType.value = ''
        showToast.value = false
      }, 3000)
    }

    const onSave = async () => {  // To-do 변경사항 업데이트
      try {
        const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
          subject: todo.value.subject,
          completed: todo.value.completed
        })
        originalTodo.value={...res.data}  // 업데이트가 된 후
        triggerToast('성공적으로 저장되었습니다!')  // Toast 실행
      } catch (error) {
        triggerToast('DB 연결 오류', 'danger')
      }
    }

    getTodo() // getTodo 함수 실행

    return {
      todo,
      loading,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessage,
      toastAlertType,
    }
  }
}
</script>

<style scoped>

</style>
