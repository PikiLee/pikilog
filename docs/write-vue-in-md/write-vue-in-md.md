---
title: How to write vue syntax in markdown?
---

### Write the following code in markdown file.
```js
<style>
.hello {
    font-size: 1rem;
    background-color: red;
}
</style>

<h1>{{ count }}</h1>
<button @click="increment" class="hello">Increment</button>	
```

### The following elements would be rendered,
<script>
const count = ref(0)

function increment() {
    count.value++;
}
</script>

<style>
.hello {
    font-size: 1rem;
    background-color: red;
}
</style>

<h1>{{ count }}</h1>
<button @click="increment" class="hello">Increment</button>

