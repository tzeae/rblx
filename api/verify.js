export default function handler(req, res) {
    const { key, hwid } = req.body || req.query;

    // database giả lập (sau này đổi MongoDB cũng được)
    const keys = {
        "wbalalahup": {
            hwid: null,
            expire: Date.now() + 1000 * 60 * 60 * 24 // 1 ngày
        },
        "vip123": {
            hwid: null,
            expire: Date.now() + 1000 * 60 * 60 * 24 * 7
        }
    };

    if (!key || !hwid) {
        return res.status(400).json({ status: "error", msg: "missing_data" });
    }

    const data = keys[key];

    if (!data) {
        return res.json({ status: "fail", msg: "invalid_key" });
    }

    if (Date.now() > data.expire) {
        return res.json({ status: "fail", msg: "expired" });
    }

    // HWID lock lần đầu
    if (!data.hwid) {
        data.hwid = hwid;
    }

    if (data.hwid !== hwid) {
        return res.json({ status: "fail", msg: "hwid_locked" });
    }

    return res.json({ status: "ok" });
}
