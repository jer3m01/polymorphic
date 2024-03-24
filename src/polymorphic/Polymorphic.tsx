import { Component, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export type ValidTagComponent = keyof JSX.HTMLElementTags | Component<any>;

export type TagComponentProps<T extends ValidTagComponent> = T extends keyof JSX.HTMLElementTags ? JSX.HTMLElementTags[T] : T extends Component<infer P> ? P : Record<string, unknown>;

type ExtractProps<T extends {}, Props extends {}> = Pick<T, keyof T & keyof Props>;

type ElementHasProps<T extends keyof JSX.HTMLElementTags, Props extends {}> = Props extends ExtractProps<JSX.HTMLElementTags[T], Props> ? T : never;

export type ValidPElementTags<Props extends {}> = {
	[Key in keyof JSX.HTMLElementTags]: ElementHasProps<Key, Props>;
}[keyof JSX.HTMLElementTags];

export type ValidPComponent<T extends ValidTagComponent, RenderProps extends {}> = ValidPElementTags<RenderProps> | Component<ExtractProps<T, RenderProps & PolymorphicAttributes<T>>>;

export interface PolymorphicAttributes<T extends ValidTagComponent> {
	as?: T;
	ref?: HTMLElement | ((el: HTMLElement) => void);
	id?: string;
	class?: string;
	classList?: {
		[k: string]: boolean | undefined;
	};
}

export type PolymorphicProps<T extends ValidTagComponent, RenderProps extends {} = {}, ComponentProps extends {} = {}> = TagComponentProps<T> & Partial<RenderProps> & ComponentProps & PolymorphicAttributes<T>;

export type OverrideProps<T, P> = Omit<T, keyof P> & P;

/**
 * Polymorphic override of the `Dynamic` component.
 */
export function Polymorphic<T extends ValidTagComponent>(props: OverrideProps<TagComponentProps<T>, PolymorphicAttributes<T>>): JSX.Element {
	const [local, others] = splitProps(props, ['as']);

	return (
		// @ts-ignore
		<Dynamic
			component={local.as}
			{...others}
			/>
		);
}