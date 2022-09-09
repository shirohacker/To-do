<template>
  <div v-if="loading">
    Loading...
  </div>
  <form v-else @submit.prevent="onSave"> <!-- Submit하면 Onsave 실행 -->
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>제목</label>
          <input v-model="todo.subject" type="text" class="form-control">
          <div v-if="subjectError" style="color: red">{{ subjectError }}</div> <!-- To-do 제목이 비었을 때 오류 출력 -->
        </div>
      </div>
      <div v-if="editing" class="col-6">  <!-- Todo 수정 상태일때만 표시 -->
        <div class="form-group">
          <label>상태</label>
          <div>
            <button type="button" class="btn" :class="todo.completed ? 'btn-success' : 'btn-danger'" @click="toggleTodoStatus">
              {{todo.completed ? '완료' : '미완료'}}
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">  <!-- Todo 수정 상태일때만 표시 -->
        <div class="form-group">
          <label>내용</label>
          <textarea v-model="todo.body" class="form-control" cols="30" rows="10"> </textarea>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">{{ editing ? '업데이트' : '생성'}}</button>
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
import { useToast } from '@/composables/toast'

export default {
  components: {
    Toast
  },
  props: {
    editing: {  // 기본적으로 TodoForm을 생성하는 form으로 사용하고, editing이 true면 수정 페이지로 사용한다.
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const todo = ref({
      subject: '',
      completed: false,
      body: ''
    })  // To-do 데이터가 저장되는 변수
    const subjectError = ref('')
    const originalTodo = ref(null)  // 기존 데이터
    const loading = ref(false)
    const todoId = route.params.id

    const { toastMessage, toastAlertType, showToast, triggerToast } = useToast();

    const getTodo = async () => {
      loading.value = true
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`)
        todo.value = {...res.data} // To-do 데이터를 가져와서 to-do 변수에 저장
        originalTodo.value = {...res.data}
        loading.value = false
      } catch (error) {
        loading.value = false
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

    const onSave = async () => {  // To-do 변경사항 업데이트
      subjectError.value = ''
      if (!todo.value.subject) {
        subjectError.value = 'Todo 제목은 필수입니다.'
        return;
      }

      try {
        let res;
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body
        }
        if (props.editing) {  // To-do 수정상태일때
          res = await axios.put(`http://localhost:3000/todos/${todoId}`, data)
          originalTodo.value={...res.data}  // 업데이트가 된 후
        } else {  // To-do 생성 상태일 때
          res = await axios.post(`http://localhost:3000/todos`, data)
          todo.value.subject = ''
          todo.value.body = ''
        }
        const message = '성공적으로 ' + (props.editing ? '업데이트 되었습니다!' : '생성되었습니다!')
        triggerToast(message)  // Toast 실행
      } catch (error) {
        triggerToast('DB 연결 오류', 'danger')
      }
    }

    if (props.editing) {
      getTodo() // getTodo 함수 실행
    }

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
      subjectError,
    }
  }
}
</script>

<style scoped>

</style>