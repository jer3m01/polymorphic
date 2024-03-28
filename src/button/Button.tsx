import { JSXElement, splitProps } from "solid-js";
import {
	Polymorphic,
	PolymorphicProps,
	ValidPComponent,
} from "../polymorphic";

// Custom props from our Button
interface ButtonProps {
	requiredOption: "requiredOptionValue";
	variant?: "outline" | "default" | undefined;
}

// Props we expect to pass on to the rendered element
interface RenderButtonProps {
	children: JSXElement; // We *need* to pass `children`
	type?: "button" | "submit"; // We might pass `type`
}

function Button<T extends ValidPComponent<T, RenderButtonProps> = "button">(
	props: PolymorphicProps<T, RenderButtonProps, ButtonProps>,
): JSXElement {
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
		<Polymorphic
			component={local.as ?? "button"}
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

interface Custom {
	variant?: "custom";
	children?: JSXElement;
	other?: "customAttribute";
}

function CustomButton(props: Custom): JSXElement {
	return "";
}

export const CustomExample = (
	<Button
		requiredOption="requiredOptionValue"
		variant="default"
		other="customAttribute"
		as={CustomButton}
	/>
);

export const CustomCallbackExample = (
	<Button<typeof CustomButton>
		requiredOption="requiredOptionValue"
		variant="default"
		other="customAttribute"
		as={(props) => {
			return "";
		}}
	/>
);
