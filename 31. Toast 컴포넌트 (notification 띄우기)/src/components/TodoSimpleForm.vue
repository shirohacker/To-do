<template>
  <form @submit.prevent="onSubmit">
    <div class="d-flex">
      <div class="flex-grow-1 me-2">
        <input class="form-control" type="text" v-model="todo" placeholder="새로운 To-do 입력">
      </div>
      <div>
        <button class="btn btn-primary" type="submit">추가</button>
      </div>
    </div>
    <div v-show="hasError" style="color: red">
      To-Do는 빈칸일 수 없습니다.
    </div>
  </form>
</template>

<script>
import { ref } from "vue";

export default {
  emits: ['add-todo'],
  setup(props, { emit }) { // 자식 컴포넌트에서 부모 컴포넌트로 보낼 때 필요한게 context 안에 들어있다.
    const todo = ref('')
    const hasError = ref(false)
    const onSubmit = () => {
      if (todo.value === '') {
        hasError.value = true
      } else {
        emit('add-todo', { // 이 부분을 통해 부모 컴포넌트로 데이터를 보낼 수 있다. add-todo는 이벤트 이름
          // 부모 컴포넌트로 올려줄 오브젝트 설정
          id: Date.now(), // id는 unique 하게 설정
          subject: todo.value, // to-do의 제목을 저장
          completed: false  // 완료된 to-do인지 확인
        })
        hasError.value = false
        todo.value = '' // to-do가 추가되면 입력칸 공백으로 설정
      }
    }

    return {
      todo,
      hasError,
      onSubmit,
    }
  }
}
</script>

<style scoped>

</style>