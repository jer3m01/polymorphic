import { JSXElement, splitProps } from "solid-js";
import {
	PolymorphicProps,
	ValidPolymorphicComponent,
} from "../polymorphic/polymorphic";
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

function Button<
	T extends ValidPolymorphicComponent<RenderButtonProps> = "button",
>(props: PolymorphicProps<T, ButtonProps, RenderButtonProps>): JSXElement {
	let ref: HTMLElement;

	const [local, others] = splitProps(props, [
		"as",
		"variant",
		"children",
		"requiredOption",
		"class",
		"ref",
	]);

	console.assert(local.requiredOption === "requiredOption");

	const tagName = createTagName(
		() => ref,
		() => "button",
	);

	return (
		<Dynamic
			component={local.as}
			ref={mergeRefs((el) => (ref = el), local.ref)}
			class={`polymorphic-button ${local.variant} ${local.class ?? ""}`}
			type={tagName() === "button" ? "button" : undefined}
			{...others}
		>
			{local.children}
		</Dynamic>
	);
}
