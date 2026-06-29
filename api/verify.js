let db = {
    "wbalalahup": {
        hwid: null,
        expire: Date.now() + 1000 * 60 * 60 * 24 // 1 ngày
    },
    "vip123": {
        hwid: null,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
};

export default async function handler(req, res) {
    let body = req.body;

    // fix Vercel parse
    if (typeof body === "string") {
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = {};
        }
    }

    const key = body?.key || req.query.key;
    const hwid = body?.hwid || req.query.hwid;

    // ❌ thiếu data
    if (!key || !hwid) {
        return res.status(400).json({
            status: "error",
            msg: "missing_data"
        });
    }

    const data = db[key];

    // ❌ key sai
    if (!data) {
        return res.json({
            status: "fail",
            msg: "invalid_key"
        });
    }

    // ❌ hết hạn
    if (Date.now() > data.expire) {
        return res.json({
            status: "fail",
            msg: "expired"
        });
    }

    // 🔒 bind HWID lần đầu
    if (!data.hwid) {
        data.hwid = hwid;
    }

    // ❌ HWID sai
    if (data.hwid !== hwid) {
        return res.json({
            status: "fail",
            msg: "hwid_locked"
        });
    }

    return res.json({
        status: "ok",
        msg: "access_granted"
    });
}
