import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("/authors/add");
});

test.describe("New Author", () => {
  test("should allow me to add new author", async ({ page }) => {
    const author = {
      fullName: faker.person.fullName(),
    };
    const fullNameInput = page.getByLabel("Full name");
    await fullNameInput.fill(author.fullName);
    await fullNameInput.press("Enter");

    await expect(page).toHaveURL("/authors");
    await expect(page.getByText(author.fullName)).toBeVisible();
  });
});
