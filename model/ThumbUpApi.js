export default class ThumbUpApi {
  constructor(uin) {
    this.Bot = Bot[uin] ?? Bot
  }

  /**
   * 陌生人点赞
   * @param {number} uid QQ号
   * @param {number} times 数量
   * @returns {object}
   */
  async thumbUp(uid, times = 1) {
    try {
      uid = Number(uid) || String(uid)
      times = Number(uid) || 20
      if (!uid) return { code: 1, msg: "未指定用户" }
      let core = this.Bot.icqq?.core
      // eslint-disable-next-line import/no-unresolved
      if (!core) core = (await import("icqq")).core
      if (times > 20) { times = 20 }
      let ReqFavorite
      if (this.Bot.fl.get(uid)) {
        ReqFavorite = core.jce.encodeStruct([
          core.jce.encodeNested([ this.Bot.uin, 1, this.Bot.sig.seq + 1, 1, 0, Buffer.from("0C180001060131160131", "hex") ]),
          uid, 0, 1, times
        ])
      } else {
        ReqFavorite = core.jce.encodeStruct([
          core.jce.encodeNested([ this.Bot.uin, 1, this.Bot.sig.seq + 1, 1, 0, Buffer.from("0C180001060131160135", "hex") ]),
          uid, 0, 5, times
        ])
      }
      const body = core.jce.encodeWrapper({ ReqFavorite }, "VisitorSvc", "ReqFavorite", this.Bot.sig.seq + 1)
      const payload = await this.Bot.sendUni("VisitorSvc.ReqFavorite", body)
      let result = core.jce.decodeWrapper(payload)[0]
      return { code: result[3], msg: result[4] }
    } catch (error) {
      return this.origThumbUp(uid, times)
    }
  }

  async origThumbUp(uid, times) {
    const friend = this.Bot.pickFriend(uid)
    if (!friend?.thumbUp) return { code: 1, msg: "当前协议端不支持点赞" }
    let res
    try {
      res = { ...await friend.thumbUp(times) }
    } catch (err) {
      if (err?.error) {
        res = { ...err.error }
      } else if (err?.message) {
        res = { code: 1, msg: err.message }
      } else {
        res = { ...err }
      }
    }
    if (res.retcode && !res.code) { res.code = res.retcode }
    if (res.message && !res.msg) { res.msg = res.message }
    return res
  }
}
