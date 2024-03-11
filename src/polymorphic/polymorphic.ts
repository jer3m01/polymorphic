import { Component, ComponentProps, JSX, ValidComponent } from "solid-js";

type OverrideProps<T, P> = Omit<T, keyof P> & P;

type OptionalKeys<T> = Exclude<
	{
		[K in keyof T]: {} extends Pick<T, K> ? K : never;
	}[keyof T],
	undefined
>;

interface PolymorphicAttributes<T extends ValidComponent> {
	as?: T;
}

export type PolymorphicProps<
	T extends ValidComponent,
	B,
	C = {},
> = OverrideProps<
	ComponentProps<T>,
	B &
		PolymorphicAttributes<
			T extends Component<infer P>
				? Component<Omit<P, keyof (B & PolymorphicAttributes<T>)> & C>
				: T
		> &
		Partial<C>
>;

type ElementWithProps<B> = {
	[Key in keyof JSX.HTMLElementTags]: Required<ComponentProps<Key>> extends B
		? Key
		: never;
}[keyof JSX.HTMLElementTags];

export type ValidPolymorphicComponent<B> =
	| ElementWithProps<Omit<B, OptionalKeys<B>>>
	| Component<Omit<B, OptionalKeys<B>>>;
