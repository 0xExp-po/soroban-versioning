import { chromium, type BrowserContext, type Page } from "playwright";
import { expect } from "playwright/test";
import { wallet1, wallet2, walletExtensionPath } from "./constants";
import type { IWallet } from "./interfaces";

const elapse = 100;

const getPage = (context: BrowserContext, index: number, timeout = 20000) =>
  new Promise<Page>((resolve, reject) => {
    let time = 0;
    const intervalId = setInterval(() => {
      time += elapse;
      if (time >= timeout) {
        clearInterval(intervalId);
        reject(new Error("Timeout"));
      }
      const pages = context.pages();
      if (!pages[index]) return;
      clearInterval(intervalId);
      resolve(pages[index]);
    }, elapse);
  });

const connectWalletWithSeeds = async (page: Page, wallet: IWallet) => {
  await page.getByText("Import wallet").click();
  await page.getByTestId("account-creator-password-input").click();
  await page
    .getByTestId("account-creator-password-input")
    .fill(wallet.password);
  await page.getByTestId("account-creator-confirm-password-input").click();
  await page
    .getByTestId("account-creator-confirm-password-input")
    .fill(wallet.password);
  await page.getByText("I have read and agree to").click();
  await page.getByTestId("account-creator-submit").click();
  for (let i = 0; i < wallet.seeds!.length; i++) {
    await page
      .locator(`#MnemonicPhrase-${i + 1}`)
      .fill(wallet.seeds?.[i] || "");
  }
  await page.getByRole("button", { name: "Import" }).click();
  await expect(page.getByText("You’re all set!")).toBeVisible();
  await page.goBack();
  await page.goBack();
  await page.getByTestId("network-selector-open").click();
  await page.getByText("Test Net").click();
  await page.close();
};

const connectWalletWithSecretKey = async (page: Page, wallet: IWallet) => {
  await page
    .getByPlaceholder("Your Stellar secret key")
    .fill(wallet.secretKey || "");
  await page.getByPlaceholder("Enter password").fill(wallet.password);
  await page.getByText("I’m aware Freighter can’t").click();
  await page.getByRole("button", { name: "Import" }).click();
  await page.close();
};

export async function setupWallet() {
  const context = await chromium.launchPersistentContext("", {
    headless: false,
    args: [
      `--disable-extensions-except=${walletExtensionPath}`,
      `--load-extension=${walletExtensionPath}`,
    ],
  });

  const pages = context.pages();

  const wallet1Page = await getPage(context, 1);
  if (wallet1Page) {
    await connectWalletWithSeeds(wallet1Page, wallet1);
  }

  const wallet2Page = await context.newPage();
  if (wallet2Page) {
    await wallet2Page.goto(
      "chrome-extension://bcacfldlkkdogcmkkibnjlakofdplcbk/index.html#/account/import",
    );
    await connectWalletWithSecretKey(wallet2Page, wallet2);
  }

  const page = pages[0];

  if (page) {
    await page.goto("/");
    await page.getByTestId("connect-wallet-button").click();
    await page.getByText("Freighter").click();
    const walletPage = await getPage(context, 1);
    await walletPage.getByRole("button", { name: "Connect" }).click();
  }

  return {
    context,
    page,
    changeWallet: async (index: number) => {
      const walletPage = await context.newPage();
      await walletPage.goto(
        "chrome-extension://bcacfldlkkdogcmkkibnjlakofdplcbk/index.html#/account",
      );
      await walletPage
        .getByTestId("account-list-identicon-button")
        .first()
        .click();
      await walletPage
        .getByTestId("account-list-identicon-button")
        .nth(index)
        .click();
      await walletPage.close();
    },
    sign: async () => {
      const walletPage = await getPage(context, 1);
      await walletPage.getByRole("button", { name: "Sign" }).click();
    },
    reviewAndSign: async () => {
      const walletPage = await getPage(context, 1);
      await walletPage.getByText("Review").click();
      await walletPage.getByText("Approve and continue").click();
      await walletPage.getByText("Sign Transaction").click();
    },
  };
}

export async function closeWallet(context: BrowserContext) {
  await context.close();
}