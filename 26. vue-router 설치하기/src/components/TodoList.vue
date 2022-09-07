<template>
  <div v-for="(todo, index) in todos" :key="todo.id" class="card mt-2">
    <div class="card-body p-2 d-flex align-items-center">
      <div class="form-check flex-grow-1">
        <input class="form-check-input" type="checkbox" :checked="todo.completed" @change="toggleTodo(index)">
        <label class="form-check-label" :class="{ todo: todo.completed }">{{ todo.subject }}</label>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click="deleteTodo(index)">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // props: ['todos']  // 부모 컴포넌트에서 지정한 :todos 여기서 데이터를 가져옴
  props: {
    todos: {
      type: Array,  // 타입 지정
      required: true
    }
  },
  emits: ['toggle-todo', 'delete-todo'],
  setup(props, { emit }) {
    const toggleTodo = (index) => {
      emit('toggle-todo', index);
    }

    const deleteTodo = (index) => {
      emit('delete-todo', index);
    }

    return {
      toggleTodo,
      deleteTodo,
    }
  }
}
</script>

<style scoped>
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>
