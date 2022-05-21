// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Anvil contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecycle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Anvil;
  let hardhatAnvil;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Anvil = await ethers.getContractFactory("Anvil");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatAnvil = await Anvil.deploy();

    // We can interact with the contract by calling `hardhatAnvil.method()`
    await hardhatAnvil.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await hardhatAnvil.owner()).to.equal(owner.address);
    });

    it("Should have the correct starting balance for common items", async function () {
      const ownerBalance = await hardhatAnvil.balanceOf(owner.address, 0);
      expect(await hardhatAnvil.startingCommonCount()).to.equal(ownerBalance);
    });

    it("Should have the correct starting balance for uncommon items", async function () {
      const ownerBalance = await hardhatAnvil.balanceOf(owner.address, 1);
      expect(await hardhatAnvil.startingUncommonCount()).to.equal(ownerBalance);
    });

    it("Should have the correct starting balance for rare items", async function () {
      const ownerBalance = await hardhatAnvil.balanceOf(owner.address, 2);
      expect(await hardhatAnvil.startingRareCount()).to.equal(ownerBalance);
    });

    it("Should have the correct starting balance for legendary items", async function () {
      const ownerBalance = await hardhatAnvil.balanceOf(owner.address, 3);
      expect(await hardhatAnvil.startingLegendaryCount()).to.equal(ownerBalance);
    });
  });

  describe("Transferring", function () {
    it("Transfer from should transfer items", async function () {
      expect(await hardhatAnvil.balanceOf(addr1.address, 0)).to.equal(0);
      await hardhatAnvil.safeTransferFrom(owner.address, addr1.address, 0, 10, "0x00");
      expect(await hardhatAnvil.balanceOf(addr1.address, 0)).to.equal(10);
    });
  });

  describe("Upgrading", function () {
    it("Deterministic upgrading should upgrade 10 common items to one uncommon item", async function () {
      await hardhatAnvil.safeTransferFrom(owner.address, addr1.address, 0, 10, "0x00");
      expect(await hardhatAnvil.balanceOf(addr1.address, 0)).to.equal(10);
      expect(await hardhatAnvil.balanceOf(addr1.address, 1)).to.equal(0);
      await hardhatAnvil.deterministicUpgradeItem(addr1.address, 0);
      expect(await hardhatAnvil.balanceOf(addr1.address, 0)).to.equal(0);
      expect(await hardhatAnvil.balanceOf(addr1.address, 1)).to.equal(1);
    });
  });
});
