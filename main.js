import fs from 'fs';

import Instagram from "./modules/instagram.js";
import config from "./config.js";
import Logger from "./modules/logger.js";

class UsernameManager {
  constructor(startIndex, endIndex, usernames) {
    this.usernames = usernames.slice(startIndex, endIndex);
    this.currentUsername = 0;
  }

  getNextUsername() {
    if (this.currentUsername >= this.usernames.length) {
      return null;
    }
    return this.usernames[this.currentUsername++];
  }
}

class ProxyManager {
  constructor(startIndex, endIndex, proxies) {
    this.proxies = proxies.slice(startIndex, endIndex);
    this.currentProxy = 0;
  }

  getNextProxy() {
    if (this.currentProxy >= this.proxies.length) {
      return null;
    }
    return this.proxies[this.currentProxy++];
  }
}

async function thread(ID, usernames, proxies) {
  const chunkSize = Math.floor(usernames.length / config.threads);
  const startIndex = (ID - 1) * chunkSize;
  const endIndex = ID === config.threads ? usernames.length : startIndex + chunkSize;

  const threadUsernameManager = new UsernameManager(startIndex, endIndex, usernames);
  const threadProxyManager = new ProxyManager(startIndex, endIndex, proxies);

  while (true) {
    const username = threadUsernameManager.getNextUsername();
    const proxy = threadProxyManager.getNextProxy();

    if (!username || !proxy) {
      return;
    }

    await removeLineFromFile(config.usernameFile, username);
    await removeLineFromFile(config.proxyFile, proxy);

    const instagram = new Instagram('http://' + proxy);
    await instagram.register(ID, username);
  }
}

async function removeLineFromFile(filePath, lineToRemove) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const lines = data.split('\n');
    const filteredLines = lines.filter(line => line.trim() !== lineToRemove.trim());
    await fs.promises.writeFile(filePath, filteredLines.join('\n'));
  } catch (error) {
    Logger.log("ERROR", `Failed to remove line from ${filePath}`, { error });
  }
}

(async () => {
  const data = await fs.promises.readFile(config.usernameFile, 'utf8');
  const usernames = data.split('\n').map(username => username.trim()).filter(username => username.length > 0);
  
  const proxyData = await fs.promises.readFile(config.proxyFile, 'utf8');
  const proxies = proxyData.split('\n').map(proxy => proxy.trim()).filter(proxy => proxy.length > 0);

  const threadPromises = [];
  for (let i = 0; i < config.threads; i++) {
    threadPromises.push(thread(i + 1, usernames, proxies));
  }

  await Promise.all(threadPromises);
  Logger.log("DONE", "All Accounts Created", { Success: true });
})();