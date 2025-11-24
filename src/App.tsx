
import { useState } from "react";
import type { FormEvent } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import type { Schema } from "../amplify/data/resource";
import "./App.css";

// Import outputs safely - file is generated during deployment
let outputs: any = {};
try {
	// Use require for CommonJS compatibility and to avoid module resolution issues
	outputs = require("../amplify_outputs.json");
} catch (e) {
	console.warn("amplify_outputs.json not found - running in build environment");
}

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
	authMode: "userPool",
});

function App() {
	const [result, setResult] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData(event.currentTarget);
			const { data, errors } = await amplifyClient.queries.askBedrock({
				ingredients: [formData.get("ingredients")?.toString() || ""],
			});

			if (!errors) {
				setResult(data?.body || "No data returned");
			} else {
				console.log(errors);
			}
		} catch (e) {
			alert(`An error occurred: ${e}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="app-container">
			<div className="header-container">
				<h1 className="main-header">
					Meet Your Personal
					<br />
					<span className="highlight">Recipe AI</span>
				</h1>
				<p className="description">
					Simply type a few ingredients using the format ingredient1,
					ingredient2, etc., and Recipe AI will generate an all-new
					recipe on
					demand... Andrew Kim CSCE 3420
				</p>
			</div>

			<form onSubmit={onSubmit} className="form-container">
				<div className="search-container">
					<input
						type="text"
						className="wide-input"
						id="ingredients"
						name="ingredients"
						placeholder="Andrew Kim CSCE 3420 made this"
					/>
					<button type="submit" className="search-button">
						Generate
					</button>
				</div>
			</form>

			<div className="result-container">
				{loading ? (
					<div className="loader-container">
						<p>Loading...</p>
						<Loader size="large" />
						<Placeholder size="large" />
						<Placeholder size="large" />
						<Placeholder size="large" />
					</div>
				) : (
					result && <p className="result">{result}</p>
				)}
			</div>
		</div>
	);
}

export default App;