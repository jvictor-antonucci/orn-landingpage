<script lang="ts">
	import { cn } from '$lib/utils.js';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...$$restProps}>
	<slot />
</div>