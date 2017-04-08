/* module imports */
const BotConnector = require('recastai-botconnector')
const recastai = require('recastai')
const express = require('express')
const bodyParser = require('body-parser')

/* Bot Connector connection */
const myBot = new BotConnector({ userSlug: 'aatish', botId: '58c93705a542271d4c6c11dd79560143', userToken: '289a68d2511842aee3018d3905e2ffe6' })

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
