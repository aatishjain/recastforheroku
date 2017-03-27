/* module imports */
const BotConnector = require('recastai-botconnector')
const recastai = require('recastai')
const express = require('express')
const bodyParser = require('body-parser')

/* Bot Connector connection */
const myBot = new BotConnector({ userSlug: 'aatish', botId: 'b47c2e10-c451-488f-8667-4c207dce1d19', userToken: '4b41e3f9b7750cbe36d3dd2590b10634' })

/* Recast.AI API connection */
const client = new recastai.Client('e2185dcbeff65850ebeb78d263b05cd5')

/* Server setup */
const app = express()
var port = process.env.PORT || 8080;



app.use(bodyParser.json())
app.post('/', (req, res) => myBot.listen(req, res))
app.listen(port, () => console.log('Bot running on port', port))

/* When a bot receive a message */
myBot.onTextMessage(message => {
  console.log(message)
  const userText = message.content.attachment.content
  const conversationToken = message.senderId

  client.textConverse(userText, { conversationToken })
    .then(res => {
      // We get the first reply from Recast.AI or a default reply
      const reply = res.reply() || 'Sorry, I didn\'t understand'

      const response = {
        type: 'text',
        content: reply,
      }

      return message.reply(response)
    })
    .then(() => console.log('Message successfully sent'))
    .catch(err => console.error(`Error while sending message: ${err}`))
})
