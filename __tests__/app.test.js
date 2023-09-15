const {
    groceryItems,
    get,
    post,
    put,
    deleteItems,
} = require("../src/app");
const { closeServer } = require("../src/app");
describe("Testing API functions", () => {
    // Initialize and clean up groceryItems before and after tests
    beforeAll(() => {
        // This runs before any tests in this suite
        groceryItems.length = 0; // Clear the groceryItems array
        groceryItems.push({
            name: "milk",
            quantity: 1,
            price: 2.99,
            purchased: false,
        });
    });

    afterAll(() => {
        // This runs after all tests in this suite
        closeServer();
    });

    describe("GET - Return list of grocery items", () => {
        it("Should return the list of grocery items", async () => {
            let results = await get();

            expect(results.length).toBeGreaterThan(0);

            expect(results[0]).toStrictEqual({
                name: "milk",
                quantity: 1,
                price: 2.99,
                purchased: false,
            });
        });
    });

    describe("POST - Add a new item to the grocery list", () => {
        let newItem = {
            name: "butter",
            quantity: 1,
            price: 4.99,
            purchased: false,
        };

        it("Should add a new item to the grocery list", async () => {
            let results = await post(newItem);

            expect(results.message).toBe("New item added successfully");

            expect(results.item).toStrictEqual({
                name: "butter",
                quantity: 1,
                price: 4.99,
                purchased: false,
            });
        });
    });

    describe("PUT - Update a purchased status of grocery list item", () => {
        it("Should update the purchased status to true for a given item", async () => {
            let results = await put("milk");

            expect(results).toStrictEqual({
                name: "milk",
                quantity: 1,
                price: 2.99,
                purchased: true,
            });
        });
    });

    describe("DELETE - Remove an item from the grocery list", () => {
        it("Should remove the given item from the grocery list", async () => {
            let results = await deleteItems("milk");

            console.log(results);

            expect(results).toStrictEqual({
                name: "milk",
                quantity: 1,
                price: 2.99,
                purchased: true,
            });
        });
    });
});
