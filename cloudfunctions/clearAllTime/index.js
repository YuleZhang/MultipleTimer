const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('todos').where({
      mark: '1'
    }).remove()
  } catch (e) {
    console.log(e)
  }
}