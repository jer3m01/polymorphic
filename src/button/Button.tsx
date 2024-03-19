import { JSXElement, splitProps } from "solid-js";
import { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { mergeRefs } from "@solid-primitives/refs";

// Custom props from our Button
interface ButtonProps {
	requiredOption: "requiredOptionValue";
	variant?: "outline" | "default";
}

// Props we expect to pass on to the rendered element
interface RenderButtonProps {
	children: JSXElement; // We *need* to pass `children`
	type?: "button" | "submit"; // We might pass `type`
}
//
//function Button<
//	T extends ValidComponent = "button",
//>(props: PolymorphicProps<T>): JSXElement {
//	let ref: HTMLElement;
//
//	const [local, others] = splitProps(props, [
//		"as",
//		"variant",
//		"children",
//		"requiredOption",
//		"class",
//		"ref",
//	]);
//
//	console.assert(local.requiredOption === "requiredOption");
//
//	const tagName = () => "";
//
//	return (
//		<Dynamic
//			component={local.as}
//			ref={mergeRefs((el) => (ref = el), local.ref)}
//			class={`polymorphic-button ${local.variant} ${local.class ?? ""}`}
//			type={tagName() === "button" ? "button" : undefined}
//			{...others}
//		>
//			{local.children}
//		</Dynamic>
//	);
//}

type CValidComponent = keyof JSX.HTMLElementTags | Component<any>;


type CComponentProps<T extends CValidComponent> = T extends keyof JSX.HTMLElementTags ? JSX.HTMLElementTags[T] : T extends Component<infer P> ? P : Record<string, unknown>;

type ExtractProps<T extends {}, Props extends {}> = Pick<T, keyof T & keyof Props>;

type ElementHasProps<T extends keyof JSX.HTMLElementTags, Props extends {}> = Props extends ExtractProps<JSX.HTMLElementTags[T], B> ? T : never;

type ValidPElementTags<Props extends {}> = {
	[Key in keyof JSX.HTMLElementTags]: ElementHasProps<Key, Props>;
}[keyof JSX.HTMLElementTags];

type RequiredFieldsOnly<T> = {
	[K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
}

type ValidPComponent<Props extends {}> = Component;


interface PolymorphicAttributes<T extends CValidComponent> {
	as?: T;
}

export type PolymorphicProps<T extends CValidComponent> = CComponentProps<T> & PolymorphicAttributes<T>;


// type?: "submit" | "reset" | "button"

type t3 = JSX.HTMLElementTags["a"]["href"];

type t4 = Required<JSX.HTMLElementTags["a"]>["href"];

type t2 = ValidPElementTags<{href: string}>

type t = ElementHasProps<"button", {type?: "submit" | "reset" | "button"}>



type A = {href?: "submit", other: true};
type B = {href: "submit"};
type C = {
	C: A;
};

type t5 = Required<A> extends B ? true : false;

type t6 = B extends ExtractProps<A, B> ? true : false;

type AA = (args: A) => "";

type t10 = B extends ExtractProps<ComponentProps<"C">, B> ? true : false;

function test<T extends ValidPElementTags<B> | Component<RequiredFieldsOnly<B>>>(t: T) {}

test("button");

test((a: {href?: "submit", other: true}) => "");

type a = {
	a: string,
	b: "no",
};

type b = {
	a: "why",
	c: "ok",
}

type c = ExtractProps<a, b>;

type f = "a" | "b";

type g = "b" | "c";

type h = f & g;