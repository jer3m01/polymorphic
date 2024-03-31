import {JSXElement, ValidComponent, splitProps } from "solid-js";
import { Polymorphic, PolymorphicProps } from "../polymorphic";


// Props we expect to pass on to the rendered element
export interface RenderButtonProps {
	children: JSXElement;
	type?: "button" | "submit";
	ref?: HTMLElement | ((el: HTMLElement) => void);
	class?: string;
}

// Custom props from our Button
export interface ButtonProps {
	requiredOption: "requiredOptionValue";
	variant?: "outline" | "default" | undefined;
}

export function Button<
	T extends ValidComponent = "button",
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

	console.assert(local.requiredOption === "requiredOptionValue"); // test

	const tagName = () => ""; // stub

	return (
		/*
		 * Required to pass render props type to <Polymorphic/>.
		 * This prevents polymorphic developers from using a prop that is not listed
		 * inside the render props type.
		 * It assures the exported API conforms to the actuall implementation.
		 */
		<Polymorphic<RenderButtonProps>
			as={local.as ?? "button"}
			ref={(el) => {
				ref = el;
			}}
			class={`polymorphic-button ${local.variant} ${local.class ?? ""}`}
			type={tagName() === "button" ? "button" : undefined}
			
			{...others}
		>
			{local.children}
		</Polymorphic>
	);
}





function CustomButton<T extends ValidComponent = "button">(props: {
	test: "h",
}): JSXElement {
	return "";
}

function example5() {
	return (
		<Button
			as={CustomButton}
			// missing
			//test="h"
		 	requiredOption="requiredOptionValue"/>
		);
}