<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{name: 'Home'}">Todo List</router-link>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" :to="{name: 'Todos'}">Todos</router-link>
          </li>
        </ul>
    </div>
  </nav>
  <div class="container">
    <router-view/>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
