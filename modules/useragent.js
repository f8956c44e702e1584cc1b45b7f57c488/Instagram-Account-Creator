import fs from "fs";

export default class Useragent {
    constructor() {
        this.baseUserAgent = "Instagram 360.0.0.52.192 Android ({android_ver}/{api_ver}; {dpi}dpi; {resolution}; {manufacturer}/{brand}; {device}; {cpu}; {language}; {build_id})";
        
        this.defaultComponents = {
            android_ver: "33",
            api_ver: "13",
            dpi: "640",
            resolution: "1440x2560",
            manufacturer: "Genymobile",
            brand: "Samsung",
            device: "Galaxy S6",
            cpu: "motion_phone_arm64",
            language: "en_US",
            build_id: "672535960"
        };
        
        this.componentValues = {
            android_ver: new Set(),
            api_ver: new Set(),
            dpi: new Set(),
            resolution: new Set(),
            manufacturer: new Set(),
            brand: new Set(),
            device: new Set(),
            cpu: new Set(),
            language: new Set(),
            build_id: new Set()
        };
        
        const data = fs.readFileSync("./assets/fingerprint-data.json", "utf-8");
        this.data = JSON.parse(data);
        this.nodes = this.data.nodes;
    }

    parseUserAgent(uaString) {
        const result = {};
        
        const androidSection = uaString.match(/Android\s*\((.*?)\)/);
        if (androidSection) {
            const parts = androidSection[1].split(';').map(part => part.trim());
            
            if (parts[0] && parts[0].includes('/')) {
                const [androidVer, apiVer] = parts[0].split('/');
                result.android_ver = androidVer.trim();
                result.api_ver = apiVer.trim();
            }
            
            for (const part of parts) {
                const trimmedPart = part.trim();
                
                if (trimmedPart.includes('dpi')) {
                    result.dpi = trimmedPart.replace('dpi', '').trim();
                } else if (trimmedPart.includes('x') && trimmedPart.split('x').every(x => /^\d+$/.test(x))) {
                    result.resolution = trimmedPart;
                } else if (trimmedPart.includes('/')) {
                    const [mfg, brand] = trimmedPart.split('/', 2);
                    result.manufacturer = mfg.trim();
                    result.brand = brand.trim();
                } else if (/^[a-z]{2}[-_][A-Z]{2}$/.test(trimmedPart)) {
                    result.language = trimmedPart;
                } else if (/^\d+$/.test(trimmedPart)) {
                    result.build_id = trimmedPart;
                } else if (trimmedPart.length > 0) {
                    if (/arm|cpu/i.test(trimmedPart)) {
                        result.cpu = trimmedPart;
                    } else if (/vbox|generic|sdk/i.test(trimmedPart)) {
                        result.hardware = trimmedPart;
                    } else {
                        result.device = trimmedPart;
                    }
                }
            }
        }
        
        return result;
    }

    addComponentValues(parsedUa) {
        for (const [key, value] of Object.entries(parsedUa)) {
            if (key in this.componentValues && value) {
                this.componentValues[key].add(value);
            }
        }
    }

    generateUaString(components) {
        return this.baseUserAgent.replace(/\{(\w+)\}/g, (match, key) => components[key]);
    }

    generateOneUserAgent() {
        for (const [key, value] of Object.entries(this.defaultComponents)) {
            this.componentValues[key].add(value);
        }
        
        const componentLists = {};
        for (const [key, values] of Object.entries(this.componentValues)) {
            componentLists[key] = Array.from(values);
        }
        
        const components = {};
        for (const [key, values] of Object.entries(componentLists)) {
            const randomIndex = Math.floor(Math.random() * values.length);
            components[key] = values[randomIndex];
        }
        
        return this.generateUaString(components);
    }

    run() {
        if (this.nodes[0].possibleValues) {
            const userAgents = this.nodes[0].possibleValues;
            for (const ua of userAgents) {
                const parsed = this.parseUserAgent(ua);
                if (parsed) {
                    this.addComponentValues(parsed);
                }
            }
        }
        
        return this.generateOneUserAgent();
    }
}