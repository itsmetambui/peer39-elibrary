import { faker } from "@faker-js/faker";
import { expect, Locator,test } from "@playwright/test";

test.describe("books", () => {
  test("should allow me to add new book", async ({ page }) => {
    // Mock the authors api call
    const title = faker.lorem.words();
    const publishedYear = faker.date.past().getFullYear();
    const mockAuthorNames = [
      faker.person.fullName(),
      faker.person.fullName(),
      faker.person.fullName(),
    ];
    await page.route("**/api/authors", async (route) => {
      const authors = mockAuthorNames.map((fullName, index) => ({
        id: index.toString(),
        fullName,
      }));
      await route.fulfill({ json: authors });
    });

    page.route("**/api/books", async (route) => {
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
        title,
        publishedYear: publishedYear,
        authors: ["0", "1"],
      });
    });

    await page.goto("/books/add");

    const titleInput = page.getByLabel("Title");
    await titleInput.fill(title);

    const yearInput = page.getByLabel("Published year");
    await yearInput.fill(publishedYear.toString());

    const authorsInput = page.getByPlaceholder("Select authors...");
    await authorsInput.fill(mockAuthorNames[0]);
    await authorsInput.press("Enter");

    await authorsInput.fill(mockAuthorNames[1]);
    await authorsInput.press("Enter");
    await page.keyboard.press("Escape");

    await page.getByText("Submit").click();
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });

  test("should show correct book list", async ({ page }) => {
    const { mockBooks } = generateMockBooksAndAuthors();

    await page.route("**/api/books", async (route) => {
      await route.fulfill({ json: mockBooks });
    });

    await page.goto("/books");

    const totalRows = page.locator("table tbody tr");
    await expect(totalRows).toHaveCount(5);

    await expectBookRowData(totalRows.nth(0), mockBooks[0]);
    await expectBookRowData(totalRows.nth(1), mockBooks[1]);
    await expectBookRowData(totalRows.nth(2), mockBooks[2]);
    await expectBookRowData(totalRows.nth(3), mockBooks[3]);
    await expectBookRowData(totalRows.nth(4), mockBooks[4]);

    await expect(page.getByText(mockBooks[5].title)).not.toBeVisible();
    await expect(
      page.getByText(mockBooks[5].authors[1].fullName)
    ).not.toBeVisible();
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });

  test("should delete the correct book", async ({ page }) => {
    const { mockBooks } = generateMockBooksAndAuthors();

    await page.route("**/api/books", async (route) => {
      await route.fulfill({ json: mockBooks });
    });

    page.route("**/api/books/*", async (route) => {
      const request = route.request();
      const method = request.method();

      expect(method).toBe("DELETE");
      expect(request.url().includes(mockBooks[0].id)).toBe(true);
      await route.fulfill({
        status: 204,
      });
    });

    await page.goto("/books");

    const totalRows = page.locator("table tbody tr");
    await expect(totalRows).toHaveCount(5);

    await totalRows.nth(0).getByRole("button", { name: "Delete book" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });

  test("should allow to edit the correct book", async ({ page }) => {
    const { mockBooks, mockAuthors } = generateMockBooksAndAuthors();
    const oldBook = mockBooks[0];
    const toBeUpdatedBook = {
      id: oldBook.id,
      title: faker.lorem.words(),
      authors: [mockAuthors[2], mockAuthors[3]],
      publishedYear: faker.date.past().getFullYear(),
    };

    await page.route("**/api/authors", async (route) => {
      await route.fulfill({ json: mockAuthors });
    });

    page.route(`**/api/books/${oldBook.id}`, async (route) => {
      const request = route.request();
      const method = request.method();
      if (method === "GET") {
        await route.fulfill({ json: oldBook });
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
        title: toBeUpdatedBook.title,
        publishedYear: toBeUpdatedBook.publishedYear,
        authors: toBeUpdatedBook.authors.map((author) => author.id),
      });
    });

    await page.goto(`/books/edit/${oldBook.id}`);

    const titleInput = page.getByLabel("Title");
    await expect(titleInput).toHaveValue(oldBook.title);
    await titleInput.fill(toBeUpdatedBook.title);

    const yearInput = page.getByLabel("Published year");
    await expect(yearInput).toHaveValue(oldBook.publishedYear.toString());
    await yearInput.fill(toBeUpdatedBook.publishedYear.toString());

    const authorsInput = page.getByPlaceholder("Select authors...");
    await expect(page.getByText(oldBook.authors[0].fullName)).toBeVisible();
    await authorsInput.press("Backspace");
    await authorsInput.fill(toBeUpdatedBook.authors[0].fullName);
    await authorsInput.press("Enter");
    await authorsInput.fill(toBeUpdatedBook.authors[1].fullName);
    await authorsInput.press("Enter");
    await page.keyboard.press("Escape");

    await page.getByText("Submit").click();
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });
});

const generateMockBooksAndAuthors = () => {
  const mockAuthors = [
    { id: "1", fullName: faker.person.fullName() },
    { id: "2", fullName: faker.person.fullName() },
    { id: "3", fullName: faker.person.fullName() },
    { id: "4", fullName: faker.person.fullName() },
    { id: "5", fullName: faker.person.fullName() },
    { id: "6", fullName: faker.person.fullName() },
    { id: "7", fullName: faker.person.fullName() },
  ];

  const mockBooks = [
    {
      id: "1",
      title: faker.lorem.words(),
      authors: [mockAuthors[0]],
      publishedYear: faker.date.past().getFullYear(),
    },
    {
      id: "2",
      title: faker.lorem.words(),
      authors: [mockAuthors[0], mockAuthors[1]],
      publishedYear: faker.date.past().getFullYear(),
    },
    {
      id: "3",
      title: faker.lorem.words(),
      authors: [mockAuthors[1], mockAuthors[2]],
      publishedYear: faker.date.past().getFullYear(),
    },
    {
      id: "4",
      title: faker.lorem.words(),
      authors: [mockAuthors[2], mockAuthors[3]],
      publishedYear: faker.date.past().getFullYear(),
    },
    {
      id: "5",
      title: faker.lorem.words(),
      authors: [mockAuthors[3], mockAuthors[4], mockAuthors[5]],
      publishedYear: faker.date.past().getFullYear(),
    },
    {
      id: "6",
      title: faker.lorem.words(),
      authors: [mockAuthors[5], mockAuthors[6]],
      publishedYear: faker.date.past().getFullYear(),
    },
  ];

  return { mockBooks, mockAuthors };
};

const expectBookRowData = async (
  locator: Locator,
  book: {
    id: string;
    title: string;
    authors: {
      id: string;
      fullName: string;
    }[];
    publishedYear: number;
  }
) => {
  return Promise.all([
    await expect(locator).toContainText(book.id),
    await expect(locator).toContainText(book.title),
    ...book.authors.map(
      async (author) => await expect(locator).toContainText(author.fullName)
    ),
    await expect(locator).toContainText(book.publishedYear.toString()),
  ]);
};
