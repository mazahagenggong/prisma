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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.datatable = void 0;
const datatable = (model, req, list_search = null, sort_by = null) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let start;
        let length;
        if (typeof req.body.length === 'undefined') {
            length = 10;
        }
        else {
            length = parseInt(req.body.length);
        }
        if (typeof req.body.page === 'undefined') {
            start = 0;
        }
        else {
            start = ((parseInt(req.body.page) * length) - parseInt(req.body.length));
        }
        const search = (_a = req.body.keyword) !== null && _a !== void 0 ? _a : '';
        const draw = req.body.draw || 1;
        let qq = {};
        if (search !== '') {
            let query = [];
            list_search === null || list_search === void 0 ? void 0 : list_search.map((item) => {
                query.push({
                    [item]: {
                        contains: search,
                        mode: 'insensitive',
                    },
                });
            });
            qq.where = { OR: query };
        }
        if (sort_by !== null) {
            qq.orderBy = sort_by;
        }
        const dataori = yield model.findMany(qq);
        if (length !== -1) {
            qq.skip = start;
            qq.take = length;
        }
        else {
            qq.skip = start;
        }
        const data = yield model.findMany(qq);
        const count = dataori.length;
        const newdata = data.map((data, index) => {
            const rest = __rest(data, []);
            return Object.assign({ nomor_urut: start + index + 1 }, rest);
        });
        return {
            draw: draw,
            length,
            start,
            page: req.body.page,
            recordsTotal: count,
            recordsFiltered: count,
            data: newdata
        };
    }
    catch (error) {
        console.error(error);
        return { error: 'Internal Server Error' };
    }
});
exports.datatable = datatable;
//# sourceMappingURL=datatable.js.map