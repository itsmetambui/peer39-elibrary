import { faker } from "@faker-js/faker";
import { expect, Locator,test } from "@playwright/test";

test.describe("authors", () => {
  test("should allow me to add new author", async ({ page }) => {
    const fullName = faker.person.fullName();

    page.route("**/api/authors", async (route) => {
      const request = route.request();
      const method = request.method();
      const postData = request.postDataJSON() as Record<string, string>;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(postData),
      });

      expect(method).toBe("POST");
      expect(postData).toEqual({
        fullName,
      });
    });

    await page.goto("/authors/add");

    const fullNameInput = page.getByLabel("Full name");
    await fullNameInput.fill(fullName);
    await fullNameInput.press("Enter");
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });

  test("should show correct author list", async ({ page }) => {
    const mockAuthors = generateMockAuthors();
    await page.route("**/api/authors", async (route) => {
      await route.fulfill({ json: mockAuthors });
    });

    await page.goto("/authors");

    const totalRows = page.locator("table tbody tr");
    await expect(totalRows).toHaveCount(5);

    await expectAuthorRowData(totalRows.nth(0), mockAuthors[0]);
    await expectAuthorRowData(totalRows.nth(1), mockAuthors[1]);
    await expectAuthorRowData(totalRows.nth(2), mockAuthors[2]);
    await expectAuthorRowData(totalRows.nth(3), mockAuthors[3]);
    await expectAuthorRowData(totalRows.nth(4), mockAuthors[4]);

    await expect(page.getByText(mockAuthors[5].fullName)).not.toBeVisible();
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });

  test("should delete the correct author", async ({ page }) => {
    const mockAuthors = generateMockAuthors();

    await page.route("**/api/authors", async (route) => {
      await route.fulfill({ json: mockAuthors });
    });

    page.route("**/api/authors/*", async (route) => {
      const request = route.request();
      const method = request.method();

      expect(method).toBe("DELETE");
      expect(request.url().includes(mockAuthors[0].id)).toBe(true);
      await route.fulfill({
        status: 204,
      });
    });

    await page.goto("/authors");

    const totalRows = page.locator("table tbody tr");
    await expect(totalRows).toHaveCount(5);

    await totalRows
      .nth(0)
      .getByRole("button", { name: "Delete author" })
      .click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });

  test("should allow to edit the correct author", async ({ page }) => {
    const mockAuthors = generateMockAuthors();
    const oldAuthor = mockAuthors[0];
    const toBeUpdatedAuthor = {
      id: oldAuthor.id,
      fullName: faker.person.fullName(),
    };

    page.route(`**/api/authors/${oldAuthor.id}`, async (route) => {
      const request = route.request();
      const method = request.method();
      if (method === "GET") {
        await route.fulfill({ json: oldAuthor });
        return;
      }
      const postData = request.postDataJSON() as Record<string, string>;

      expect(method).toBe("PUT");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(postData),
      });

      expect(postData).toEqual({
        fullName: toBeUpdatedAuthor.fullName,
      });
    });

    await page.goto(`/authors/edit/${oldAuthor.id}`);

    const titleInput = page.getByLabel("Full name");
    await expect(titleInput).toHaveValue(oldAuthor.fullName);
    await titleInput.fill(toBeUpdatedAuthor.fullName);
    await titleInput.press("Enter");
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });
});

const generateMockAuthors = () => {
  const mockAuthors = [
    { id: "1", fullName: faker.person.fullName(), numberOfBooks: 1 },
    { id: "2", fullName: faker.person.fullName(), numberOfBooks: 10 },
    { id: "3", fullName: faker.person.fullName(), numberOfBooks: 4 },
    { id: "4", fullName: faker.person.fullName(), numberOfBooks: 2 },
    { id: "5", fullName: faker.person.fullName(), numberOfBooks: 3 },
    { id: "6", fullName: faker.person.fullName(), numberOfBooks: 5 },
  ];
  return mockAuthors;
};

const expectAuthorRowData = async (
  locator: Locator,
  author: {
    id: string;
    fullName: string;
    numberOfBooks: number;
  }
) => {
  return Promise.all([
    await expect(locator).toContainText(author.id),
    await expect(locator).toContainText(author.fullName),
    await expect(locator).toContainText(author.numberOfBooks.toString()),
  ]);
};
