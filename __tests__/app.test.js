const request = require("supertest");
const baseURL = "http://localhost:3000";

// GET ALL GROCERY ITEMS
describe("GET /api/data", () => {
    const newGroceryItem = {
        name: "milk",
        quantity: 1,
        price: 2.99,
        bought: false,
    };

    beforeAll(async () => {
        // set up a test grocery item
        await request(baseURL).post("/api/data").send(newGroceryItem);
    });

    afterAll(async () => {
        await request(baseURL).delete(`/api/data?name=${newGroceryItem.name}`);
    });

    it("should return 200", async () => {
        const response = await request(baseURL).get("/api/data");
        expect(response.statusCode).toBe(200);
    });

    it("should return list of grocery items", async () => {
        const response = await request(baseURL).get("/api/data");
        console.log(response.body);
        expect(response.body.length >= 0).toBe(true);
    });
});

// POST NEW GROCERY ITEM
describe("POST /api/add", () => {
    const newGroceryItem = {
        name: "milk",
        quantity: 1,
        price: 2.99,
        bought: false,
    };

    afterAll(async () => {
        await request(baseURL).delete(`/api/add?name=${newGroceryItem.name}`);
    });

    it("should return 201", async () => {
        const response = await request(baseURL)
            .post("/api/add")
            .send(newGroceryItem);
        expect(response.statusCode).toBe(201);
    });
});
// UPDATE GROCERY ITEM
describe("Update one grocery item", () => {

    const updateData = {
        "index": 1,
    };

    beforeAll(async () => {
        // Set the initial "bought" status to false for the item at validIndex
        const initialItem = {
            name: "example item",
            quantity: 1,
            price: 2.99,
            bought: false,
        };
        await request(baseURL).post("/api/data").send(initialItem);
    });

    it("should update the grocery item if it exists", async () => {
        const response = await request(baseURL)
            .put(`/api/edit`)
            .send(updateData);

        expect(response.statusCode).toBe(200); // Use 200 if it's a successful update

        // Verify that the "bought" status has been updated for the item
        const updatedResponse = await request(baseURL).get("/api/data");
        const updatedItem = updatedResponse.body[1 - 1];
        expect(updatedItem.bought).toBe(true); // Assuming you are toggling it to true
    });

    it("should handle invalid index", async () => {
        const invalidIndex = 999; // Replace with an invalid index
        const invalidUpdateData = {
            index: invalidIndex,
        };

        const response = await request(baseURL)
            .put(`/api/edit`)
            .send(invalidUpdateData);

        expect(response.statusCode).toBe(404); // Expect a 404 status code for invalid index
    });
});



// DELETE A GROCERY ITEM
describe("Delete one grocery item", () => {

    const itemToDelete = {
        index: 1,
    };

    beforeAll(async () => {
        await request(baseURL).post("/api/remove").send(itemToDelete);
    });

    it("should delete one grocery list item", async () => {
        const response = await request(baseURL)
            .delete("/api/remove")
            .send({ index: 1 }); // Specify the index of the item to delete

        expect(response.statusCode).toBe(200); // Use 200 for a successful deletion
    });

    it("should handle invalid index", async () => {
        const invalidIndex = 999; // Replace with an invalid index
        const invalidItem = {
            index: invalidIndex,
        };

        const response = await request(baseURL)
            .delete(`/api/remove?index=${invalidIndex}`)
            .send(invalidItem);

        expect(response.statusCode).toBe(404); // Expect a 404 status code for invalid index
    });
});
