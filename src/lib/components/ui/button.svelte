<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '$lib/utils.js';

	const buttonVariants = tv({
		base: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		variants: {
			variant: {
				default: 'bg-gray-900 text-white hover:bg-gray-800',
				destructive: 'bg-red-500 text-white hover:bg-red-600',
				outline: 'border border-gray-300 bg-white hover:bg-gray-50',
				secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
				ghost: 'hover:bg-gray-100',
				link: 'text-blue-600 underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	type Variant = VariantProps<typeof buttonVariants>['variant'];
	type Size = VariantProps<typeof buttonVariants>['size'];

	let className: string | undefined | null = undefined;
	export { className as class };
	export let variant: Variant = 'default';
	export let size: Size = 'default';
	export let disabled: boolean = false;
</script>

<button
	class={cn(buttonVariants({ variant, size, className }))}
	{disabled}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</button>