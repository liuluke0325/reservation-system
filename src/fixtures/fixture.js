import fixture from 'can-fixture';
import { delay } from "../utils/utils"

// Can change the response to see the different result
fixture("GET /api/verifyCode", async (request, response) => {
    await delay(1000);
    // response(400)
    response(200);
});

fixture("GET /api/isWalletUsed", async (request, response) => {
    await delay(1000);
    // response(400)
    response(200);
});

fixture("GET /api/isEmailUsed", async (request, response) => {
    await delay(1000);
    // response(400)
    response(200);
});


fixture("POST /api/reserve", async (request, response) => {
    await delay(1000);
    // response(400);
    // response(429);
    response(200);
});

export default fixture;