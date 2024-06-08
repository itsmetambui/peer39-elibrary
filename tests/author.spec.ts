import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/authors/add");
});

test.describe("New Author", () => {
  test("should allow me to add new author", async ({ page }) => {
    const author = {
      fullName: faker.person.fullName(),
    };
    const fullNameInput = page.getByLabel("Full name");
    await fullNameInput.fill(author.fullName);
    await fullNameInput.press("Enter");

    await expect(page).toHaveURL("http://127.0.0.1:3000/authors");
    await expect(page.getByText(author.fullName)).toBeVisible();
  });
});
