import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { ProxyAgent, request } from "undici";
import fs from "fs";

import Client from "./client.js";
import Logger from "./logger.js";
import config from "../config.js";
import Useragent from "./useragent.js";

import { purchaseSMS, getActiveOrders, client } from "./smsapi.js";
client(config.smsPool);

function createTimestamp() {}

function generateMid() {}

function generateRandomNumber(baseNumber, range) {}

function signature(data, force) {}

function safetyNetToken(phone) {}

function generateBandwidthMetrics() {}

function generateUploadCode() {}

export default class Instagram {
  constructor(proxy) {}

  __send_request = (url, opts) =>
    new Promise(async (resolve, reject) => {
      const RETRIES = 15;

      const controller = new AbortController();

      for (let i = 0; i < RETRIES; i++) {
        const timeoutId = setTimeout(() => controller.abort(), 13000);

        try {
          if(!opts.noTLS) {
            if (this.values.headers["ig-u-ds-user-id"])
              opts.headers["ig-u-ds-user-id"] =
                this.values.headers["ig-u-ds-user-id"];
            if (this.values.headers["ig-u-rur"])
              opts.headers["ig-u-rur"] = this.values.headers["ig-u-rur"];
            if (this.values.headers["ig-u-shbid"])
              opts.headers["ig-u-shbid"] = this.values.headers["ig-u-shbid"];
            if (this.values.headers["ig-u-shbts"])
              opts.headers["ig-u-shbts"] = this.values.headers["ig-u-shbts"];
            if (this.values.headers["ig-intended-user-id"])
              opts.headers["ig-intended-user-id"] =
                this.values.headers["ig-intended-user-id"];
            if (this.values.headers["ig-u-ig-direct-region-hint"])
              opts.headers["ig-u-ig-direct-region-hint"] =
                this.values.headers["ig-u-ig-direct-region-hint"];

            if (this.values.useragent)
              opts.headers["user-agent"] = this.values.useragent;
            if (this.values.headers["authorization"])
              opts.headers["authorization"] =
                this.values.headers["authorization"];

            if (this.values.headers["x-pigeon-session-id"])
              opts.headers["x-pigeon-session-id"] =
                this.values.headers["x-pigeon-session-id"];
            if (this.values.headers["x-mid"])
              opts.headers["x-mid"] = this.values.headers["x-mid"];
            if (this.values.headers["x-bloks-version-id"])
              opts.headers["x-bloks-version-id"] =
                this.values.headers["x-bloks-version-id"];
            if (this.values.headers["x-ig-www-claim"])
              opts.headers["x-ig-www-claim"] =
                this.values.headers["x-ig-www-claim"];
            if (this.values.headers["x-ig-device-id"])
              opts.headers["x-ig-device-id"] =
                this.values.headers["x-ig-device-id"];
            if (this.values.headers["x-ig-family-device-id"])
              opts.headers["x-ig-family-device-id"] =
                this.values.headers["x-ig-family-device-id"];
            if (this.values.headers["x-ig-android-id"])
              opts.headers["x-ig-android-id"] =
                this.values.headers["x-ig-android-id"];

            const metrics = generateBandwidthMetrics();

            opts.headers = {
              "x-ig-app-locale": "en_US",
              "x-ig-device-locale": "en_US",
              "x-ig-mapped-locale": "en_US",
              "x-pigeon-rawclienttime": createTimestamp(),
              "x-ig-bandwidth-speed-kbps": metrics.speed,
              "x-ig-bandwidth-totalbytes-b": "0",
              "x-ig-bandwidth-totaltime-ms": "0",
              "x-ig-www-claim": "0",
              "x-bloks-prism-button-version": "CONTROL",
              "x-bloks-prism-colors-enabled": "false",
              "x-bloks-prism-ax-base-colors-enabled": "false",
              "x-bloks-prism-font-enabled": "false",
              "x-bloks-is-layout-rtl": "false",
              "x-ig-timezone-offset": "0",
              "x-fb-connection-type": "WIFI",
              "x-ig-connection-type": "WIFI",
              "x-ig-capabilities": "3brTv10=",
              "x-ig-app-id": "567067343352427",
              priority: "u=3",
              // "x-tigon-is-retry": "True,True",
              "user-agent": this.values.useragent,
              "accept-language": "en-US",
              "ig-intended-user-id": "0",
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
              "accept-encoding": "utf-8",
              host: "i.instagram.com",
              "x-fb-http-engine": "Liger",
              "x-fb-client-ip": "True",
              "x-fb-server-cluster": "True",
              connection: "keep-alive",
              ...opts.headers,
              ...this.values.headers,
            };
          }

          if(opts.isUpload) {
            delete opts.headers["x-ig-app-locale"];
            delete opts.headers["x-ig-device-locale"]; 
            delete opts.headers["x-ig-mapped-locale"];
            delete opts.headers["x-pigeon-rawclienttime"];
            delete opts.headers["x-ig-bandwidth-speed-kbps"];
            delete opts.headers["x-ig-bandwidth-totalbytes-b"];
            delete opts.headers["x-ig-bandwidth-totaltime-ms"];
            delete opts.headers["x-bloks-prism-button-version"];
            delete opts.headers["x-bloks-prism-colors-enabled"];
            delete opts.headers["x-bloks-prism-ax-base-colors-enabled"];
            delete opts.headers["x-bloks-prism-font-enabled"];
            delete opts.headers["x-bloks-is-layout-rtl"];
          }

          if(opts.noTLS) {
            opts.dispatcher = this.agent;
            var response = await request(url, opts);
            response.body = await response.body.text();
          } else {
            var response = await this.client.request(url, opts);
          }

          if (opts.log)
            console.log({
              url: url,
              opts: opts,
              proxy: this.proxy,
              response: {
                status: response.status,
                body: await response.body.text(),
              },
            });

            const bodyText =
            response.body instanceof Buffer
              ? response.body.toString()
              : typeof response.body === "string"
                ? response.body
                : await response.body.text();

          if(bodyText.includes("CSRF")) {
            throw { silent: true };
          }

          if (
            bodyText.includes(
              "We're sorry, but something went wrong. Please try again.",
            ) ||
            bodyText.includes('{"body":"","cookies":{') ||
            (bodyText == "" && response.statusCode != 200)
          ) {
            await new Promise((resolve) =>
              setTimeout(
                resolve,
                Math.floor(Math.random() * (2000 - 300 + 1)) + 300,
              ),
            );
            continue;
          }

          if (bodyText.includes("challenge_required")) {
            return resolve("Challenge Required");
          }

          if(response.headers && !opts.defineHeaders) {
            if (response.headers["ig-set-x-mid"])
              this.values.headers["x-mid"] = response.headers["ig-set-x-mid"];
            if (response.headers["x-ig-set-www-claim"])
              this.values.headers.claim = response.headers["x-ig-set-www-claim"];
            if (response.headers["ig-set-ig-u-rur"])
              this.values.headers.rur = response.headers["ig-set-ig-u-rur"];
            if (response.headers["ig-set-ig-u-shbid"])
              this.values.headers.shbid = response.headers["ig-set-ig-u-shbid"];
            if (response.headers["ig-set-ig-u-shbts"])
              this.values.headers.shbts = response.headers["ig-set-ig-u-shbts"];
            if (response.headers["ig-set-ig-u-ds-user-id"])
              this.values.headers.ds_user_id =
                response.headers["ig-set-ig-u-ds-user-id"];
            if (response.headers["x-set-ig-intended-user-id"])
              this.values.headers.intended_user_id =
                response.headers["x-set-ig-intended-user-id"];
            if (response.headers["ig-set-ig-u-ig-direct-region-hint"])
              this.values.headers["ig-u-ig-direct-region-hint"] =
                response.headers["ig-set-ig-u-ig-direct-region-hint"];
          }

          clearTimeout(timeoutId);

          try {
            return resolve(response);
          } catch (error) {
            return resolve(response);
          }
        } catch (error) {
          if (!error.silent) {
            console.log(error);
          }
          continue;
        }
      }

      resolve()
    });
  }

  aymh_create_account_button = async () => {
    try {} catch (error) {
      return false;
    }
  };

  nta_landing_logging = async () => {
    try {} catch (error) {
      return false;
    }
  };

  create_android_keystore = async () => {
    try {} catch (error) {
      return false;
    }
  };

  create_android_playintegrity = async () => {
    try {} catch (error) {
      return false;
    }
  };

  contactpoint_phone = async () => {
    try {} catch (error) {
      return false;
    }
  };

  actionContactpoint_phone = async (phone) => {
    try {} catch (error) {
      return false;
    }
  };

  contactPointVerify_phone = async (code) => {
    try {} catch (error) {
      return false;
    }
  };

  setPassword = async (password, ID) => {
    try {} catch (error) {
      return false;
    }
  };

  setBirthday = async (day, month, year) => {
    try {} catch (error) {
      return false;
    }
  };

  setFullName = async (name) => {
    try {} catch (error) {
      return false;
    }
  };

  setUsername = async (name) => {
    try {} catch (error) {
      return false;
    }
  };

  finishRegister = async () => {
    try {} catch (error) {
    return false;
  }

  uploadImage = async () => {
    try {} catch (error) {
      return false;
    }
  }

  dynamicOnboarding = async () => {
    try {} catch (error) {
      return false;
    }
  }

  setAvatar = async (uploadId) => {
    try {} catch (error) {
      return false;
    }
  }

  setBiography = async (biography) => {
    try {} catch (error) {
      return false;
    }
  }

  setAccountLink = async (link) => {
    try {} catch (error) {
      return false;
    }
  }

  register = async (ID, username) => {
    try {
      let phone = await purchaseSMS("1", "457");

      Logger.log("SMS", "Purchased Phone Number", { Thread: ID, Phone: phone.number });

      if (!await this.aymh_create_account_button()) {
        Logger.log("WARN", "Aymh Create Account Button", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Aymh Create Account Button", { Thread: ID, Result: true });

      if (!await this.nta_landing_logging()) {
        Logger.log("WARN", "Nta Landing Logging", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Nta Landing Logging", { Thread: ID, Result: true });

      if (!await this.create_android_keystore()) {
        Logger.log("WARN", "Keystore", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Android Keystore", { Thread: ID, Result: true });

      if (!await this.create_android_playintegrity()) {
        Logger.log("WARN", "Integrity", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Playstore Integrity", { Thread: ID, Result: true });

      if (!await this.contactpoint_phone()) {
        Logger.log("WARN", "Contact Point Phone", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Contact Point Phone", { Thread: ID, Result: true });

      if (!await this.actionContactpoint_phone('+' + phone.number)) {
        Logger.log("WARN", "Contact Point Phone Action", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Contact Point Phone Action", { Thread: ID, Result: true });

      Logger.log("SMS", "Waiting for SMS", { Thread: ID });

      let code = "";

      for (let i = 0; i < 75; i++) {
        var orders = await getActiveOrders();
        var foundOrder = orders.find(order => order.phonenumber === String(phone.number));
        if(foundOrder.code != '0') {
          code = foundOrder.code;
          break;
        }
        await new Promise((r) => setTimeout(r, 500));
      }

      Logger.log("SMS", "Recieved SMS", { Thread: ID, Code: code });

      if (!await this.contactPointVerify_phone(code)) {
        Logger.log("WARN", "Verify Phone", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Verify Phone", { Thread: ID, Result: true });

      if (!await this.setPassword(config.password + String(Math.floor(Math.random() * 900 + 100)), ID)) {
        Logger.log("WARN", "Password", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Password", { Thread: ID, Result: true });

      const currentYear = new Date().getFullYear();
      const minYear = currentYear - 30;
      const maxYear = currentYear - 18;
      const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
      
      if (!await this.setBirthday(day, month, String(year))) {
        Logger.log("WARN", "Birthday", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Birthday", { Thread: ID, Result: true });

      const fullnames = fs.readFileSync('./assets/fullnames.txt', 'utf8').split('\n').filter(name => name.trim());
      const randomFullname = fullnames[Math.floor(Math.random() * fullnames.length)];

      if (!await this.setFullName(randomFullname)) {
        Logger.log("WARN", "Fullname", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Fullname", { Thread: ID, Result: true });

      if (!await this.setUsername(username)) {
        Logger.log("WARN", "Username", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Username", { Thread: ID, Result: true });

      if(!await this.finishRegister()) {
        Logger.log("WARN", "Finish", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Finish", { Thread: ID, Result: true });

      if(!await this.dynamicOnboarding()) {
        Logger.log("WARN", "Dynamic Onboarding Completed", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Dynamic Onboarding Completed", { Thread: ID, Result: true });

      this.values.headers["authorization"] = this.res.token;
      this.values.headers["x-ig-www-claim"] = this.res.hmac;
      // this.values.headers["x-ig-app-id"] = "936619143392459";
      this.values.headers['ig-intended-user-id'] = this.res.dsUserId;
      this.values.headers['ig-u-ds-user-id'] = this.res.dsUserId;
      this.values.headers['ig-u-rur'] = this.res.rur;
    
      const uploadRes = JSON.parse(await this.uploadImage());

      Logger.log("INSTAGRAM", "Upload Image", { Thread: ID, Result: uploadRes.upload_id });

      const avatarRes = await this.setAvatar(uploadRes.upload_id);

      if(avatarRes.includes("fbid_v2")) {
        Logger.log("INSTAGRAM", "Set Avatar", { Thread: ID, Result: true });
      } else {
        Logger.log("WARN", "Set Avatar", { Thread: ID, Result: false });
        return false;
      }

      const biographies = fs.readFileSync('./assets/biographies.txt', 'utf8').split('\n').filter(bio => bio.trim());
      const randomBio = biographies[Math.floor(Math.random() * biographies.length)];
      if(!await this.setBiography(randomBio)) {
        Logger.log("WARN", "Set Biography", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Set Biography", { Thread: ID, Result: true });

      const links = fs.readFileSync('./assets/links.txt', 'utf8').split('\n').filter(link => link.trim());
      const randomLink = links[Math.floor(Math.random() * links.length)];
      const linkRes = await this.setAccountLink(randomLink);
      console.log(linkRes);
      if(!linkRes) {
        Logger.log("WARN", "Set Account Link", { Thread: ID, Result: false });
        return false;
      }
      Logger.log("INSTAGRAM", "Set Account Link", { Thread: ID, Result: true });

      const parts = [
        phone.number,
        config.fullname,
        this.values.headers["authorization"],
        this.values.headers["x-ig-www-claim"],
        this.values.headers['ig-u-ds-user-id'],
        this.values.headers['ig-u-rur'],
        this.values.headers["x-ig-device-id"],
        this.values.headers["x-ig-android-id"],
        this.values.headers["x-ig-family-device-id"],
        this.values.headers["x-pigeon-session-id"],
        this.values.headers["x-mid"],
        this.values.headers["x-bloks-version-id"],
        this.values.misc.waterfall_id,
        this.values.useragent,
        this.proxy
      ]

      fs.appendFileSync('./success.txt', `${username}:${this.values.password}|${parts.join("|")}\n`)

      Logger.log("SUCCESS", "Account Created", { Thread: ID, Username: username, Password: config.password, Phone: phone.number, Fullname: config.fullname });
    } catch (error) {
      return false;
    }
  }
}