const { TestHelper } = require("uu_script_devkitg01");

describe("ShoplistMainInit", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {};

    const result = await TestHelper.runScript("shoplist-main/init.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
