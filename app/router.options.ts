import type { RouterOptions } from "@nuxt/schema"
export default <RouterOptions>{
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return {
				el: to.hash,
				top: 300,
				behavior: "smooth",
			}
		}
	},
}
