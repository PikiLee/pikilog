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

```js
	const headings: Heading[] = []
	const env: MarkdownItEnv = {}
	const mdi = MarkdownIt().use(MarkdownItAnchor, {
		callback: (token, info) => {
			const heading = { ...info } as Heading
			heading.tag = token.tag
			headings.push(heading)
		},
	}).use(frontmatterPlugin)
```