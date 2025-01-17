"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoCacheManager = exports.CacheManager = void 0;
const ServerComponent_1 = require("./ServerComponent");
const interfaces_1 = require("../interfaces");
const fs = require('fs');
class NoCacheManager extends ServerComponent_1.ServerComponent {
    constructor(server) {
        super(server);
    }
    list() { return []; }
    /**
    **/
    getInstance(instanceId) { return null; }
    add(execution) { return null; }
    remove(instanceId) { return null; }
    //	shutsdown all instances that are still live
    shutdown() { }
    restart() { }
}
exports.NoCacheManager = NoCacheManager;
class CacheManager extends ServerComponent_1.ServerComponent {
    constructor(server) {
        super(server);
        var self = this;
        server.listener.on(interfaces_1.EXECUTION_EVENT.process_end, function ({ context, event, }) {
            //				console.log(`--->Cache Event: ${event} Removing Instance:`, context.instance.id);
            self.remove(context.instance.id);
        });
    }
    list() {
        const items = [];
        CacheManager.liveInstances.forEach(item => { items.push(item); });
        return items;
    }
    /**
    **/
    getInstance(instanceId) {
        const instance = CacheManager.liveInstances.get(instanceId);
        return instance;
    }
    add(execution) {
        CacheManager.liveInstances.set(execution.id, execution);
    }
    remove(instanceId) {
        CacheManager.liveInstances.delete(instanceId);
    }
    //	shutsdown all instances that are still live
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Shutdown..");
            const instances = CacheManager.liveInstances;
            let i = 0;
            const list = [];
            instances.forEach(item => { list.push(item); });
            for (i = 0; i < list.length; i++) {
                const engine = list[i];
                //await engine.stop();
                this.logger.log("shutdown engine " + engine.execution.name + " status : " + engine.execution.state);
                instances.delete(list[i].execution.id);
            }
        });
    }
}
exports.CacheManager = CacheManager;
CacheManager.liveInstances = new Map();
//# sourceMappingURL=CacheManager.js.map