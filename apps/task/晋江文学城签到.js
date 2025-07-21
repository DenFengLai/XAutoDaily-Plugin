import fetch from 'node-fetch';
import { Des } from '#utils';
import { URLSearchParams } from 'url';
import { Config, common } from '#components';

/**
 * 使用 DES-CBC-PKCS5 加密
 */
function desEncrypt(keyHex, ivHex, plaintext) {
    try {
        return Des.desCbcPkcs5Encrypt(keyHex, ivHex, plaintext);
    } catch (e) {
        logger.error('[XAutoDaily] [晋江文学城签到] 加密失败:', e);
        return null;
    }
}

/**
 * 晋江文学城签到请求
 */
async function jjwxcSignIn(token) {
    const keyHex = '4b573844766d324e';
    const ivHex = '3161653263393462';
    const SMDeviceID = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

    const timestamp = Date.now();
    const plaintext = `${timestamp}:${token}`;

    const headersSignEncrypted = desEncrypt(
        keyHex,
        ivHex,
        JSON.stringify({ token, time: Math.floor(timestamp / 1000) })
    );

    const encryptedText = desEncrypt(keyHex, ivHex, plaintext);
    if (!headersSignEncrypted || !encryptedText) {
        throw new Error('[XAutoDaily] [晋江文学城签到] DES 加密失败');
    }

    const url = 'https://android.jjwxc.net/androidapi/signin';
    const headers = {
        'cacheShowed': 'false',
        'Referer': 'http://android.jjwxc.net/?v=423',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 15; PJX110 Build/UKQ1.231108.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/133.0.6943.137 Mobile Safari/537.36/JINJIANG-Android/423(PJX110;Scale/2.55;isHarmonyOS/false)',
        'VERSIONTYPE': 'reading, reading',
        'source': 'android',
        'versionCode': '423',
        'Version-Code': '423',
        'sign': headersSignEncrypted,
        'SMDeviceID': SMDeviceID,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'android.jjwxc.net',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
    };

    const body = new URLSearchParams({
        versionCode: '423',
        sign: encodeURIComponent(encryptedText),
    });

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body,
    });

    return await res.json();
}

/**
 * 签到调度任务
 */
let task = {};
if (Config.sign.晋江文学城签到 && Config.sign.晋江文学城签到Token.length > 0) {
    task = {
        cron: Config.sign.晋江文学城签到cron,
        name: '晋江文学城签到',
        fnc: () => jjwxcSignTask(),
    };
}

/**
 * 多账户签到执行函数
 */
async function jjwxcSignTask() {
    let success = 0;
    let fail = 0;
    const tokens = Config.sign.晋江文学城签到Token;
    let resultMessage = `[XAutoDaily] [晋江文学城签到] 任务开始：\n`;

    for (let token of tokens) {
        const taskKey = `${task.name}:${token}`;
        if (await common.isTaskDone(taskKey)) {
            resultMessage += `[跳过] 今日已完成，跳过：${token}\n`;
            continue;
        }

        try {
            const res = await jjwxcSignIn(token);
            if (!res || !res.code) {
                resultMessage += `[失败] 响应异常：${token}\n`;
                fail++;
                continue;
            }
            switch (Number(res.code)) {
                case 200:
                    resultMessage += `[成功] 成功：${token}\n`;
                    await common.setTaskDone(taskKey);
                    success++;
                    break;
                case 70003:
                    resultMessage += `[成功] 已签到：${token}\n`;
                    await common.setTaskDone(taskKey);
                    success++;
                    break;
                case 1004:
                    resultMessage += `[失败] 登入验证失败，可能是Token无效：${token}\n`;
                    await common.setTaskDone(taskKey);
                    fail++;
                    break;
                default:
                    resultMessage += `[失败] 失败：${token}，响应：${res.code}\n`;
                    fail++;
            }
        } catch (e) {
            resultMessage += `[异常] 异常：${token}，${e.message}\n`;
            fail++;
        }
    }

    resultMessage += `[XAutoDaily] [晋江文学城签到] 任务完成：成功 ${success} 个${fail > 0 ? `，失败 ${fail} 个` : ''}`;
    common.informMaster(resultMessage);
}


export default task;
