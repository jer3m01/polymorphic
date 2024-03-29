import {Component, ComponentProps, JSX, splitProps, ValidComponent} from "solid-js";
import { Dynamic } from "solid-js/web";

// Combine T and P by overwriting T
export type OverrideProps<T, P> = Omit<T, keyof P> & P;

// Common polymorphic attributes
export interface PolymorphicAttributes<T extends ValidComponent> {
	as?: T | keyof JSX.HTMLElementTags;
	ref?: HTMLElement | ((el: HTMLElement) => void);
	id?: string;
	class?: string;
	classList?: {
		[k: string]: boolean | undefined;
	};
}

// Props accepted by a polymorphic component
export type PolymorphicProps<
	T extends ValidComponent,
	Props extends {} = {},
  RenderProps extends {} = {},
> = OverrideProps<
	ComponentProps<T>, // Override props from custom/tag component with our own
		Props & // Accept custom props of our own component
		Partial<RenderProps> & // Accept custom props that pass through
		PolymorphicAttributes<T>
>;

// Optional helper type to get the exact props
export type PolymorphicCallbackProps<
  CustomProps extends {},
	BaseProps extends {},
	RenderProps extends {},
> = Omit<CustomProps, keyof BaseProps | keyof RenderProps> & RenderProps

/**
 * Polymorphic override of the `Dynamic` component.
 */
export function Polymorphic<RenderProps>(
	props: RenderProps &
		PolymorphicAttributes<ValidComponent> & {
			others: Record<string, unknown>;
		},
): JSX.Element {
	const [local, custom, others] = splitProps(props, ["as"], ["others"]);

	return (
		// @ts-ignore: Props are valid but too complicated and not worth calculating
		<Dynamic component={local.as} {...custom} {...others} />
	);
}
