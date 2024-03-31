/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		"Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
	);
}

export const dynamic = false;

const measurements: number[] = [];

for (let i = 0; i < 10; i++) {
	root!.innerHTML = "";

	console.log("measuring...")

	const time = performance.now();

	render(() => <App />, root!);

	const ms = performance.now() - time;

	measurements.push(ms);

	console.log(`took ${ms}ms`);
}

console.log(`${dynamic ? "Dynamic" : "Static"}: ${measurements.join("ms, ")}ms, avg: ${measurements.reduce((a, b) => a + b, 0) / measurements.length}ms`)