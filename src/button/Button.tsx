import { JSXElement, splitProps } from "solid-js";
import { Polymorphic, PolymorphicProps, ValidPComponent } from "../polymorphic";

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

export function Button<
	T extends ValidPComponent<T, RenderButtonProps> = "button",
>(props: PolymorphicProps<T, RenderButtonProps, ButtonProps>): JSXElement {
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
			/*
			 * Props that are inherited from custom `as`, not possible to determine using types.
			 *
			 * Note: You to tell the type but it cannot be used to extract any usefull information.
			 *       This type is generic so impossible to effectively determine and is explicitely
			 *       treated as `unknown`.
			 *       The props accepted by the Button component itself serve as a safeguard and
			 *       already provide all required features. See more `src/button/examples.tsx`.
			 */
			custom={others}
		>
			{local.children}
		</Polymorphic>
	);
}
