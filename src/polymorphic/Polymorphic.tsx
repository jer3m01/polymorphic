import { Component, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

// Restricted subset of all components - This excludes deprecated HTML tags and SVG tags
export type ValidTagComponent = keyof JSX.HTMLElementTags | Component<any>;

// Custom equivalent of solid's ComponentProps type - Subset same as above and flipped ternary operator to optimize infer (not becnhmarked)
export type TagComponentProps<T extends ValidTagComponent> =
	T extends keyof JSX.HTMLElementTags
		? JSX.HTMLElementTags[T]
		: T extends Component<infer P>
		  ? P
		  : Record<string, unknown>;

// Pick from T only props that are common in T and Props
export type ExtractProps<T extends {}, Props extends {}> = Pick<
	T,
	keyof T & keyof Props
>;

// Is element tag T compatible with Props
export type ElementHasProps<
	T extends keyof JSX.HTMLElementTags,
	Props extends {},
> = Props extends ExtractProps<JSX.HTMLElementTags[T], Props> ? T : never;

// Get all keys of T that are optional (i.e. that are annotated with `?` or accept `undefined`)
export type OptionalKeys<T> = Exclude<
	{
		[K in keyof T]: {} extends Pick<T, K> ? K : never;
	}[keyof T],
	undefined
>;

// Combine T and P by overwriting T
export type OverrideProps<T, P> = Omit<T, keyof P> & P;

// Get all tag names that are compatible with Props
export type ValidPElementTags<Props extends {}> = {
	[Key in keyof JSX.HTMLElementTags]: ElementHasProps<Key, Props>;
}[keyof JSX.HTMLElementTags];

// All tag names or custom components compatible with RenderProps - Used as base for polymorphic generics
export type ValidPComponent<
	T extends ValidTagComponent,
	RenderProps extends {},
> =
	| ValidPElementTags<Omit<RenderProps, OptionalKeys<RenderProps>>> // All tag names compatible
	| Component<RenderProps & PolymorphicAttributes<T>>; // Component with compatible props

// Common polymorphic attributes
export interface PolymorphicAttributes<T extends ValidTagComponent> {
	as?: T;
	ref?: HTMLElement | ((el: HTMLElement) => void);
	id?: string;
	class?: string;
	classList?: {
		[k: string]: boolean | undefined;
	};
}

// Props accepted by a polymorphic component
export type PolymorphicProps<
	T extends ValidTagComponent,
	RenderProps extends {} = {},
	ComponentProps extends {} = {},
> = OverrideProps<
	TagComponentProps<T>, // Override props from custom/tag component with our own
	Partial<RenderProps> & // Accept any partial props we forward to the rendered element
		ComponentProps & // Accept custom props of our own component
		PolymorphicAttributes<
			// Handle the `as` prop and other common props
			T extends keyof JSX.HTMLElementTags
				? T // If the element is a native tag, don't analyze further
				: Component<
						// If the element is a custom component, provide exact props for the `as={(props) => {...}}` callback
						Omit<
							OverrideProps<TagComponentProps<T>, RenderProps>,
							"as" | keyof ComponentProps // Remove the as prop and custom props used only in our component
						>
				  >
		>
>;

/**
 * Polymorphic override of the `Dynamic` component.
 */
export function Polymorphic<RenderProps>(
	props: RenderProps &
		PolymorphicAttributes<ValidTagComponent> & {
			custom: Record<string, unknown>;
		},
): JSX.Element {
	const [local, custom, others] = splitProps(props, ["as"], ["custom"]);

	return (
		// @ts-ignore: Props are valid but too complicated and not worth calculating
		<Dynamic component={local.as} {...custom} {...others} />
	);
}
