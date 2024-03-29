import { JSXElement } from "solid-js";
import {Button, ButtonProps, RenderButtonProps} from "./Button";
import {PolymorphicCallbackProps} from "../polymorphic";

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
		<Button
			requiredOption="requiredOptionValue"
			myProp={4}
			as={(props: PolymorphicCallbackProps<Custom, ButtonProps, RenderButtonProps>) => { // Helper type
				type PropsType = typeof props; // Exact props type

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
		<Button<typeof CustomButton> // Also technically works but less accurate than above
			requiredOption="requiredOptionValue"
			as={(props) => {
				type PropsType = typeof props; // Treated as Custom instead of the exact props

				return CustomButton({ variant: "custom", ...props });
			}}
			myProp="doesnt work, myProp is `number`" // inherited from custom `as` (in this case because of the `Button<typeof CustomButton>`)
		/>
	);
}