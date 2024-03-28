import { JSXElement } from "solid-js";
import { Button } from "./Button";
import { ValidPComponent } from "../polymorphic";

// Extract for reference

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
// ----

function example0() {
	return (
		<Button
			requiredOption="requiredOptionValue"
			variant="default"
			onClick={() => "works!"} // Works as it should normally
		/>
	);
}

function example1() {
	return (
		<Button
			as="a"
			requiredOption="requiredOptionValue"
			variant="default"
			href="it.works" // inherited from custom `as`
		/>
	);
}

function example2() {
	return (
		<Button
			as="button"
			requiredOption="requiredOptionValue"
			variant="outline"
			href="heres.an.error" // href doesn't exist on `button`
		/>
	);
}

function example3() {
	return (
		<Button
			as="button"
			requiredOption="requiredOptionValue"
			variant="invalid variant" // variant should be `"outline" | "default"`
		/>
	);
}

function example4() {
	return (
		<Button
			requiredOption="requiredOptionValue"
			onClick={(invalidProp: string) => "error!"} // invalid callback definition, should be correct event or nothing
		/>
	);
}

// Custom component (no children)
// ========================================

interface CustomComponentNoChildren {
	myProp?: number;
	variant?: "custom";
	other?: "customAttribute";
}

function CustomButtonNoChildren(props: CustomComponentNoChildren): JSXElement {
	return "stub";
}

function exampleNoChildren() {
	return (
		<Button
			as={CustomButtonNoChildren} // Doesn't work CustomButtonNoChildren doesn't accept children but Polymorhpic requires it
			requiredOption="requiredOptionValue"
		/>
	);
}

// Custom component (children)
// ========================================

interface Custom {
	myProp?: number;
	variant?: "custom";
	children?: JSXElement;
	other?: "customAttribute";
}

function CustomButton(props: Custom): JSXElement {
	return "";
}

function example5() {
	return (
		<Button
			as={CustomButton}
			requiredOption="requiredOptionValue"
			other="customAttribute"
			myProp={4} // inherited from custom `as`
		/>
	);
}

function example6() {
	return (
		<Button
			as={CustomButton}
			requiredOption="requiredOptionValue"
			myProp={4}
			onClick={() => "doesnt work because CustomButton doesn't have a onClick"}
		/>
	);
}

function example7() {
	return (
		<Button
			as={CustomButton}
			requiredOption="requiredOptionValue"
			variant="custom" // Doesnt work because Polymorphic Button only accepts `"default" | "outline"`
		/>
	);
}

function example8() {
	return (
		<Button<typeof CustomButton> // Needed because the `as` prop is a callback
			requiredOption="requiredOptionValue"
			as={(props) => {
				type PropsType = typeof props; // Typed from generic

				props.children; // JSXElement
				props.type; // "button" | "submit" | undefined
				props.myProp; // number | undefined

				props.as; // does not exist
				props.variant; // does not exist
				props.requiredOption; // does not exist

				return CustomButton({ variant: "custom", ...props }); // Here we can pass `custom` variant
			}}
		/>
	);
}

function example9() {
	return (
		<Button<typeof CustomButton>
			requiredOption="requiredOptionValue"
			as={(props) => {
				type PropsType = typeof props; // Typed from generic

				return CustomButton({ variant: "custom", ...props });
			}}
			myProp="doesnt work, myProp is `number`" // inherited from custom `as` (in this case because of the `Button<typeof CustomButton>`)
		/>
	);
}
