import { Log } from "./Logger";

Log({
    level:"debug",
    message: "This is a test log message",
    package:"config",
    stack: "backend"
})

import * as Types from "./types";

export { Types , Log } 