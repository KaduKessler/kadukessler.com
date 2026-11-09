import { fileURLToPath } from "node:url";
import { createStaticServer } from "./static-server.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 3000);
createStaticServer(root).listen(port, "0.0.0.0", () => {
	console.log(`Listening on port ${port}`);
});
