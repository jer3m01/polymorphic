import { Component, Show, For } from "solid-js";
import {Dynamic} from "solid-js/web";
import {dynamic} from "./index";


const App: Component = () => {
	return (
		<div>
			<For each={new Array(100000)}>
				{() => !dynamic ? <button /> : <Dynamic component="button"/>}
			</For>
		</div>
	);
};

export default App;
