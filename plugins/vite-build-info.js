var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { readdir, stat } from 'node:fs';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import pkg from 'picocolors';
var green = pkg.green, blue = pkg.blue, bold = pkg.bold;
dayjs.extend(duration);
var fileListTotal = [];
function recursiveDirectory(folder, callback) {
    var _this = this;
    readdir(folder, function (err, files) {
        if (err)
            throw err;
        var count = 0;
        var checkEnd = function () {
            ++count === files.length && callback();
        };
        files.forEach(function (item) {
            stat("".concat(folder, "/").concat(item), function (err, stats) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err)
                        throw err;
                    if (stats.isFile()) {
                        fileListTotal.push(stats.size);
                        checkEnd();
                    }
                    else if (stats.isDirectory()) {
                        recursiveDirectory("".concat(folder, "/").concat(item, "/"), checkEnd);
                    }
                    return [2 /*return*/];
                });
            }); });
        });
        files.length === 0 && callback();
    });
}
function sum(arr) {
    return arr.reduce(function (t, c) {
        return t + c;
    }, 0);
}
function formatBytes(a, b) {
    if (a === 0)
        return '0 Bytes';
    var c = 1024;
    var d = b || 2;
    var e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var f = Math.floor(Math.log(a) / Math.log(c));
    return "".concat(Number.parseFloat((a / Math.pow(c, f)).toFixed(d)), " ").concat(e[f]);
}
export function viteBuildInfo(name) {
    var config;
    var startTime;
    var endTime;
    return {
        name: 'vite:buildInfo',
        configResolved: function (resolvedConfig) {
            config = resolvedConfig;
        },
        buildStart: function () {
            console.log(bold(green("\uD83D\uDC4F\u6B22\u8FCE\u4F7F\u7528".concat(blue("[".concat(name, "]")), "\uFF0C\u73B0\u5728\u6B63\u5168\u529B\u4E3A\u60A8").concat(config.command === 'build' ? '打包' : '编译'))));
            if (config.command === 'build')
                startTime = dayjs(new Date());
        },
        closeBundle: function () {
            if (config.command === 'build') {
                endTime = dayjs(new Date());
                recursiveDirectory(config.build.outDir, function () {
                    console.log(bold(green("\u606D\u559C\u6253\u5305\u5B8C\u6210\uD83C\uDF89\uFF08\u603B\u7528\u65F6".concat(dayjs
                        .duration(endTime.diff(startTime))
                        .format('mm分ss秒'), "\uFF0C\u6253\u5305\u540E\u7684\u5927\u5C0F\u4E3A").concat(formatBytes(sum(fileListTotal)), "\uFF09"))));
                });
            }
        },
    };
}
