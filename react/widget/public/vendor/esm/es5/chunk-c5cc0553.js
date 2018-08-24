function readableNumber(e) { var t = Math.ceil(100 * e) / 100; return t >= 1e9 ? (t / 1e9).toFixed(1) + "G" : t >= 1e6 ? (t / 1e6).toFixed(1) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : t; }
function shadeOrBlend(e, t, r) { if ("number" != typeof e || e < -1 || e > 1 || "string" != typeof t || "r" != t[0] && "#" != t[0] || r && "string" != typeof r)
    return null; var n = function (e) { var t = e.length, r = {}; if (t > 9) {
    if ((e = e.split(",")).length < 3 || e.length > 4)
        return null;
    r[0] = l(e[0].split("(")[1]), r[1] = l(e[1]), r[2] = l(e[2]), r[3] = e[3] ? parseFloat(e[3]) : -1;
}
else {
    if (8 == t || 6 == t || t < 4)
        return null;
    t < 6 && (e = "#" + e[1] + e[1] + e[2] + e[2] + e[3] + e[3] + (t > 4 ? e[4] + "" + e[4] : "")), e = l(e.slice(1), 16), r[0] = e >> 16 & 255, r[1] = e >> 8 & 255, r[2] = 255 & e, r[3] = -1, 9 != t && 5 != t || (r[3] = i(r[2] / 255 * 1e4) / 1e4, r[2] = r[1], r[1] = r[0], r[0] = e >> 24 & 255);
} return r; }; var l = parseInt, i = Math.round, o = t.length > 9, s = (o = "string" == typeof r ? r.length > 9 || "c" == r && !o : o, e < 0), a = (e = s ? -1 * e : e, r = r && "c" != r ? r : s ? "#000000" : "#FFFFFF", n(t)), u = n(r); return a && u ? o ? "rgb" + (a[3] > -1 || u[3] > -1 ? "a(" : "(") + i((u[0] - a[0]) * e + a[0]) + "," + i((u[1] - a[1]) * e + a[1]) + "," + i((u[2] - a[2]) * e + a[2]) + (a[3] < 0 && u[3] < 0 ? ")" : "," + (a[3] > -1 && u[3] > -1 ? i(1e4 * ((u[3] - a[3]) * e + a[3])) / 1e4 : u[3] < 0 ? a[3] : u[3]) + ")") : "#" + (4294967296 + 16777216 * i((u[0] - a[0]) * e + a[0]) + 65536 * i((u[1] - a[1]) * e + a[1]) + 256 * i((u[2] - a[2]) * e + a[2]) + (a[3] > -1 && u[3] > -1 ? i(255 * ((u[3] - a[3]) * e + a[3])) : u[3] > -1 ? i(255 * u[3]) : a[3] > -1 ? i(255 * a[3]) : 255)).toString(16).slice(1, a[3] > -1 || u[3] > -1 ? void 0 : -2) : null; }
export { readableNumber as a, shadeOrBlend as b };
