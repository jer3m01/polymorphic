import { Accessor, Component, createEffect, createSignal } from "solid-js";

export function createTagName(
	ref: Accessor<HTMLElement | undefined>,
	fallback?: Accessor<string | Component | undefined>,
) {
	const [tagName, setTagName] = createSignal(stringOrUndefined(fallback?.()));

	createEffect(() => {
		setTagName(ref()?.tagName.toLowerCase() || stringOrUndefined(fallback?.()));
	});

	return tagName;
}

function stringOrUndefined(value: any) {
	return isString(value) ? value : undefined;
}

function isString(value: unknown): value is string {
	return Object.prototype.toString.call(value) === "[object String]";
}
