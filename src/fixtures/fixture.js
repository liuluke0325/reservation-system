import fixture from 'can-fixture';
import { delay } from "../utils/utils"

fixture("GET /api/verifyCode", async (request, response) => {
    await delay(1000);
    // response(401)
    response(200);
});

export default fixture;