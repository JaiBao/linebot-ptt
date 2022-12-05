import axios from 'axios'
import * as cheerio from 'cheerio'
import bubble from '../templates/bubble.js'
import fs from 'fs'

export default async (event) => {
  try {
    const { data } = await axios.get('https://www.ptt.cc/bbs/beauty/index.html', {
      headers: {
        'Accept-Encoding': 'world/html',
        cookie: 'over18=1;'
      }
    })
    const $ = cheerio.load(data)

    const beauty = []
    $('.r-list-container .r-ent').each(function () {
      const bubbleTemp = JSON.parse(JSON.stringify(bubble))
      bubbleTemp.body.contents[0].text = $(this).find('.title a').text().trim()
      if ($(this).find('.title a').attr('href') === undefined) return
      else {
        bubbleTemp.footer.contents[0].action.uri = 'https://www.ptt.cc/' + $(this).find('.title a').attr('href')
      }
      beauty.push(bubbleTemp)
      if (beauty.length >= 12) return false
    })
    const reply = {
      type: 'flex',
      altText: '表特',
      contents: {
        type: 'carousel',
        contents: beauty
      }
    }

    event.reply(reply)
    fs.writeFileSync('./dump/course.json', JSON.stringify(reply, null, 2))
  } catch (error) {
    console.error(error)
  }
}
